import { apiSlice } from './api';
import { ServiceRequest } from '../types';

interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export const requestsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRequest: builder.mutation<
      ApiResponse<ServiceRequest>,
      {
        categoryName: string;
        categoryIcon: string;
        activities: string[];
        timing: string;
        scheduledDate?: string;
        scheduledTime?: string;
        notes?: string;
      }
    >({
      query: (body) => ({
        url: '/requests',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Tasks'],
    }),

    getUserRequests: builder.query<ApiResponse<ServiceRequest[]>, void>({
      query: () => '/requests',
      providesTags: ['Tasks'],
    }),
  }),
});

export const {
  useCreateRequestMutation,
  useGetUserRequestsQuery,
} = requestsApi;
