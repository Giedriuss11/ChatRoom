import React from 'react';
import "../pagesCss/AllUsers.css"
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";


const AllUserCard = ({item, socket}) => {
    const navigate = useNavigate()
    const userData = useSelector(store => store.user.user)


    const nav = async (id) => {
        socket.emit("addUser", userData._id );
        navigate(`/allUsers/${id}`);
    }

    return (
        <div onClick={() => nav(item._id)} className="card">
            <div className="imgBx">
                <img src={item.image} alt=""/>
            </div>
            <div className="content">
                <div className="details">
                    <h2>{item.username}</h2>
                </div>
            </div>
        </div>
    );
};

export default AllUserCard;



