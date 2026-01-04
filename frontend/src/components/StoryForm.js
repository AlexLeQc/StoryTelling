import { useState } from 'react';
import ImageUpload from './ImageUpload';
import './StoryForm.css';

function StoryForm({ page, pageId, onChange, onDelete, onAddChoice }) {
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleTextChange = (e) => {
    onChange({
      ...page,
      text: e.target.value,
    });
  };

  const handleBackgroundChange = (imageUrl) => {
    onChange({
      ...page,
      background: imageUrl,
    });
    setShowImageUpload(false);
  };

  const handleChoiceChange = (index, field, value) => {
    const newChoices = [...page.choices];
    if (field === 'next') {
      newChoices[index] = { ...newChoices[index], [field]: parseInt(value) || 1 };
    } else {
      newChoices[index] = { ...newChoices[index], [field]: value };
    }
    onChange({
      ...page,
      choices: newChoices,
    });
  };

  const handleChoiceTextChange = (index, text) => {
    handleChoiceChange(index, 'text', text);
  };

  const handleChoiceNextChange = (index, nextPage) => {
    handleChoiceChange(index, 'next', nextPage);
  };

  const handleAddChoice = () => {
    const newChoices = [...page.choices, { text: '', next: 1 }];
    onChange({
      ...page,
      choices: newChoices,
    });
  };

  const handleDeleteChoice = (index) => {
    const newChoices = page.choices.filter((_, i) => i !== index);
    onChange({
      ...page,
      choices: newChoices,
    });
  };

  const handleRemoveBackground = () => {
    onChange({
      ...page,
      background: '',
    });
  };

  return (
    <div className="story-form">
      <div className="story-form-header">
        <h3>Page {pageId}</h3>
        <button type="button" onClick={onDelete} className="btn-delete-page">
          Delete Page
        </button>
      </div>

      <div className="form-group">
        <label>Text</label>
        <textarea
          value={page.text}
          onChange={handleTextChange}
          rows={4}
          placeholder="Enter the story text for this page..."
        />
      </div>

      <div className="form-group">
        <label>Background Image</label>
        {page.background ? (
          <div className="background-preview">
            <img src={page.background} alt="Background preview" />
            <div className="background-actions">
              <button type="button" onClick={() => setShowImageUpload(true)}>
                Change
              </button>
              <button type="button" onClick={handleRemoveBackground}>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setShowImageUpload(true)} className="btn-add-background">
            Add Background Image
          </button>
        )}
        {showImageUpload && (
          <ImageUpload
            onUpload={handleBackgroundChange}
            onCancel={() => setShowImageUpload(false)}
          />
        )}
      </div>

      <div className="form-group">
        <label>Choices</label>
        {page.choices.length === 0 ? (
          <p className="no-choices">No choices yet. Add some to make your story interactive!</p>
        ) : (
          page.choices.map((choice, index) => (
            <div key={index} className="choice-item">
              <div className="choice-input-group">
                <label className="choice-label">Choice {index + 1}:</label>
                <input
                  type="text"
                  value={choice.text}
                  onChange={(e) => handleChoiceTextChange(index, e.target.value)}
                  placeholder={`What happens if the reader chooses this?`}
                  className="choice-text"
                />
              </div>
              <div className="choice-input-group">
                <label className="choice-label">Goes to page:</label>
                <select
                  value={choice.next}
                  onChange={(e) => handleChoiceNextChange(index, parseInt(e.target.value))}
                  className="choice-next"
                >
                  <option value={1}>Page 1</option>
                  {/* Add more page options dynamically based on existing pages */}
                  {Array.from({length: 20}, (_, i) => i + 2).map(num => (
                    <option key={num} value={num}>Page {num}</option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteChoice(index)}
                className="btn-delete-choice"
                title="Remove this choice"
              >
                🗑️
              </button>
            </div>
          ))
        )}
        <div className="choice-actions">
          <button type="button" onClick={handleAddChoice} className="btn-add-choice">
            ➕ Add Choice
          </button>
          {page.choices.length > 0 && (
            <small className="choice-help">
              💡 Tip: Choices make your story interactive! Readers can choose different paths.
            </small>
          )}
        </div>
      </div>
    </div>
  );
}

export default StoryForm;

