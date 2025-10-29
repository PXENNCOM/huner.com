import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../images/logo.png';
function Header() {
  const [top, setTop] = useState(true);
  const [showSignupDropdown, setShowSignupDropdown] = useState(false);

  useEffect(() => {
    const scrollHandler = () => {
      window.pageYOffset > 10 ? setTop(false) : setTop(true);
    };
    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [top]);

  return (
    <header className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${!top && 'bg-white backdrop-blur-sm shadow-lg'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            {/* Site branding */}
            <div className="flex-shrink-0 mr-8">
              <Link to="/" className="relative inline-block">
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

            {/* Main Navigation */}
            <nav className="hidden md:flex">
              <ul className="flex items-center space-x-8">
                <li>
                  <Link 
                    to="/companies" 
                    className="font-medium text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                  >
                    For Companies
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/talents" 
                    className="font-medium text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                  >
                    For Talents
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Right side - Auth buttons */}
          <div className="flex items-center">
            <nav className="flex items-center">
              <ul className="flex items-center space-x-3">
                <li>
                  <Link 
                    to="/signin" 
                    className="font-medium text-gray-600 hover:text-gray-900 px-4 py-2 transition duration-150 ease-in-out"
                  >
                    Sign in
                  </Link>
                </li>
                <li className="relative">
                  {/* Sign up dropdown */}
                  <div 
                    className="relative"
                    onMouseEnter={() => setShowSignupDropdown(true)}
                    onMouseLeave={() => setShowSignupDropdown(false)}
                  >
                    <button className="btn-sm text-white bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 transition duration-150 ease-in-out flex items-center px-4 py-2 rounded-md shadow-md hover:shadow-lg">
                      <span>Sign up</span>
                      <svg 
                        className={`w-3 h-3 fill-current text-white flex-shrink-0 ml-2 transition-transform duration-200 ${showSignupDropdown ? 'rotate-180' : ''}`} 
                        viewBox="0 0 12 12" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M6 8.586L2.707 5.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414L6 8.586z" fillRule="nonzero" />
                      </svg>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showSignupDropdown && (
                      <div className="absolute right-0 z-50">
                        {/* Invisible bridge */}
                        <div className="h-3 w-full"></div>
                        
                        {/* Actual dropdown */}
                        <div className="w-44 bg-white rounded-lg shadow-xl border-0 py-2">
                          <Link
                            to="/student/signup"
                            className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition duration-200 ease-in-out"
                          >
                            Join as Talent
                          </Link>
                          <div className="h-px bg-gray-100 mx-2"></div>
                          <Link
                            to="/employer/signup"
                            className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition duration-200 ease-in-out"
                          >
                            Join as Company
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </nav>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Header;