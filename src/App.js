import './App.css';
import { PostProvider } from './context/PostContext';
import Auth from './components/Auth';
import Navigation from './components/Navigation';
import BottomNav from './components/BottomNav';
import CreatePost from './components/CreatePost';
import Feed from './components/Feed';
import Profile from './components/Profile';
import { useContext, useState } from 'react';
import { PostContext } from './context/PostContext';

function AppContent() {
  const { currentUser } = useContext(PostContext);
  const [activeTab, setActiveTab] = useState('feed');

  return (
    <div className="App">
      <Navigation />
      {!currentUser ? (
        <Auth />
      ) : (
        <>
          <div className="app-main">
            {activeTab === 'feed' && <Feed />}
            {activeTab === 'post' && <CreatePost />}
            {activeTab === 'profile' && <Profile />}
          </div>
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      )}
    </div>
  );
}


function App() {
  return (
    <PostProvider>
      <AppContent />
    </PostProvider>
  );
}

export default App;
