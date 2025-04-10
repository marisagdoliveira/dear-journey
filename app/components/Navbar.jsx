"use client";

// components/NavBar.js

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Resize from '../../public/assets/Resize.svg'
import Home from '../../public/assets/Home.svg'
import Profile from '../../public/assets/Profile.svg'
import Support from '../../public/assets/Support.svg'
import Notifications from '../../public/assets/Notifications.svg'
import Logout from '../../public/assets/Logout.svg'
import Welcome from '../../public/assets/Welcome.svg'
import { signOut } from "next-auth/react";


//import { HomeIcon, UserIcon, ChatAltIcon, BellIcon, LogoutIcon } from '@heroicons/react/outline'; // Adjust icon imports as per your version 2

const NavBar = ({ setNavbarIsOpen, fetchTheReminder }) => {
    const [isOpen, setIsOpen] = useState(true); // State to manage sidebar open/close

    const toggleSideBar = () => {
        setIsOpen(!isOpen); // Toggle the isOpen state
        setNavbarIsOpen(!isOpen); // Toggle the isOpen state
    };

    const router = useRouter();

    if (!router) {
        return null; // Handle cases where router is not available
    }

  
    return (
        <div className={`h-[380px] ${isOpen ? 'w-[200px]' : 'w-[75px]'} px-4 flex items-center py-8 mb-6 relative border ml-12 rounded-[45px] border-white/60 bg-gradient-to-tl from-[rgba(100,100,211,0.4)] to-[rgba(204,196,255,0.3)] transition-all duration-300 ease-in-out overflow-hidden`}>
            <div style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                marginLeft: '20px',
                zIndex: -1,
            }}>
            </div>
            <div className='relative flex-1 flex flex-col items-start justify-evenly'>
                <div className='ml-2 py-[10px]  cursor-pointer' onClick={toggleSideBar}>
                    <Resize />
                </div>
                <Link href="/homepage" className={`flex items-center py-[10px] text-2xl transition-transform duration-300 ease-in-out`} style={{ fontFamily: 'Darker Grotesque' }}>
                    <Home className="ml-2 w-8 h-8" /> 
                    <div className={`font-medium ml-2 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'} transition-opacity transition-transform duration-300 ease-in-out text-sparkle`}>
                        Home
                    </div>
                </Link>
                <Link href="/welcome" className={`flex items-center py-[10px] text-2xl transition-transform duration-300 ease-in-out`} style={{ fontFamily: 'Darker Grotesque' }}>
                    <Welcome className="ml-2 w-6 h-6" /> 
                    <div className={`font-medium ml-4 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'} transition-opacity transition-transform duration-300 ease-in-out text-sparkle`}>
                        Welcome!
                    </div>
                </Link>
                <Link href={`/profile?isOpen=${isOpen} `} element={<Profile fetchTheReminder={fetchTheReminder} />} className={`flex items-center py-[13px] text-2xl transition-transform duration-300 ease-in-out`} style={{ fontFamily: 'Darker Grotesque' }}>
                    <Profile  className="ml-2 w-8 h-8"/> 
                    <div className={`font-medium ml-2 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'} transition-opacity transition-transform duration-300 ease-in-out text-sparkle`}>
                        Profile
                    </div>
                </Link>
                <Link href="/support" className={`flex items-center py-[10px] text-2xl transition-transform duration-300 ease-in-out`} style={{ fontFamily: 'Darker Grotesque' }}>
                    <Support className="ml-2 w-8 h-8 "/> 
                    <div className={`font-medium ml-2 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'} transition-opacity transition-transform duration-300 ease-in-out text-sparkle`}>
                        Support
                    </div>
                </Link>

                <button 
                    className={`flex items-center py-[10px] text-2xl transition-transform duration-300 ease-in-out`} 
                    style={{ fontFamily: 'Darker Grotesque' }}
                    onClick={() => signOut()}
                >
                    <Logout className="ml-2 w-8 h-8 pt-1.5" /> 
                    <div className={`font-medium ml-2 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-20px]'} transition-opacity transition-transform duration-300 ease-in-out text-sparkle`}>
                        Log Out
                    </div>
                </button>
            </div>
        </div>
    );
    

};

export default NavBar;


