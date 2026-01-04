const express = require('express');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

const router = express.Router();

let gfs;

const initGridFS = () => {
  const conn = mongoose.connection;
  if (conn.readyState === 1) {
    gfs = new GridFSBucket(conn.db, {
      bucketName: 'images',
    });
  } else {
    conn.once('open', () => {
      gfs = new GridFSBucket(conn.db, {
        bucketName: 'images',
      });
    });
  }
};

initGridFS();

router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!gfs) {
      initGridFS();
      if (!gfs) {
        return res.status(500).json({ message: 'Database not ready' });
      }
    }

    const writeStream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    writeStream.end(req.file.buffer);

    writeStream.on('finish', () => {
      res.json({
        imageUrl: `/api/images/${writeStream.id}`,
        imageId: writeStream.id.toString(),
      });
    });

    writeStream.on('error', (error) => {
      console.error('GridFS upload error:', error);
      res.status(500).json({ message: 'Error uploading image' });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!gfs) {
      initGridFS();
      if (!gfs) {
        return res.status(500).json({ message: 'Database not ready' });
      }
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    
    const files = await gfs.find({ _id: fileId }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const readStream = gfs.openDownloadStream(fileId);
    
    res.set('Content-Type', files[0].contentType);
    readStream.pipe(res);

    readStream.on('error', (error) => {
      console.error('GridFS download error:', error);
      res.status(500).json({ message: 'Error retrieving image' });
    });
  } catch (error) {
    console.error('Image retrieval error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    if (!gfs) {
      initGridFS();
      if (!gfs) {
        return res.status(500).json({ message: 'Database not ready' });
      }
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    
    await gfs.delete(fileId);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

