import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStory, createStory, updateStory } from '../services/stories';
import StoryForm from '../components/StoryForm';
import './StoryEditor.css';

function StoryEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('visual');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [storyData, setStoryData] = useState({});
  const [showJsonImport, setShowJsonImport] = useState(false);
  const [jsonImportText, setJsonImportText] = useState('');
  const [nextPageId, setNextPageId] = useState(1);

  useEffect(() => {
    if (id) {
      fetchStory();
    } else {
      const initialData = {
        1: {
          text: '',
          background: '',
          choices: [{ text: '', next: 1 }],
        },
      };
      setStoryData(initialData);
      setNextPageId(2);
      setLoading(false);
    }
  }, [id]);

  const fetchStory = async () => {
    try {
      const data = await getStory(id);
      setTitle(data.title);
      setDescription(data.description || '');
      setStoryData(data.storyData);
      const maxId = Math.max(...Object.keys(data.storyData).map(Number), 0);
      setNextPageId(maxId + 1);
    } catch (err) {
      setError('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageId, newPageData) => {
    setStoryData({
      ...storyData,
      [pageId]: newPageData,
    });
  };

  const handleAddPage = () => {
    const newPageId = nextPageId;
    setStoryData({
      ...storyData,
      [newPageId]: {
        text: '',
        background: '',
        choices: [{ text: '', next: 1 }],
      },
    });
    setNextPageId(newPageId + 1);
  };

  const handleDeletePage = (pageId) => {
    const newStoryData = { ...storyData };
    delete newStoryData[pageId];
    
    Object.keys(newStoryData).forEach((key) => {
      newStoryData[key].choices = newStoryData[key].choices.map((choice) => {
        if (choice.next === parseInt(pageId)) {
          return { ...choice, next: 1 };
        }
        return choice;
      });
    });
    
    setStoryData(newStoryData);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    const hasValidPages = Object.keys(storyData).some(
      (key) => storyData[key].text && storyData[key].text.trim()
    );

    if (!hasValidPages) {
      setError('At least one page with text is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const storyPayload = {
        title,
        description,
        storyData,
      };

      if (id) {
        await updateStory(id, storyPayload);
      } else {
        const result = await createStory(storyPayload);
        navigate(`/editor/${result.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save story');
    } finally {
      setSaving(false);
    }
  };

  const handleJsonImport = () => {
    try {
      const importedData = JSON.parse(jsonImportText);

      // Validation basique
      if (typeof importedData !== 'object' || importedData === null) {
        setError('Invalid JSON: must be an object');
        return;
      }

      // Vérifier que chaque page a la bonne structure
      for (const [pageId, pageData] of Object.entries(importedData)) {
        if (!pageData.text || typeof pageData.text !== 'string') {
          setError(`Invalid page ${pageId}: missing or invalid text`);
          return;
        }
        if (!Array.isArray(pageData.choices)) {
          setError(`Invalid page ${pageId}: choices must be an array`);
          return;
        }
        for (const choice of pageData.choices) {
          if (!choice.text || typeof choice.next !== 'number') {
            setError(`Invalid choice in page ${pageId}: text required and next must be a number`);
            return;
          }
        }
      }

      setStoryData(importedData);
      setShowJsonImport(false);
      setJsonImportText('');
      setError('');

      // Recalculer nextPageId
      const maxId = Math.max(...Object.keys(importedData).map(Number), 0);
      setNextPageId(maxId + 1);

    } catch (err) {
      setError('Invalid JSON format: ' + err.message);
    }
  };

  const handleJsonChange = (e) => {
    try {
      const newData = JSON.parse(e.target.value);
      setStoryData(newData);
    } catch (err) {
      console.error('Invalid JSON:', err);
    }
  };

  if (loading) {
    return <div className="story-editor-loading">Loading...</div>;
  }

  const pageIds = Object.keys(storyData).map(Number).sort((a, b) => a - b);

  return (
    <div className="story-editor">
      <header className="story-editor-header">
        <button onClick={() => navigate('/dashboard')} className="btn-back">
          ← Back to Dashboard
        </button>
        <h1>{id ? 'Edit Story' : 'Create New Story'}</h1>
        <div className="story-editor-actions">
          <button
            onClick={() => setViewMode(viewMode === 'visual' ? 'json' : 'visual')}
            className="btn-toggle-view"
          >
            {viewMode === 'visual' ? 'JSON View' : 'Visual View'}
          </button>
          <button
            onClick={() => setShowJsonImport(true)}
            className="btn-import-json"
          >
            📄 Import JSON
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-save">
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {error && <div className="story-editor-error">{error}</div>}

      <div className="story-editor-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter story title"
            className="title-input"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter story description (optional)"
            rows={2}
          />
        </div>

        {viewMode === 'visual' ? (
          <div className="story-editor-pages">
            {pageIds.map((pageId) => (
              <StoryForm
                key={pageId}
                pageId={pageId}
                page={storyData[pageId]}
                onChange={(newPage) => handlePageChange(pageId, newPage)}
                onDelete={() => handleDeletePage(pageId)}
              />
            ))}
            <button onClick={handleAddPage} className="btn-add-page">
              + Add New Page
            </button>
          </div>
        ) : (
          <div className="story-editor-json">
            <textarea
              value={JSON.stringify(storyData, null, 2)}
              onChange={handleJsonChange}
              rows={20}
              className="json-textarea"
              placeholder="Edit JSON directly..."
            />
          </div>
        )}

        {showJsonImport && (
          <div className="json-import-modal">
            <div className="json-import-content">
              <h3>📄 Import Story from JSON</h3>
              <p>Paste your story JSON below. Make sure it follows the correct format.</p>
              <textarea
                value={jsonImportText}
                onChange={(e) => setJsonImportText(e.target.value)}
                placeholder={`Paste your story JSON here...

Example:
{
  "1": {
    "text": "You wake up in a dark forest...",
    "background": "",
    "choices": [
      {"text": "Go left", "next": 2},
      {"text": "Go right", "next": 3}
    ]
  }
}`}
                rows={15}
                className="json-import-textarea"
              />
              <div className="json-import-actions">
                <button
                  onClick={() => {
                    setShowJsonImport(false);
                    setJsonImportText('');
                    setError('');
                  }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button onClick={handleJsonImport} className="btn-import">
                  Import Story
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StoryEditor;

