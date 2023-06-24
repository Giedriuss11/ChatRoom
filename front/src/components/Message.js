import React from 'react';
import http from "../plugins/http";
import "../pagesCss/Conversation.css"
import {setDeleteMessagesCon} from "../features/chatReducer";
import {useDispatch} from "react-redux";

const Message = ({item, chatId}) => {
    const dispatch = useDispatch()


    const messageDel = async () => {
        const res = await http.postWithToken("deleteMessage",
            {id: item.messageId, chatId})
        if (res.success){
            dispatch(setDeleteMessagesCon(res.data))
        }
    }

    return (
        <div className="d-flex a-center j-btw">
            <div className="senderMessage d-flex">
                <div className="senderName">{item.sender}</div>
                <p
                    style={{
                        backgroundColor: "#6f6fd3",
                        borderRadius: "10px 10px 10px 10px",
                        marginLeft: "10px"
                    }}
                    className="message"
                >
                    {item.message}
                </p>
            </div>
            <div>
                <button
                    style={{
                        cursor: "pointer",
                        padding: "3px",
                        borderRadius: "10px"
                }} onClick={messageDel}>Delete message</button>
            </div>
        </div>
    );
};

export default Message;