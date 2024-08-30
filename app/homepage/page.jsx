"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import Navbar from "../components/Navbar";
import UserPic from "../components/UserPic";
import Link from 'next/link';
import OriginalBinder2 from "../../public/assets/OriginalBinder2.svg"



export default function Homepage() {
  const [username, setUsername] = useState("");
  const [userPic, setUserPic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  // Fetch user data to confirm authentication - BEFORE USERPIC LOGIC:
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", {
          method: "GET",
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        console.log(data)
        if (!data.user.username) { // ---------------> this is the way to access userinfo -> "data.user.whatever"
          throw new Error("User not authenticated");
        }
        setUsername(data.user.username);// ---------------> this is the way to access userinfo -> data.user.x
        setUserPic(data.user.img || null); // -----------> set state userPic
        setEmail(data.user.email);
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.replace("/"); // Redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);


  const handlePicChange = (newPicUrl) => {
    setUserPic(newPicUrl);
  };

  const toggleBinder = () => {
    setIsOpen(!isOpen);
  };

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="flex items-center justify-center wrapper pb-10">
      <div>
        {/* Outer Container with Fixed Position */}
        <div className="fixed top-10 left-5 w-[700px] h-[100px]" style={{ zIndex: "1000" }}>
          <div className="flex items-center font-semibold text-[#5c62da] ml-10">
            {/* Logo and Binder Container */}
            <Link href="">
              <img
                src="../../assets/Logo.svg"
                className="w-28 h-28 cursor-pointer"
              />
            </Link>
            <div className="relative overflow-hidden -ml-2.5 mt-4 w-[calc(100%-7rem)] h-[100px]">
              <div
                className={`absolute top-0 h-full transition-transform duration-300 ease-in-out ${
                  isOpen ? "translate-x-0" : "translate-x-[calc(-100%+15px)]"
                }`}
              >
                <OriginalBinder2 className="h-full" onClick={toggleBinder} />
              </div>
            </div>
          </div>
        </div>

        {/* User Picture */}
        <div className="fixed top-12 right-16 w-[100px] h-[100px] z-50">
          <UserPic
            user={{ img: userPic, email: email, username: username }}
            onPicChange={handlePicChange}
          />
        </div>
      </div>

      {/* Navbar */}
      <div className="mt-14" style={{ zIndex: "1000" }}>
        <Navbar />
      </div>

      {/* Calendar */}
      <Calendar />
    </div>
  );
}
