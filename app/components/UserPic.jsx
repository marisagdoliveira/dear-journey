import React, { useEffect, useState } from 'react';
import AddPic from '../../public/assets/AddPic.svg'




const UserPic = ({ user }) => {
  const [userPic, setUserPic] = useState(null);


// Descomentar este useEffect após existir a lógica de file upload: 

   useEffect(() => {
     // Update userPic state when user.img prop changes
     setUserPic(user.img || null);
   }, [user.img]);

 

  return (


    <div className="w-[100%] h-[100%] rounded-full overflow-hidden flex justify-center items-center">
      {userPic ? (
        <img src={`/assets/${userPic}`} alt="User Pic" className="w-[100%] h-[100%] rounded-full object-cover" />
      ) : (
        <div className='picholder w-full h-full bg-[#5c43b0] flex justify-center items-center'><AddPic className=""/>

        </div>
      )}
    </div>


  );
};

export default UserPic;