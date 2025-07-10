# Day, Week, Month Task Scheduler

A modern React task scheduler with Firebase backend and Google authentication. Built with React, Tailwind CSS, and Zustand for state management.

## Features

- 📅 **Multiple Views**: Day, Week, and Month calendar views
- 🔐 **Google Authentication**: Seamless sign-in with Google
- 🎨 **Dark Mode**: Toggle between light and dark themes
- 🔄 **Real-time Updates**: Live event synchronization with Firestore
- 📱 **Responsive Design**: Works on desktop and mobile
- ⚡ **Fast & Lightweight**: Optimized for performance

## Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Backend**: Firebase (Firestore + Authentication)
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd dayweekmonth
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**

   a. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   b. Enable Authentication with Google provider:
      - Go to Authentication → Sign-in method
      - Enable Google provider
   
   c. Create a Firestore database:
      - Go to Firestore Database
      - Create database in test mode (for development)
   
   d. Update `src/config/firebase.js` with your config:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };
   ```

4. **Run the application**
```bash
npm run dev
```

Visit `http://localhost:5173` to see your application.

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth.jsx        # Authentication component
│   └── ErrorNotification.jsx
├── config/             # Firebase configuration
│   └── firebase.js
├── services/           # Firebase services
│   ├── eventService.js # Event CRUD operations
│   └── authService.js  # Authentication operations
├── store/              # State management
│   └── useStore.js
└── App.jsx             # Main application
```

## Data Models

### Event Model
```javascript
{
  id: string,
  userId: string,
  title: string,
  description: string,
  date: string, // YYYY-MM-DD format
  time: string, // HH:MM format
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### User Model
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string
}
```

## Features in Detail

### Authentication
- Google OAuth integration
- Automatic session management
- User profile display
- Secure sign-out

### Event Management
- Create, read, update, delete events
- Real-time synchronization with Firestore
- Date and time selection
- Event descriptions

### Calendar Views
- **Day View**: Detailed daily schedule
- **Week View**: 7-day overview
- **Month View**: Full month calendar
- Navigation between periods

### UI/UX
- Responsive design
- Dark/light mode toggle
- Loading states
- Error handling
- Real-time updates

## Firebase Security Rules

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy dist/ folder
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Environment Variables

Create a `.env` file for sensitive configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

Then update `src/config/firebase.js`:
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Create an issue on GitHub
- Check the [Firebase documentation](https://firebase.google.com/docs)
- Review the configuration examples above

## Roadmap

- [ ] Recurring events
- [ ] Event categories/tags
- [ ] Calendar sharing
- [ ] Mobile app
- [ ] Offline support
- [ ] Advanced filtering
- [ ] Export/import functionality
