import React, { useEffect, useState } from 'react';
import AddPic from '../../public/assets/AddPic.svg'
import LoadingSpinner from './LoadingSpinner';






const UserPic = ({ user, onPicChange }) => {
  const [userPic, setUserPic] = useState(null);
  const [refresh, setRefresh] = useState(false);



// Descomentar este useEffect após existir a lógica de file upload: 

    useEffect(() => {
      // Update userPic state when user.img prop changes
      setUserPic(user.img || null);
    }, [user.img]);



    useEffect(() => {
        if (refresh) {
          setTimeout(() => {
            window.location.reload();
          }, 1000); // Delay the reload to allow the animation to play for 1 second
        }
      }, [refresh]);
    

   const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('username', user.username); // Include user email or ID if necessary
      formData.append('email', user.email); // Include user email or ID if necessary
      formData.append('img', file);

      try {
        const res = await fetch('/api/user_img', { // Endpoint for updating user image
          method: 'PATCH',
          body: formData,
        });

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();
        if (data.message === 'User updated.') {
          // Notify parent component to update the picture
          onPicChange(file.name); // Assuming the file name is used as the imageURL
          setRefresh(true); // Set refresh to true to trigger the second useEffect
        } else {
          throw new Error('Failed to update user image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  
 


  return (
    <>
    {refresh && <LoadingSpinner />} {/* Show loading spinner when refreshing */}
    <div className="relative w-[100%] h-[100%] rounded-full overflow-hidden flex justify-center items-center group">
      {userPic ? (
        <img
          src={`/assets/${userPic}`}
          alt=""
          className="w-[100%] h-[100%] rounded-full object-cover"
        />
      ) : (
        <div className='picholder w-full h-full bg-[#5c43b0] flex justify-center items-center'>
          <AddPic
            className="cursor-pointer"
            onClick={() => document.getElementById('fileInput').click()}
          />
          <input
            type="file"
            id="fileInput"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      )}
      <div className="absolute inset-0 bg-[#272339] bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <AddPic
          className="cursor-pointer"
          onClick={() => document.getElementById('fileInput').click()}
        />
      </div>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
    </>
  );
};

export default UserPic;