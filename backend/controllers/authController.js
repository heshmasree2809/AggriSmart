const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { cache } = require('../config/redis');

// Generate tokens
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
};

// Signup/Register
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, contact, address } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Buyer',
    contact,
    address,
    verificationStatus: false
  });

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token to user
  user.refreshToken = refreshToken;
  await user.save();

  // Set refresh token in cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  // Remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  res.status(201).json(
    new ApiResponse(201, {
      user: userResponse,
      accessToken
    }, 'Registration successful')
  );
});

// Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user || !(await user.checkPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check if account is active
  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated. Please contact support.');
  }

  // Update last login
  user.lastLogin = Date.now();
  
  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // Set refresh token in cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  // Remove sensitive fields
  const userResponse = user.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  res.json(
    new ApiResponse(200, {
      user: userResponse,
      accessToken
    }, 'Login successful')
  );
});

// Refresh Token
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies || req.body;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token not provided');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update refresh token
    user.refreshToken = newRefreshToken;
    await user.save();

    // Update cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json(
      new ApiResponse(200, {
        accessToken: newAccessToken
      }, 'Token refreshed successfully')
    );
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
});

// Logout
exports.logout = asyncHandler(async (req, res) => {
  // Clear refresh token from database
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { refreshToken: 1 }
    });
  }

  // Clear cookie
  res.clearCookie('refreshToken');

  // Clear any cache if exists
  if (req.user) {
    await cache.del(`user:${req.user._id}`);
  }

  res.json(
    new ApiResponse(200, null, 'Logged out successfully')
  );
});

// Forgot Password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists
    return res.json(
      new ApiResponse(200, null, 'If the email exists, a password reset link has been sent')
    );
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save();

  // TODO: Send email with reset link
  // const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  // await sendEmail({
  //   to: email,
  //   subject: 'Password Reset Request',
  //   template: 'passwordReset',
  //   data: { resetUrl, name: user.name }
  // });

  res.json(
    new ApiResponse(200, null, 'If the email exists, a password reset link has been sent')
  );
});

// Reset Password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  // Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Generate new tokens for auto-login
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.json(
    new ApiResponse(200, {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, 'Password reset successful')
  );
});

// Get Profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -refreshToken');
  
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json(
    new ApiResponse(200, user, 'Profile fetched successfully')
  );
});

// Update Profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  
  // Fields that cannot be updated through this endpoint
  const restrictedFields = ['password', 'email', 'role', 'refreshToken', 'passwordResetToken'];
  restrictedFields.forEach(field => delete updates[field]);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updates,
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json(
    new ApiResponse(200, user, 'Profile updated successfully')
  );
});

// Change Password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  
  // Verify current password
  if (!(await user.checkPassword(currentPassword))) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json(
    new ApiResponse(200, null, 'Password changed successfully')
  );
});

// Verify Email
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }

  user.verificationStatus = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.json(
    new ApiResponse(200, null, 'Email verified successfully')
  );
});

