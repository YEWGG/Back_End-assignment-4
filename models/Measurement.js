const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
    timestamp: { 
        type: Date, 
        required: true,
        index: true 
    },
    field1: { type: Number, default: 0 },
    field2: { type: Number, default: 0 },
    field3: { type: Number, default: 0 }
}, { 
    collection: 'measurements',
    versionKey: false 
});

module.exports = mongoose.model('Measurement', MeasurementSchema);