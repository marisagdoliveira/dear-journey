import React, { useEffect, useState } from 'react';


const UserPic = ({ user }) => {
  const [userPic, setUserPic] = useState(null);

  useEffect(() => {
    // Update userPic state when user.img prop changes
    setUserPic(user.img || null);
  }, [user.img]);

 

  return (


    <div className="w-[100%] h-[100%] rounded-full overflow-hidden flex justify-center items-center">
      {userPic ? (
        <img src={`/assets/${userPic}`} alt="User Pic" className="w-[100%] h-[100%] rounded-full object-cover" />
      ) : (
        <div className='w-full h-full bg-[#5b4a95] flex justify-center items-center'>JOORGE
            
        </div>
      )}
    </div>


  );
};

export default UserPic;