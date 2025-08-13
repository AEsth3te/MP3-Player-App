import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Upload, 
  Plus,
  Trash2,
  Edit3,
  X
} from 'lucide-react';
import './App.css';

const API_BASE_URL = 'http://localhost:2002/api';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Fetch songs on component mount
  useEffect(() => {
    fetchSongs();
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      playNextSong();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/songs`);
      setSongs(response.data);
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  const playSong = (song) => {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentSong(song);
      setCurrentTime(0);
      setIsPlaying(true);
      // Set audio source and play
      setTimeout(() => {
        audioRef.current.src = `http://localhost:2002/${song.filePath}`;
        audioRef.current.play();
      }, 100);
    }
  };

  const playNextSong = () => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    playSong(songs[nextIndex]);
  };

  const playPreviousSong = () => {
    if (songs.length === 0) return;
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    playSong(songs[prevIndex]);
  };

  const handleTimeChange = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    audioRef.current.currentTime = time;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    const songFile = fileInputRef.current.files[0];
    const coverFile = coverInputRef.current.files[0];
    const title = e.target.title.value;
    const artist = e.target.artist.value;
    const album = e.target.album.value;

    if (!songFile || !title) {
      alert('Please provide a song file and title');
      return;
    }

    formData.append('song', songFile);
    if (coverFile) formData.append('cover', coverFile);
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('album', album);

    try {
      await axios.post(`${API_BASE_URL}/songs`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchSongs();
      setShowUploadForm(false);
      e.target.reset();
    } catch (error) {
      console.error('Error uploading song:', error);
      alert('Error uploading song');
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    const coverFile = coverInputRef.current.files[0];
    const title = e.target.title.value;
    const artist = e.target.artist.value;
    const album = e.target.album.value;

    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('album', album);
    if (coverFile) formData.append('cover', coverFile);

    try {
      await axios.put(`${API_BASE_URL}/songs/${editingSong.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchSongs();
      setEditingSong(null);
      e.target.reset();
    } catch (error) {
      console.error('Error updating song:', error);
      alert('Error updating song');
    }
  };

  const handleDelete = async (songId) => {
    if (!confirm('Are you sure you want to delete this song?')) return;
    
    try {
      await axios.delete(`${API_BASE_URL}/songs/${songId}`);
      fetchSongs();
      if (currentSong?.id === songId) {
        setCurrentSong(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }
    } catch (error) {
      console.error('Error deleting song:', error);
      alert('Error deleting song');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🎵 MP3 Player</h1>
        <button 
          className="upload-btn"
          onClick={() => setShowUploadForm(true)}
        >
          <Plus size={20} />
          Add Song
        </button>
      </header>

      <main className="main">
        <div className="song-list">
          <h2>Library</h2>
          {songs.length === 0 ? (
            <p className="no-songs">No songs yet. Add your first song!</p>
          ) : (
            <div className="songs-grid">
              {songs.map((song) => (
                <div 
                  key={song.id} 
                  className={`song-card ${currentSong?.id === song.id ? 'active' : ''}`}
                  onClick={() => playSong(song)}
                >
                  <div className="song-cover">
                    {song.coverPath ? (
                      <img 
                        src={`http://localhost:2002/${song.coverPath}`} 
                        alt={song.title}
                      />
                    ) : (
                      <div className="default-cover">🎵</div>
                    )}
                  </div>
                  <div className="song-info">
                    <h3>{song.title}</h3>
                    <p>{song.artist || 'Unknown Artist'}</p>
                    <p className="album">{song.album || 'Unknown Album'}</p>
                  </div>
                  <div className="song-actions">
                    <button 
                      className="edit-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSong(song);
                      }}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(song.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {currentSong && (
          <div className="player">
            <div className="now-playing">
              <div className="current-cover">
                {currentSong.coverPath ? (
                  <img 
                    src={`http://localhost:2002/${currentSong.coverPath}`} 
                    alt={currentSong.title}
                  />
                ) : (
                  <div className="default-cover-large">🎵</div>
                )}
              </div>
              <div className="current-info">
                <h3>{currentSong.title}</h3>
                <p>{currentSong.artist || 'Unknown Artist'}</p>
                <p className="album">{currentSong.album || 'Unknown Album'}</p>
              </div>
            </div>

            <div className="controls">
              <button onClick={playPreviousSong} className="control-btn">
                <SkipBack size={24} />
              </button>
              <button 
                onClick={() => playSong(currentSong)} 
                className="control-btn play-btn"
              >
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
              <button onClick={playNextSong} className="control-btn">
                <SkipForward size={24} />
              </button>
            </div>

            <div className="progress">
              <span className="time">{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleTimeChange}
                className="progress-bar"
              />
              <span className="time">{formatTime(duration)}</span>
            </div>

            <div className="volume-control">
              <Volume2 size={20} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-bar"
              />
            </div>
          </div>
        )}
      </main>

      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Upload Modal */}
      {showUploadForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Song</h2>
              <button 
                className="close-btn"
                onClick={() => setShowUploadForm(false)}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Song File (MP3)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*"
                  required
                />
              </div>
              <div className="form-group">
                <label>Cover Image (Optional)</label>
                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/*"
                />
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Song title"
                />
              </div>
              <div className="form-group">
                <label>Artist</label>
                <input
                  type="text"
                  name="artist"
                  placeholder="Artist name"
                />
              </div>
              <div className="form-group">
                <label>Album</label>
                <input
                  type="text"
                  name="album"
                  placeholder="Album name"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowUploadForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <Upload size={16} />
                  Upload Song
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingSong && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Song</h2>
              <button 
                className="close-btn"
                onClick={() => setEditingSong(null)}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEdit}>
              <div className="form-group">
                <label>Cover Image (Optional)</label>
                <input
                  type="file"
                  ref={coverInputRef}
                  accept="image/*"
                />
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingSong.title}
                  required
                  placeholder="Song title"
                />
              </div>
              <div className="form-group">
                <label>Artist</label>
                <input
                  type="text"
                  name="artist"
                  defaultValue={editingSong.artist || ''}
                  placeholder="Artist name"
                />
              </div>
              <div className="form-group">
                <label>Album</label>
                <input
                  type="text"
                  name="album"
                  defaultValue={editingSong.album || ''}
                  placeholder="Album name"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setEditingSong(null)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  <Edit3 size={16} />
                  Update Song
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
  );
}

export default App;
