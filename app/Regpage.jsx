"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../public/assets/Logo.svg";
import "../../my-app/postcss.config.mjs"; // Ensure this path is correct
import { useSession, signIn } from "next-auth/react";


export default function Regpage() {  
  
  const { data: session } = useSession();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState(""); // register
  const [email, setEmail] = useState(""); // register
  const [password, setPassword] = useState(""); // register ----- Estes comparam com login: 
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loginEmail, setLoginEmail] = useState(""); // login
  const [loginPassword, setLoginPassword] = useState(""); // login

  
  useEffect(() => {
    if (session) {
      router.push("/homepage");
    }
  }, [session, router]);

  const handleRegister = async () => {
    try {

      if (!email || !password || !username) {
        setMessage("All fields are required.");
        return;
      }
      
       // Check if the email is already in use using the new GET endpoint
      const checkEmailRes = await fetch(`/api/check-email?email=${encodeURIComponent(email)}`, {
        method: "GET", 
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!checkEmailRes.ok) {
        console.error("Failed to check email:", checkEmailRes); // Log if the request fails
        throw new Error("Network response was not ok");
      }

      const checkEmailData = await checkEmailRes.json();
      if (checkEmailData.exists) {
        setErrorMessage("This email is already in use.");
        return;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      setMessage(data.message || "User registered successfully.");
      setTimeout(() => setMessage(''), 3000);  // Clear the message after a delay

    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("Failed to register user. Please try again later.");
    }
  };

  //const handleLogin = async () => {
  //  if (!loginEmail || !loginPassword) {
  //    setMessage("All fields are required.");
  //    return;
  //  }
//
//
  //  try {
  //    const res = await fetch("/api/login", {
  //      method: "POST",
  //      headers: {
  //        "Content-Type": "application/json",
  //      },
  //      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
  //    });
//
  //    if (!res.ok) {
  //      throw new Error("Network response was not ok");
  //    }
//
  //    const data = await res.json();
  //    setMessage(data.message || "Logged in successfully.");
  //    setTimeout(() => setMessage(''), 3000);  // Clear the message after a delay
//
  //    router.replace("/homepage");
  //  } catch (error) {
  //    console.error("Error logging in:", error);
  //    setMessage("Failed to log in. Please try again later.");
  //  }
  //};
  // const handleLogin = async () => {
  //   if (!loginEmail || !loginPassword) {
  //     setMessage("All fields are required.");
  //     return;
  //   }


  //   try {
  //     const res = await signIn("credentials", {
  //       email: loginEmail,
  //       password: loginPassword,
  //       redirect: false,
  //     })

  //     console.log(res); // Log the response for debugging


  //     if (!res.ok) {
  //       throw new Error("Network response was not ok");
  //       return;
  //     }

  //     const data = await res.json();
  //     setMessage(data.message || "Logged in successfully.");
  //     setTimeout(() => setMessage(''), 3000);  // Clear the message after a delay

  //     router.replace("homepage");
  //   } catch (error) {
  //     console.error("Error logging in:", error);
  //     setMessage("Failed to log in. Please try again later.");
  //   }
  // };


  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setMessage("All fields are required.");
      return;
    }


    try {
      const res = await signIn("credentials", {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      })

      console.log(res); // Log the response for debugging


      if (!res.ok) {
        throw new Error("Network response was not ok");
        return;
      }

      const data = await res.json();
      setMessage(data.message || "Logged in successfully.");
      setTimeout(() => setMessage(''), 3000);  // Clear the message after a delay

      router.replace("homepage");
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage("Failed to log in. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <div className="flex flex-col w-[500px] h-[500px] rounded-2xl gap-2 text-white items-center justify-center " style={{ perspective: 1000 }}>
        <AnimatePresence mode="wait">
          {showLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.5 }}
              className="w-72"
            >
              <div className="flex flex-col w-72 mb-10 h-fit mt-5 mb-2 justify-center items-center text-xl font-semibold text-[#5c62da]">
                <div className="rounded-lg w-full flex justify-center items-center">
                  <Logo className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 pl-[20px] mb-[-15px]" />
                </div>
                <h1 className="text-white text-3xl mb-3" style={{ fontFamily: 'Vibur, cursive' }}>Sign In</h1>
              </div>
              <input
                className="border border-white/60 bg-transparent placeholder-white/60 rounded-xl w-[300px] h-[30px] py-5 pl-2 mb-4 darker-grotesque-main"
                type="email"
                placeholder="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <input
                className="border border-white/60 bg-transparent placeholder-white/60 rounded-xl w-[300px] h-[30px] mb-3 py-5 pl-2 darker-grotesque-main"
                type="password"
                placeholder="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <p className="text-s" style={{ fontFamily: 'Darker Grotesque' }}>{message}</p>
              <div className="flex align-center justify-center"><button
                className="bg-[#8585F2]/25 border border-white/60 rounded-xl font-medium text-white w-[90px] h-[35px] mt-5 darker-grotesque-main" style={{ fontWeight: '500' }}
                onClick={handleLogin}
              >
                Submit
              </button></div>
             
              <div
                className="mt-3 text-[#5c62da] text-s cursor-pointer flex align-center justify-center" style={{ fontFamily: 'Vibur, cursive' }}
                onClick={() => {setShowLogin(false); setMessage('');}}
              >
                Don't have an account?{" "}
                <span className="flex text-[#5c62da] text-s hover:underline  align-center justify-center pl-1" style={{ fontFamily: 'Vibur, cursive' }}>
                  Register here!
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ duration: 0.5 }}
              className="w-72"
            >
              <div className="flex flex-col w-72 mb-10 h-fit mt-5 mb-2 justify-center items-center text-xl font-semibold text-[#5c62da]">
                <div className="rounded-lg w-full flex justify-center items-center">
                  <Logo className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 pl-[20px] mb-[-15px]" />
                </div>
                <h1 className="text-white text-3xl mb-3" style={{ fontFamily: 'Vibur, cursive' }}>Sign Up</h1>
              </div>
              <input
                className="border border-white/60 bg-transparent placeholder-white/60 rounded-xl w-[300px] h-[30px] mb-4 py-5 pl-2 darker-grotesque-main"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="border border-white/60 bg-transparent placeholder-white/60 rounded-xl w-[300px] h-[30px] mb-4 py-5 pl-2 darker-grotesque-main"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="border border-white/60 bg-transparent placeholder-white/60 rounded-xl w-[300px] h-[30px] mb-3 py-5 pl-2 darker-grotesque-main"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-s" style={{ fontFamily: 'Darker Grotesque' }}>{message}</p>
              <div className="flex align-center justify-center"><button
                className="bg-[#8585F2]/25 border border-white/60 rounded-xl text-white w-[90px] h-[35px] mt-5 darker-grotesque-main" style={{ fontWeight: '500' }}
                onClick={handleRegister}
              >
                Submit
              </button></div>

              <div
                className="flex align-center justify-center mt-3 text-[#5c62da] cursor-pointer text-s hover:underline" style={{ fontFamily: 'Vibur, cursive' }}
                onClick={() => {setShowLogin(true); setMessage('');}}

              >
                Already have an account?
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}



