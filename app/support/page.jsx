"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import UserPic from "../components/UserPic";
import CheckSVG from "../../public/assets/CheckSVG.svg"
import EmailSVG from "../../public/assets/EmailSVG.svg"
import FAQIcon from "../../public/assets/FAQIcon.svg"


import { IoChevronDownCircleOutline } from "react-icons/io5";

import Link from "next/link";


export default function Support() {
  const [username, setUsername] = useState("");
  const [userPic, setUserPic] = useState(null);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    description: "",
    explanation: "",
  });

  const [submissionSuccess, setSubmissionSuccess] = useState(false); // state for submission success

  // FAQ TOGGLES:
  const [toggle1, setToggle1] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(false);
  const [toggle4, setToggle4] = useState(false);
  const [toggle5, setToggle5] = useState(false);



  const router = useRouter(); // router for redirection

  // Fetch user data
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/user", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      console.log(data);

      if (!data.user.username) {
        throw new Error("User not authenticated");
      }

      setUsername(data.user.username);
      setUserPic(data.user.img || null);
      setEmail(data.user.email);
      setFormData({
        username: data.user.username,
        email: data.user.email,
        description: "",
        explanation: "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.replace("/"); // Redirect to login if not authenticated
    }
  };

  useEffect(() => {
    fetchUser(); // Call fetchUser inside useEffect
  }, []);

  const handlePicChange = (newPicUrl) => {
    setUserPic(newPicUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send form data as the request body
      });

      if (!res.ok) {
        throw new Error("Failed to submit support ticket");
      }

      const data = await res.json();
      console.log("Support ticket submitted successfully:", data);

      // Update UI to show success message
      setSubmissionSuccess(true);

      // Optionally, redirect to homepage after a delay
      setTimeout(() => {
        router.push("/homepage"); // Redirect to homepage 
      }, 180000); // Redirect after 60 seconds
    } catch (error) {
      console.error("Error submitting the support ticket:", error);
      alert("Failed to submit support ticket. Please try again later.");
    }
  };


  return (
    <div className="flex flex-col wrapper pb-10 w-[100vw] text-white">
      {/* ------------------------------------ Header Section -------------------------------------------------------------------- */}
      <div className="fixed top-10 left-3 w-[440px] h-[100px]" style={{ zIndex: 1000 }}>
        <div className="flex items-center ml-10">
          {/* Logo */}
          <Link href="./welcome">
            <img
              src="../../assets/Logo.svg"
              className="w-32 h-32 cursor-pointer"
              alt="Logo"
            />
          </Link>
        </div>
      </div>
  
      {/* ------------------------------------ Navbar Section ------------------------------------------------------------------------ */}
      <div className="fixed top-[240px] w-[440px]" style={{ zIndex: 1000 }}>
        <Navbar />
      </div>
  
      {/* User Picture */}
      <div className="fixed top-12 right-16 w-[100px] h-[100px]" style={{ zIndex: 10000000 }}>
        <UserPic
          user={{ img: userPic, email: email, username: username }} // Pass userPic instead of UserPic
          onPicChange={handlePicChange}
        />
      </div>
  
      {/* ------------------------------------- Main Content -------------------------------------------------------------------------- */}
      {/* Ticket submission success message: */}
        <div className="pt-[90px]"> {/* Adjust top padding to account for fixed header */}
        {submissionSuccess ? ( 
        <div className=" flex flex-col items-center">
        <div className="waviy" >
          <span style={{ "--i": 1 }}>S</span>
          <span style={{ "--i": 2 }}>u</span>
          <span style={{ "--i": 3 }}>c</span>
          <span style={{ "--i": 4 }}>c</span>
          <span style={{ "--i": 5 }}>e</span>
          <span style={{ "--i": 6 }}>s</span>
          <span style={{ "--i": 7 }}>s</span>
          <span style={{ "--i": 8 }}>!</span>
        </div>
        <div className="relative  flex w-100 h-300 items-center justify-center">
          <div className="animation-container mt-6">
            <svg className="circle-svg" width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="circle-path" cx="75" cy="75" r="70" />
            </svg>
            <CheckSVG className="check-icon" />
            <EmailSVG className="email-icon" />
          </div>
        </div>
        <h2 className="mt-5" style={{ fontFamily: 'Darker Grotesque', fontSize: 40, fontWeight: 500 }}>
          Your support ticket has been submitted.
        </h2>
        <p style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
          Thank you for reaching out! We will review your submission and get back to you soon.
        </p>
        <Link href="/homepage">
          <button className="button-pop flex justify-center items-center mt-10 bg-gradient-to-tr from-[#a49ef6bf] to-[#9b90ffe3] rounded-xl border border-white/65 text-white px-3 shadow-[0px_4px_6px_rgba(0,0,0,0.1)] shadow-[#71718f29] pb-1 darker-grotesque-main"
            style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 500 }}>
            Go to Homepage
          </button>
        </Link>
        </div>
        ) : (
        <div className="pl-80 flex gap-24 justify-between">
          <div className="flex flex-col h-[350px] items-start justify-center mt-4"> {/* Support Form: --------------------------------------------------- */}
            <h1 style={{ fontFamily: 'Darker Grotesque', fontSize: 55, fontWeight: 500 }}>
              Welcome to Support!
            </h1>
            <h2 style={{ fontFamily: 'Darker Grotesque', fontSize: 40, fontWeight: 500 }}>
              How can we help?
            </h2>
            <p className="mb-2" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
              Please, describe the issue below:
            </p>
            <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username"
                  required
                  className="bg-transparent border border-white/60 p-2 rounded-xl flex-grow mr-4 pl-2 input-field placeholder-white/80"
                  style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
                />
                <label htmlFor="username" className="whitespace-nowrap" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
                  username
                </label>
              </div>
  
              <div className="flex items-center mb-4">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email"
                  required
                  className="bg-transparent border p-2 rounded-xl flex-grow mr-4 pl-2 input-field placeholder-white/80"
                  style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400, color: 'white' }}
                />
                <label htmlFor="email" className="whitespace-nowrap" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
                  your email
                </label>
              </div>
  
              <div className="flex items-center mb-4 w-[523px]">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="describe the issue"
                  required
                  className="bg-transparent border p-2 rounded-xl flex-grow mr-4 h-[47px] pl-2 input-field placeholder-white/80"
                  style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400, color: 'white' }}
                />
                <label htmlFor="description" className="whitespace-nowrap" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
                  description
                </label>
              </div>
  
              <div className="absolute flex items-center w-[570px] h-[150px] mb-4">
                <textarea
                  id="explanation"
                  name="explanation"
                  value={formData.explanation}
                  onChange={handleChange}
                  placeholder="Briefly explain the problem you are facing"
                  required
                  className="bg-transparent border p-2 rounded-xl w-[652px] h-[150px] flex-grow mr-4 pl-2 input-field placeholder-white/80"
                  style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
                />
                <label htmlFor="explanation" className="whitespace-nowrap" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}></label>
              </div>
  
              <button type="submit" className="button-pop2 flex justify-center bg-[#8585f267] rounded-xl border border-white/65 text-white px-4 pb-1 relative top-[164px] left-[460px]"
                style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
                Submit
              </button>
            </form>
            </div>

            
            <div className="absolute top-[153px] right-[180px] flex flex-col justify-center items-center"><FAQIcon/></div>
            <div className="relative w-[450px]   mt-40 max-h-[400px]  overflow-hidden overflow-y-auto scroll-container-faq">
                
                <ol className="flex flex-col items-center gap-3">
                  {/* Question 1 */}
                <li className="w-96 h-12 bg-gradient-to-br from-[#887cf9ca] to-[#a49ef6bf] text-white px-3 border border-white/60 rounded-3xl flex items-center justify-between p-3 relative" style={{ fontFamily: 'Darker Grotesque', fontSize: 17, fontWeight: 500 }}>
                  1. What is the purpose of this journaling app?
                  <span className="pl-[60px] pt-1" size={35} strokeWidth={2} onClick={() => setToggle1(!toggle1)} style={{zIndex: 100000000}}>
                    <IoChevronDownCircleOutline className={`cursor-pointer transition-transform duration-300 ${toggle1 ? 'rotate-180' : ''}`} />
                  </span>
                </li>
                <div className={`border border-white/60 rounded-3xl -mt-[59px] pt-[47px] pl-3 h-[160px] bg-[#ad9cfa42] w-96 left-0 overflow-hidden transition-all duration-500 ease-in-out ${toggle1 ? 'max-h-[149px] opacity-100' : 'max-h-0 opacity-0'}`} style={{ fontFamily: 'Darker Grotesque', fontSize: 16, fontWeight: 500 }}>
                Dear Journey was designed to help you reflect on your daily experiences, track your emotions, set and achieve goals, and improve your mental well-being through regular premeditated journaling practices.

                </div>
                {/* Question 2 */}
                <li className="w-96 h-12 bg-gradient-to-br from-[#887cf9ca] to-[#a49ef6bf] text-white px-3 border border-white/60 rounded-3xl flex items-center justify-between p-3 relative" style={{ fontFamily: 'Darker Grotesque', fontSize: 17, fontWeight: 500 }}>
                  2. How do I create a new journal entry?
                  <span className="pl-[60px] pt-1" size={35} strokeWidth={2} onClick={() => setToggle2(!toggle2)} style={{zIndex: 100000000}}>
                    <IoChevronDownCircleOutline className={`cursor-pointer transition-transform duration-300 ${toggle2 ? 'rotate-180' : ''}`} />
                  </span>
                </li>
                <div className={`border border-white/60 rounded-3xl -mt-[59px] pt-[47px] pl-3 h-[160px] bg-[#ad9cfa42] w-96 left-0 overflow-hidden transition-all duration-500 ease-in-out ${toggle2 ? 'max-h-[149px] opacity-100' : 'max-h-0 opacity-0'}`} style={{ fontFamily: 'Darker Grotesque', fontSize: 16, fontWeight: 500 }}>
                To create a new journal entry, simply click on the '+' button on the home screen, enter your thoughts or experiences, and save your entry. You can also add tags, mood indicators, or images to enrich your entry.
                </div>
                 {/* Question 3 */}
                <li className="w-96 h-12 bg-gradient-to-br from-[#887cf9ca] to-[#a49ef6bf] text-white px-3 border border-white/60 rounded-3xl flex items-center justify-between p-3 relative" style={{ fontFamily: 'Darker Grotesque', fontSize: 17, fontWeight: 500 }}>
                  3. Can I customize my journal entries?
                  <span className="pl-[60px] pt-1" size={35} strokeWidth={2} onClick={() => setToggle3(!toggle3)} style={{zIndex: 100000000}}>
                    <IoChevronDownCircleOutline className={`cursor-pointer transition-transform duration-300 ${toggle3 ? 'rotate-180' : ''}`} />
                  </span>
                </li>
                <div className={`border border-white/60 rounded-3xl -mt-[59px] pt-[47px] pl-3 h-[160px] bg-[#ad9cfa42] w-96 left-0 overflow-hidden transition-all duration-500 ease-in-out ${toggle3 ? 'max-h-[149px] opacity-100' : 'max-h-0 opacity-0'}`} style={{ fontFamily: 'Darker Grotesque', fontSize: 16, fontWeight: 500 }}>
                  Yes, you can customize your entries by adding titles, tags, mood indicators, and images. You can also choose different colors to personalize your entries.
                </div>

                {/* Question 4 */}
                <li className="w-96 h-12 bg-gradient-to-br from-[#887cf9ca] to-[#a49ef6bf] text-white px-3 border border-white/60 rounded-3xl flex items-center justify-between p-3 relative" style={{ fontFamily: 'Darker Grotesque', fontSize: 17, fontWeight: 500 }}>
                  4. How can I search through my past entries?
                  <span className="pl-2.5 pt-1" size={35} strokeWidth={2} onClick={() => setToggle4(!toggle4)} style={{zIndex: 100000000}}>
                    <IoChevronDownCircleOutline className={`cursor-pointer transition-transform duration-300 ${toggle4 ? 'rotate-180' : ''}`} />
                  </span>
                </li>
                <div className={`border border-white/60 rounded-3xl -mt-[59px] pt-[47px] pl-3 h-[160px] bg-[#ad9cfa42] w-96 left-0 overflow-hidden transition-all duration-500 ease-in-out ${toggle4 ? 'max-h-[149px] opacity-100' : 'max-h-0 opacity-0'}`} style={{ fontFamily: 'Darker Grotesque', fontSize: 16, fontWeight: 500 }}>
                  You can use the search bar to find specific entries by keywords, tags, or dates. The app also allows you to filter entries by week, month, or year, for easier visualization.
                </div>

                {/* Question 5 */}
                <li className="w-96 h-12 bg-gradient-to-br from-[#887cf9ca] to-[#a49ef6bf] text-white px-3 border border-white/60 rounded-3xl flex items-center justify-between p-3 relative" style={{ fontFamily: 'Darker Grotesque', fontSize: 17, fontWeight: 500 }}>
                  5. Can I track my mood & emotions over time?
                  <span className="pl-[16px] pt-1" size={35} strokeWidth={2} onClick={() => setToggle5(!toggle5)} style={{zIndex: 100000000}}>
                    <IoChevronDownCircleOutline className={`cursor-pointer transition-transform duration-300 ${toggle5 ? 'rotate-180' : ''}`} />
                  </span>
                </li>
                <div className={`border border-white/60 rounded-3xl -mt-[59px] pt-[47px] pl-3 h-[160px] bg-[#ad9cfa42] w-96 left-0 overflow-hidden transition-all duration-500 ease-in-out ${toggle5 ? 'max-h-[149px] opacity-100' : 'max-h-0 opacity-0'}`} style={{ fontFamily: 'Darker Grotesque', fontSize: 16, fontWeight: 500 }}>
                  Our app includes a mood tracker feature where you can log your emotions daily. Over time, you'll be able to view your mood trends and patterns through visual indicators extracted from daily entries.
                </div>

                </ol>
            </div>
          </div>
            )}
      </div>
    </div>
  );
}
