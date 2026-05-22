import { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    try {
      const q = query(
        collection(db, 'posts'),
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const postsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsList);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const value = {
    currentUser,
    posts,
    loading,
    fetchPosts,
    setPosts,
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
};
