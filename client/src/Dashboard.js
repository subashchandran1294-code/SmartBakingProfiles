import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createCategory, getUserCategories, createPost, getUserPosts } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '' });
  const [postForm, setPostForm] = useState({ caption: '', categoryId: '', image: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesResponse, postsResponse] = await Promise.all([
        getUserCategories(),
        getUserPosts()
      ]);
      setCategories(categoriesResponse.data);
      setPosts(postsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createCategory(categoryForm);
      setCategoryForm({ name: '', description: '' });
      setShowCategoryForm(false);
      setMessage('Category created successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating category');
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('caption', postForm.caption);
      formData.append('categoryId', postForm.categoryId);
      formData.append('image', postForm.image);
      
      await createPost(formData);
      setPostForm({ caption: '', categoryId: '', image: null });
      setShowPostForm(false);
      setMessage('Post created successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {message && (
        <div className={`mb-4 p-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Categories</h2>
            <button 
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              {showCategoryForm ? 'Cancel' : 'Add Category'}
            </button>
          </div>
          
          {showCategoryForm && (
            <form onSubmit={handleCategorySubmit} className="mb-6">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows="3"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          )}
          
          {categories.length === 0 ? (
            <p className="text-gray-500">No categories yet. Create your first one!</p>
          ) : (
            <div className="space-y-4">
              {categories.map(category => (
                <div key={category._id} className="border-b pb-4">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-gray-600">{category.description}</p>
                  <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Posts Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Posts</h2>
            <button 
              onClick={() => setShowPostForm(!showPostForm)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              {showPostForm ? 'Cancel' : 'Add Post'}
            </button>
          </div>
          
          {showPostForm && (
            <form onSubmit={handlePostSubmit} className="mb-6">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Caption</label>
                <input
                  type="text"
                  value={postForm.caption}
                  onChange={(e) => setPostForm({...postForm, caption: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Category</label>
                <select
                  value={postForm.categoryId}
                  onChange={(e) => setPostForm({...postForm, categoryId: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  onChange={(e) => setPostForm({...postForm, image: e.target.files[0]})}
                  className="w-full p-2 border border-gray-300 rounded"
                  accept="image/*"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </form>
          )}
          
          {posts.length === 0 ? (
            <p className="text-gray-500">No posts yet. Create your first one!</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {posts.map(post => (
                <div key={post._id} className="border rounded overflow-hidden">
                  <img 
                    src={`http://localhost:5000${post.imageUrl}`} 
                    alt={post.caption} 
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <p className="text-sm truncate">{post.caption}</p>
                    <p className="text-xs text-gray-500">{post.category.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Public Profile Link */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Your Public Profile</h2>
        <p className="mb-2">Share your baking profile with others:</p>
        <a 
          href={`http://localhost:3000/${user.username}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-yellow-600 hover:text-yellow-700 underline"
        >
          http://localhost:3000/{user.username}
        </a>
      </div>
    </div>
  );
};

export default Dashboard;