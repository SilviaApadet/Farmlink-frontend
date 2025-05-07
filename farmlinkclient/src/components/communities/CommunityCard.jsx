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
      <div className="flex basis-3/4">
        <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
          <img 
            src={community.image} 
            alt={community.name} 
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 uppercase">{community.name}</h3>
          <p className="text-xs text-gray-600">WELCOME TO THE COMMUNITY</p>
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
