import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicCategory } from '../services/api';
import PostGrid from '../components/PostGrid';

const PublicCategory = () => {
  const { username, categorySlug } = useParams();
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getPublicCategory(username, categorySlug);
        setCategoryData(response.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Category not found');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [username, categorySlug]);

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
      <nav className="mb-6">
        <Link 
          to={`/${username}`} 
          className="text-yellow-600 hover:text-yellow-700"
        >
          &larr; Back to {categoryData.user.bakeryName}'s profile
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{categoryData.category.name}</h1>
          {categoryData.category.description && (
            <p className="text-gray-700">{categoryData.category.description}</p>
          )}
          <p className="text-gray-500 mt-2">
            By {categoryData.user.bakeryName} (@{categoryData.user.username})
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Posts</h2>
      
      {categoryData.posts.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No posts in this category yet.</p>
        </div>
      ) : (
        <PostGrid posts={categoryData.posts} />
      )}
    </div>
  );
};

export default PublicCategory;