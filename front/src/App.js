import './App.css';

import {Routes, Route} from "react-router-dom";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {io} from "socket.io-client"

import Register from "./pages/Register"
import Login from "./pages/Login"
import Profile from "./pages/Profile";
import AllUsers from "./pages/AllUsers";
import Conversations from "./pages/Conversations";
import SingleUserPage from "./components/SingleUserPage";
import Notification from "./pages/Notification";
import Chat from "./components/Chat";
import FrontPage from './pages/FrontPage';

import http from "./plugins/http";

import {setUser} from "./features/userReducer"
import {setUsers, setRegisterUser, changedUserDisplay} from "./features/userReducer"
import {setConversation, setPersonalMessage,
    setNotification, setGroupMessage,
    setDeleteMessagesCon, setDeleteMessagesPerAndGroup
} from "./features/chatReducer";



const socket = io("http://localhost:4002")


function App() {
    const dispatch = useDispatch()
    const token = sessionStorage.getItem("token")

    useEffect(() => {
        socket.on("personalNewMessage", data => {
            dispatch(setPersonalMessage(data))
        })
        socket.on("messageInGroup", data => {
            dispatch(setGroupMessage(data))
        })
        socket.on("newRegisterUser", data => {
            dispatch(setRegisterUser(data))
        })
        socket.on("allUser", data => {
            dispatch(changedUserDisplay(data))
        })
        socket.on("allMessage", data => {
            dispatch(setConversation(data))
        })
        socket.on("notifications", data => {
            dispatch(setNotification(data))
        })
        socket.on("messageUpdated", data => {
            dispatch(setDeleteMessagesCon(data))
            dispatch(setDeleteMessagesPerAndGroup(data))
        })
    }, [])
    useEffect(() => {
        async function fetchData() {
            if (token) {
                const res = await http.postWithToken("autoLogin", {ok: "ok"})
                if (res.success) {
                    dispatch(setUser(res.data.user))
                    dispatch(setUsers(res.data.allUsers))
                    socket.emit("addUser", res.data.user._id)
                }
            }
        }

        fetchData()

    }, [])


    return (
        <div>
            <Routes>
                <Route path='/' element={<FrontPage/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/login" element={<Login socket={socket}/>}/>
                <Route path="/profile" element={<Profile socket={socket}/>}/>
                <Route path="/allUsers" element={<AllUsers socket={socket}/>}/>
                <Route path="/conversations" element={<Conversations socket={socket}/>}/>
                <Route path="/allUsers/:id" element={<SingleUserPage socket={socket}/>}/>
                <Route path="/conversations/:id" element={<Chat socket={socket}/>}/>
                <Route path="/notification" element={<Notification socket={socket}/>}></Route>
            </Routes>
        </div>
    );
}

export default App;
