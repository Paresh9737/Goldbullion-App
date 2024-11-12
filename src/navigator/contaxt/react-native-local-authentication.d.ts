declare module 'react-native-local-authentication' {
    export interface LocalAuthenticationResult {
      success: boolean;
      error?: string;
    }
  
    export interface LocalAuthenticationOptions {
      promptMessage?: string;
      cancelLabel?: string;
      disableDeviceFallback?: boolean;
    }
  
    export function hasHardwareAsync(): Promise<boolean>;
    export function isEnrolledAsync(): Promise<boolean>;
    export function authenticateAsync(
      options?: LocalAuthenticationOptions,
    ): Promise<LocalAuthenticationResult>;
  }
  