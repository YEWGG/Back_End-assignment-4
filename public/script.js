let chartInstance = null;

async function updateDashboard() {
    const field = document.getElementById('field').value;
    const start = document.getElementById('start_date').value;
    const end = document.getElementById('end_date').value;

    try {
        const response = await fetch(`/api/analytics?field=${field}&start_date=${start}&end_date=${end}`);
        const data = await response.json();

        
        document.getElementById('avg').innerText = data.avg.toFixed(2);
        document.getElementById('min').innerText = data.min.toFixed(2);
        document.getElementById('max').innerText = data.max.toFixed(2);
        document.getElementById('std').innerText = data.stdDev.toFixed(2);

        // Обновление графика
        const ctx = document.getElementById('myChart').getContext('2d');
        if (chartInstance) chartInstance.destroy();

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.chartData.map(p => new Date(p.x).toLocaleDateString()),
                datasets: [{
                    label: `Dynamic of ${field}`,
                    data: data.chartData.map(p => p.y),
                    borderColor: '#007bff',
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                scales: {
                    y: {
                        beginAtZero: false, // Для динамических данных
                        grid: { color: '#f0f0f0' }
                    },
                    x: { grid: { display: false } }
                }
            }
        });
    } catch (e) {
        console.error("Error:", e);
    }
}