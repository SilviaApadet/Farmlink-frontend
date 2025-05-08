import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpertCard from './ExpertCard';
import expertsData from '../../data/experts.json';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await axios.get(''); // Replace with your API
        console.log('Fetched experts:', response.data);

        if (Array.isArray(response.data)) {
          const onlyExperts = response.data.filter(user => user.is_expert);
          if (onlyExperts.length > 0) {
            setExperts(onlyExperts);
          } else {
            console.warn('No experts returned, falling back to default data');
            setExperts(expertsData.experts);
          }
        } else {
          throw new Error('Fetched data is not an array');
        }
      } catch (err) {
        console.error('Error fetching experts:', err);
        setError('Failed to load experts from server. Showing default data.');
        setExperts(expertsData.experts);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  const filteredExperts = experts.filter((expert) => {
    const name = expert.full_name || expert.username || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expert.expertise || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expert.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">EXPERTS</h1>

      <input
        type="text"
        placeholder="Search by name, field, or location..."
        className="w-full p-2 mb-4 border border-gray-300 rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading experts...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 gap-4">
            {filteredExperts.length > 0 ? (
              filteredExperts.map((expert) => (
                <ExpertCard key={expert.user_id || expert.id} expert={expert} />
              ))
            ) : (
              <p className="text-gray-500">No experts found matching your search.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpertList;
