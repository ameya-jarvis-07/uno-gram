import { useContext, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PostContext } from '../context/PostContext';
import PostCard from './PostCard';
import SkeletonLoader from './SkeletonLoader';
import '../styles/Feed.css';

function Feed() {
  const { posts, currentUser, fetchPosts, loading } = useContext(PostContext);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startYRef = useRef(0);

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
      setIsLoading(false);
    }
  }, [currentUser, fetchPosts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (window.scrollY === 0 && startYRef.current) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startYRef.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance, 100));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 50) {
      setRefreshing(true);
      await fetchPosts();
      setRefreshing(false);
    }
    setPullDistance(0);
    startYRef.current = 0;
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div
      className="feed-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      <motion.div
        className="pull-to-refresh"
        style={{ height: pullDistance }}
        initial={{ opacity: 0 }}
        animate={{ opacity: pullDistance > 0 ? 1 : 0 }}
      >
        <motion.div
          animate={{ rotate: refreshing ? 360 : pullDistance * 3.6 }}
          transition={{ duration: 0.3 }}
        >
          ↻
        </motion.div>
      </motion.div>

      <motion.div
        className="feed-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Your Feed</h2>
      </motion.div>

      {isLoading ? (
        <motion.div
          className="posts-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[1, 2, 3].map((i) => (
            <motion.div key={i} variants={itemVariants}>
              <SkeletonLoader />
            </motion.div>
          ))}
        </motion.div>
      ) : posts.length === 0 ? (
        <motion.div
          className="no-posts"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            No posts yet. Be the first to create one! 📸
          </motion.p>
        </motion.div>
      ) : (
        <motion.div
          className="posts-list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <PostCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {refreshing && (
        <motion.div
          className="refreshing-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⟳
          </motion.span>
        </motion.div>
      )}
    </div>
  );
}

export default Feed;
