// Example weather controller (Protected)
exports.getWeatherForecast = async (req, res) => {
  try {
    // In a real app, you'd call a 3rd party weather API here
    // We'll use the logged-in user's info for a placeholder
    const location = req.query.location || 'user location';
    
    const weatherData = {
      temp: '29°C',
      condition: 'Sunny',
      location: location,
      requestedBy: req.user.name // from authMiddleware
    };

    res.json({ success: true, data: weatherData });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch weather', error: err.message });
  }
};

