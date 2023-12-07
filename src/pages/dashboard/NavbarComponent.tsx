import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { logoutService } from '@/services/authServices';
import Link from 'next/link';

const NavbarComponent = () => {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logOut = async () => {
    try {
      const response = await logoutService();
      if (response?.status === 201) {
        window.location.href = '/login'
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleHomeClick = () => {
    router.push('/dashboard');
  };

  const handleOtherPageClick = () => {
    router.push('/stats');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="h-16 bg-gray-50 flex items-center justify-between px-4 w-full fixed z-[99999] drop-shadow-md">

      <div className="flex items-center">
        <div className="flex items-center gap-4">
          <a href={'/dashboard/main'}>
          <img src="/trendbox_logo.png" alt="Logo"  className="w-16 sm:w-36 mr-4 sm:mr-8" />
          </a>
          <a
            href={'/dashboard/main'}
            className={`text-sm sm:text-lg py-2 px-3 sm:px-6 rounded-xl ${
              router.pathname === '/dashboard/main' ? 'font-bold bg-sky-600 text-white' : 'text-gray-700'
            } hover:bg-sky-600 hover:text-white transition-colors duration-300`}
            key="main"
          >
            Main
          </a>
          <a
            href={'/dashboard/stats'}
            className={`text-sm sm:text-lg py-2 px-3 sm:px-6 rounded-xl ${
              router.pathname === '/dashboard/stats' ? 'font-bold bg-sky-600 text-white' : 'text-gray-700'
            } hover:bg-sky-600 hover:text-white transition-colors duration-300`}
            
          >
            Statistics
          </a>
          <a
            href={'/dashboard/timeseries'}
            className={`text-sm sm:text-lg py-2 px-3 sm:px-6 rounded-xl ${
              router.pathname === '/dashboard/timeseries' ? 'font-bold bg-sky-600 text-white' : 'text-gray-700'
            } hover:bg-sky-600 hover:text-white transition-colors duration-300`}
            
          >
            Time Series
          </a>
        </div>
      </div>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          onClick={toggleDropdown}
          className={`text-sm sm:text-lg py-2 px-3 sm:px-6 rounded-xl ${
            dropdownOpen ? 'font-bold bg-sky-600 text-white' : 'text-gray-700'
          } hover:bg-sky-600 hover:text-white transition-colors duration-300`}
        >
          Profile
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-10">
            <ul className="py-2">
              <li className="px-4 py-2 hover:bg-gray-200">
                <button
                  onClick={logOut}
                  className="bg-white text-black px-4 py-2 rounded mt-2 w-full text-left hover:bg-gray-200 transition-colors duration-300"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarComponent;
