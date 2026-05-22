import { motion } from 'framer-motion';
import '../styles/BottomNav.css';

function BottomNav({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: '📰', ariaLabel: 'View Feed' },
    { id: 'post', label: 'Post', icon: '➕', ariaLabel: 'Create Post' },
    { id: 'profile', label: 'Profile', icon: '👤', ariaLabel: 'View Profile' },
  ];

  return (
    <motion.nav
      className="bottom-nav"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="nav-items">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={item.ariaLabel}
            aria-current={activeTab === item.id ? 'page' : undefined}
          >
            <motion.span
              className="nav-icon"
              animate={activeTab === item.id ? { scale: [1, 1.2, 1] } : {}}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {item.icon}
            </motion.span>
            <span className="nav-label">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
}

export default BottomNav;
