import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Logo from '../images/logo.png';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-y-8 md:gap-y-0 md:gap-x-16">
          {/* 1st Column: Logo */}
          <div className="flex flex-col">
            <div className="mb-4">
              <Link to="/" className="inline-block relative" aria-label="Hüner">
                <img 
                  src={Logo} 
                  alt="hunerly" 
                  className='w-16 h-16' 
                  style={{
                    filter: 'brightness(0) saturate(100%) invert(46%) sepia(89%) saturate(2476%) hue-rotate(189deg) brightness(99%) contrast(91%)'
                  }}
                />
                <div 
                  className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-400"
                  style={{
                    WebkitMaskImage: `url(${Logo})`,
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    maskImage: `url(${Logo})`,
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center'
                  }}
                ></div>
              </Link>
            </div>
          </div>

          {/* 2nd Column: Navigation Links */}
          <div className="md:col-span-1">
            <ul className="text-lg">
              <li className="mb-4 border-b-2 border-transparent hover:border-teal-400 transition-colors duration-200">
                <Link to="/for-companies" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">For Companies</Link>
              </li>
              <li className="mb-4 border-b-2 border-transparent hover:border-teal-400 transition-colors duration-200">
                <Link to="/for-talents" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">For Talents</Link>
              </li>
              <li className="mb-4 border-b-2 border-transparent hover:border-teal-400 transition-colors duration-200">
                <Link to="/signup" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">Sign Up</Link>
              </li>
              <li className="mb-4 border-b-2 border-transparent hover:border-teal-400 transition-colors duration-200">
                <Link to="/login" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">Log In</Link>
              </li>
            </ul>
          </div>

          {/* 3rd Column: Legal Links */}
          <div className="md:col-span-1">
            <ul className="text-lg">
              <li className="mb-4 border-b-2 border-transparent hover:border-teal-400 transition-colors duration-200">
                <Link to="/data-processing" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">Data Processing Agreement</Link>
              </li>
              <li className="mb-4 border-b-2 border-transparent hover:border-teal-400 transition-colors duration-200">
                <Link to="/user-agreement" className="text-gray-300 hover:text-white transition duration-150 ease-in-out">User Agreement</Link>
              </li>
            </ul>
          </div>
          
          {/* 4th Column: Social Links */}
        <div className="md:col-span-1 flex flex-col items-start">             
  <div className="flex space-x-4">               
    <Link to="#" className="text-gray-500 hover:text-white transition duration-150 ease-in-out" aria-label="Instagram">                 
      <FaInstagram className="w-8 h-8" />
    </Link>               
    <Link to="#" className="text-gray-500 hover:text-white transition duration-150 ease-in-out" aria-label="LinkedIn">                 
      <FaLinkedin className="w-8 h-8" />
    </Link>               
    <Link to="#" className="text-gray-500 hover:text-white transition duration-150 ease-in-out" aria-label="Email">                 
      <FaEnvelope className="w-8 h-8" />
    </Link>             
  </div>           
</div>
        </div>

        {/* Bottom area: Copyright and Scroll to Top */}
        <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-700 mt-8">
          {/* Copyrights note */}
          <div className="text-sm text-gray-500 mr-4">
            © 2025 HÜNER. All rights reserved.
          </div>

          {/* Scroll to Top button */}
          <button
            className="w-12 h-12 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg focus:outline-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M14.707 9.707a1 1 0 01-1.414 0L10 6.414 6.707 9.707a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

      </div>
    </footer>
  );
}

export default Footer;