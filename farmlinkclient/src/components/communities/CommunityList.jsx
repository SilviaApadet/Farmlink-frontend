import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommunityCard from './CommunityCard';

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const API_URL = "https://farmlink-server-bhlp.onrender.com";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On fetching communities from backend
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(`${API_URL}/communities`);  // Using the API_URL constant
        console.log('Fetched communities:', response.data);

        // On ensuring response.data is an array before setting it
        if (Array.isArray(response.data)) {
          setCommunities(response.data);
        } else {
          throw new Error('Fetched data is not an array');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Failed to load communities.');
        setLoading(false);
        // Removed reference to undefined communityData
      }
    };

    fetchCommunities(); // Call the function
  }, []); // Empty dependency array to run once on mount

  if (loading) {
    return <p>Loading communities...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Communities</h2>
      {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      {communities.length === 0 ? (
        <p className="text-gray-500">No communities available.</p>
      ) : (
        communities.map((community) => (
          <CommunityCard key={community.community_id} community={community} />
        ))
      )}
    </div>
  );
};

export default CommunityList;