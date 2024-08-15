"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import Navbar from "../components/Navbar";
import UserPic from "../components/UserPic";


export default function Homepage() {
  const [username, setUsername] = useState("");
  const [userPic, setUserPic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
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

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div className="flex items-center justify-center wrapper pb-10">
      <div>
        <div className="fixed top-5 w-[100px] h-[100px]">
        <div className="flex w-72 mb-10 h-fit mt-5 mb-2 justify-center items-center font-semibold text-[#5c62da]">
            <div className="w-full flex justify-center items-center -ml-20">
              <img src="../../assets/Logo.svg" className="w-28 h-28" />
            </div>
          </div>
        </div>
        <div className="fixed top-12 right-16 w-[100px] h-[100px] z-50" >
        <UserPic user={{ img: userPic, email: email, username: username }} onPicChange={handlePicChange} />
        </div>
      </div>
      <div className="mt-14 z-0">
        <Navbar />
      </div>
        <Calendar />
      </div>
  );
}
