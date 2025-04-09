import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Tenant, Manager } from '@/types/prismaTypes';
import { createNewUserInDatabase, IdToken } from '@/lib/utils';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set('Authorization', `Bearer ${idToken}`);
      }
      return headers;
    },
  }),
  reducerPath: 'api',
  tagTypes: [],
  endpoints: (build) => ({
    getAuthUser: build.query<User, void>({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBaseQuery) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload['custom:role'] as string;

          const endpoint = `/${
            userRole === 'manager' ? 'managers' : 'tenants'
          }/${user.userId}`;

          let userDetailsResponse = await fetchWithBaseQuery(endpoint);
          console.log('userDetailsResponse::', userDetailsResponse);

          // If user doesn't exist, create new user
          if (
            userDetailsResponse.error &&
            userDetailsResponse.error.status === 404
          ) {
            userDetailsResponse = await createNewUserInDatabase(
              user,
              idToken as IdToken,
              userRole,
              fetchWithBaseQuery
            );
          }

          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsResponse.data as Tenant | Manager,
              userRole,
            },
          };
        } catch (error: any) {
          return { error: error.message || 'Failed to fetch user data' };
        }
      },
    }),
  }),
});

export const { useGetAuthUserQuery } = api;
