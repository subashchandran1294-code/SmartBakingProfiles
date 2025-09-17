import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProfile } from '../services/api';
import PostGrid from '../components/PostGrid';

const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getPublicProfile(username);
        setProfile(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center">
            {profile.user.profilePicture && (
              <img 
                src={profile.user.profilePicture} 
                alt={profile.user.bakeryName} 
                className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
              />
            )}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{profile.user.bakeryName}</h1>
              <p className="text-gray-600">@{profile.user.username}</p>
              {profile.user.location && (
                <p className="text-gray-600">{profile.user.location}</p>
              )}
              {profile.user.bio && (
                <p className="mt-2 text-gray-700">{profile.user.bio}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Categories</h2>
      
      {profile.categories.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">This baker hasn't created any categories yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {profile.categories.map(category => (
            <Link 
              key={category._id} 
              to={`/${username}/${category.slug}`}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicProfile;