import React, {useEffect, useRef, useState} from 'react';
import "../pagesCss/SingleUserPage.css"
import http from "../plugins/http";
import {useNavigate, useParams} from "react-router-dom";
import {setSingleUser, setPersonalMessage} from "../features/chatReducer";
import {useDispatch, useSelector} from "react-redux";
import removeSocket from "../plugins/disconnectUser";


const SingleUserPage = ({socket}) => {

    const singleUser = useSelector(store => store.chat.user)
    const userMessage = useSelector(store => store.chat.personalChat)
    const userData = useSelector(store => store.user.user)
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

            const res = await http.postWithToken("personalChat", { id });
            if (res.success) {
                socket.emit("addUser", userData._id)
                dispatch(setPersonalMessage(res.data.userMessage))
                dispatch(setSingleUser(res.data.oldUser))
            }

            setIsLoading(false); // Set loading state to false once the data is fetched
        }

        fetchData();
    }, [socket, userData._id, id, dispatch]);

    const send = async () => {
        const newMessage = {
            message: messageRef.current.value,
            id,
            username: userData.username,
            senderId: userData._id,
            image: userData.image
        }

        if (newMessage.message === "") return

        const res = await http.postWithToken("personaMessage", {newMessage})
        if (res.success) {
            dispatch(setPersonalMessage(res.data))
            messageRef.current.value = ""
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
                    <div className="navigate__SinglePage" onClick={() => nav("/allUsers")}>Home page</div>
                </div>
                <div
                    style={{
                        padding: "10px 60px"
                    }}
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
                                            justifyContent: x.sender === singleUser.username ? "flex-start" : "flex-end"
                                        }}>
                                        <div
                                        style={{
                                            display: "flex",
                                            gap: "5px",
                                            backgroundColor: "white",
                                            flexDirection: x.sender === singleUser.username ? "row" : "row-reverse",
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
                                            <div>
                                                <p
                                                style={{
                                                    backgroundColor: x.sender === singleUser.username ? "#6f6fd3" : "#D0D0D0",
                                                    borderRadius: x.sender === singleUser.username ? "10px 10px 10px 0" : "10px 10px 0 10px"
                                                }}
                                                className="message"
                                                >
                                                    {x.message}
                                                </p>
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
                </div>
            </div>
    );
};

export default SingleUserPage;

