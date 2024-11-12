export const MESSAGES = {
    ENABLE_SECURITY: 'Please enable device lock screen security in your phone settings.',
    USE_FINGERPRINT: 'Use fingerprint to authenticate',
    USE_DEVICE_CREDENTIALS: 'Use device credentials to authenticate',
    APP_LOCKED: 'For your security, you can only use goldbullion when it\'s unlocked',
    APP_LOCKED_TITLE: 'Goldbullion is locked',
  } as const;
  
  export const ERRORS = {
    AUTHENTICATION: 'Authentication error',
    SETTINGS: 'Error opening settings',
  } as const;