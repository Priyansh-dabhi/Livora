import { apiSlice } from './api';

// Response shapes matching the Express backend
export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<
      ApiResponse<{ id: string; email: string; message: string }>,
      { email: string; password: string; confirmPassword: string }
    >({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),

    verifyEmail: builder.mutation<
      ApiResponse<{
        token: string;
        user: {
          id: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          isVerified: boolean;
          isProfileComplete: boolean;
          createdAt: string;
        };
      }>,
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
    }),

    resendEmailOtp: builder.mutation<
      ApiResponse<void>,
      { email: string }
    >({
      query: (body) => ({
        url: '/auth/resend-email-otp',
        method: 'POST',
        body,
      }),
    }),

    requestLoginOtp: builder.mutation<
      ApiResponse<void>,
      { email: string; phone?: string }
    >({
      query: (body) => ({
        url: '/auth/login/request-otp',
        method: 'POST',
        body,
      }),
    }),

    verifyLoginOtp: builder.mutation<
      ApiResponse<{
        token: string;
        user: {
          id: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          isVerified: boolean;
          isProfileComplete: boolean;
          createdAt: string;
        };
      }>,
      { email: string; phone?: string; otp: string }
    >({
      query: (body) => ({
        url: '/auth/login/verify-otp',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendEmailOtpMutation,
  useRequestLoginOtpMutation,
  useVerifyLoginOtpMutation,
} = authApi;
