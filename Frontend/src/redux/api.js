import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = import.meta.env.VITE_API_URL;

export const shipmentApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    health: builder.query({
      query: () => '/health',
    }),
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    signup: builder.mutation({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getMe: builder.query({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
    }),
    getShipments: builder.query({
      query: () => '/shipment',
      transformResponse: (response) => (Array.isArray(response?.data) ? response.data : []),
      providesTags: (result) =>
        Array.isArray(result)
          ? [
              {
                type: 'Shipment',
                id: 'LIST',
              },
              ...result.map((shipment) => ({
                type: 'Shipment',
                id: shipment._id,
              })),
            ]
          : [
              {
                type: 'Shipment',
                id: 'LIST',
              },
            ],
    }),
    getShipment: builder.query({
      query: (id) => `/shipment/${id}`,
      transformResponse: (response) => response?.data ?? null,
      providesTags: (_result, _error, id) => [
        {
          type: 'Shipment',
          id,
        },
      ],
    }),
    addShipment: builder.mutation({
      query: (body) => ({
        url: '/shipment',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        {
          type: 'Shipment',
          id: 'LIST',
        },
      ],
    }),
    updateShipmentLocation: builder.mutation({
      query: ({ id, currentLocation }) => ({
        url: `/shipment/${id}/updatelocation`,
        method: 'POST',
        body: {
          currentLocation,
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        {
          type: 'Shipment',
          id: 'LIST',
        },
        {
          type: 'Shipment',
          id,
        },
      ],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetShipmentsQuery,
  useGetShipmentQuery,
  useAddShipmentMutation,
  useUpdateShipmentLocationMutation,
  useHealthQuery,
} = shipmentApi;
