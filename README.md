# 🎵 MP3 Player Application

A full-stack MP3 player application built with React frontend and Node.js backend, featuring a beautiful modern UI and complete music management capabilities.

![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange?style=for-the-badge&logo=mysql)
![Vite](https://img.shields.io/badge/Vite-7.1.2-purple?style=for-the-badge&logo=vite)

## ✨ Features

- **Music Library Management**: Upload, edit, and delete MP3 files with metadata
- **Beautiful Player Interface**: Modern, responsive design with smooth animations
- **Audio Controls**: Play, pause, skip, volume control, and progress bar
- **Cover Art Support**: Upload and display album cover images
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Updates**: Instant synchronization between frontend and backend

## 🏗️ Architecture

- **Frontend**: React 19 + Vite with modern CSS
- **Backend**: Node.js + Express + Sequelize
- **Database**: MySQL with automatic schema management
- **File Storage**: Local file system for MP3s and images
- **API**: RESTful API with CORS support

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- MP3 files to test with

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mp3-player.git
cd mp3-player
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file and configure
cp env.example .env

# Edit .env with your database credentials
# DB_HOST=localhost
# DB_USER=your_username
# DB_PASSWORD=your_password
# DB_NAME=playlistDB

# Start the backend server
npm run dev
```

The backend will be available at `http://localhost:2002`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 4. Database Setup

Create a MySQL database named `playlistDB` and the application will automatically create the required tables on startup.

## 📁 Project Structure

```
MP3Player/
├── backend/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # API controllers
│   ├── model/              # Database models
│   ├── routes/             # API routes
│   ├── uploads/            # File storage
│   │   ├── songs/          # MP3 files
│   │   └── img/            # Cover images
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.jsx         # Main application component
│   │   ├── App.css         # Application styles
│   │   └── main.jsx        # Entry point
│   └── package.json
└── README.md
```

## 🎮 Usage

### Adding Songs

1. Click the "Add Song" button in the header
2. Select an MP3 file (required)
3. Optionally add a cover image
4. Fill in song details (title, artist, album)
5. Click "Upload Song"

### Playing Music

1. Click on any song card to start playing
2. Use the player controls:
   - Play/Pause button
   - Previous/Next track buttons
   - Progress bar for seeking
   - Volume control
3. The currently playing song is highlighted in the library

### Managing Songs

- **Edit**: Click the edit button (pencil icon) on any song card
- **Delete**: Click the delete button (trash icon) on any song card
- **View**: Click anywhere on the song card to play

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=playlistDB
DB_PORT=3306
PORT=2002
```

### Frontend Configuration

The frontend automatically connects to `http://localhost:2002`. If you change the backend port, update the `API_BASE_URL` constant in `src/App.jsx`.

## 🎨 Customization

### Styling

The application uses modern CSS with:
- CSS Grid and Flexbox for layouts
- CSS Custom Properties for theming
- Smooth transitions and animations
- Responsive design breakpoints

### Adding Features

The modular architecture makes it easy to add new features:
- New API endpoints in `backend/routes/`
- New controllers in `backend/controllers/`
- UI components in `frontend/src/`

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**: Check your MySQL connection and `.env` file
2. **Frontend can't connect**: Ensure backend is running on port 2002
3. **File uploads fail**: Check file permissions in the `uploads/` directory
4. **Database errors**: Verify MySQL is running and credentials are correct

### Logs

- Backend logs appear in the terminal where you run `npm run dev`
- Frontend errors appear in the browser console

## 🚀 Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Set up a reverse proxy (nginx/Apache)
4. Configure proper CORS origins

### Frontend Deployment

1. Build the application: `npm run build`
2. Serve the `dist/` folder with a web server
3. Update `API_BASE_URL` to point to your production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with React, Node.js, and Express
- Icons from Lucide React
- Modern CSS techniques and best practices
- Responsive design principles

## 📸 Screenshots

<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/6f828cf4-687b-4f90-8d0a-ab9db8c5de05" />


---

**Happy listening! 🎧**

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/mp3-player&type=Date)](https://star-history.com/#yourusername/mp3-player&Date)
