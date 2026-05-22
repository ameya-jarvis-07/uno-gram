import { motion } from 'framer-motion';
import '../styles/Skeleton.css';

function SkeletonLoader() {
  return (
    <motion.div
      className="skeleton-card"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className="skeleton-header">
        <div className="skeleton-user-info">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-text-small"></div>
        </div>
      </div>
      <div className="skeleton-image"></div>
      <div className="skeleton-actions">
        <div className="skeleton-button"></div>
        <div className="skeleton-button"></div>
      </div>
      <div className="skeleton-caption">
        <div className="skeleton-text"></div>
        <div className="skeleton-text"></div>
      </div>
    </motion.div>
  );
}

export default SkeletonLoader;
