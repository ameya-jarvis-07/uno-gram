import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { PostContext } from '../context/PostContext';
import '../styles/Navigation.css';

function Navigation() {
  const { currentUser } = useContext(PostContext);
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navVariants = {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: { duration: 0.15 },
    },
  };

  return (
    <motion.nav
      className="navbar"
      variants={navVariants}
      initial="initial"
      animate="animate"
    >
      <div className="nav-container">
        <motion.div
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <h1>Uno-Gram</h1>
        </motion.div>

        {currentUser && (
          <div className="nav-menu">
            <div className="nav-user">
              <motion.span
                className="user-email"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {currentUser.email}
              </motion.span>
              <motion.div
                className="menu-toggle"
                onClick={() => setShowMenu(!showMenu)}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                ⋮
              </motion.div>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    className="dropdown-menu"
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.button
                      onClick={handleLogout}
                      className="logout-button"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      Logout
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  );
}

export default Navigation;
