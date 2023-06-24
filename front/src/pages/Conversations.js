import React, {useEffect} from 'react';
import "../pagesCss/Conversation.css"
import http from "../plugins/http";
import {setConversation} from "../features/chatReducer";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Message from "../components/Message";
import removeSocket from "../plugins/disconnectUser";

const Conversations = ({socket}) => {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const chat = useSelector(store => store.chat.userConversation)
    const userData = useSelector(store => store.user.user)

    useEffect(() => {
        async function fetchData() {
            const res = await http.postWithToken("findAllMyChats", {});
            if (res.success) {
                dispatch(setConversation(res.data.oldUser))
                removeSocket.disconnectSocket( socket, userData._id );
            }
        }
        fetchData()
    }, [socket])

    const navTo = async (id) => {
        nav(`/conversations/${id}`);
    }


    return (
        <div className="d-flex column">
            <div className="profileToolBar">
                <div onClick={() => nav("/profile")}>Profile</div>
                <div onClick={() => nav("/allUsers")}>All Users</div>
                <div onClick={() => nav("/conversations")}>Conversations</div>
            </div>

            <div className="userConBar">
                {chat &&
                    chat.map((x, i) => {
                        return x.usernameWhoReceive !== userData.username ? (
                            <div key={i} className="d-flex gap mt15">
                                <div onClick={() => navTo( x._id)}>
                                    <div
                                        style={{backgroundImage: `url("${x.imagePerson}")`}}
                                        className="flex personImage d-flex column a-center">
                                        <h4>{x.usernameWhoReceive}</h4>
                                    </div>
                                </div>
                                <div className="flex4 chat">
                                    {x.message && x.message.map((item,i) => <Message item={item} chatId={x._id}  key={i}/>)}
                                </div>
                            </div>
                        ) : (
                            <div key={i} className="d-flex gap mt15">
                                <div onClick={() => navTo(x._id)}>
                                    <div
                                        style={{backgroundImage: `url("${x.imageWhoSend}")`}}
                                        className="flex personImage d-flex column a-center">
                                        <h4>{x.usernameWhoSent}</h4>
                                    </div>
                                </div>
                                <div className="flex4 chat">
                                    {x.message && x.message.map((item,i) => <Message item={item} chatId={x._id} key={i}/>)}
                                </div>
                            </div>
                        );
                    })}
            </div>

        </div>
    );
};

export default Conversations;