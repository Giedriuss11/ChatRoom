import React, {useEffect, useState} from 'react';
import "../pagesCss/Notification.css"
import http from "../plugins/http";
import {useNavigate} from "react-router-dom";
import removeSocket from "../plugins/disconnectUser";
import {useSelector} from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';


const Notification = ({socket}) => {
    const [dataNotification, setDataNotification] = useState(null)
    const userData = useSelector(store => store.user.user)
    const nav = useNavigate()

    useEffect(() => {
        async function fetchData() {

            const res = await http.postWithToken("notifications", {});
            if (res.success) {
                setDataNotification(res.data.noti)
                removeSocket.disconnectSocket( socket, userData._id );
            }
        }
        fetchData()
    }, [socket])
    const joinInGroup = async (inv, idChat) => {
        const res = await http.postWithToken("joinInChat", {inv})
        if (res.success){
            nav(`/conversations/${idChat}`)
        }
    }

    const deleteNoti = async (id) => {
        const res = await http.postWithToken("deleteNoti", {id})
        if (res.success){
            setDataNotification(res.data.noti)
        }
    }

    return (
        <div className="noti__Container d-flex column">
            <div className="flex d-flex column ">
                <div className="noti__back">
                    <div onClick={() => nav("/profile")}>Profile</div>
                </div>
                <div className="d-flex a-center j-center">
                   <h1>All notifications</h1>
                </div>
            </div>
            <div className="flex6 d-flex a-center j-center">
                <div className="user__AllNotifications">
                    {dataNotification && dataNotification.map((x,i) =>
                        <div key={i} className="noti__newMes">
                            <div
                                style={{cursor: "pointer"}}
                                className="d-flex a-center">
                                <FontAwesomeIcon
                                    onClick={() => deleteNoti(x._id)}
                                    icon={faTrashCan}/>
                            </div>
                            <div className="noti__image">
                                <img
                                    onClick={() => nav(`/conversations/${x.invitationId}`)}
                                    src={x.image} alt=""
                                    style={{
                                        cursor: "pointer"
                                    }}
                                />
                            </div>
                            <div>
                                Sent you a message:
                                <p
                                    style={{
                                        backgroundColor: "#6f6fd3"
                                    }}
                                    className="noti__message"
                                >
                                    {x.message}  {x.invitation && <span onClick={() => joinInGroup(x.invitationId, x.idToLogin)} > {x.invitation}</span>}
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </div>
    );
};

export default Notification;