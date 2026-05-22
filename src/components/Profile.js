import { useContext } from 'react';
import { motion } from 'framer-motion';
import { PostContext } from '../context/PostContext';
import PostCard from './PostCard';
import '../styles/Profile.css';

function Profile() {
  const { currentUser, posts } = useContext(PostContext);

  if (!currentUser) return null;

  const userPosts = posts.filter((post) => post.userId === currentUser.uid);

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="profile-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="profile-header"
        variants={itemVariants}
        initial="initial"
        animate="animate"
      >
        <div className="profile-avatar">👤</div>
        <div className="profile-info">
          <h2>{currentUser.email.split('@')[0]}</h2>
          <p>{currentUser.email}</p>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{userPosts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="profile-posts"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {userPosts.length === 0 ? (
          <motion.div
            className="no-posts"
            variants={itemVariants}
          >
            <p>No posts yet. Start sharing your memories! 📸</p>
          </motion.div>
        ) : (
          userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </motion.div>
    </motion.div>
  );
}

export default Profile;
