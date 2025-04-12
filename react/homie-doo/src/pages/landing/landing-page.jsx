
import React from 'react';
// Import FontAwesome icons but not Bootstrap
import '@fortawesome/fontawesome-free/css/all.min.css';
import './landing.css';

// Import components
import Navbar from '../../components/Navbar';
import Hero from './components/hero';
import Quote from './components/quote';
import ServiceCards from './components/service-cards';
import GetStarted from './components/get-started';
import Stats from './components/stats';
import Footer from '../../components/Footer';

export default function LandingPage() {
    return (
        <div className="landing-page">
            <Navbar />
            <Hero />
            <Quote />
            <ServiceCards />
            <GetStarted />
            <Stats />
            <Footer />
        </div>
    );
}
