import React from 'react';

const PostGrid = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {posts.map((post) => (
        <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            src={`http://localhost:5000${post.imageUrl}`} 
            alt={post.caption} 
            className="w-full h-48 object-cover"
          />
          <div className="p-3">
            <p className="text-gray-700">{post.caption}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostGrid;