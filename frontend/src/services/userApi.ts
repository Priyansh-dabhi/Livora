import { apiSlice } from './api';
import type { Profile, ProfilePayload } from '../types';

interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<Profile>, void>({
      query: () => '/users/profile',
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<ApiResponse<Profile>, ProfilePayload>({
      query: (body) => ({
        url: '/users/profile',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile', 'User'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi;
