import React, {useRef, useState} from 'react';
import Auth from "../pagesCss/Auth.css"
import {useNavigate} from "react-router-dom";
import http from "../plugins/http";

const Register = () => {
    const nav = useNavigate()
    const [error, setError] = useState("")
    const usernameRef = useRef()
    const passwordRef = useRef()
    const passwordTwoRef = useRef()
    const imageRef = useRef()

    const authentication = async () => {

        const userInfo = {
            image: imageRef.current.value,
            username: usernameRef.current.value,
            password: passwordRef.current.value,
            passwordTwo: passwordTwoRef.current.value,
        }

        if (userInfo.username.length > 20 || userInfo.username.length < 4)
            return setError("Username must be between 4 and 20 characters ")
        if (!/[!@#$%^&*_+]/.test(userInfo.password))
            return setError("Password should include at least one symbol ");
        if (!/[A-Z]/.test(userInfo.password))
            return setError("Password should include at least one uppercase character ");
        if (userInfo.password.length > 20 || userInfo.password.length < 4)
            return setError("Password must be between 4 and 20 characters")
        if (userInfo.password !== userInfo.passwordTwo)
            return setError("Password should match")

        if (userInfo.image === "") {
            userInfo.image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgtRCZxJGNSbC62Q0YHool1uGPaNRQY_huow&usqp=CAU"
        }

        const res = await http.post("register", userInfo)
        if (!res.success){
            setError(res.message)
        } else {
            setError("")
            usernameRef.current.value = ""
            passwordRef.current.value = ""
            passwordTwoRef.current.value = ""
            nav("/login")
        }
    }

    return (
        <div className="authPage">
            <div className="platform">
                <div className="login">Register</div>
                <div className="error">{error}</div>
                <div className="autoBordReg">
                    <div className="d-flex a-center column">
                        <input id="myInput" ref={imageRef} type="text" placeholder="Image"/>
                        <input id="myInput" ref={usernameRef} type="text" placeholder="Username"/>
                        <input id="myInput" ref={passwordRef} type="text" placeholder="Password"/>
                        <input id="myInput" ref={passwordTwoRef} type="text" placeholder="Password"/>
                        <button onClick={authentication}>Register</button>
                    </div>
                </div>
                <div className="login__bottomTxt d-flex a-center column">
                    <p>If you do not have an account you can <span onClick={() => nav("/login")}>Login</span></p>
                </div>
            </div>
        </div>
    );
};

export default Register;