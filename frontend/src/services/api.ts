import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Set this to your local Wi-Fi IP (e.g. '192.168.1.100') if auto-detection fails on physical device
const MANUAL_DEV_IP: string | null = null;

// Auto-detect the right backend host IP based on environment and platform
const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (MANUAL_DEV_IP) {
    return `http://${MANUAL_DEV_IP}:5000/api/v1`;
  }

  // Detect host IP from Expo Metro packager (works automatically for physical devices on same Wi-Fi)
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ||
    (Constants as any).manifest?.debuggerHost;

  if (debuggerHost) {
    const hostIp = debuggerHost.split(':')[0];
    if (hostIp && hostIp !== 'localhost' && hostIp !== '127.0.0.1') {
      return `http://${hostIp}:5000/api/v1`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api/v1'; // Android Emulator
  }
  return 'http://localhost:5000/api/v1'; // iOS Simulator / Web
};

export const API_BASE_URL = getApiBaseUrl();
console.log(`[API Config] 🌐 Base URL initialized: ${API_BASE_URL}`);

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    try {
      const token = await SecureStore.getItemAsync('livora_auth_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (error) {
      console.warn('Error reading token from SecureStore:', error);
    }
    return headers;
  },
});

const loggingBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args.url;
  const method = (typeof args === 'string' ? 'GET' : args.method) || 'GET';
  const cleanUrl = url ? url.replace(/^\//, '') : '';
  const fullEndpoint = cleanUrl ? `${API_BASE_URL}/${cleanUrl}` : API_BASE_URL;

  console.log(`[API Request] ➡️ ${method} ${fullEndpoint}`);

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    console.error(`[API Error] ❌ ${method} ${fullEndpoint}`, {
      status: result.error.status,
      data: result.error.data,
      error: (result.error as any).error,
    });
  } else {
    console.log(
      `[API Response] ✅ ${method} ${fullEndpoint} (${result.meta?.response?.status ?? 200})`
    );
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: loggingBaseQuery,
  tagTypes: ['User', 'Profile', 'Tasks'],
  endpoints: () => ({}),
});

