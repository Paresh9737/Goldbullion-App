import AsyncStorage from '@react-native-async-storage/async-storage';

// Types for API Response
interface APIResponse<T = any> {
  data: T;
  ok: boolean;
  status: number;
  message: string;
}

// Configuration interface
interface RequestConfig {
  body?: any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
}

// API Client Class
export class APIClient {
  private static serverURL = 'http://139.59.7.235/bullion/api/';

  // Generic API request method
  static async request(
    endpoint: string,
    {body, method = body ? 'POST' : 'GET', ...customConfig}: RequestConfig = {},
  ): Promise<APIResponse> {
    // Log request details
    const logData = {
      endpoint,
      body,
    };
    console.log('API ---> ', JSON.stringify(logData));

    try {
      // Get API key from storage
      const xapikey = await AsyncStorage.getItem('xapikey');

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(xapikey ? {'X-API-KEY': xapikey} : {}),
        ...customConfig.headers,
      };

      // Prepare configuration
      const config: RequestInit = {
        method,
        headers,
        credentials: 'include',
        ...(body ? {body: JSON.stringify(body)} : {}),
      };

      // Make the request
      const response = await fetch(`${this.serverURL}${endpoint}`, config);

      // Handle response
      if (!response.ok && response.status !== 200) {
        return {
          data: [],
          ok: false,
          status: response.status,
          message: `Request failed with status code: ${response.status}`,
        };
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const jsonResponse = await response.json();
        return {
          data: jsonResponse,
          ok: response.ok,
          status: response.status,
          message: '',
        };
      }

      // Return empty response if not JSON
      return {
        data: [],
        ok: response.ok,
        status: response.status,
        message: '',
      };
    } catch (error) {
      console.error('API call error:', error);
      return {
        data: [],
        ok: false,
        status: 0,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Convenience methods
  static get(endpoint: string, customConfig: Omit<RequestConfig, 'body'> = {}) {
    return this.request(endpoint, {...customConfig, method: 'GET'});
  }

  static post(
    endpoint: string,
    body: any = {},
    customConfig: Omit<RequestConfig, 'body'> = {},
  ) {
    return this.request(endpoint, {...customConfig, body});
  }
}
