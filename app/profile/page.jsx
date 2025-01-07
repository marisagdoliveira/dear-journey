"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import UserPic from "../components/UserPic";
import Popup from "../components/Popup";
import MonthGraph from "../components/MonthGraph";
import VisibilityHidden from "../../public/assets/VisibilityHidden.svg"
import VisibilityOpen from "../../public/assets/VisibilityOpen.svg"
import StatsJournaling from "../../public/assets/StatsJournaling.svg"
import Link from "next/link";
import { FaRegCircleCheck } from "react-icons/fa6";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";
import { MdInbox } from "react-icons/md";



import { BsJournals } from "react-icons/bs";

import { useReminder } from "@/context/ReminderContext";

import ArrowDropdown from "../../public/assets/ArrowDropdown.svg"
import ChartIcon from "../../public/assets/ChartIcon.svg"
import StatsInsightsIcon from "../../public/assets/StatsInsightsIcon.svg"
import JournalEntriesIcon from "../../public/assets/JournalEntriesIcon.svg"
import StatsMonthIcon from "../../public/assets/StatsMonthIcon.svg"
import ActiveNotificationsIcon from "../../public/assets/ActiveNotificationsIcon.svg"
import OpenNotifications from "../../public/assets/OpenNotifications.svg"
import TrashNotifications from "../../public/assets/TrashNotifications.svg"
import Close from "../../public/assets/Close.svg"
import Calenleft from "../../public/assets/Calenleft.svg"
import Calenright from "../../public/assets/Calenright.svg"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, addDays, subDays, startOfToday, isSameDay } from "date-fns";










export default function Profile({  }) {

  const fetchTheReminder = useReminder();


  const [username, setUsername] = useState("");
  const [userPic, setUserPic] = useState(null);
  const [email, setEmail] = useState("");// Stores user email
  const [journalEntries, setJournalEntries] = useState([]); 
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Track password change
  const [monthlyCounts, setMonthlyCounts] = useState(Array(12).fill(0)); // Stores monthly entry counts
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false); // State to manage dropdown visibility
  const [totalCountsMainContent, setTotalCountsMainContent] = useState(0);
  const [totalCountsSmallNotes, setTotalCountsSmallNotes] = useState(0);
  const [journalingTendency, setJournalingTendency] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [navbarIsOpen, setNavbarIsOpen] = useState(true);  // State to hold the isOpen value (prop)

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
  const [isCurrentPasswordFocused, setIsCurrentPasswordFocused] = useState(false);
  const [successFeedbackMessage, setSuccessFeedbackMessage] = useState(null);  // Success status Message on deleting notification
  const [failFeedbackMessage, setFailFeedbackMessage] = useState(null);  // Fail Status Message on deleting notification

  const [showPopupFromNotific, setShowPopupFromNotific] = useState(false);
  const [noteDate, setNoteDate] = useState("");
  const [title1, setTitle1] = useState("");
  const [showSmallNotesCalendar, setShowSmallNotesCalendar] = useState(false);








  

    
    useEffect(() => {
      fetchUserAndJournalEntries();
    }, []);
  
    const fetchUserAndJournalEntries = async () => {
      try {
        const response = await fetch(`/api/user`);
        if (response.ok) {
          const data = await response.json();
          setEmail(data.user.email);
          setJournalEntries(data.user.library); // Assuming `library` contains all journal entries
          setNotifications(data.user.notifications); // Store notifications in state

          
        // Calculate monthly journaling counts based on selected year
        const counts = Array(12).fill(0);
        let mainEntriesCount = 0;
        let insightsCount = 0;

        data.user.library.forEach(entry => {
          const entryDate = new Date(entry.date);
          
            // Check if the entry belongs to the selected year
            if (entryDate.getFullYear() === Number(selectedYear)) {
              // Count Main Entries
              if (entry.mainContent !== "" && entry.title !== "") {
                mainEntriesCount++;
                const month = entryDate.getMonth();
                counts[month] += 1;
              }
             
              // Count insights (small notes) - count non-empty smallNotes arrays
              if (entry.smallNotes && entry.smallNotes.length > 0) {
                insightsCount += entry.smallNotes.length;  // Increment insights count by the number of small notes
              }
            }
          });
          setMonthlyCounts(counts);
          setTotalCountsMainContent(mainEntriesCount);
          setTotalCountsSmallNotes(insightsCount);

          console.log(counts);
          console.log(mainEntriesCount);
          console.log(insightsCount);

          // Calculate journaling tendency as a percentage of days in the year
          const daysInYear = selectedYear === currentYear ? 
          Math.ceil((new Date() - new Date(selectedYear, 0, 1)) / (1000 * 60 * 60 * 24)) :
          365;
          const tendencyPercentage = Math.round((mainEntriesCount / daysInYear) * 100);
          setJournalingTendency(tendencyPercentage);

        } else {
          throw new Error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    }



  const router = useRouter();
  
 //useEffect(() => {
 //  // Only proceed when the router is ready and query is available
 //  if (router.isReady && router.query) {
 //    const openState = router.query.isOpen === 'true'; // Convert query to boolean
 //    console.log(openState)
 //    setIsOpen(openState);
 //  }
 //}, [router.isReady, router.query]); // Trigger when router is ready or query changes




  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", { method: "GET" });
        if (!res.ok) throw new Error("Network response was not ok");
        
        const data = await res.json();
        if (!data.user.username) throw new Error("User not authenticated");

        setUsername(data.user.username);
        setUserPic(data.user.img || null);
        setEmail(data.user.email);

        // Prefill the form with fetched user data
        setFormData({
          email: data.user.email,
          username: data.user.username,
          password: '',
          confirmPassword: ''
        });
        
      } catch (error) {
        console.error("Error fetching user data:", error);
        router.replace("/"); // Redirect to login if not authenticated
      }
    };

    fetchUser();
  }, [router]);

  const handlePicChange = (newPicUrl) => setUserPic(newPicUrl);

  const handleChange = (e) => {
    const { name, value } = e.target; // <-- Add this line to destructure `name` and `value`.

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
     // Set isChangingPassword if password field is filled or cleared ---> new - 14/10!!! -----------
     if (name === 'password') {
      setIsChangingPassword(!!value);  // true if password has value, false if it's cleared
    } // ---------------------------------------------------------------------------------------------
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form submitted", formData);

  if (isChangingPassword) {
    if (!formData.confirmPassword) {
      setError('Password confirmation is required!');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
  }

  try {
    console.log("Sending update request");

    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        currentPassword,
      }),
    });

    const data = await res.json();
    console.log("Response received:", res.status, data);

    if (res.ok) {
      setSuccess('Profile updated successfully!');
      setError('');

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      setError(data.message || 'Failed to update profile.');
    }
  } catch (err) {
    setError('An error occurred.');
    console.error('Fetch error:', err);
  }
};

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Generate an array of years from 2023 to the current year
  const years = [];
  for (let year = 2023; year <= currentYear; year++) {
    years.push(year);
  }


  // Calculate the month with the maximum journal entries
  const maxEntries = Math.max(...monthlyCounts);
  const maxMonthIndex = monthlyCounts.indexOf(maxEntries);

  // Calculate the percentage of entries for the max month relative to the total
  const maxMonthPercentage = totalCountsMainContent > 0 
    ? ((maxEntries / totalCountsMainContent) * 100).toFixed(1)  // Rounded to 1 decimal place
    : 0;

  let maxMonth = '';
  if (maxEntries > 0) {
    maxMonth = new Date(0, maxMonthIndex).toLocaleString('en', { month: 'long' });
  }



  // Handle year change for graph
  const handleYearChange = (year) => {
    setSelectedYear(year); // Set the selected year directly
    setDropdownIsOpen(false); // Optionally close the dropdown after selection
  };

  // Fetch data on component mount and when selectedYear changes
  useEffect(() => {
    fetchUserAndJournalEntries();
  }, [selectedYear]); // Dependency on selectedYear



  async function handleDeleteNotification(notification) {
    const { noteDate, noticeDate } = notification;

    if (!email) {
        console.error('Email is not available yet.');
        setFailFeedbackMessage('Failed to delete notification!'); // Email might be missing
        setTimeout(() => setFailFeedbackMessage(null), 3000); // Hide after 3 seconds
        return;
    }

    if (!noteDate || !noticeDate) {
        console.error('Missing required fields:', { email, noteDate, noticeDate });
        setFailFeedbackMessage('Failed to delete notification!'); // Required fields might be missing
        setTimeout(() => setFailFeedbackMessage(null), 3000); // Hide after 3 seconds
        return;
    }

    try {
        const response = await fetch('/api/delnotifications', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, noteDate, noticeDate }), // Use email from state
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to delete notification:', errorData.message);
            setFailFeedbackMessage('An error occurred while deleting the notification!');
            setTimeout(() => setFailFeedbackMessage(null), 3000); // Hide after 3 seconds
            return;
        }

        const result = await response.json();
        console.log('Notification deleted successfully:', result.message);

        // Update state/UI
        setNotifications((prevNotifications) =>
            prevNotifications.filter(
                (n) =>
                    !(n.noteDate === noteDate && n.noticeDate === noticeDate)
            )
        );

        setSuccessFeedbackMessage('Notification deleted successfully!');
        setTimeout(() => setSuccessFeedbackMessage(null), 3000); // Hide after 3 seconds
        } catch (error) {
            console.error('Error deleting notification:', error);
            setFailFeedbackMessage('An error occurred while deleting the notification.');
            setTimeout(() => setFailFeedbackMessage(null), 3000); // Hide after 3 seconds
        }

      }


  const handleOpenNotification = (date) => {
    setNoteDate(date); // Set the date or any data you want to pass
    setShowPopupFromNotific(true);
  };

  const handleClosePopup = () => {
    setShowPopupFromNotific(false);
  };

  


  return (
    <div className="flex justify-center wrapper pb-10">
      <div className="flex items-center mt-[195px] " style={{ zIndex: 10000000 }}>
        <Navbar setNavbarIsOpen={setNavbarIsOpen} />
      </div>

      <div className="flex flex-col w-screen bg-transparent text-white align-start pt-5 pl-20 gap-2">
        {/* Greeting */}
        <div className="flex flex-row">
          <h1 className="darker-grotesque-main" style={{ fontFamily: 'Darker Grotesque', fontSize: 45, fontWeight: 600 }}>
            It's good to see you,
          </h1>
          <span className="w-[80px] pr-16 darker-grotesque-main" style={{ whiteSpace: "normal", fontFamily: 'Darker Grotesque', fontSize: 45, fontWeight: 550 }}>
            &nbsp;{username}!
          </span>
        </div>

        <p className="relative flex align-center darker-grotesque-main pr-6 text-lg" style={{ fontFamily: 'Darker Grotesque', fontSize: 30, fontWeight: 470 }}>
          This is your personal space.
        </p>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
        <p className="flex" style={{ fontFamily: 'Darker Grotesque', fontSize: 20, fontWeight: 450, marginBottom: -10 }}>
          Edit your information</p>
          <div className="flex items-center mb-4">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              required
              className="bg-transparent border border-white/60 p-1 rounded-lg max-w-[400px] mr-4 pl-2 input-field placeholder-white/80"
              style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
            />
            <label htmlFor="username" className="" style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}>
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
              className="bg-transparent border p-1 rounded-lg max-w-[400px] mr-4 pl-2 input-field placeholder-white/80"
              style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400, color: 'white' }}
            />
            <label htmlFor="email" className="whitespace-nowrap" style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}>
              your email
            </label>
          </div>

          <div className="flex items-center relative mb-4">
            <input
              type={currentPasswordVisible ? 'text' : 'password'}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="type current password"
              required={isChangingPassword}
              className="bg-transparent border border-white/60 p-1 rounded-lg max-w-[400px] mr-4 pl-2 input-field placeholder-white/80"
              style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
              onFocus={() => setIsCurrentPasswordFocused(true)}
              onBlur={() => setIsCurrentPasswordFocused(false)}
            />
            {(isCurrentPasswordFocused || formData.currentPassword) && (
              <div
                className="w-25 h-25 absolute left-[360px] cursor-pointer"
                onClick={() => setCurrentPasswordVisible(!currentPasswordVisible)}
              >
                {currentPasswordVisible ? <VisibilityOpen /> : <VisibilityHidden />}
              </div>
            )}
            <label
              htmlFor="currentPassword"
              className="whitespace-nowrap"
              style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
            >
              current password
            </label>
          </div>

        <div className="flex items-center relative mb-4">
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="type new password"
            required={isChangingPassword}
            className="bg-transparent border border-white/60 p-1 rounded-lg max-w-[400px] mr-4 pl-2 input-field placeholder-white/80"
            style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
            onFocus={() => setIsPasswordFocused(true)}
            onBlur={() => setIsPasswordFocused(false)}
          />
          {(isPasswordFocused || formData.password) && (
            <div
              className="w-25 h-25 absolute left-[360px] cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <VisibilityOpen /> : <VisibilityHidden />}
            </div>
          )}
          <label
            htmlFor="new password"
            className="whitespace-nowrap"
            style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
          >
            new password
          </label>
        </div>

        <div className="flex items-center relative mb-4">
          <input
            type={passwordVisible2 ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="type new password confirmation"
            required={isChangingPassword}
            className="bg-transparent border border-white/60 p-1 rounded-lg max-w-[400px] mr-4 pl-2 input-field placeholder-white/80"
            style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
            onFocus={() => setIsConfirmPasswordFocused(true)}
            onBlur={() => setIsConfirmPasswordFocused(false)}
          />
          {(isConfirmPasswordFocused || formData.confirmPassword) && (
            <div
              className="w-25 h-25 absolute left-[360px] cursor-pointer"
              onClick={() => setPasswordVisible2(!passwordVisible2)}
            >
              {passwordVisible2 ? <VisibilityOpen /> : <VisibilityHidden />}
            </div>
          )}
          <label
            htmlFor="confirmPassword"
            className="whitespace-nowrap"
            style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
          >
            confirm new password
          </label>
        </div>

          {error && <div className='fixed top-80 left-[50vw] w-{100vw} h-{100vh} flex justify-center items-center z-50'>
          {/* Save message container */}
          <div className="overlay_blur"></div>
          <div className='absolute flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#bcb7fcb7] to-[#4e44a79e] border border-white/60 backdrop-blur-[2px] h-[150px] w-[240px] text-white text-lg p-4 rounded-3xl shadow-lg' style={{ fontFamily: 'Darker Grotesque', fontWeight: 500, fontSize: 18, zIndex: 100000 }}>
            {/* Message */}
            <div className='mb-4' style={{ fontFamily: 'Darker Grotesque' }}>
              {error}
            </div>
            {/* Alert icon */}
            <FiAlertCircle className='text-[rgb(255,172,201)]' size={34} />
          </div>
            </div>}
          {success && <div className='fixed top-80 left-[50vw] w-{100vw} h-{100vh} flex justify-center items-center z-50'>
          {/* Save message container */}
          <div className="overlay_blur"></div>
          <div className='absolute flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#bcb7fcb7] to-[#4e44a79e] border border-white/60 backdrop-blur-[2px] h-[150px] w-[240px] text-white text-lg p-4 rounded-3xl shadow-lg' style={{ fontFamily: 'Darker Grotesque', fontWeight: 500, fontSize: 18, zIndex: 100000 }}>
            {/* Message */}
            <div className='mb-4' style={{ fontFamily: 'Darker Grotesque' }}>
              {success}
            </div>
            {/* Check icon */}
            <FaRegCircleCheck className='text-[rgb(172,255,226)]' size={34} />
          </div>
        </div>}
        <div className="flex max-w-[400px] justify-end">
          <button
            type="submit"
            className="button-pop2 mt-2 flex justify-end bg-[#8585f25e] rounded-xl border border-white/65 text-white px-4 pb-1"
            style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}
          >
            Save
          </button>
          </div>
        </form>
      
      {/* Journal Tracker - graph */}
      <div className="flex justify-end items-center w-[750px] h-[180px] pr-5 bg-gradient-to-tr from-[#C6BCFF] to-[#AA9BFE] border-none rounded-[30px] shadow-[#6760bba6] mt-5 shadow-lg">
        <div className="journal-analysis p-4 text-white">
          <h2 className="journal-analysis-title text-md mb-4 pl-10 relative" style={{ fontFamily: "Vibur", fontSize: 20 }}>
            <ChartIcon className="absolute bottom-1 left-0" />Your Journaling Analysis for {selectedYear}
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 journal-analysis-content text-sm tracking-wide ">
              <span><JournalEntriesIcon/></span>
              <span className="text-[#6D6BC8] font-bold">{totalCountsMainContent}</span>Journal Entries
            </div>
            <div className="flex gap-2 journal-analysis-content text-sm tracking-wide">
              <span><StatsInsightsIcon size={44}/></span>
              <span className="text-[#6D6BC8] font-bold">{totalCountsSmallNotes}</span>Insights
            </div>
          </div>
                    
          {/* New item to display the month with the most entries and its percentage */}
          <div className="journal-analysis-content text-sm tracking-wide mt-2 relative">
            <div className="flex justify-end">
              <span className="text-white max-w-[185px] break-words absolute top-[-61px] right-[-25px]">
                <div className="relative">
                  <span className="absolute right-[193px]"><StatsMonthIcon /></span>
                </div>
                {/* Check if there are no entries */}
                {maxEntries > 0 ? (
                  <>
                    <span className="text-[#6D6BC8] font-bold ">{maxMonth}</span> leads with <span className="text-[#6D6BC8] font-bold">{maxEntries}</span> entries, making up <span className="text-[#6D6BC8] font-bold">{maxMonthPercentage}%</span> of the total.
                  </>
                ) : (
                  <span className="text-[#6D6BC8] font-bold">No entries found for the selected year</span>
                )}
              </span>
            </div>
          </div>

        {/* Journaling tendency sentence */}
        <div className="text-sm flex relative gap-3 mt-1 ">
          <div className="checkmark-container absolute top-2">
            <div className="circle"></div>
            <div className="checkmark"></div>
          </div>
          <div className="text-[#6D6BC8] tracking-wider " style={{ fontFamily: "Darker Grotesque", fontWeight: 600 }}>
            This corresponds to an overall journaling tendency of{" "}
            <span className="text-white font-bold">{journalingTendency}%</span> throughout the year.
          </div>
        </div>
      </div>

      {/* Year Selection and StatsJournaling */}
      <div className="relative w-[350px] h-[130px] bg-[#cdc6ff] border-none rounded-2xl">
        {/* Current Year display & dropdown year Selection */}
        <div className="relative">
          <div className="bg-transparent text-white pl-3 current-year year-option">
            {selectedYear}
          </div>
          <ArrowDropdown
            className="absolute top-7 left-[82px] cursor-pointer"
            style={{ fontSize: 24 }}
            onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
          />
          {dropdownIsOpen && (
            <ul className="absolute left-8 top-11 border-none rounded-lg p-1 pb-0 pt-0 bg-[#cdc6ff76] backdrop-blur-sm text-white max-h-16 overflow-auto z-10">
              {years.map((year) => (
                <li
                  key={year}
                  className="relative cursor-pointer"
                  onClick={() => handleYearChange(year.toString())} // Pass the year directly as a string
                >
                  {year}
                </li>
              ))}
            </ul>
          )}
        </div>
              
        {/* Container for Year and StatsJournaling SVG - left */}
        <div className="absolute bottom-1 left-4 flex flex-col items-center">
          <StatsJournaling className="w-[50px] h-[50px]" />
        </div>
              
        {/* Monthly Counts Graph */}
        <div className="relative h-full">
          <div className="flex gap-1 items-end w-[400px] p-4 pl-[130px] pb-[25px] h-full">
            {monthlyCounts.map((count, index) => {
              const year = new Date().getFullYear();
              const monthDays = new Date(year, index + 1, 0).getDate();
              const heightPercentage = count > 0 ? Math.min(count * 4, 170) : 1;
            
              return (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className="relative bg-gradient-to-r from-[#a3a1f5] to-[#8C8ADB] w-3 flex items-end justify-center rounded-t-xl transition-all duration-300 graph_bar"
                    style={{ height: `${heightPercentage}px` }}
                  >
                    <span className="absolute text-[#ffffff2f] text-xs tooltip">{count}/{monthDays}</span>
                  </div>
                  <span className="text-white text-xs mb-1">
                    {new Date(0, index).toLocaleString('en', { month: 'short' }).charAt(0)}
                  </span>
                </div>
              );
            })}

            {/* Ruler - right */}
            <div className="absolute bottom-[31px] left-[350px] h-[120px] flex flex-col justify-between items-center">
              <div className="h-36 relative">
                {[5, 10, 15, 20, 25, 30].map((day, idx) => (
                  <div
                    key={idx}
                    className="absolute left-0 -translate-x-full text-xs text-[#675E99] flex items-center"
                    style={{ bottom: `${(day / 30) * 100}%` }}
                  >
                    <span className="mr-0.5">{day}</span>
                    <span className="w-1 border-t border-[#675E99]"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      </div>
      {/* User Picture and Logo */}
      <div>
        <div className="fixed top- right-16 w-[120px] h-[120px] z-1000 mt-11" style={{  }}>
          <UserPic user={{ img: userPic, email: email, username: username }} onPicChange={handlePicChange} />
        </div>
        <div className="fixed top-10 left-3 w-[440px] h-[100px]" style={{ zIndex: 1000 }}>
          <div className="flex items-center ml-10">
            <Link href="./welcome">
              <img src="../../assets/Logo.svg" className="w-32 h-32 cursor-pointer" alt="Logo" />
            </Link>
          </div>
        </div>
      </div>

      {/* Notification Center - Active Notifications */}
      <div className="active-notifications-title">
        <p
          className={`absolute top-52 tracking-wider border border-white/45 p-2.5 rounded-2xl bg-[#cebdf614] transition-all duration-500 ${navbarIsOpen ? 'right-[40px]' : 'right-[115px]'}`}
          style={{ fontFamily: "Darker Grotesque", fontWeight: 400, fontSize: 20 }}
        >
          <span className="inline-block h-3 w-3 bg-[#6D6BC8] border-none rounded-full mr-2 blinking-circle"></span>
          Active notifications
        </p>
      </div>
     <div className="absolute top-[280px] right-0 h-fit flex justify-center items-end pr-10 pb-10 ">
                  
     <div className={`notification-container scroll-container ${!navbarIsOpen ? 'two-columns' : 'single-column'} ${notifications.length > 0 ? 'max-h-[434px] overflow-y-auto' : ''}`}>
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <div key={index} className="notification-item cursor-pointer">
              <div className="icon-container">
                <ActiveNotificationsIcon /> 
                <p>{new Date(notification.noticeDate).toLocaleDateString()}</p>
          
                {/* Hover actions */}
                <div className="icon-actions absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="action-icon hover:scale-110 transition-transform mr-2"
                    onClick={() => handleDeleteNotification(notification)}
                  >
                    <TrashNotifications className="pt-[3px]" />
                  </button>
                  <button
                    className="action-icon hover:scale-110 transition-transform mr-2"
                    onClick={() => handleOpenNotification(new Date(notification.noteDate))}
                  >

                    <OpenNotifications className="pt-[6px]" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : ( 

          <div className=" relative text-center text-[#ffffff] pr-3 w-full tracking-wide scroll-none" style={{ fontFamily: "Darker Grotesque", fontWeight: 400, fontSize: 20 }}>   {/* When there's no notifications */}
            <div className="no-notific bg-[#aba2ff6c] p-2 border-none rounded-xl flex flex-col items-center justify-center gap-5">
            <p>Nothing to show ...</p>
            <MdInbox className="mb-2 text-[#6f6ed7]" size={44} />
            </div>
          </div>
        )}
      </div>
          {/* Display feedback message */}
          {successFeedbackMessage && (
            <div className='fixed inset-0 flex justify-center items-center z-50'>
            {/* Save message container */}
            <div className='flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#a49ef68c] to-[#4e44a7ab] border border-white/60 backdrop-blur-[2px] h-[150px] w-fit text-white text-lg pl-6 pr-6 p-4 rounded-3xl shadow-lg' style={{ fontFamily: 'Darker Grotesque', fontWeight: 500, fontSize: 18 }}>
              {/* Message */}
              <div className='mb-4 tracking-wider'>
                {successFeedbackMessage}
              </div>
              {/* Check icon */}
              <FaRegCircleCheck className='text-[rgb(172,255,226)]' size={34} />
            </div>
          </div>
          )}

          {failFeedbackMessage && (
            <div className='fixed inset-0 flex justify-center items-center z-50'>
            {/* Save message container */}
            <div className='flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-[#a49ef68c] to-[#4e44a7ab] border border-white/60 backdrop-blur-[2px] h-[150px] w-fit text-white text-lg pl-6 pr-6 p-4 rounded-3xl shadow-lg' style={{ fontFamily: 'Darker Grotesque', fontWeight: 500, fontSize: 18 }}>
              {/* Message */}
              <div className='mb-4 tracking-wider'>
                {failFeedbackMessage}
              </div>
              {/* error icon */}
              <FiAlertCircle className='text-[rgb(255,172,201)]' size={34} />
            </div>
          </div>
          )}
          
          {showPopupFromNotific && (
            
            <div className="fixed inset-0" style={{ zIndex: 1000000 }}>  {/* zIndex em tailwind só vai até 100 - acima de 100 tem de ser no style */}
              <div className="overlay_blur"></div>
              <div className="popup border border-white/45 z-40 ">
                <div className="popup-content flex flex-col justify-center items-center relative">
                  <div className="flex w-full justify-end items-end">
                    <button className="close-button self-end pr-2 top-5 absolute" onClick={() => handleClosePopup()}>
                      <Close />
                    </button>
                  </div>
                  <div className="flex items-center">
                    <p onClick={() => setNoteDate(subDays(noteDate, 1))} className="pr-4 cursor-pointer"><Calenleft /></p>
                     <Popup
                      noteDate={noteDate}
                      showPopupFromNotific={showPopupFromNotific}
                      onSave={(date, title, mainContent, smallNotes) => {
                        console.log("Entry saved:", { date, title, mainContent, smallNotes });
                      }}
                      setTitle1={setTitle1}
                      showSmallNotesCalendar={showSmallNotesCalendar}
                      setShowSmallNotesCalendar={setShowSmallNotesCalendar}
                      fetchTheReminder={fetchTheReminder}
                      

                    />
                  <p onClick={() => setNoteDate(addDays(noteDate, 1))} className="pl-4 cursor-pointer"><Calenright /></p>
              </div>
          </div>
        </div>
      </div>
       )}
    </div>     
  </div>
  );
}