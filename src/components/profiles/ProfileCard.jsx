// src/components/profiles/ProfileCard.jsx
import React from 'react';

const ProfileCard = ({ profile, onSelect }) => {
  return (
    <div
      className="profile-card p-4 bg-gray-800 text-white rounded-lg shadow-md cursor-pointer hover:bg-gray-700"
      onClick={onSelect}
    >
      <img
        src={profile.imageUrl}
        alt={`Avatar ${profile.name}`}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src = '/images/profiles/default-profile.png'; // Asegúrate de que la imagen por defecto también esté en public/images
        }}
      />


      <h3 className="text-xl text-center">{profile.name}</h3>
    </div>
  );
};

export default ProfileCard;
