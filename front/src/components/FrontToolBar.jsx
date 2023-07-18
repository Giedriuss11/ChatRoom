import React from 'react'
import "../pagesCss/FrontToolBar.css"
import { Link } from 'react-router-dom';
import image from '../image/chat-logo.png'


import FrontP from "./FrontMiddle"


const FrontPage = () => {
  return (
      <section className='h-wrapper'>
      <div className="flexCenter paddings innerWidth frontpage-container">
        <img src={image} alt="logo" width={100} />
        <div className='h-menu flexCenter'>
        <Link className='button-frInner' to="/login">Login</Link>
        <Link className='button-fr' to="/register">Sign up</Link>
        </div>
    </div>
      </section>

  );
}

export default FrontPage