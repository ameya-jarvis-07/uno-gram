import { useState, useContext } from 'react';
import { db } from '../config/firebaseConfig';
import { PostContext } from '../context/PostContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import ImageUpload from './ImageUpload';
import '../styles/CreatePost.css';

function CreatePost() {
  const { currentUser, fetchPosts } = useContext(PostContext);
  const [caption, setCaption] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [posting, setPosting] = useState(false);
  const [message, setMessage] = useState('');

  const mediaType = uploadedImage?.mediaType || 'image';

  const handleImageUploadSuccess = (result) => {
    setUploadedImage(result);
    setMessage(`${result.mediaType === 'video' ? 'Video' : 'Image'} uploaded successfully!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImageUploadError = (error) => {
    setMessage(`Upload error: ${error}`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setMessage('Please log in to create a post');
      return;
    }

    if (!uploadedImage) {
      setMessage('Please upload a media file');
      return;
    }

    if (!caption.trim()) {
      setMessage('Please add a caption');
      return;
    }

    setPosting(true);

    try {
      // Create post in Firestore
      await addDoc(collection(db, 'posts'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        caption: caption,
        imageUrl: uploadedImage.url,
        imagePublicId: uploadedImage.publicId,
        mediaType: uploadedImage.mediaType || 'image',
        likes: [],
        comments: [],
        timestamp: serverTimestamp(),
      });

      // Reset form
      setCaption('');
      setUploadedImage(null);
      setMessage('Post created successfully!');
      setTimeout(() => setMessage(''), 3000);

      // Refresh posts
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      setMessage('Error creating post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="create-post-container">
        <p className="login-message">Please log in to create a post</p>
      </div>
    );
  }

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h2>Create a New Post</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Media</label>
            <ImageUpload
              onUploadSuccess={handleImageUploadSuccess}
              onError={handleImageUploadError}
            />
          </div>

          {uploadedImage && (
            <div className="image-preview-section">
              {mediaType === 'video' ? (
                <video src={uploadedImage.url} className="post-preview" controls />
              ) : (
                <img src={uploadedImage.url} alt="Post preview" className="post-preview" />
              )}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              rows="4"
              disabled={posting}
            />
          </div>

          {message && <div className="message">{message}</div>}

          <button
            type="submit"
            disabled={posting}
            className="submit-button"
          >
            {posting ? 'Posting...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
