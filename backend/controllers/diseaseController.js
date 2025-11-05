const DiseaseScan = require('../models/DiseaseScan');
const { asyncHandler } = require('../middleware/errorHandler');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/diseases';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `disease-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// Simulated AI disease detection (replace with actual AI model integration)
const analyzeDisease = async (imagePath) => {
  // This is a placeholder for AI integration
  // In production, integrate with TensorFlow, PyTorch, or cloud AI services
  
  const diseases = [
    {
      name: 'Leaf Blight',
      confidence: 85,
      severity: 'High',
      treatments: [
        { type: 'Chemical', description: 'Apply fungicide containing Mancozeb', organic: false },
        { type: 'Organic', description: 'Use neem oil spray', organic: true }
      ],
      action: 'Immediate treatment required. Remove affected leaves and apply fungicide.'
    },
    {
      name: 'Powdery Mildew',
      confidence: 78,
      severity: 'Medium',
      treatments: [
        { type: 'Chemical', description: 'Apply sulfur-based fungicide', organic: false },
        { type: 'Organic', description: 'Spray with baking soda solution', organic: true }
      ],
      action: 'Improve air circulation and apply treatment within 2-3 days.'
    },
    {
      name: 'Bacterial Spot',
      confidence: 72,
      severity: 'Medium',
      treatments: [
        { type: 'Chemical', description: 'Use copper-based bactericide', organic: false },
        { type: 'Biological', description: 'Apply beneficial bacteria', organic: true }
      ],
      action: 'Avoid overhead watering and apply bactericide.'
    }
  ];
  
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return random disease for demonstration
  const result = diseases[Math.floor(Math.random() * diseases.length)];
  return result;
};

// Upload and scan plant disease
exports.scanDisease = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'Please upload an image' 
    });
  }
  
  const { cropType } = req.body;
  
  try {
    // Analyze the image using AI
    const analysis = await analyzeDisease(req.file.path);
    
    // Save scan result to database
    const scan = new DiseaseScan({
      user: req.user._id,
      imageUrl: `/uploads/diseases/${req.file.filename}`,
      disease: analysis.name,
      confidence: analysis.confidence,
      severity: analysis.severity,
      cropType: cropType || 'Unknown',
      recommendedAction: analysis.action,
      treatments: analysis.treatments,
      status: 'Analyzed'
    });
    
    await scan.save();
    await scan.populate('user', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Disease analysis completed',
      scan
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    throw error;
  }
});

// Get all disease scans for user
exports.getMyScans = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  
  const query = { user: req.user._id };
  if (status) query.status = status;
  
  const totalScans = await DiseaseScan.countDocuments(query);
  const scans = await DiseaseScan.find(query)
    .populate('reviewedBy', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  res.json({
    success: true,
    scans,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalScans / limit),
      totalScans
    }
  });
});

// Get single scan by ID
exports.getScanById = asyncHandler(async (req, res) => {
  const scan = await DiseaseScan.findById(req.params.id)
    .populate('user', 'name email contact')
    .populate('reviewedBy', 'name email');
  
  if (!scan) {
    return res.status(404).json({
      success: false,
      message: 'Scan not found'
    });
  }
  
  // Check if user owns this scan or is an expert/admin
  if (scan.user._id.toString() !== req.user._id.toString() && 
      !['Expert', 'Admin'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
  
  res.json({ success: true, scan });
});

// Expert review of disease scan
exports.reviewScan = asyncHandler(async (req, res) => {
  const { expertNotes, treatments, recommendedAction, severity } = req.body;
  
  const scan = await DiseaseScan.findById(req.params.id);
  
  if (!scan) {
    return res.status(404).json({
      success: false,
      message: 'Scan not found'
    });
  }
  
  scan.reviewedBy = req.user._id;
  scan.expertNotes = expertNotes;
  scan.status = 'Reviewed';
  
  if (treatments) scan.treatments = treatments;
  if (recommendedAction) scan.recommendedAction = recommendedAction;
  if (severity) scan.severity = severity;
  
  await scan.save();
  await scan.populate('user reviewedBy');
  
  res.json({
    success: true,
    message: 'Scan reviewed successfully',
    scan
  });
});

// Delete scan
exports.deleteScan = asyncHandler(async (req, res) => {
  const scan = await DiseaseScan.findOne({
    _id: req.params.id,
    user: req.user._id
  });
  
  if (!scan) {
    return res.status(404).json({
      success: false,
      message: 'Scan not found or unauthorized'
    });
  }
  
  // Delete associated image file
  if (scan.imageUrl) {
    const imagePath = path.join(__dirname, '..', scan.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }
  
  await scan.remove();
  
  res.json({
    success: true,
    message: 'Scan deleted successfully'
  });
});

// Get disease statistics
exports.getDiseaseStats = asyncHandler(async (req, res) => {
  const stats = await DiseaseScan.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: '$disease',
        count: { $sum: 1 },
        avgConfidence: { $avg: '$confidence' },
        lastSeen: { $max: '$createdAt' }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  const severityStats = await DiseaseScan.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: '$severity',
        count: { $sum: 1 }
      }
    }
  ]);
  
  res.json({
    success: true,
    stats: {
      diseases: stats,
      severity: severityStats,
      totalScans: await DiseaseScan.countDocuments({ user: req.user._id })
    }
  });
});

module.exports = {
  upload,
  ...exports
};
