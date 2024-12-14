export const VALIDATION = {
  USERNAME_EMT: 'Username is required',
  USERNAME_RQD: 'Username must be 4-20 characters long',
  USERNAME_FMT: 'Username can only contain letters, numbers, and underscores',

  ADDRESS_RQD: 'Address must be 4-100 characters long',
  ADDRESS_EMT: 'Address is required',
  ADDRESS_FMT: 'Please provide a valid address',

  PASSWORD_EMT: 'Password is required',
  PASSWORD_RQD: 'Password must be 6-30 characters long',
  PASSWORD_FMT: '',

  MOBILE_EMT: 'Mobile number is required',
  MOBILE_RQD: 'Mobile number must be 10 digits',
  MOBILE_FMT: 'Invalid mobile number format',

  EMAIL_EMT: 'Email is required',
  EMAIL_RQD: 'Please enter a valid email address',
} as const;

// Email validation with more robust regex
export const isValidEmail = (email: string): string => {
  if (!email) {
    return VALIDATION.EMAIL_EMT;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return VALIDATION.EMAIL_RQD;
  }

  return '';
};

// Mobile validation with stricter rules
export const isValidMobile = (mobile: string): string => {
  if (!mobile) {
    return VALIDATION.MOBILE_EMT;
  }

  // Remove any spaces or dashes
  const cleanedMobile = mobile.replace(/[\s-]/g, '');

  // Check if it's exactly 10 digits and starts with a valid prefix
  const mobileRegex = /^[6-9]\d{9}$/;
  if (!mobileRegex.test(cleanedMobile)) {
    return VALIDATION.MOBILE_RQD;
  }

  return '';
};

// Username validation with more comprehensive checks
export const isValidUsername = (username: string): string => {
  if (!username) {
    return VALIDATION.USERNAME_EMT;
  }

  // Check length
  if (username.length < 4 || username.length > 20) {
    return VALIDATION.USERNAME_RQD;
  }

  // Allow only letters, numbers, and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return VALIDATION.USERNAME_FMT;
  }

  return '';
};

// Password validation with complexity requirements
export const isValidPassword = (password: string): string => {
  if (!password) {
    return VALIDATION.PASSWORD_EMT;
  }

  // Check length
  if (password.length < 6 || password.length > 30) {
    return VALIDATION.PASSWORD_RQD;
  }

  return '';
};

// Address validation with more nuanced checks
export const isValidAddress = (address: string): string => {
  if (!address) {
    return VALIDATION.ADDRESS_EMT;
  }

  // Trim and check length
  const trimmedAddress = address.trim();
  if (trimmedAddress.length < 4 || trimmedAddress.length > 100) {
    return VALIDATION.ADDRESS_RQD;
  }

  const addressRegex = /^[a-zA-Z0-9\s,.-]+$/;
  if (!addressRegex.test(trimmedAddress)) {
    return VALIDATION.ADDRESS_FMT;
  }

  return '';
};
