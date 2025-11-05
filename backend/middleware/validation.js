const Joi = require('joi');
const ApiError = require('../utils/ApiError');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: {
          label: ''
        }
      }
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(422).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    req.body = value;
    next();
  };
};

// Validation schemas
const schemas = {
  // Auth schemas
  register: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }),
    role: Joi.string().valid('Farmer', 'Buyer').required(),
    contact: Joi.string().pattern(/^[6-9]\d{9}$/).required()
      .messages({
        'string.pattern.base': 'Please provide a valid 10-digit Indian mobile number'
      }),
    address: Joi.object({
      street: Joi.string().allow(''),
      village: Joi.string().required(),
      district: Joi.string().required(),
      state: Joi.string().required(),
      zipcode: Joi.string().pattern(/^\d{6}$/)
        .messages({
          'string.pattern.base': 'Please provide a valid 6-digit PIN code'
        })
    }).required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  }),
  
  resetPassword: Joi.object({
    token: Joi.string().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
  }),
  
  // Product schemas
  createProduct: Joi.object({
    name: Joi.string().min(3).max(100).required(),
    category: Joi.string().required(),
    subcategory: Joi.string(),
    description: Joi.string().max(1000),
    price: Joi.number().positive().required(),
    unit: Joi.string().valid('kg', 'gram', 'piece', 'dozen', 'quintal').required(),
    quantity: Joi.number().min(0).required(),
    minimumOrder: Joi.number().min(1).default(1),
    maximumOrder: Joi.number().min(Joi.ref('minimumOrder')),
    quality: Joi.string().valid('A', 'B', 'C').default('A'),
    organic: Joi.boolean().default(false),
    harvestDate: Joi.date(),
    expiryDate: Joi.date().greater(Joi.ref('harvestDate')),
    location: Joi.object({
      state: Joi.string(),
      district: Joi.string(),
      village: Joi.string()
    }),
    tags: Joi.array().items(Joi.string()),
    bulkPricing: Joi.object({
      enabled: Joi.boolean().default(false),
      price: Joi.number().positive(),
      minimumQuantity: Joi.number().min(1).default(100)
    })
  }),
  
  updateProduct: Joi.object({
    name: Joi.string().min(3).max(100),
    category: Joi.string(),
    subcategory: Joi.string(),
    description: Joi.string().max(1000),
    price: Joi.number().positive(),
    quantity: Joi.number().min(0),
    minimumOrder: Joi.number().min(1),
    maximumOrder: Joi.number(),
    quality: Joi.string().valid('A', 'B', 'C'),
    organic: Joi.boolean(),
    harvestDate: Joi.date(),
    expiryDate: Joi.date(),
    location: Joi.object({
      state: Joi.string(),
      district: Joi.string(),
      village: Joi.string()
    }),
    tags: Joi.array().items(Joi.string()),
    isActive: Joi.boolean(),
    isFeatured: Joi.boolean()
  }).min(1), // At least one field must be provided
  
  // Order schemas
  createOrder: Joi.object({
    items: Joi.array().items(
      Joi.object({
        product: Joi.string().hex().length(24).required(),
        quantity: Joi.number().min(1).required()
      })
    ).min(1).required(),
    orderType: Joi.string().valid('B2C', 'B2B').default('B2C'),
    shippingAddress: Joi.object({
      street: Joi.string(),
      village: Joi.string().required(),
      district: Joi.string().required(),
      state: Joi.string().required(),
      zipcode: Joi.string().pattern(/^\d{6}$/),
      phone: Joi.string().pattern(/^[6-9]\d{9}$/).required()
    }).required(),
    billingAddress: Joi.object({
      street: Joi.string(),
      village: Joi.string(),
      district: Joi.string(),
      state: Joi.string(),
      zipcode: Joi.string().pattern(/^\d{6}$/)
    }),
    paymentMethod: Joi.string().valid('cod', 'upi', 'card', 'netbanking', 'wallet').default('cod'),
    notes: Joi.string().max(500)
  }),
  
  updateOrderStatus: Joi.object({
    orderStatus: Joi.string()
      .valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')
      .required(),
    trackingNumber: Joi.string(),
    courierPartner: Joi.string(),
    expectedDeliveryDate: Joi.date(),
    cancellationReason: Joi.string().when('orderStatus', {
      is: 'cancelled',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
  }),
  
  // Disease scan schemas
  createDiseaseScan: Joi.object({
    crop: Joi.string().required(),
    location: Joi.object({
      state: Joi.string(),
      district: Joi.string(),
      village: Joi.string(),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90),
        lng: Joi.number().min(-180).max(180)
      })
    })
  }),
  
  // Soil report schemas
  createSoilReport: Joi.object({
    fieldLocation: Joi.object({
      name: Joi.string(),
      area: Joi.number().min(0),
      areaUnit: Joi.string().valid('acre', 'hectare', 'bigha').default('acre'),
      coordinates: Joi.object({
        lat: Joi.number().min(-90).max(90),
        lng: Joi.number().min(-180).max(180)
      }),
      address: Joi.object({
        village: Joi.string(),
        district: Joi.string(),
        state: Joi.string()
      })
    }),
    soilParameters: Joi.object({
      pH: Joi.number().min(0).max(14),
      nitrogen: Joi.number().min(0),
      phosphorus: Joi.number().min(0),
      potassium: Joi.number().min(0),
      organicMatter: Joi.number().min(0).max(100),
      ec: Joi.number().min(0),
      cec: Joi.number().min(0),
      moisture: Joi.number().min(0).max(100),
      temperature: Joi.number(),
      micronutrients: Joi.object({
        zinc: Joi.number(),
        iron: Joi.number(),
        manganese: Joi.number(),
        copper: Joi.number(),
        boron: Joi.number()
      })
    }).required(),
    soilType: Joi.string()
      .valid('alluvial', 'black', 'red', 'laterite', 'desert', 'mountain', 'clay', 'sandy', 'loamy', 'peaty', 'saline')
      .required(),
    texture: Joi.object({
      sand: Joi.number().min(0).max(100),
      silt: Joi.number().min(0).max(100),
      clay: Joi.number().min(0).max(100)
    })
  }),
  
  // Notification schemas
  createNotification: Joi.object({
    type: Joi.string().valid('Alert', 'Reminder', 'Update', 'Warning', 'Info', 'Success', 'Error').default('Info'),
    category: Joi.string().valid('Weather', 'Pest', 'Disease', 'Price', 'Order', 'Irrigation', 'System', 'Scheme').required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
    actionUrl: Joi.string().uri(),
    expiresAt: Joi.date(),
    deliveryChannels: Joi.array().items(
      Joi.string().valid('InApp', 'Email', 'SMS', 'Push')
    ).default(['InApp'])
  }),
  
  // Query validation schemas
  paginationQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string(),
    order: Joi.string().valid('asc', 'desc').default('desc')
  }),
  
  productQuery: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    category: Joi.string(),
    subcategory: Joi.string(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().greater(Joi.ref('minPrice')),
    organic: Joi.boolean(),
    seller: Joi.string().hex().length(24),
    search: Joi.string(),
    sortBy: Joi.string().valid('price', 'createdAt', 'rating', 'name').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
    quality: Joi.string().valid('A', 'B', 'C'),
    state: Joi.string(),
    district: Joi.string()
  })
};

// Validate query parameters
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Invalid query parameters',
        errors
      });
    }
    
    req.query = value;
    next();
  };
};

// Validate params
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return res.status(400).json({
        status: 'error',
        message: 'Invalid parameters',
        errors
      });
    }
    
    req.params = value;
    next();
  };
};

// MongoDB ObjectId validation
const objectId = Joi.string().hex().length(24);

module.exports = {
  validate,
  validateQuery,
  validateParams,
  schemas,
  objectId
};
