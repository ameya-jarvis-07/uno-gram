# Uno-Gram

Uno-Gram is a small social image-sharing React app (Create React App) featuring user authentication, image uploads, and a simple feed. It's built with React, Firebase (auth + optional data), and Cloudinary for image hosting.

## Features

- User authentication (Firebase)
- Create posts with image uploads (Cloudinary)
- Feed with posts and profiles
- Responsive UI components and skeleton loader

## Tech Stack

- React (Create React App)
- Firebase (Authentication, optional Firestore)
- Cloudinary (image uploads)
- CSS modules / plain CSS in `src/styles`

## Prerequisites

- Node.js 16+ and npm
- A Firebase project (for Authentication)
- A Cloudinary account (for image hosting)

## Quickstart

1. Install dependencies:

```bash
npm install
```

2. Configure Firebase: open [src/config/firebaseConfig.js](src/config/firebaseConfig.js) and provide your project's config values (apiKey, authDomain, projectId, etc.).

3. Configure Cloudinary: open [src/services/cloudinaryService.js](src/services/cloudinaryService.js) and set your `cloudName` and `uploadPreset` (or update the service to read from environment variables).

4. Run the app in development:

```bash
npm start
```

The app runs at `http://localhost:3000` by default.

## Available Scripts

- `npm start` — Runs the app in development mode.
- `npm test` — Runs the test runner.
- `npm run build` — Builds the app for production into the `build/` folder.

## Project Structure (key files)

- [src/index.js](src/index.js) — App entry
- [src/App.js](src/App.js) — Root component and routes
- [src/components](src/components) — React components (Auth, Feed, Profile, PostCard, ImageUpload, etc.)
- [src/config/firebaseConfig.js](src/config/firebaseConfig.js) — Firebase configuration
- [src/services/cloudinaryService.js](src/services/cloudinaryService.js) — Cloudinary upload helper
- [src/context/PostContext.js](src/context/PostContext.js) — Global post state
- [src/styles](src/styles) — Component CSS files

## Environment & Secrets

This repo stores configuration in `src/config/firebaseConfig.js` and `src/services/cloudinaryService.js` by default. For production, prefer environment variables and a build-time solution. Example env vars you might use:

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_CLOUDINARY_CLOUD_NAME`
- `REACT_APP_CLOUDINARY_UPLOAD_PRESET`

Create a `.env.local` with those variables and update the config files to read from `process.env`.

## Deployment

Build the optimized production bundle:

```bash
npm run build
```

Then deploy the contents of the `build/` folder to your static host (Netlify, Vercel, Surge, Firebase Hosting, etc.).

## Contributing

Feel free to open issues or pull requests. Suggested first steps:

- Improve form validation and error handling
- Add pagination or infinite scroll to the feed
- Add server-side APIs if you want to protect Cloudinary credentials

## Notes

- See `CLOUDINARY_SETUP.md` and `COMPRESSION_STRATEGY.md` in the repo for related docs.

## License

MIT — see `package.json` for project metadata.

---

If you'd like, I can also:

- Add environment variable support to the config files,
- Generate a minimal `.env.example`, or
- Create a short developer checklist for local testing.

