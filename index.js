const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Measurement = require('./models/Measurement'); 

const app = express();
app.use(cors());
app.use(express.static('public'));

mongoose.connect('mongodb://127.0.0.1:27017/analyticsDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

// Маршрут для получения данных и аналитики
app.get('/api/analytics', async (req, res) => {
    try {
        const { field, start_date, end_date } = req.query;

        const results = await Measurement.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: new Date(start_date),
                        $lte: new Date(end_date)
                    }
                }
            },
            { $sort: { timestamp: 1 } },
            {
                $group: {
                    _id: null,
                    chartData: { $push: { x: "$timestamp", y: `$${field}` } },
                    avg: { $avg: `$${field}` },
                    min: { $min: `$${field}` },
                    max: { $max: `$${field}` },
                    stdDev: { $stdDevPop: `$${field}` }
                }
            }
        ]);

        res.json(results[0] || { chartData: [], avg: 0, min: 0, max: 0, stdDev: 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Server: http://localhost:3000'));