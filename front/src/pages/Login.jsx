import React, {useRef, useState} from 'react';
import "../pagesCss/Auth.css"
import {useNavigate} from "react-router-dom";
import http from "../plugins/http";
import {useDispatch} from "react-redux";
import {setUser} from "../features/userReducer"
import { RiEyeCloseFill } from 'react-icons/ri';
import {LuEye} from "react-icons/lu"

const Login = ({socket}) => {
    const nav = useNavigate()
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const usernameRef = useRef()
    const passwordRef = useRef()
    const dispatch = useDispatch()

    const authentication = async () => {

        const userInfo = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        }

        if (userInfo.username.length > 20 || userInfo.username.length < 4)
            return setError("Username must be between 4 and 20 characters ")
        if (userInfo.password.length > 20 || userInfo.password.length < 4)
            return setError("Password must be between 4 and 20 characters")

        const res = await http.post("login", userInfo)
        if (!res.success){
            setError(res.message)
        } else {
            sessionStorage.setItem("token", res.data.token)
            dispatch(setUser(res.data.user))
            socket.emit("addUser", res.data.user._id)
            setError("")
            usernameRef.current.value = ""
            passwordRef.current.value = ""
            nav("/profile")
        }
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
      };

    return (
        <div className="authPage">
            <div className="platform">
                <div className="login">Login</div>
                <div className="error">{error}</div>
                <div className="autoBord">
                    <div className="d-flex a-center column">
                        <input id="myInput" ref={usernameRef} type="text" placeholder="Username"/>
                        <div className='d-flex' style={{width: "93%"}}>
                           <input className='flex4' id="myInput" ref={passwordRef} type={showPassword ? "text" : "password"} placeholder="Password"/>
                           <div className='iconShow d-flex j-center a-center' 
                           style={{marginLeft: "10px",
                           marginTop: "15px",
                           }}>
                             {showPassword && <LuEye onClick={handleTogglePassword} style={{ fontSize: "1.5rem"}} />}
                            {!showPassword && <RiEyeCloseFill onClick={handleTogglePassword} style={{ fontSize: "1.5rem" }} />}
                           </div>
                        </div>
                        
                        <button onClick={authentication}>LOG IN</button>
                    </div>
                </div>
                <div className="login__bottomTxt d-flex a-center column">
                    <p>If you do not have an account you can <span onClick={() => nav("/register")}>Register</span></p>
                </div>
            </div>
        </div>
    );
};


export default Login;