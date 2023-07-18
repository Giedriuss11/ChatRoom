import React from 'react'
import FrontTool from "../components/FrontToolBar"
import FrontMiddle from "../components/FrontMiddle"
import FrontFooter from '../components/FrontFooter';


const FrontPage = () => {
  return (
      <div style={{overflow: "hidden"}} className='Front-page '>
        <div>
          <div className="white-gradient"/>
          <FrontTool/>
          <FrontMiddle/>
          <FrontFooter/>
        </div>
        
      </div>

  );
}

export default FrontPage