const Song = require('../model/song');
const fs = require('fs');
const path = require('path');

exports.list = async(req, res) => {
    try {
        const songs = await Song.findAll({ order: [['id', 'ASC']]});
        console.log('Retrieved songs:', songs.length);
        res.json(songs);
    } catch (error) {
        console.error('Error retrieving songs:', error);
        res.status(500).json({ 
            message: 'Error retrieving songs', 
            error: error.message 
        });
    }
};

exports.getOne = async(req, res) => {
    const song = await Song.findByPk(req.params.id);
    if (!song) {
        return res.status(404).json({ error: 'Song not found' });
    }
    res.json(song);
};

exports.create = async (req, res) => {
  try {
    // Fields from multipart form
    const { title, artist, album, duration } = req.body;
    const songFile = req.files?.song?.[0];
    const coverFile = req.files?.cover?.[0];

    console.log('Upload request received:', { title, artist, album, duration });
    console.log('Files received:', { songFile: songFile?.filename, coverFile: coverFile?.filename });

    if (!songFile || !title) {
      return res.status(400).json({ message: 'title and song file are required' });
    }

    // Use platform-appropriate path joining
    const filePath = path.join('uploads', 'songs', songFile.filename);
    const coverPath = coverFile ? path.join('uploads', 'img', coverFile.filename) : null;

    console.log('File paths:', { filePath, coverPath });

    const newSong = await Song.create({
      title,
      artist: artist || null,
      album: album || null,
      duration: duration ? Number(duration) : null,
      filePath,
      coverPath
    });

    console.log('Song created successfully:', newSong.toJSON());
    res.status(201).json(newSong);
  } catch (error) {
    console.error('Error creating song:', error);
    res.status(500).json({ 
      message: 'Error creating song', 
      error: error.message,
      details: error.errors || null
    });
  }
};

exports.update = async (req, res) => {
  try {
    const song = await Song.findByPk(req.params.id);
    if (!song) return res.status(404).json({ message: 'Not found' });

    const { title, artist, album, duration } = req.body;
    const coverFile = req.files?.cover?.[0];

    if (title !== undefined) song.title = title;
    if (artist !== undefined) song.artist = artist;
    if (album !== undefined) song.album = album;
    if (duration !== undefined) song.duration = Number(duration);
    if (coverFile) song.coverPath = path.join('uploads', 'img', coverFile.filename);

    await song.save();
    res.json(song);
  } catch (error) {
    console.error('Error updating song:', error);
    res.status(500).json({ 
      message: 'Error updating song', 
      error: error.message 
    });
  }
};

exports.remove = async (req, res) => {
  const song = await Song.findByPk(req.params.id);
  if (!song) return res.status(404).json({ message: 'Not found' });

  // Optionally delete files (check existence)
  for (const p of [song.filePath, song.coverPath]) {
    if (p) {
      try { fs.unlinkSync(p); } catch { /* ignore */ }
    }
  }
  await song.destroy();
  res.json({ ok: true });
};