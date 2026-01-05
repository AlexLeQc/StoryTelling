import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadImage, getImageUrl } from '../services/images';
import './ImageUpload.css';

function ImageUpload({ onUpload, onCancel }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setUploading(true);
    setError('');

    try {
      const result = await uploadImage(file);
      onUpload(result.imageId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div className="image-upload-container">
      <div
        {...getRootProps()}
        className={`image-upload-dropzone ${isDragActive ? 'active' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p>Uploading...</p>
        ) : (
          <div>
            <p>Drag & drop an image here, or click to select</p>
            <p className="image-upload-hint">Max size: 5MB</p>
          </div>
        )}
      </div>
      {error && <div className="image-upload-error">{error}</div>}
      {onCancel && (
        <button type="button" onClick={onCancel} className="image-upload-cancel">
          Cancel
        </button>
      )}
    </div>
  );
}

export default ImageUpload;

