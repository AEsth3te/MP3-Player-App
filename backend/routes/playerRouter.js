const express = require('express');
const multer = require('multer');
const path = require('path');
const playerController = require('../controllers/playerController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isAudio = file.mimetype.startsWith('audio/');
    const uploadPath = isAudio ? 'uploads/songs' : 'uploads/img';
    console.log(`File upload destination: ${uploadPath} for ${file.originalname} (${file.mimetype})`);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    console.log(`Generated filename: ${safeName} for ${file.originalname}`);
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const ok = file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/');
  cb(null, ok);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

router.get('/', playerController.list);
router.get('/:id', playerController.getOne);

// multipart/form-data fields: song (file), cover (file), + text fields
router.post('/', (req, res, next) => {
  console.log('POST /api/songs - Request received');
  console.log('Request body:', req.body);
  console.log('Request files:', req.files);
  next();
}, upload.fields([{ name: 'song', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), playerController.create);

// Update metadata or replace cover
router.put('/:id', upload.fields([{ name: 'cover', maxCount: 1 }]), playerController.update);

router.delete('/:id', playerController.remove);

module.exports = router;