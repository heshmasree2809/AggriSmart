# 🌾 AgriSmart - Smart Farming Solutions

AgriSmart is a comprehensive agricultural technology platform that empowers farmers with AI-driven solutions for sustainable and efficient farming. Built with React, MUI (Material-UI), and Tailwind CSS.

## ✨ Features

### Core Functionalities
- **🌱 Plant Disease Detection** - AI-powered image analysis to detect crop diseases instantly
- **☀️ Weather Forecast** - Real-time weather predictions for better farming decisions
- **🛍️ Buy Vegetables** - E-commerce platform for fresh produce
- **🧪 Fertilizer Recommendations** - Personalized fertilizer suggestions based on soil and crop type
- **🌾 Seasonal Crop Guide** - Best crops to grow based on season and climate
- **🌍 Soil Health Analysis** - Detailed soil composition and fertility reports
- **🪱 Pest Alerts** - Early warning system for pest infestations
- **💧 Smart Irrigation** - Efficient water management and irrigation scheduling
- **🏛️ Government Schemes** - Latest information on farming subsidies and schemes
- **📈 Market Trends** - Real-time crop price tracking and demand forecasting

### Technical Features
- **🔐 Authentication System** - Secure user login and registration with JWT
- **🛒 Shopping Cart** - Full e-commerce functionality with cart management
- **🎨 Modern UI/UX** - Beautiful interface using MUI components and Tailwind CSS
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **⚡ Fast Performance** - Built with Vite for optimal development and production performance

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/agrismart.git
cd agrismart
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Update `.env` with your API keys:
```env
VITE_WEATHER_API_KEY=your_openweather_api_key
VITE_PLANT_NET_API_KEY=your_plantnet_api_key
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - React component library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization

### State Management
- **Context API** - For global state (Auth, Cart)
- **Local Storage** - For persisting user data

## 📁 Project Structure

```
agrismart/
├── src/
│   ├── api/             # API configuration and endpoints
│   ├── components/      # Reusable React components
│   ├── context/         # Context providers (Auth, Cart)
│   ├── pages/           # Page components
│   ├── storage/         # Static data and mock APIs
│   ├── theme/           # MUI theme configuration
│   ├── utils/           # Helper functions and constants
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── public/              # Static assets
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## 📖 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## 🌐 API Integration

The app uses several external APIs:
- **OpenWeatherMap API** - For weather forecasts
- **PlantNet API** - For plant disease detection (mock implementation)
- **Custom Backend API** - For user authentication and e-commerce (ready for integration)

## 🔒 Security

- JWT-based authentication
- Secure password handling
- Protected routes
- Input validation
- XSS protection

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

Developed with ❤️ by the AgriSmart Team

## 📞 Support

For support, email support@agrismart.com or open an issue in the GitHub repository.

---

**Note**: This is a development version. Some features may be incomplete or use mock data. For production deployment, ensure all API endpoints are properly configured and security measures are in place.
