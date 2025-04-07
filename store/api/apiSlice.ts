import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BaseQueryApi } from "@reduxjs/toolkit/query/react"
import { FetchArgs } from "@reduxjs/toolkit/query/react"
import { RootState } from "../store"
import { logOut, setToken } from "../auth/authSlice"

const baseQuery = fetchBaseQuery({
  baseUrl: "https://fakestoreapi.com",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set("authorization", `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryrefresh = fetchBaseQuery({
  baseUrl: "https://fakestoreapi.com",
  // responseHandler: "text",
  prepareHeaders: (headers, { getState }) => {
    const refetchToken = (getState() as RootState).auth.refetchToken
    if (refetchToken) {
      headers.set("Authorization", `Bearer ${refetchToken}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: any
) => {
  let result = await baseQuery(args, api, extraOptions)
  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 501)
  ) {
    const refreshResult = await baseQueryrefresh(
      "/refreshToken/accessToken",
      api,
      extraOptions
    )
    if (refreshResult?.data) {
      const refreshData = refreshResult.data as any
      api.dispatch(setToken(refreshData.accessToken))
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logOut())
    }
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
})
