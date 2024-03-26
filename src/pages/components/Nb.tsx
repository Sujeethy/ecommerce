import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from 'next/router';

const Nb = () => {
  let storedUserData = null;
  
  const router = useRouter(); 
  
  const handleLogout = () => {

    localStorage.removeItem('User');
    
    router.push('/');
  };

  if (typeof window !== 'undefined') {
    
    const storedUserDataString = localStorage.getItem('User');

    if (storedUserDataString) {
      try {
        storedUserData = JSON.parse(storedUserDataString);
      } catch (error) {
        console.error('Error parsing JSON data:', error);
      }
    }
  }
  const [user, setUser] = useState(storedUserData ? storedUserData.name : "");
  const [showLogout, setShowLogout] = useState(false); 
  
  return (
    <div>
      <div className="h-9  flex justify-end pr-10 font-inter text-xs font-normal leading-4.5 text-left">
        <div className="flex flex-row gap-x-5 items-center">
          <div className="mr-5">Help</div>
          <div className="mr-5">Orders & Returns</div>
          
          
          {user!=""?
        <div
        className="user_logo relative"
        onMouseEnter={() => setShowLogout(true)} 
        onMouseLeave={() => {
          setTimeout(() => {
            setShowLogout(false);
          }, 2000); 
        }}
      >
        {"Hi, " + user}
      </div>:<div></div>  
        }
          
          
        </div>
      </div>
      {showLogout && ( 
        <button className="logout_button" onClick={handleLogout}>Logout</button>
      )}
      <div className="h-16  flex items-center px-10 justify-between">
        <div className="w-[212px] h-[39px] text-3xl font-bold font-inter leading-9 text-left pb-4.5">
          ECOMMERCE
        </div>
        <div className="flex flex-row gap-x-8 font-inter text-base font-semibold leading-5 text-left">
          <div className="div">Categories</div>
          <div className="div">Sales</div>
          <div className="div">Clearance</div>
          <div className="div">New stock</div>
          <div className="div">Trending</div>
        </div>
        <div className="flex items-center gap-x-10">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG code for icon */}
          </svg>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* SVG code for icon */}
          </svg>
        </div>
      </div>
      <div className="h-9 bg-gray-200 flex justify-center items-center gap-x-6">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* SVG code for icon */}
        </svg>
        <span className="font-inter text-sm font-medium leading-5 text-left">Get 10% off on business sign up</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* SVG code for icon */}
        </svg>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Nb), { ssr: false });
