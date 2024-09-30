"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import UserPic from "../components/UserPic";
import VisibilityHidden from "../../public/assets/VisibilityHidden.svg"
import VisibilityOpen from "../../public/assets/VisibilityOpen.svg"
import Link from "next/link";
import { FaRegCircleCheck } from "react-icons/fa6";


export default function Profile() {
  const [username, setUsername] = useState("");
  const [userPic, setUserPic] = useState(null);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [passwordVisible2, setPasswordVisible2] = useState(true);

  const router = useRouter();

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Profile updated successfully!');
        setError('');
      } else {
        setError(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError('An error occurred.');
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center wrapper pb-10">
      <div className="flex items-center mt-[123px]">
        <Navbar />
      </div>

      <div className="flex flex-col w-screen bg-transparent text-white align-start pt-20 pl-20 gap-3">
        {/* Greeting */}
        <div className="flex flex-row">
          <h1 className="darker-grotesque-main" style={{ fontFamily: 'Darker Grotesque', fontSize: 55, fontWeight: 500 }}>
            It's good to see you,
          </h1>
          <span className="w-[80px] pr-16 darker-grotesque-main" style={{ whiteSpace: "normal", fontFamily: 'Darker Grotesque', fontSize: 55, fontWeight: 500 }}>
            &nbsp;{username}!
          </span>
        </div>

        <p className="relative flex align-center darker-grotesque-main pr-6 text-lg" style={{ fontFamily: 'Darker Grotesque', fontSize: 40, fontWeight: 400 }}>
          This is your personal space.
        </p>

        <p className="absolute top-[255px] left-[330px] flex" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 450 }}>Edit your information</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-24">
          <div className="flex items-center mb-4">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              required
              className="bg-transparent border border-white/60 p-2 rounded-xl max-w-[400px] mr-4 pl-2 input-field placeholder-white/80"
              style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
            />
            <label htmlFor="username" className="" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
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
              className="bg-transparent border p-2 rounded-xl max-w-[400px] mr-4 pl-2 input-field placeholder-white/80"
              style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400, color: 'white' }}
            />
            <label htmlFor="email" className="whitespace-nowrap" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
              your email
            </label>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="new password"
              required
              className="relative bg-transparent border border-white/60 p-2 rounded-xl max-w-[400px] mr-4 pl-2 input-field placeholder-white/80"
              style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
            />
            <div className="w-25 h-25 absolute left-[690px] cursor-pointer" onClick={() => setPasswordVisible(!passwordVisible)}>
              {!passwordVisible ? (
                <VisibilityOpen/>
              ) : (
                <VisibilityHidden/>
              )}
            </div>
            <label htmlFor="password" className="whitespace-nowrap" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
              new password
            </label>
          </div>

          <div className="flex items-center mb-4">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="confirm password"
              required
              className="bg-transparent border border-white/60 p-2 rounded-xl max-w-[400px] mr-4 pl-2 input-field placeholder-white/80"
              style={{ fontFamily: 'Darker Grotesque', fontSize: 19, fontWeight: 400 }}
            />
            <div className="w-25 h-25 absolute left-[690px] cursor-pointer" onClick={() => setPasswordVisible2(!passwordVisible2)}>
              {!passwordVisible2 ? (
                <VisibilityOpen/>
              ) : (
                <VisibilityHidden/>
              )}
            </div>
            <label htmlFor="confirmPassword" className="whitespace-nowrap" style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}>
              confirm password
            </label>
          </div>

          {error && <p className="" style={{ color: 'red' }}>
            {error}
            </p>}
          {success && <div className='fixed inset-0 flex justify-center items-center z-50'>
          {/* Save message container */}
          <div className='fixed inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#bcb7fcb7] to-[#4e44a79e] border border-white/60 backdrop-blur-[2px] h-[150px] w-[240px] text-white text-lg p-4 rounded-3xl shadow-lg' style={{ fontFamily: 'Darker Grotesque', fontWeight: 500, fontSize: 18 }}>
            {/* Message */}
            <div className='mb-4'>
              {success}
            </div>
            {/* Check icon */}
            <FaRegCircleCheck className='text-[rgb(173,172,255)]' size={34} />
          </div>
        </div>}
        <div className="flex max-w-[400px] justify-end">
          <button
            type="submit"
            className="button-pop2 flex justify-end bg-[#8585f25e] rounded-xl border border-white/65 text-white px-4 pb-1"
            style={{ fontFamily: 'Darker Grotesque', fontSize: 24, fontWeight: 400 }}
          >
            Save
          </button>
          </div>
        </form>
      </div>

      {/* User Picture and Logo */}
      <div>
        <div className="fixed top-12 right-16 w-[150px] h-[150px] z-1000 mt-16" style={{ zIndex: 10000000 }}>
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
    </div>
  );
}
