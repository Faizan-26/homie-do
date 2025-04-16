import React from 'react';

function Footer({ isDark }) {
    return (
        <footer className="bg-[#FEF5E7] dark:bg-[#1e2538] text-[#F4815B] dark:text-[#FF7B61] transition-colors duration-300">
            <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
                <path d="M0,0 C250,80 350,0 600,30 C850,60 950,0 1200,70 L1200,0 L0,0 Z" fill="#ffff" className="dark:fill-[#1a2035] transition-colors duration-300"></path>
            </svg>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h5 className="text-xl font-bold mb-4 text-[#F4815B] dark:text-[#FF7B61] transition-colors duration-300">About Homie Doo</h5>
                        <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            Homie Doo is your trusted academic partner, dedicated to providing excellent homework support,
                            study tips, and exam preparation resources. We empower students to excel in their academic
                            journey.
                        </p>
                    </div>
                    
                    {/* Contact Section */}
                    <div className="text-center">
                        <h5 className="text-xl font-bold mb-4 text-[#F4815B] dark:text-[#FF7B61] transition-colors duration-300">Contact Us</h5>
                        <ul className="space-y-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                            <li className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin text-[#F4815B] dark:text-[#FF7B61] transition-colors duration-300">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <span>123 Learning Lane, Study City</span>
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone text-[#F4815B] dark:text-[#FF7B61] transition-colors duration-300">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <span>(123) 456-7890</span>
                            </li>
                            <li className="flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail text-[#F4815B] dark:text-[#FF7B61] transition-colors duration-300">
                                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                </svg>
                                <span>info@homiedoo.com</span>
                            </li>
                        </ul>
                    </div>
                    
                    {/* Follow Us Section */}
                    <div className="text-center">
                        <h5 className="text-xl font-bold mb-4 text-[#F4815B] dark:text-[#FF7B61] transition-colors duration-300">Follow Us</h5>
                        <div className="flex justify-center space-x-4">
                            <a href="#" className="h-10 w-10 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center hover:bg-white/30 dark:hover:bg-white/20 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook text-[#F4815B] dark:text-[#FF7B61] transition-colors duration-300">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center hover:bg-white/30 dark:hover:bg-white/20 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter text-[#F4815B] dark:text-[#FF7B61] transition-colors duration-300">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                                </svg>
                            </a>
                            <a href="#" className="h-10 w-10 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center hover:bg-white/30 dark:hover:bg-white/20 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram text-[#F4815B] dark:text-[#FF7B61] transition-colors duration-300">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Horizontal line */}
            <div className="border-t border-gray-300 dark:border-gray-700 mt-8 transition-colors duration-300"></div>
            <div className="text-center py-4 text-black dark:text-gray-200 transition-colors duration-300">
                <p>&copy;2025 Homie Doo. All rights reserved.</p>
                <p>Designed with ❤️ by the Homie Doo Team</p>
            </div>
        </footer>
    );
}

export default Footer;
