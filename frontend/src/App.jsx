    import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import { ThemeProvider } from '@mui/material/styles';
    import CssBaseline from '@mui/material/CssBaseline';
    import { CartProvider } from './context/CartContext.jsx';
    import { AuthProvider } from './context/AuthContext.jsx';
    import ErrorBoundary from './components/ErrorBoundary.jsx';
    import { NotificationProvider } from './components/NotificationSystem.jsx';
    import muiTheme from './theme/muiTheme.js';

    // Components
    import Navbar from './components/Navbar.jsx';
    import AddressBar from './components/AddressBar.jsx';
    import Footer from './components/Footer.jsx';

    // Pages
    import Home from './pages/Home.jsx';
    import BuyVegetables from './pages/BuyVegetables.jsx';
    import PlantDetection from './pages/PlantDetection.jsx';
    import FertilizerInfo from './pages/FertilizerInfo.jsx';
    import WeatherForecast from './pages/WeatherForecast.jsx';
    import SeasonalCrop from './pages/SeasonalCrop.jsx';
    import SoilHealth from './pages/SoilHealth.jsx';
    import PestAlerts from './pages/PestAlerts.jsx';
    import Irrigation from './pages/Irrigation.jsx';
    import GovernmentSchemes from './pages/GovernmentSchemes.jsx';
    import CropTrends from './pages/CropTrends.jsx';
    import Login from './pages/Login.jsx';
    import Signup from './pages/Signup.jsx';
    import TermsAndConditions from './pages/TermsAndConditions.jsx';
    import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
    import Payment from './pages/Payment.jsx';

    function App() {
        return (
            <ErrorBoundary>
                <ThemeProvider theme={muiTheme}>
                    <CssBaseline />
                    <Router>
                        <NotificationProvider>
                            <AuthProvider>
                                <CartProvider>
                                <div className="min-h-screen bg-farm-gradient">
                                    <Navbar />
                                    <AddressBar />
                                    <main className="container mx-auto px-4 py-8">
                                        <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/buy" element={<BuyVegetables />} />
                                    <Route path="/plant-detection" element={<PlantDetection />} />
                                    <Route path="/fertilizer-info" element={<FertilizerInfo />} />
                                    <Route path="/weather-forecast" element={<WeatherForecast />} />
                                    <Route path="/seasonal-crop" element={<SeasonalCrop />} />
                                    <Route path="/soil-health" element={<SoilHealth />} />
                                    <Route path="/pest-alerts" element={<PestAlerts />} />
                                    <Route path="/irrigation" element={<Irrigation />} />
                                    <Route path="/government-schemes" element={<GovernmentSchemes />} />
                                    <Route path="/crop-trends" element={<CropTrends />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/signup" element={<Signup />} />
                                    <Route path="/terms" element={<TermsAndConditions />} />
                                    <Route path="/privacy" element={<PrivacyPolicy />} />
                                    <Route path="/payment" element={<Payment />} />
                                    </Routes>
                                </main>
                                <Footer />
                            </div>
                        </CartProvider>
                    </AuthProvider>
                </NotificationProvider>
            </Router>
            </ThemeProvider>
            </ErrorBoundary>
        );
    }

    export default App;
