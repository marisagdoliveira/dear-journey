"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../public/assets/Logo.svg";
import "../../my-app/postcss.config.mjs"; // Ensure this path is correct
import { useSession, signIn } from "next-auth/react";
import VisibilityHiddenReg from "../public/assets/VisibilityHiddenReg.svg"
import VisibilityOpenReg from "../public/assets/VisibilityOpenReg.svg"


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
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirmation
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [passwordRegVisible, setPasswordRegVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isRegisterPasswordFocused, setIsRegisterPasswordFocused] = useState(false);
  const [isConfirmPassFocused, setIsConfirmPassFocused] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    

    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const [passwordError, setPasswordError] = useState(false);

  // states for reseting password:
  // const [showForgotPassword, setShowForgotPassword] = useState(false);
  // const [resetEmail, setResetEmail] = useState('');
  // const [resetPassword, setResetPassword] = useState('');
  // const [confirmResetPassword, setConfirmResetPassword] = useState('');
  // const [resetMessage, setResetMessage] = useState('');
  // const [passwordResetValidation, setPasswordResetValidation] = useState({});
  // const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  // const [confirmResetPasswordVisible, setConfirmResetPasswordVisible] = useState(false);


  
  useEffect(() => {
    if (session) {
      router.push("/homepage");
    }
  }, [session, router]);

  const handleRegister = async () => {
    try {

      if (!email || !password || !confirmPassword || !username) {
        setMessage("All fields are required.");
        return;
      }

      if (password !== confirmPassword) {
        setMessage("Passwords do not match.");
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
      setMessage(data.message || "User registered successfully!");
      setTimeout(() => {
        setMessage('');  // Clear the message after a delay
        setShowLogin(true);  // Set showLogin to true after the delay

         // Reset the input fields
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword(''); 

    }, 1000);

    } catch (error) {
      console.error("Error registering user:", error);
      setMessage("Failed to register user. Please try again later.");
    }
  };

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


      if (res.error) {
        if (res.error.includes("CredentialsSignin")) {
          setMessage("Incorrect email or password.");
        } else {
          setMessage("Login failed. Please try again.");
        }
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

  useEffect(() => {
    // Validate password
    const isValid = 
    passwordValidation.length &&
    passwordValidation.uppercase &&
    passwordValidation.number &&
    passwordValidation.specialChar;
    
    // Set passwordError based on validation result
    setPasswordError(!isValid);

    setPasswordValidation({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[@$!%*?&]/.test(password),
    });
  }, [password, passwordValidation.length, passwordValidation.uppercase, passwordValidation.number, passwordValidation.specialChar]);





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
              <div className="flex flex-col w-72  h-fit mt-5 mb-2 justify-center items-center text-xl font-semibold text-[#5c62da]">
                <div className="rounded-lg w-full flex justify-center items-center">
                  <Logo className="w-32 h-32 xs:w-48 xs:h-48 sm:w-48 sm:h-48 md:w-48 md:h-48 lg:w-48 lg:h-48 pl-[20px] mb-[-15px]" />
                </div>
                <h1 className="text-white text-3xl mb-3" style={{ fontFamily: 'Vibur, cursive' }}>Sign In</h1>
              </div>
              <input
                className="border border-white/60 bg-transparent placeholder-white/60 rounded-xl w-[300px] h-[30px] py-5 pl-2 mb-4 darker-grotesque-main"
                type="email"
                placeholder="email"
                value={loginEmail}
                autoComplete="off"
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <div className="relative">
              <input
                className="border border-white/60 bg-transparent placeholder-white/60 rounded-xl w-[300px] h-[30px] mb-3 py-5 pl-2 darker-grotesque-main"
                type={passwordVisible2 ? 'text' : 'password'}
                placeholder="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                onFocus={() => setIsPasswordFocused(true)}
                onBlur={() => setIsPasswordFocused(false)}
              />
              {(isPasswordFocused || loginPassword) && (
                <div
                  
                  onClick={() => setPasswordVisible2(!passwordVisible2)}
                >
                  {passwordVisible2 ?
                   <VisibilityOpenReg className="w-25 h-25 absolute top-3 right-[9px] cursor-pointer opacity-0.5" /> :
                   <VisibilityHiddenReg className="w-25 h-25 absolute top-[35%] right-[11px] cursor-pointer" />}
                </div>)}
                </div>

                
              <p className="text-s" style={{ fontFamily: 'Darker Grotesque' }}>{message}</p>


              <div className="flex align-center justify-center text-white text-md tracking-wide " style={{ fontFamily: 'Darker Grotesque', fontWeight: 450 }}
              >
                <span className="hover:underline underline-offset-2 cursor-pointer"
                  onClick={() => {
                  setShowLogin(!showLogin);
                  setMessage('');
                  setErrorMessage('');
                  
                  // Reset inputs when toggling between login and register
                  setUsername('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setLoginEmail('');
                  setLoginPassword('');
                }}
                >
                  Forgot password?
                </span>

              </div>
              <div className="flex align-center justify-center "><button
                className="button-pop2 bg-[#8585F2]/25 border border-white/60 rounded-xl font-medium text-white w-[90px] h-[35px] mt-5 darker-grotesque-main" style={{ fontWeight: '500' }}
                onClick={handleLogin}
              >
                Submit
              </button></div>


             
              <div
                className="mt-3 text-[#5c62da] text-s cursor-pointer flex align-center justify-center" style={{ fontFamily: 'Vibur, cursive' }}
                onClick={() => {
                setShowLogin(false);
                setMessage('');

                // Reset login input fields
                setLoginEmail('');
                setLoginPassword('');
              }}
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
              <div className="flex flex-col w-72 h-fit mt-5 mb-2 justify-center items-center text-xl font-semibold text-[#5c62da]">
                <div className="rounded-lg w-full flex justify-center items-center">
                  <Logo className="w-32 h-32 !xs:w-48 !xs:h-48 !sm:w-48 !sm:h-48 md:w-48 md:h-48 lg:w-48 lg:h-48 pl-[20px] mb-[-15px] min-w-48 min-h-48 " />
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
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
              <input
                className="border border-white/60 bg-transparent placeholder-white/60 rounded-xl w-[300px] h-[30px] mb-3 py-5 pl-2 darker-grotesque-main"
                type={passwordRegVisible ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => {setPassword(e.target.value); setPasswordValidation(e.target.value)}}
                  
                onFocus={() => setIsRegisterPasswordFocused(true)}
                onBlur={() => setIsRegisterPasswordFocused(false)}
              />
              {(isRegisterPasswordFocused || password) && (
                <div
                  
                  onClick={() => setPasswordRegVisible(!passwordRegVisible)}
                >
                  {passwordRegVisible ?
                   <VisibilityOpenReg className="w-25 h-25 absolute top-[21%] right-[10px] cursor-pointer" /> :
                    <VisibilityHiddenReg className="w-25 h-25 absolute top-[35%] right-[10px] cursor-pointer" />}
                </div>)}
                </div>

              {/* Password Validation Messages */}
              {(isRegisterPasswordFocused || password) && (
                <ul 
                  className={`text-sm mt-1 ml-1 error-message ${!passwordError ? 'hidden' : ''}`}
                >
                  <li className={passwordValidation.length ? "text-[rgb(172,255,226)]" : "text-white/70"}>
                    {passwordValidation.length ? "✔" : "✘"} At least 6 characters
                  </li>
                  <li className={passwordValidation.uppercase ? "text-[rgb(172,255,226)]" : "text-white/70"}>
                    {passwordValidation.uppercase ? "✔" : "✘"} At least one uppercase letter
                  </li>
                  <li className={passwordValidation.number ? "text-[rgb(172,255,226)]" : "text-white/70"}>
                    {passwordValidation.number ? "✔" : "✘"} At least one number
                  </li>
                  <li className={passwordValidation.specialChar ? "text-[rgb(172,255,226)]" : "text-white/70"}>
                    {passwordValidation.specialChar ? "✔" : "✘"} At least one special character (@, $, !, %, *, ?, &)
                  </li>
                </ul>
              )}
              <div className="relative">
              <input
                className="border border-white/60 bg-transparent placeholder-white/60 rounded-xl w-[300px] h-[30px] mb-3 mt-1 py-5 pl-2 darker-grotesque-main"
                type={confirmPasswordVisible ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setIsConfirmPassFocused(true)}
                onBlur={() => setIsConfirmPassFocused(false)}
              />
              {(isConfirmPassFocused || confirmPassword) && (
                <div
                  
                  onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                >
                  {confirmPasswordVisible ?
                   <VisibilityOpenReg className="w-25 h-25 absolute top-[28%] right-[9px] cursor-pointer" /> :
                   <VisibilityHiddenReg className="w-25 h-25 absolute top-[40.5%] right-[12px] cursor-pointer" />}
                </div>)}
                </div>
              <p className="text-s" style={{ fontFamily: 'Darker Grotesque' }}>{message}</p>
              <div className="flex align-center justify-center"><button
                className="button-pop2 bg-[#8585F2]/25 border border-white/60 rounded-xl text-white w-[90px] h-[35px] mt-5 darker-grotesque-main" style={{ fontWeight: '500' }}
                onClick={handleRegister}
              >
                Submit
              </button></div>

              <div
                className="flex align-center justify-center mt-3 text-[#5c62da] cursor-pointer text-s hover:underline" style={{ fontFamily: 'Vibur, cursive' }}
                onClick={() => {
                  setShowLogin(!showLogin);
                  setMessage('');
                  setErrorMessage('');
                  
                  // Reset inputs when toggling between login and register
                  setUsername('');
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                  setLoginEmail('');
                  setLoginPassword('');
                }}

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



