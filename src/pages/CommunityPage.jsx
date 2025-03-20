import React, { useState, useEffect } from 'react';
import CommunityControls from '../components/Community/CommunityControls';
import { fetchCommunityPosts, deleteCommunityPost } from '../utils/api';
import './CommunityPage.css';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        const postsData = await fetchCommunityPosts();
        setPosts(postsData);
      } catch (err) {
        setError('Failed to load community posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    try {
      await deleteCommunityPost(postId);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
      // Optionally show an error message
    }
  };

  if (loading) {
    return <div className="community-loading">Loading community feed...</div>;
  }

  if (error) {
    return <div className="community-error">{error}</div>;
  }

  return (
    <div className="community-container">
      <div className="community-header">
        <h1>Community Feed</h1>
        {/* Create post button removed */}
      </div>
      
      <CommunityControls />
      
      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-author-info">
                <span className="post-author">{post.author}</span>
                <span className="post-author-role">{post.role}</span>
                <span className="post-gym">{post.gym}</span>
              </div>
              <span className="post-date">{post.date}</span>
            </div>
            
            <h2 className="post-title">{post.title}</h2>
            <p className="post-content">{post.content}</p>
            
            <div className="post-footer">
              <div className="post-stats">
                <span className="post-likes">❤️ {post.likes} likes</span>
                <span className="post-comments">💬 {post.comments} comments</span>
              </div>
              <div className="post-actions">
                <button className="post-action-btn">Like</button>
                <button className="post-action-btn">Comment</button>
                <button className="post-action-btn">Share</button>
                <button 
                  className="post-action-btn delete-btn"
                  onClick={() => handleDeletePost(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;