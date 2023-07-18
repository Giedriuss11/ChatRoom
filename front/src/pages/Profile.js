import React, {useEffect, useRef, useState} from 'react';
import "../pagesCss/Profile.css"
import {useDispatch, useSelector} from "react-redux";
import http from "../plugins/http";
import {setUser, setUsers} from "../features/userReducer"
import {useNavigate} from "react-router-dom";
import {setCheckNoti} from "../features/chatReducer";
import removeSocket from "../plugins/disconnectUser";


const Profile = ({socket}) => {
    const nav = useNavigate()

    const imageRef = useRef()
    const usernameRef = useRef()
    const oldPasswordRef = useRef()
    const passwordRef = useRef()
    const passwordTwoRef = useRef()


    const userData = useSelector(store => store.user.user)
    const userNotification = useSelector(store => store.chat.notification)
    const [error, setError] = useState("")
    const [error1, setError1] = useState("")
    const [error2, setError2] = useState("")
    const dispatch = useDispatch()

    useEffect(() =>{
        removeSocket.disconnectSocket( socket, userData._id );
    },[socket])


    const changes = async (change) => {

        if (change){
            const image = imageRef.current.value

            if (image === "") return  setError("You need set your image")

            const res = await http.postWithToken("changePicture", {image})
            if (res.success){
                dispatch(setUser(res.data.user))
                imageRef.current.value = ""
                setError("")
            }

        } else {
            const passwords = {
                oldPassword: oldPasswordRef.current.value,
                password: passwordRef.current.value,
                passwordTwo: passwordTwoRef.current.value,
            }

            const res = await http.postWithToken("changePassword", {passwords})
            if (!res.success){
                setError1(res.message)
            } else {
                dispatch(setUser(res.data.user))
                setError1("")
                oldPasswordRef.current.value = ""
                passwordRef.current.value = ""
                passwordTwoRef.current.value = ""
            }
        }
    }
    const changeUsername = async () => {
        const username = usernameRef.current.value
        if (username.length > 20 || username.length < 4)
            return setError2("Username must be between 4 and 20 characters ")
        const res = await http.postWithToken("changeUsername", {username})
        if (!res.success){
            setError2(res.message)
        } else {
            dispatch(setUser(res.data.user))
            usernameRef.current.value = ""
            setError2("")
        }
    }
    const logout = () => {
        localStorage.clear()
        nav("/login")
    }
    const allUsers = async () => {
        const res = await http.postWithToken("autoLogin",{ok:"ok"})
        if (res.success) {
            dispatch(setUsers(res.data.allUsers))
        }
        nav("/allUsers")
    }
    const checkNotification = () => {
        nav("/notification");
        dispatch(setCheckNoti([]))
    }

    return (
        <div className="profile">
            <div className="profileToolBar">
                <div onClick={checkNotification}>Notifications<span>{userNotification.length === 0 ? "": userNotification.length}</span></div>
                <div onClick={() => nav("/profile")}>Profile</div>
                <div onClick={allUsers}>All Users</div>
                <div onClick={() => nav("/conversations")}>Conversations</div>
                {userData.username ?
                    <div onClick={logout}>Logout</div> :
                    <div onClick={() => nav("/login")}>login</div>
                }
            </div>

            <div className="d-flex">

                <div className="flex userPageToolBar">
                    <div className="flex d-flex b-box p20 column a-center">
                        <div style={{backgroundImage: `url("${userData.image}")`}} className="img"></div>
                        <h3>{userData.username}</h3>
                    </div>
                </div>

                <div className="flex4 d-flex">
                    <div className="flex4">
                        {userData.username &&
                            <div className="flex userPageLayout">
                                <h1 className="m-d-none">Profile</h1>
                                <h2 className="m-block d-none">Profile</h2>
                                <div className="changeImage">
                                    <div className="error1">{error}</div>
                                    <h3 className="m-d-none">Change profile picture</h3>
                                    <div className="m-block d-none">Change profile picture</div>
                                    <div className="d-flex column">
                                        <input ref={imageRef} type="text" placeholder="Change profile picture"/>
                                        <button className="button" onClick={() => changes(true)}>Change</button>
                                    </div>
                                </div>
                                <div className="changePassword">
                                    <div className="error1">{error1}</div>
                                    <h3 className="m-d-none">Change password</h3>
                                    <div className="m-block d-none">Change password</div>
                                    <input ref={oldPasswordRef} type="password" placeholder="Old password"/>
                                    <input ref={passwordRef} type="password" placeholder="New password"/>
                                    <input ref={passwordTwoRef} type="password" placeholder="New password"/>
                                    <button style={{marginTop: "10px"}} className="button" onClick={() => changes(false)}>Change</button>
                                </div>
                                <div style={{marginTop: "20px"}} className="changeImage">
                                    <div className="error1">{error2}</div>
                                    <h3 className="m-d-none">Change username</h3>
                                    <div className="m-block d-none">Change profile picture</div>
                                    <div className="d-flex column">
                                        <input ref={usernameRef} type="text" placeholder="Change username"/>
                                        <button className="button" onClick={changeUsername}>Change</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Profile;




