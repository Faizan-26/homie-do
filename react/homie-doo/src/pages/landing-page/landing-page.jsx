import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HeroSection from './components/HeroSection';
import QuoteSection from './components/QuoteSection';
import ServiceCards from './components/ServiceCards';
import GetStartedSection from './components/GetStartedSection';
import StatsSection from './components/StatsSection';

function LandingPage() {
    const footerRef = useRef(null);
    const [isDark, setIsDark] = useState(false);
    
    useEffect(() => {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('theme');
        setIsDark(savedTheme === 'dark' || (!savedTheme && darkModeQuery.matches));
        const handleThemeChange = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        
        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.documentElement, { 
            attributes: true, 
            attributeFilter: ['class'] 
        });
        
        return () => observer.disconnect();
    }, []);
    
    const scrollToFooter = () => {
        footerRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    return (
        <div className="transition-all duration-300 ease-in-out bg-white dark:bg-[#1a2035]">
            <Navbar scrollToAbout={scrollToFooter} />
            <main className="transition-colors duration-300"> 
                <HeroSection isDark={isDark} />
                <QuoteSection isDark={isDark} />
                <ServiceCards isDark={isDark} />
                <GetStartedSection isDark={isDark} />
                <StatsSection isDark={isDark} />
            </main>
            <div ref={footerRef}>
                <Footer isDark={isDark} />
            </div>
        </div>
    );
}

export default LandingPage;