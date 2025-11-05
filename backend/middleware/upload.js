const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    'uploads',
    'uploads/products',
    'uploads/diseases',
    'uploads/profiles',
    'uploads/documents',
    'uploads/temp'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// File filter functions
const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed.'), false);
  }
};

const documentFileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, XLS, and XLSX files are allowed.'), false);
  }
};

// Storage configurations
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const diseaseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/diseases');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'disease-' + req.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles');
  },
  filename: (req, file, cb) => {
    cb(null, 'profile-' + req.userId + path.extname(file.originalname));
  }
});

const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'doc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Memory storage for processing before saving
const memoryStorage = multer.memoryStorage();

// Upload configurations
const productUpload = multer({
  storage: productStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5 // Maximum 5 files
  }
});

const diseaseUpload = multer({
  storage: diseaseStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB for disease images (higher quality needed)
  }
});

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});

const documentUpload = multer({
  storage: documentStorage,
  fileFilter: documentFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

const memoryUpload = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Image processing middleware
const processImage = (options = {}) => {
  const {
    width = 800,
    height = 800,
    quality = 85,
    format = 'jpeg',
    thumbnail = false
  } = options;
  
  return async (req, res, next) => {
    if (!req.file && !req.files) {
      return next();
    }
    
    try {
      const files = req.files || [req.file];
      
      for (const file of files) {
        if (!file.buffer) continue;
        
        const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${format}`;
        const filepath = path.join('uploads', 'products', filename);
        
        // Process main image
        await sharp(file.buffer)
          .resize(width, height, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .toFormat(format, { quality })
          .toFile(filepath);
        
        // Create thumbnail if requested
        if (thumbnail) {
          const thumbPath = path.join('uploads', 'products', `thumb-${filename}`);
          await sharp(file.buffer)
            .resize(200, 200, {
              fit: 'cover'
            })
            .toFormat(format, { quality: 70 })
            .toFile(thumbPath);
          
          file.thumbnail = `/uploads/products/thumb-${filename}`;
        }
        
        // Update file info
        file.filename = filename;
        file.path = filepath;
        file.publicUrl = `/uploads/products/${filename}`;
      }
      
      next();
    } catch (error) {
      next(new Error('Image processing failed: ' + error.message));
    }
  };
};

// Delete file utility
const deleteFile = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filepath, (err) => {
      if (err && err.code !== 'ENOENT') {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

// Cleanup old files middleware
const cleanupOldFiles = (directory, daysOld = 30) => {
  return async (req, res, next) => {
    try {
      const files = fs.readdirSync(directory);
      const now = Date.now();
      const cutoff = daysOld * 24 * 60 * 60 * 1000;
      
      for (const file of files) {
        const filepath = path.join(directory, file);
        const stats = fs.statSync(filepath);
        
        if (now - stats.mtimeMs > cutoff) {
          await deleteFile(filepath);
        }
      }
      
      next();
    } catch (error) {
      console.error('Cleanup error:', error);
      next(); // Continue even if cleanup fails
    }
  };
};

// File validation middleware
const validateFile = (options = {}) => {
  const {
    required = false,
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['image/jpeg', 'image/png']
  } = options;
  
  return (req, res, next) => {
    if (required && !req.file && !req.files) {
      return res.status(400).json({
        status: 'error',
        message: 'File is required'
      });
    }
    
    const files = req.files || (req.file ? [req.file] : []);
    
    for (const file of files) {
      if (file.size > maxSize) {
        return res.status(400).json({
          status: 'error',
          message: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`
        });
      }
      
      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          status: 'error',
          message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
        });
      }
    }
    
    next();
  };
};

module.exports = {
  productUpload,
  diseaseUpload,
  profileUpload,
  documentUpload,
  memoryUpload,
  processImage,
  deleteFile,
  cleanupOldFiles,
  validateFile,
  imageFileFilter,
  documentFileFilter
};
