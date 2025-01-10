
# Watchlist Duo

Watchlist Duo is a web application designed to help manage and share a personalized list of movies and TV shows. This app is currently tailored for private use by myself and my wife, but it could be adapted for broader use in the future.

## Features

- **Unified List**: Maintain a single, streamlined list for both movies and TV shows, making it easy to organize and track all your watchlist items in one place.
- **Duo Sharing**: Connect with a "Duo Partner" to view their list and discover shared interests through a common "Our List" of items that appear on both lists.
- **User-Friendly Interface**: A clean and responsive UI for easy navigation and interaction.

## Technology Stack

- **Frontend**: React with TypeScript
- **Backend**: Firebase
- **Styling**: Tailwind CSS
- **Deployment**: GitHub Pages

## Installation

To use the application, you will need to obtain an API key from TMDB for fetching movie and TV show data. Additionally, you will need a Firebase project with a configured Firestore database to store user and list data.

1. Clone the repository:
   ```bash
   git clone https://github.com/MattMiss/watchlist-duo.git
   cd watchlist-duo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration as well as your TMDB API key:
   ```env
    VITE_FIREBASE_API_KEY=your_firebase_auth_domain
    VITE_FIREBASE_AUTH_DOMAIN=watchlist-duo.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_firebase_app_id
    VITE_TMDB_API_KEY=your_tmdb_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open the app in your browser at [http://localhost:5173](http://localhost:5173).

## Usage

This app is currently intended for personal use between myself and my wife. While the repository is public, the app is not designed for general use at this time. If you’re interested in forking or adapting this project, feel free to do so!

## Future Plans

- Allow more users to be able to use this app
- Improve sharing functionality for family and friends.
- Enhance accessibility and mobile responsiveness.

## Contributing

Since this project is for personal use, contributions are not being accepted at this time. If you have suggestions or ideas, feel free to open an issue.

