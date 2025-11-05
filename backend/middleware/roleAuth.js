const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Authentication required' 
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'error', 
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
      });
    }
    
    next();
  };
};

const requireFarmer = requireRole('Farmer', 'Admin');
const requireBuyer = requireRole('Buyer', 'Admin');
const requireExpert = requireRole('Expert', 'Admin');
const requireAdmin = requireRole('Admin');
const requireAnyRole = requireRole('Farmer', 'Buyer', 'Expert', 'Admin');

const checkOwnership = (resourceModel, resourceIdParam = 'id') => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceIdParam];
      const resource = await resourceModel.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ 
          status: 'error', 
          message: 'Resource not found' 
        });
      }
      
      const ownerId = resource.user || resource.buyer || resource.seller;
      
      if (req.user.role === 'Admin' || 
          (ownerId && ownerId.toString() === req.userId.toString())) {
        req.resource = resource;
        return next();
      }
      
      return res.status(403).json({ 
        status: 'error', 
        message: 'Access denied. You do not own this resource.' 
      });
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Failed to verify ownership' 
      });
    }
  };
};

module.exports = {
  requireRole,
  requireFarmer,
  requireBuyer,
  requireExpert,
  requireAdmin,
  requireAnyRole,
  checkOwnership
};
