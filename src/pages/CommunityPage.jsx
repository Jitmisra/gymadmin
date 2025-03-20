import React, { useState, useEffect } from 'react';
import CommunityControls from '../components/Community/CommunityControls';
import './CommunityPage.css';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunityPosts = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await api.get('/community/posts');
        
        // Mock data for demonstration
        const mockPosts = [
          {
            id: 1,
            author: 'Sarah Johnson',
            role: 'Gym Manager',
            gym: 'Fitness Plus',
            title: 'New workout classes starting next week',
            content: 'We are excited to announce new workout classes starting next week including HIIT, Yoga, and Spin. Check the schedule for more details!',
            likes: 24,
            comments: 8,
            date: '2023-07-15'
          },
          {
            id: 2,
            author: 'Mike Wilson',
            role: 'Personal Trainer',
            gym: 'Iron Works',
            title: 'Nutrition tips for better workout results',
            content: 'Want to maximize your workout results? Here are some nutrition tips that can help you achieve your fitness goals faster...',
            likes: 42,
            comments: 15,
            date: '2023-07-10'
          },
          {
            id: 3,
            author: 'Admin',
            role: 'System Administrator',
            gym: 'All Gyms',
            title: 'System maintenance this weekend',
            content: 'We will be performing system maintenance this weekend. The admin panel will be unavailable from Saturday 10 PM to Sunday 2 AM.',
            likes: 5,
            comments: 2,
            date: '2023-07-08'
          }
        ];
        
        setPosts(mockPosts);
      } catch (err) {
        setError('Failed to load community posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityPosts();
  }, []);

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
        <button className="create-post-btn">Create New Post</button>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;