import {createSlice} from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        user: [],
        users: []
    },
    reducers: {
        setUser: (state, {payload}) => {
            state.user = payload
        },
        setUsers: (state, {payload}) => {
            state.users = payload
        },
        setRegisterUser: (state, {payload}) => {
            state.users.push(payload)
        },
        changedUserDisplay: (state, {payload}) => {
            const index = state.users.findIndex(x => x._id === payload._id)
            state.users[index] = payload
        }
    }
})

export const {setUser, setUsers, setRegisterUser, changedUserDisplay} = userSlice.actions
export default userSlice.reducer