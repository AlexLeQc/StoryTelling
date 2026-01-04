import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getPublicStories } from '../services/stories';
import { isAuthenticated } from '../services/auth';
import './Homepage.css';

function Homepage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPublicStories();
  }, []);

  const fetchPublicStories = async () => {
    try {
      const data = await getPublicStories();
      setStories(data.stories || []);
    } catch (err) {
      setError('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = () => {
    navigate('/editor');
  };

  const handleStoryClick = (shareId) => {
    navigate(`/story/${shareId}`);
  };

  const getFirstImage = (storyData) => {
    if (!storyData) return null;
    const pageIds = Object.keys(storyData).map(Number).sort((a, b) => a - b);
    if (pageIds.length === 0) return null;
    const firstPage = storyData[pageIds[0]];
    return firstPage?.background || null;
  };

  const getImageUrl = (background) => {
    if (!background) return null;
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    if (background.startsWith('http') || background.startsWith('/api/images/')) {
      return background.startsWith('/api/images/') 
        ? `${API_URL}${background}` 
        : background;
    }
    return `${API_URL}/api/images/${background}`;
  };

  if (loading) {
    return (
      <div className="homepage-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>StoryTelling</h1>
        <div className="homepage-header-actions">
          {isAuthenticated() ? (
            <Link to="/dashboard" className="btn-link">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn-link">
              Login
            </Link>
          )}
        </div>
      </header>

      <section className="homepage-intro">
        <h2>Create and share your interactive stories</h2>
        <p>
          StoryTelling is a platform that allows you to create interactive stories with multiple choices, 
          custom background images, and unique paths. Share your creations with the world or keep them private.
        </p>
        <button onClick={handleCreateStory} className="btn-primary">
          Create a Story
        </button>
      </section>

      {error && <div className="homepage-error">{error}</div>}

      <section className="homepage-stories">
        <h2>Public Stories</h2>
        {stories.length === 0 ? (
          <div className="homepage-empty">
            <p>No public stories at the moment.</p>
          </div>
        ) : (
          <div className="stories-grid">
            {stories.map((story) => {
              const firstImage = getFirstImage(story.storyData);
              const imageUrl = getImageUrl(firstImage);
              return (
                <div
                  key={story.shareId}
                  className="story-card"
                  onClick={() => handleStoryClick(story.shareId)}
                >
                  {imageUrl && (
                    <div className="story-card-image-container">
                      <img 
                        src={imageUrl} 
                        alt={story.title}
                        className="story-card-image"
                      />
                    </div>
                  )}
                  <div className="story-card-content">
                    <h3>{story.title}</h3>
                    <p className="story-description">{story.description || 'No description'}</p>
                    <div className="story-meta">
                      <span>Created on {new Date(story.createdAt).toLocaleDateString('en-US')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default Homepage;

