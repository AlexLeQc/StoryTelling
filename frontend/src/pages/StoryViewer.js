import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicStory } from '../services/stories';
import './StoryViewer.css';

function StoryViewer() {
  const { shareId } = useParams();
  const [story, setStory] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const data = await getPublicStory(shareId);
        setStory(data);
        const firstStep = Object.keys(data.storyData)[0];
        if (firstStep) {
          setCurrentStep(parseInt(firstStep));
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Story not found');
      } finally {
        setLoading(false);
      }
    };

    if (shareId) {
      fetchStory();
    }
  }, [shareId]);

  useEffect(() => {
    const scene = story?.storyData[currentStep];
    if (scene?.background) {
      setImageLoading(true);
    } else {
      setImageLoading(false);
    }
  }, [currentStep, story]);

  if (loading) {
    return <div className="story-viewer-loading">Loading story...</div>;
  }

  if (error || !story) {
    return <div className="story-viewer-error">{error || 'Story not found'}</div>;
  }

  const scene = story.storyData[currentStep];
  if (!scene) {
    return <div className="story-viewer-error">Invalid story step</div>;
  }

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  return (
    <div className="story-viewer">
      <div className="story-viewer-header">
        <h1 className="story-viewer-title">{story.title}</h1>
      </div>
      <div className={`story-viewer-main ${scene.background ? 'has-image' : 'no-image'}`}>
        {scene.background && (
          <div className="story-viewer-image-container">
            {imageLoading && <div className="image-loading">Loading image...</div>}
            <img
              src={scene.background.startsWith('http') || scene.background.startsWith('/api/images/')
                ? (scene.background.startsWith('/api/images/')
                  ? `${API_URL}${scene.background}`
                  : scene.background)
                : `${API_URL}/api/images/${scene.background}`}
              alt="Story scene"
              className="story-viewer-image"
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </div>
        )}
        <div className="story-viewer-scrollable-content">
          <div className="story-viewer-content">
            <div className="story-viewer-text">{scene.text}</div>
              <div className="story-viewer-choices">
                {scene.choices.map((choice, index) => (
                  <button
                    key={index}
                    className="story-viewer-choice"
                    onClick={() => {
                      setCurrentStep(choice.next);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {choice.text}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryViewer;

