// Form validation utilities

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain a number';
  return '';
};

// Phone validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian phone number format
  if (!phone) return 'Phone number is required';
  if (!phoneRegex.test(phone)) return 'Invalid phone number (10 digits required)';
  return '';
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name) return `${fieldName} is required`;
  if (name.length < 2) return `${fieldName} must be at least 2 characters`;
  if (name.length > 50) return `${fieldName} must be less than 50 characters`;
  if (!/^[a-zA-Z\s]+$/.test(name)) return `${fieldName} can only contain letters and spaces`;
  return '';
};

// Pincode validation
export const validatePincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/; // Indian pincode format
  if (!pincode) return 'Pincode is required';
  if (!pincodeRegex.test(pincode)) return 'Invalid pincode (6 digits required)';
  return '';
};

// Address validation
export const validateAddress = (address) => {
  if (!address) return 'Address is required';
  if (address.length < 10) return 'Please provide a complete address';
  if (address.length > 200) return 'Address is too long';
  return '';
};

// Quantity validation
export const validateQuantity = (quantity, min = 1, max = 999) => {
  const qty = parseInt(quantity);
  if (!quantity) return 'Quantity is required';
  if (isNaN(qty)) return 'Quantity must be a number';
  if (qty < min) return `Minimum quantity is ${min}`;
  if (qty > max) return `Maximum quantity is ${max}`;
  return '';
};

// File validation
export const validateFile = (file, maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) => {
  if (!file) return 'Please select a file';
  
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return `File size must be less than ${maxSizeMB}MB`;
  }
  
  if (!allowedTypes.includes(file.type)) {
    return 'Invalid file type. Allowed types: ' + allowedTypes.map(t => t.split('/')[1]).join(', ');
  }
  
  return '';
};

// Date validation
export const validateDate = (date, minDate = null, maxDate = null) => {
  if (!date) return 'Date is required';
  
  const selectedDate = new Date(date);
  if (isNaN(selectedDate.getTime())) return 'Invalid date';
  
  if (minDate && selectedDate < new Date(minDate)) {
    return `Date must be after ${new Date(minDate).toLocaleDateString()}`;
  }
  
  if (maxDate && selectedDate > new Date(maxDate)) {
    return `Date must be before ${new Date(maxDate).toLocaleDateString()}`;
  }
  
  return '';
};

// Credit card validation
export const validateCreditCard = (cardNumber) => {
  const cleaned = cardNumber.replace(/\s+/g, '');
  if (!cleaned) return 'Card number is required';
  if (!/^\d{16}$/.test(cleaned)) return 'Card number must be 16 digits';
  
  // Luhn algorithm validation
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  if (sum % 10 !== 0) return 'Invalid card number';
  return '';
};

// CVV validation
export const validateCVV = (cvv) => {
  if (!cvv) return 'CVV is required';
  if (!/^\d{3,4}$/.test(cvv)) return 'CVV must be 3 or 4 digits';
  return '';
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  for (const field in validationRules) {
    const value = formData[field];
    const rules = validationRules[field];
    
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        isValid = false;
        break;
      }
    }
  }

  return { isValid, errors };
};

// Custom validation rule creator
export const createValidator = (validationFn, errorMessage) => {
  return (value) => {
    if (!validationFn(value)) {
      return errorMessage;
    }
    return '';
  };
};

// Required field validator
export const required = (fieldName = 'This field') => {
  return (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return '';
  };
};

// Min length validator
export const minLength = (min, fieldName = 'Field') => {
  return (value) => {
    if (value && value.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    return '';
  };
};

// Max length validator
export const maxLength = (max, fieldName = 'Field') => {
  return (value) => {
    if (value && value.length > max) {
      return `${fieldName} must be less than ${max} characters`;
    }
    return '';
  };
};

// Pattern validator
export const pattern = (regex, errorMessage) => {
  return (value) => {
    if (value && !regex.test(value)) {
      return errorMessage;
    }
    return '';
  };
};

// Export all validators
export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validatePincode,
  validateAddress,
  validateQuantity,
  validateFile,
  validateDate,
  validateCreditCard,
  validateCVV,
  validateForm,
  createValidator,
  required,
  minLength,
  maxLength,
  pattern
};
