"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import Navbar from "../components/Navbar";
import UserPic from "../components/UserPic";


export default function Homepage() {
  const [username, setUsername] = useState("");
  const [objectUser, setObjectUser] = useState(""); // isto é à toa - ñ ha nenhum obj ficticio neste projeto
  const router = useRouter();

  // Fetch user data to confirm authentication
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
        setObjectUser(data.user);
        if (!data.user.username) { // ---------------> this is the way to access userinfo -> "data.user.whatever"
          throw new Error("User not authenticated");
        }
        setUsername(data.user.username);// ---------------> this is the way to access userinfo -> data.user.x
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.replace("/"); // Redirect to login if not authenticated
      }
    };

    fetchUser();
  }, [router]);



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
        <div className="fixed top-12 right-16 w-[100px] h-[100px]">
          <UserPic user={objectUser} />
        </div>
      </div>
      <div className="mt-14">
        <Navbar />
      </div>
        <Calendar />
      </div>
  );
}
