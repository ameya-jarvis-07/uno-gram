import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { db } from '../config/firebaseConfig';
import { PostContext } from '../context/PostContext';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import '../styles/PostCard.css';

function PostCard({ post }) {
  const { currentUser, fetchPosts } = useContext(PostContext);
  const [liked, setLiked] = useState(post.likes?.includes(currentUser?.uid));
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [likeAnimationKey, setLikeAnimationKey] = useState(0);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const imageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const handleLike = async () => {
    try {
      const postRef = doc(db, 'posts', post.id);
      if (liked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid),
        });
        setLiked(false);
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid),
        });
        setLiked(true);
        setLikeAnimationKey(prev => prev + 1);
      }
      fetchPosts();
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmittingComment(true);
    try {
      const postRef = doc(db, 'posts', post.id);
      const newComment = {
        id: Date.now(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        text: comment,
        timestamp: new Date().toISOString(),
      };

      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });

      setComment('');
      fetchPosts();
    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      className="post-card"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <motion.div
        className="post-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="post-user-info">
          <span className="post-user-email">{post.userEmail}</span>
          <span className="post-date">{formatDate(post.timestamp)}</span>
        </div>
      </motion.div>

      <motion.div
        className="post-image-container"
        variants={imageVariants}
        initial="initial"
        animate="animate"
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <img src={post.imageUrl} alt="Post" className="post-image" />
        {likeAnimationKey > 0 && liked && (
          <motion.div
            key={likeAnimationKey}
            className="like-heart"
            initial={{ opacity: 1, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: -100 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            ❤️
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="post-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.button
          className={`action-button like-button ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={liked ? { scale: [1, 1.2, 1] } : {}}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {liked ? '❤️' : '🤍'} {post.likes?.length || 0}
        </motion.button>
        <motion.button
          className="action-button"
          onClick={() => setShowComments(!showComments)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          💬 {post.comments?.length || 0}
        </motion.button>
      </motion.div>

      <motion.div
        className="post-caption"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <p>
          <strong>{post.userEmail}</strong> {post.caption}
        </p>
      </motion.div>

      <motion.div
        className="post-comments"
        initial={false}
        animate={{ height: showComments ? 'auto' : 0, opacity: showComments ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        {post.comments && post.comments.length > 0 && (
          <motion.div
            className="comments-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {post.comments.slice(-5).map((cmt, idx) => (
              <motion.div
                key={cmt.id}
                className="comment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <strong>{cmt.userEmail}</strong>
                <span> {cmt.text}</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      <motion.form
        onSubmit={handleAddComment}
        className="comment-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <motion.input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="comment-input"
          disabled={submittingComment}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <motion.button
          type="submit"
          disabled={!comment.trim() || submittingComment}
          className="comment-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {submittingComment ? '...' : 'Post'}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}

export default PostCard;
