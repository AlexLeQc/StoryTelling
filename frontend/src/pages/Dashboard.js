import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStories, deleteStory, duplicateStory } from '../services/stories';
import { logout, getUser } from '../services/auth';
import Modal from '../components/Modal';
import './Dashboard.css';

function Dashboard() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDeleteModal, setConfirmDeleteModal] = useState({ isOpen: false, storyId: null });
  const [shareSuccessModal, setShareSuccessModal] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const data = await getStories();
      setStories(data.stories || []);
    } catch (err) {
      setError('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/editor');
  };

  const handleEdit = (id) => {
    navigate(`/editor/${id}`);
  };

  const handleView = (shareId) => {
    navigate(`/story/${shareId}`);
  };

  const handleDelete = (id) => {
    setConfirmDeleteModal({ isOpen: true, storyId: id });
  };

  const confirmDelete = async () => {
    try {
      await deleteStory(confirmDeleteModal.storyId);
      fetchStories();
    } catch (err) {
      setError('Failed to delete story');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateStory(id);
      fetchStories();
    } catch (err) {
      setError('Failed to duplicate story');
    }
  };

  const handleShare = async (shareId) => {
    const shareUrl = `${window.location.origin}/story/${shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareSuccessModal(true);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShareSuccessModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleTitleClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 onClick={handleTitleClick} style={{ cursor: 'pointer' }}>My Stories</h1>
        <div className="dashboard-header-actions">
          <span className="dashboard-username">Welcome, {user?.username || 'User'}</span>
          <button onClick={handleCreateNew} className="btn-primary">
            New Story
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="dashboard-error">{error}</div>}

      {stories.length === 0 ? (
        <div className="dashboard-empty">
          <p>You haven't created any stories yet.</p>
          <button onClick={handleCreateNew} className="btn-primary">
            Create Your First Story
          </button>
        </div>
      ) : (
        <div className="dashboard-stories">
          {stories.map((story) => (
            <div
              key={story.shareId}
              className="story-card"
              onClick={() => handleView(story.shareId)}
            >
              <h3>{story.title}</h3>
              <p className="story-description">{story.description || 'No description'}</p>
              <div className="story-meta">
                <span>Created: {new Date(story.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(story.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="story-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(story._id);
                  }}
                  className="btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(story.shareId);
                  }}
                  className="btn-share"
                >
                  Share
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(story._id);
                  }}
                  className="btn-duplicate"
                >
                  Duplicate
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(story._id);
                  }}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={confirmDeleteModal.isOpen}
        onClose={() => setConfirmDeleteModal({ isOpen: false, storyId: null })}
        title="Delete Story"
        message="Are you sure you want to delete this story? This action cannot be undone."
        type="confirm"
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <Modal
        isOpen={shareSuccessModal}
        onClose={() => setShareSuccessModal(false)}
        title="Link Copied"
        message="Share link has been copied to your clipboard!"
        type="info"
        confirmText="OK"
      />
    </div>
  );
}

export default Dashboard;

