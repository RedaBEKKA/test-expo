import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  token: null,
  refetchToken: null,
  userName: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload
    },
    setUser: (state, action) => {
      state.userName = action.payload
    },
    logOut: (state) => {
      state.token = null
      state.refetchToken = null
    },
  },
})

export const { setToken, logOut, setUser } = authSlice.actions
export default authSlice.reducer
