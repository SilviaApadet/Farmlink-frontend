import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommunityCard from './CommunityCard';

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const API_URL = "https://farmlink-server-bhlp.onrender.com";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(`${API_URL}/communities`);
        console.log('Fetched communities:', response.data);

        if (Array.isArray(response.data)) {
          setCommunities(response.data);
        } else {
          throw new Error('Fetched data is not an array');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Failed to load communities, displaying default data.');
        setCommunities([]); // Optional: fallback data
        setLoading(false);
      }
    };

    fetchCommunities(); // ✅ Important!
  }, []);

  if (loading) {
    return <p>Loading communities...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Communities</h2>
      {error && <p className="text-red-500">{error}</p>}
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
