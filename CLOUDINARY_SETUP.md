# Cloudinary + Firebase Integration Setup

## Files Created

This integration includes the following files for your Instagram clone:

### Configuration Files
- `.env` - Environment variables for Cloudinary and Firebase (TEMPLATE)

### Config
- `src/config/firebaseConfig.js` - Firebase initialization and exports

### Services
- `src/services/cloudinaryService.js` - Cloudinary upload utilities

### Components
- `src/components/ImageUpload.js` - Image upload component
- `src/components/CreatePost.js` - Create post component with image upload

### Context
- `src/context/PostContext.js` - Global state management for posts and auth

### Styles
- `src/styles/ImageUpload.css` - Styling for image upload
- `src/styles/CreatePost.css` - Styling for create post form

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install firebase cloudinary
```

### 2. Set Up Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. Get your **Cloud Name** from the Dashboard
3. Create an **Upload Preset** (Settings → Upload):
   - Name: `uno_gram_photos`
   - Signing Mode: Unsigned
   - Folder: `uno-gram/posts`

### 3. Set Up Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
4. Get your config credentials from Project Settings

### 4. Update `.env` File

Replace the placeholder values in `.env`:

```env
REACT_APP_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
REACT_APP_CLOUDINARY_UPLOAD_PRESET=uno_gram_photos

REACT_APP_FIREBASE_API_KEY=your_actual_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_actual_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
REACT_APP_FIREBASE_APP_ID=your_actual_app_id
```

### 5. Update `App.js`

Wrap your app with the `PostProvider`:

```jsx
import { PostProvider } from './context/PostContext';
import CreatePost from './components/CreatePost';

function App() {
  return (
    <PostProvider>
      <div className="App">
        <CreatePost />
        {/* Add other components here */}
      </div>
    </PostProvider>
  );
}

export default App;
```

### 6. Firestore Database Structure

Create these collections in Firestore:

```
posts/
  {postId}/
    - userId (string)
    - userEmail (string)
    - caption (string)
    - imageUrl (string) [Cloudinary URL]
    - imagePublicId (string) [for future deletion]
    - likes (array)
    - comments (array)
    - timestamp (timestamp)

users/
  {userId}/
    - email (string)
    - displayName (string)
    - profileImage (string)
    - bio (string)
    - createdAt (timestamp)
```

---

## Usage

### ImageUpload Component

```jsx
import ImageUpload from './components/ImageUpload';

<ImageUpload
  onUploadSuccess={(result) => console.log(result.url)}
  onError={(error) => console.log(error)}
/>
```

### Cloudinary Service

```jsx
import { uploadToCloudinary } from './services/cloudinaryService';

const result = await uploadToCloudinary(file);
if (result.success) {
  console.log(result.url); // Cloudinary image URL
}
```

### Access Current User

```jsx
import { useContext } from 'react';
import { PostContext } from './context/PostContext';

function MyComponent() {
  const { currentUser } = useContext(PostContext);
  // Use currentUser
}
```

---

## Features Included

✅ Image upload to Cloudinary  
✅ Firebase Authentication integration  
✅ Post creation with Firestore  
✅ Global state management  
✅ Progress bar for uploads  
✅ Image preview before upload  
✅ Error handling  
✅ Loading states  

---

## Next Steps

1. **Authentication Components**: Create Login/Signup pages
2. **Feed Component**: Display posts from Firestore
3. **Like/Comment**: Add interaction features
4. **User Profiles**: Create user profile pages
5. **Event Accounts**: Set up multi-account system for different events

---

## Troubleshooting

### "REACT_APP_CLOUDINARY_CLOUD_NAME is undefined"
- Check `.env` file exists in project root
- Restart development server: `npm start`

### "Firebase config is invalid"
- Verify all Firebase credentials in `.env`
- Check Firebase project is properly initialized

### "Upload fails"
- Ensure Cloudinary upload preset is set to "Unsigned"
- Check CORS settings if errors persist
- Verify file is an image file

---

## Security Notes

🔒 Never commit `.env` file to git  
🔒 Keep `REACT_APP_FIREBASE_API_KEY` confidential  
🔒 Use Cloudinary unsigned uploads (safe for frontend)  
🔒 Set up Firestore security rules appropriately  
