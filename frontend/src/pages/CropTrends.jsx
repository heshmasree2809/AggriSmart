import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CropTrends() {
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [timeRange, setTimeRange] = useState('6months');

  const crops = [
    { name: 'Rice', value: 'rice', icon: '🌾', color: '#22c55e' },
    { name: 'Wheat', value: 'wheat', icon: '🌾', color: '#f59e0b' },
    { name: 'Tomato', value: 'tomato', icon: '🍅', color: '#ef4444' },
    { name: 'Potato', value: 'potato', icon: '🥔', color: '#8b5cf6' },
    { name: 'Onion', value: 'onion', icon: '🧅', color: '#f97316' },
    { name: 'Corn', value: 'corn', icon: '🌽', color: '#eab308' },
  ];

  const timeRanges = [
    { label: '1 Month', value: '1month' },
    { label: '3 Months', value: '3months' },
    { label: '6 Months', value: '6months' },
    { label: '1 Year', value: '1year' },
  ];

  // Mock data for demonstration
  const generateMockData = (crop, range) => {
    const months = range === '1month' ? 1 : range === '3months' ? 3 : range === '6months' ? 6 : 12;
    const labels = [];
    const prices = [];
    const volumes = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }));
      
      // Generate realistic price data with some variation
      const basePrice = crop === 'rice' ? 45 : crop === 'wheat' ? 35 : crop === 'tomato' ? 60 : 
                      crop === 'potato' ? 25 : crop === 'onion' ? 40 : 30;
      const variation = (Math.random() - 0.5) * 20;
      prices.push(Math.max(10, basePrice + variation));
      
      // Generate volume data
      volumes.push(Math.floor(Math.random() * 1000) + 500);
    }
    
    return { labels, prices, volumes };
  };

  const currentData = generateMockData(selectedCrop, timeRange);
  const selectedCropInfo = crops.find(c => c.value === selectedCrop);

  const priceChartData = {
    labels: currentData.labels,
    datasets: [
      {
        label: 'Price (₹/kg)',
        data: currentData.prices,
        borderColor: selectedCropInfo?.color || '#22c55e',
        backgroundColor: `${selectedCropInfo?.color || '#22c55e'}20`,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const volumeChartData = {
    labels: currentData.labels,
    datasets: [
      {
        label: 'Trading Volume (tons)',
        data: currentData.volumes,
        backgroundColor: selectedCropInfo?.color || '#22c55e',
        borderColor: selectedCropInfo?.color || '#22c55e',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
    },
  };

  const marketInsights = [
    {
      title: 'Price Trend',
      value: currentData.prices[currentData.prices.length - 1] > currentData.prices[0] ? 'Rising' : 'Falling',
      change: ((currentData.prices[currentData.prices.length - 1] - currentData.prices[0]) / currentData.prices[0] * 100).toFixed(1),
      icon: currentData.prices[currentData.prices.length - 1] > currentData.prices[0] ? '📈' : '📉',
      color: currentData.prices[currentData.prices.length - 1] > currentData.prices[0] ? 'text-green-600' : 'text-red-600'
    },
    {
      title: 'Current Price',
      value: `₹${currentData.prices[currentData.prices.length - 1].toFixed(2)}/kg`,
      change: '',
      icon: '💰',
      color: 'text-farm-green-600'
    },
    {
      title: 'Avg Volume',
      value: `${Math.round(currentData.volumes.reduce((a, b) => a + b, 0) / currentData.volumes.length)} tons`,
      change: '',
      icon: '📊',
      color: 'text-blue-600'
    },
    {
      title: 'Price Range',
      value: `₹${Math.min(...currentData.prices).toFixed(2)} - ₹${Math.max(...currentData.prices).toFixed(2)}`,
      change: '',
      icon: '📏',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-farm-gradient py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
            Crop Price <span className="text-gradient">Trends</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track market prices, analyze trends, and make informed decisions about your crop sales and purchases.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Crop Selection */}
            <div>
              <h3 className="text-2xl font-display font-semibold text-gray-800 mb-6">
                Select Crop 🌾
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {crops.map((crop) => (
                  <button
                    key={crop.value}
                    onClick={() => setSelectedCrop(crop.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      selectedCrop === crop.value
                        ? 'border-farm-green-500 bg-farm-green-50 text-farm-green-700'
                        : 'border-gray-200 hover:border-farm-green-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{crop.icon}</div>
                    <div className="font-medium">{crop.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Range Selection */}
            <div>
              <h3 className="text-2xl font-display font-semibold text-gray-800 mb-6">
                Time Range 📅
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setTimeRange(range.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      timeRange === range.value
                        ? 'border-farm-green-500 bg-farm-green-50 text-farm-green-700'
                        : 'border-gray-200 hover:border-farm-green-300'
                    }`}
                  >
                    <div className="font-medium">{range.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketInsights.map((insight, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl">{insight.icon}</div>
                {insight.change && (
                  <span className={`text-sm font-semibold ${insight.color}`}>
                    {insight.change > 0 ? '+' : ''}{insight.change}%
                  </span>
                )}
              </div>
              <h4 className="text-sm font-medium text-gray-600 mb-1">{insight.title}</h4>
              <p className={`text-2xl font-bold ${insight.color}`}>{insight.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Price Trend Chart */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-6 text-center">
              Price Trend 📈
            </h3>
            <div className="h-80">
              <Line data={priceChartData} options={chartOptions} />
            </div>
          </div>

          {/* Volume Chart */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-2xl font-display font-bold text-gray-800 mb-6 text-center">
              Trading Volume 📊
            </h3>
            <div className="h-80">
              <Bar data={volumeChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Market Analysis */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-display font-bold text-gray-800 mb-8 text-center">
            Market Analysis 💡
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Price Prediction</h3>
              <p className="text-gray-700 text-sm mb-4">
                Based on current trends, {selectedCropInfo?.name} prices are expected to 
                {currentData.prices[currentData.prices.length - 1] > currentData.prices[0] ? ' continue rising' : ' stabilize or decrease'} 
                in the coming weeks.
              </p>
              <div className="text-sm font-medium text-green-700">
                Confidence: 78%
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Best Selling Time</h3>
              <p className="text-gray-700 text-sm mb-4">
                Historical data suggests the best time to sell {selectedCropInfo?.name} is during 
                peak demand periods, typically in the early morning hours at wholesale markets.
              </p>
              <div className="text-sm font-medium text-blue-700">
                Peak Hours: 6-9 AM
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Market Risks</h3>
              <p className="text-gray-700 text-sm mb-4">
                Monitor weather conditions, government policies, and supply chain disruptions 
                that could significantly impact {selectedCropInfo?.name} prices.
              </p>
              <div className="text-sm font-medium text-purple-700">
                Risk Level: Moderate
              </div>
            </div>
          </div>
        </div>

        {/* Trading Tips */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h3 className="text-2xl font-display font-bold text-gray-800 mb-6 text-center">
            Trading Tips 💰
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Monitor Daily Prices</h4>
                  <p className="text-gray-600 text-sm">Check prices daily to identify patterns and optimal selling times.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🌦️</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Weather Impact</h4>
                  <p className="text-gray-600 text-sm">Weather forecasts can significantly affect crop prices and demand.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Use Technology</h4>
                  <p className="text-gray-600 text-sm">Leverage mobile apps and online platforms for real-time price updates.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <h4 className="font-semibold text-gray-800">Build Networks</h4>
                  <p className="text-gray-600 text-sm">Connect with other farmers and traders for better market insights.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropTrends;
