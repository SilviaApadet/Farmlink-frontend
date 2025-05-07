import React from 'react';
import FollowButton from '../common/FollowButton';

const ExpertCard = ({ expert, loggedInUserId }) => {
  return (
    <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-md p-4 mb-4">
      <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
        <img 
          src={expert.image} 
          alt={expert.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold uppercase">{expert.name}</h3>
        <p className="text-sm text-gray-600">{expert.tagline}</p>
        <p className="text-xs text-gray-500 mt-1">
          <span className="mr-3">{expert.specialty}</span>
          <span className="mr-3">{expert.followers} Followers</span>
          <span>{expert.posts} Posts</span>
        </p>
      </div>
      <FollowButton 
        currentUserId={loggedInUserId} 
        recipientId={expert.id} 
      />
    </div>
  );
};

export default ExpertCard;
