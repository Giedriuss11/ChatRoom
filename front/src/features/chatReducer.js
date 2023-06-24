import {createSlice} from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        user: [],
        personalChat: [],
        groupChat: [],
        userConversation: [],
        notification: [],
    },
    reducers: {
        setSingleUser: (state, {payload}) => {
            state.user = payload
        },
        setPersonalMessage: (state, {payload}) => {
            state.personalChat = payload
        },
        setGroupMessage: (state, {payload}) => {
            state.groupChat = payload
        },
        setConversation: (state, {payload}) => {
            state.userConversation = payload
        },
        setDeleteMessagesCon: (state, action) => {
            const { payload } = action;
            state.userConversation = state.userConversation.map(conversation => {
                if (conversation._id === payload._id) {
                    return payload;
                }
                return conversation;
            });
        },
        setDeleteMessagesPerAndGroup: (state, action) => {
            const { payload } = action;
            if (state.personalChat._id === payload._id && state.groupChat._id === payload._id) {
                state.personalChat = payload;
                state.groupChat = payload;
            } else if (state.personalChat._id === payload._id) {
                state.personalChat = payload;
            } else if (state.groupChat._id === payload._id) {
                state.groupChat = payload;
            }
        },
        setNotification: (state, {payload}) => {
            state.notification.push(payload);
        },
        setCheckNoti: (state, {payload}) => {
            state.notification = payload;
        },

    }
})

export const {setSingleUser, setPersonalMessage,
    setConversation, setNotification,
    setCheckNoti,
    setGroupMessage, setDeleteMessagesCon,
    setDeleteMessagesPerAndGroup
} = chatSlice.actions
export default chatSlice.reducer