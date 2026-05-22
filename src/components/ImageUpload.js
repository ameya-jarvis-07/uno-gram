import { useState } from 'react';
import { uploadToCloudinary, uploadVideoToCloudinary } from '../services/cloudinaryService';
import '../styles/ImageUpload.css';

function ImageUpload({ onUploadSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
          setPreviewType('image');
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
          setPreviewType('video');
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');

    if (!isImage && !isVideo) {
      onError?.('Please select a valid image or video file');
      return;
    }

    // Validate file size (max 10MB for images, 100MB for videos)
    const maxSize = isImage ? 10 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      onError?.(`File size must be less than ${isImage ? '10MB' : '100MB'}`);
      return;
    }

    setLoading(true);
    setProgress(0);

    let result;
    if (isImage) {
      result = await uploadToCloudinary(file);
    } else {
      result = await uploadVideoToCloudinary(file);
    }

    if (result.success) {
      setProgress(100);
      onUploadSuccess?.(result);
      setPreview(null);
      setPreviewType(null);
    } else {
      onError?.(result.error || 'Upload failed');
    }

    setLoading(false);
    setProgress(0);
  };

  return (
    <div className="image-upload-container">
      <div className="upload-info">
        <p className="compression-info">
          📸 Images: Auto-compressed for optimal storage with high viewing quality
        </p>
        <p className="compression-info">
          🎬 Videos: Compressed to 720p with moderate bitrate (2500kbps) for fast streaming
        </p>
      </div>
      <div className="upload-box">
        <label htmlFor="image-input" className="upload-label">
          {preview ? (
            previewType === 'image' ? (
              <img src={preview} alt="Preview" className="preview-image" />
            ) : (
              <video src={preview} className="preview-video" controls />
            )
          ) : (
            <div className="upload-placeholder">
              <span>📸🎬</span>
              <p>Click to select an image or video</p>
            </div>
          )}
        </label>
        <input
          id="image-input"
          type="file"
          accept="image/*,video/*"
          onChange={(e) => {
            handleFileSelect(e);
            handleUpload(e);
          }}
          disabled={loading}
          className="file-input"
        />
      </div>

      {loading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p>Uploading and compressing... {progress}%</p>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
