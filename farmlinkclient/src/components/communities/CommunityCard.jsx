import React from 'react';
import { useNavigate } from 'react-router-dom';
import FollowButton from '../common/FollowButton';

const CommunityCard = ({ community, loggedInUserId }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/communities/${community.id}`);
  };

  return (
    <div 
      className="flex items-center p-4 bg-white rounded-lg shadow-sm mb-4 cursor-pointer hover:shadow-md transition-shadow duration-300"
      onClick={handleNavigate}
    >
      <div className="flex">
      <div className="w-64 h-32 rounded-lg overflow-hidden mr-4 border border-gray-200 shadow-sm">
          <img 
            src={community.image} 
            alt={community.name} 
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 uppercase">{community.name}</h3>
          <p className="text-xs text-gray-600">{community.description}</p>
        </div>
      </div>

      <div className="basis-1/4" onClick={(e) => e.stopPropagation()}>
        <FollowButton 
          currentUserId={loggedInUserId} 
          recipientId={community.admin_id} 
        />
      </div>
    </div>
  );
};

export default CommunityCard;
