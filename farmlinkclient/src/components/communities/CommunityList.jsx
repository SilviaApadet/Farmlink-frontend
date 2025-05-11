import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CommunityCard from './CommunityCard';

const CommunityList = () => {
  const [communities, setCommunities] = useState([]);
  const API_URL = "https://farmlink-server-bhlp.onrender.com";
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchCommunities()
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await axios.get(`${API_URL}/communities`)
      const data = response.data;
      setCommunities(data)
    } catch (error) {
      toast('Cannot fetch communities')
    }
    finally{
      setLoading(false)
    }
  }

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
