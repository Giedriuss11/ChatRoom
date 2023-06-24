import React, { useEffect, useState } from 'react';
import "../pagesCss/AllUsers.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AllUserCard from "../components/AllUserCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { A11y, Scrollbar, Navigation, Pagination } from "swiper";
import removeSocket from "../plugins/disconnectUser"

const AllUsers = ({socket}) => {
    const nav = useNavigate();
    const usersData = useSelector(store => store.user.users);
    console.log(usersData)
    const userData = useSelector(store => store.user.user);
    const [slidesPerView, setSlidesPerView] = useState(3);

    const logout = () => {
        localStorage.clear();
        nav("/login");
    };

    useEffect(() => {
        if (usersData.length === 1) {
            setSlidesPerView(1);
        } else if (usersData.length === 2) {
            setSlidesPerView(2);
        } else {
            const updateSlidesPerView = () => {
                const width = window.innerWidth;
                if (width <= 650) {
                    setSlidesPerView(1);
                } else if (width <= 900) {
                    setSlidesPerView(2);
                } else {
                    setSlidesPerView(3);
                }
            };

            // Call the function initially
            updateSlidesPerView();

            // Add event listener to update slidesPerView on window resize
            window.addEventListener('resize', updateSlidesPerView);

            // Cleanup the event listener on component unmount
            return () => {
                window.removeEventListener('resize', updateSlidesPerView);
                removeSocket.disconnectSocket( socket, userData._id );
            };
        }


    }, [socket, usersData]);

    return (
        <div className="allUsers">
            <div className="profileToolBar">
                <div onClick={() => nav("/profile")}>Profile</div>
                <div onClick={() => nav("/allUsers")}>All Users</div>
                <div onClick={() => nav("/conversations")}>Conversations</div>
                {userData.username ? (
                    <div onClick={logout}>Logout</div>
                ) : (
                    <div onClick={() => nav("/login")}>Login</div>
                )}
            </div>

            <div className="allUsersCards">
                <Swiper
                    spaceBetween={50}
                    slidesPerView={slidesPerView}
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                    navigation
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    onSwiper={swiper => swiper}
                >
                    {usersData.map((x, i) => (
                        <SwiperSlide
                            style={{width: "300px"}}
                            className="d-flex a-center j-center" key={i}>
                            <AllUserCard socket={socket} item={x} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default AllUsers;


