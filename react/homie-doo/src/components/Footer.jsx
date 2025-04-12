import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="relative bg-secondary text-white pb-4">
      {/* Wave Decoration */}
      <div className="w-full overflow-hidden">
        <svg viewBox="0 0 1200 100" preserveAspectRatio="none" className="w-full h-12 -mt-1">
          <path d="M0,0 C250,80 350,0 600,30 C850,60 950,0 1200,70 L1200,0 L0,0 Z" fill="#ffffff"></path>
        </svg>
      </div>
      
      {/* Footer Main Content */}
      <div className="container mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h5 className="text-xl font-semibold mb-4">About Homie Doo</h5>
            <p className="text-gray-300">
              Homie Doo is your trusted academic partner, dedicated to providing excellent homework support,
              study tips, and exam preparation resources. We empower students to excel in their academic
              journey.
            </p>
          </div>
          
          {/* Contact Section */}
          <div>
            <h5 className="text-xl font-semibold mb-4">Contact Us</h5>
            <ul className="space-y-3">
              <li className="flex items-center">
                <FontAwesomeIcon icon={faMapMarker} className="mr-2 text-primary" />
                <span>123 Learning Lane, Study City</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faPhone} className="mr-2 text-primary" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-primary" />
                <span>info@homiedoo.com</span>
              </li>
            </ul>
          </div>
          
          {/* Social Links Section */}
          <div>
            <h5 className="text-xl font-semibold mb-4">Follow Us</h5>
            <div className="flex space-x-4">
              <a href="#" className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition-colors">
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition-colors">
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition-colors">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="text-center pt-6 border-t border-gray-700">
        <p>© {new Date().getFullYear()} Homie Doo. All rights reserved.</p>
      </div>
    </footer>
  );
}


