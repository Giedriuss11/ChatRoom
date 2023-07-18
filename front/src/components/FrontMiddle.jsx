import React from 'react'
import '../pagesCss/FrontMiddle.css'
import firstImage from "../image/FirstImage.jpg"
import secondImage from "../image/secondImage.jpg"
import ThirdImage from "../image/thirdImage.jpg"

const FrontPStyles = () => {
  return (
    <section className='front-wrapper'>
        <div className="paddings innerwidth flexCenter front-container ">
            {/* left side */}
            <div className="left flexColStart">
                <div className="title">
                    <div className="orange-circle"/>
                    <h1>
                        Hello there!
                    </h1>
                </div>
                <div className="description flexColStart">
                    <span>
                        Welcome to Chatterbox, your ultimate destination for conversations and connections.
                    </span>
                    <span>
                        Chat with friends, family, and chat with people around the world.
                    </span>
                    <span>
                        Discover and join communities tailored to your interests, hobbies, or professional aspirations.
                    </span>
                </div>
            </div>
            {/* right side */}
            <div className="flexCenter right">
                <div className="image-container1">
                    <img style={{height:"100%", width:"100%", objectFit:"cover"}} src={firstImage} alt="" />
                </div>
                <div className="image-container2">
                    <img style={{height:"100%", width:"100%", objectFit:"cover"}} src={secondImage} alt="" />
                </div>
                <div className="image-container3">
                    <img style={{height:"100%", width:"100%", objectFit:"cover"}} src={ThirdImage} alt="" />   
                </div>
            </div>
        </div>
    </section>
  )
}

export default FrontPStyles