import React, {useEffect, useRef, useState} from 'react';
import "../pagesCss/SingleUserPage.css"
import http from "../plugins/http";

import {useNavigate, useParams} from "react-router-dom";
import {setSingleUser, setGroupMessage} from "../features/chatReducer";
import {useDispatch, useSelector} from "react-redux";



const Chat = ({socket}) => {
    const invitationRef = useRef()
    const singleUser = useSelector(store => store.chat.user)
    const userMessage = useSelector(store => store.chat.groupChat)
    const userData = useSelector(store => store.user.user)
    const [likeCom, setLikeCom] = useState(null)
    const [isLoading, setIsLoading] = useState(true);

    const nav = useNavigate();
    const {id} = useParams()
    const dispatch = useDispatch()
    const messageRef = useRef()


    useEffect(() => {
        async function fetchData() {
            setIsLoading(true); // Set loading state to true initially

            if (socket && userData._id) {
                socket.emit("addUser", userData._id);
            } else {
                setIsLoading(false); // Set loading state to false if userData._id is null
                return;
            }
            const res = await http.postWithToken("groupChats", {id});
            if (res.success) {
                socket.emit("addUser", userData._id)
                dispatch(setGroupMessage(res.data.userMessage))
                dispatch(setSingleUser(res.data.oldUser))
            }
            setIsLoading(false); // Set loading state to false once the data is fetched
        }
        fetchData()
    }, [socket, userData._id, id, dispatch])

    const send = async () => {

        if (userData._id === userMessage.id) {
            const newMessage = {
                messageId: id,
                message: messageRef.current.value,
                id: userMessage.senderId,
                username: userData.username,
                senderId: userData._id,
                image: userData.image
            }

            if (newMessage.message === "") return
            const res = await http.postWithToken("groupChatMessage", {newMessage})
            if (res.success) {
                dispatch(setGroupMessage(res.data))
                messageRef.current.value = ""
            }
        } else {
            const newMessage = {
                messageId: id,
                message: messageRef.current.value,
                id: userMessage.id,
                username: userData.username,
                senderId: userData._id,
                image: userData.image
            }

            const res = await http.postWithToken("groupChatMessage", {newMessage})
            if (res.success) {
                dispatch(setGroupMessage(res.data))
                messageRef.current.value = ""
            }
        }

    }
    const like = async (index) => {
        const like = {
            postId: id,
            index: index,
            username: userData.username
        }

        const res = await http.postWithToken("likeMessage", {like})
        if (res.success) {
            dispatch(setGroupMessage(res.data))
        }
    }
    const chatInvitation = async () => {
        const inv = {
            userInv: invitationRef.current.value,
            invitation: userMessage._id,
            image: userData.image
        }

       const res = await http.postWithToken("invitation", {inv})
        if (res.success){
            invitationRef.current.value = ""
        }
    }

    if (isLoading) {
        return <div>Loading...</div>; // Display a loading state
    }

    return (
        <div className="container">

            <div
                style={{backgroundImage: "linear-gradient(45deg, #fbda61, #ff5acd)",
                    justifyContent: "space-between"
                }}
                className="flex d-flex a-center">
                <div style={{display: "flex"}}>
                    <div className="msg-header-img">
                        <img src={singleUser.image} alt=""/>
                    </div>
                    <div className="active">
                        <h4>{singleUser.username}</h4>
                    </div>
                </div>
                <div className="navigate__SinglePage" onClick={() => nav("/conversations")}>Conversations</div>
            </div>
            <div
                className="inner-box flex6">
                <div>
                    {userMessage &&
                        userMessage.message &&
                        userMessage.message
                            .map((x, i) =>
                                <div
                                    key={i}
                                    style={{
                                        display: "flex",
                                        gap: "2px",
                                        justifyContent: x.sender !== userData.username ? "flex-start" : "flex-end"
                                    }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "5px",
                                            backgroundColor: "white",
                                            flexDirection: x.sender !== userData.username  ? "row" : "row-reverse",
                                            maxWidth: "50%"
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "end"
                                            }}>
                                            <div className="userImage">
                                                <img src={x.senderImage} alt=""/>
                                            </div>
                                        </div>
                                        <div
                                            onMouseOver={() => setLikeCom(i)}
                                            onMouseOut={() => setLikeCom(null)}
                                        >
                                            <p
                                                style={{
                                                    backgroundColor: x.sender !== userData.username  ? "#6f6fd3" : "#D0D0D0",
                                                    borderRadius: x.sender !== userData.username  ? "10px 10px 10px 0" : "10px 10px 0 10px"
                                                }}
                                                className="message"
                                            >
                                                {x.message}
                                            </p>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: x.sender !== userData.username  ? "": "column",
                                                    justifyContent: "end",
                                                    cursor: "pointer"
                                                }}>
                                                {x.like.length > 0 ? (
                                                    (
                                                        <img
                                                            onClick={() => like(i)}
                                                            width="28"
                                                            height="28"
                                                            src="https://img.icons8.com/fluency/48/love-circled.png"
                                                            alt="love-circled"
                                                        />
                                                    )
                                                ) : (
                                                    likeCom === i && x.sender !== userData.username && (
                                                        <img
                                                            onClick={() => like(i)}
                                                            width="28"
                                                            height="28"
                                                            src="https://img.icons8.com/fluency/48/love-circled.png"
                                                            alt="love-circled"
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                </div>
            </div>
            <div
                style={{backgroundImage: "linear-gradient(45deg, #fbda61, #ff5acd)"}}
                className="flex d-flex a-center gap">
                <div style={{width: "80%"}} >
                    <input
                        className="text-input"
                        style={{width: "100%", backgroundColor: "whitesmoke",}}
                        ref={messageRef} type="text"
                        placeholder={"Type in your message..."} />
                </div>
                <div onSubmit={send} style={{padding: "5px"}}  >
                    <button onClick={send}  className="btnBg" style={{border: "none", borderRadius: "0 10px 0 10px" }} >Send</button>
                </div>
                <div>
                    <input
                        style={{width: "80%", backgroundColor: "whitesmoke",}}
                        ref={invitationRef} type="text"/>
                    <button
                        style={{borderRadius: "10px"}}
                        onClick={chatInvitation}>sent invitation</button>
                </div>
            </div>
        </div>
    );
};

export default Chat;