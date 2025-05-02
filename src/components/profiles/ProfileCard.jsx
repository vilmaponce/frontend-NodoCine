import React from 'react';

const ProfileCard = ({ profile, onSelect }) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  
  return (
    <div className="profile-card p-4 bg-gray-800 rounded-lg shadow-md cursor-pointer hover:bg-gray-700" onClick={onSelect}>
      <div className="w-full h-40 overflow-hidden mb-3">
        <img
          src={`${baseUrl}${profile.imageUrl}`}
          alt={`Avatar ${profile.name}`}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `${baseUrl}/images/profiles/default-profile.png`;
          }}
        />
      </div>
      <h3 className="text-white text-xl text-center">{profile.name}</h3>
    </div>
  );
};

export default ProfileCard;
