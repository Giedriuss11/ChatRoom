import React from 'react'
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import img1 from "../image/img1.png"
import img2 from "../image/img2.png"
import img3 from "../image/img3.png"
import img4 from "../image/img4.png"
import img5 from "../image/img5.png"

const FrontFooter = () => {
    const images = [
        [img1, img2], // Group two images per slide
        [img3, img4],
        [img5, img1], // Example with wrapping back to the first image
      ];
    
      return (
            <Carousel
          autoPlay
          infiniteLoop
          interval={3000}
          showArrows={2}
          showStatus={false}
          showThumbs={false}
        >
          {images.map((imageGroup, index) => (
        <div style={{ height: "8.5rem", width: "100%" }} key={index}>
          {/* Render two images per slide */}
          <div style={{ display: 'flex', height: '100%', width: '100%' }}>
            <img style={{ height: '100%', flex: 1, marginRight: '1px' }} src={imageGroup[0]} alt={`Slide ${index}`} />
            <img style={{ height: '100%', flex: 1, marginLeft: '1px' }} src={imageGroup[1]} alt={`Slide ${index}`} />
          </div>
        </div>
      ))}
        </Carousel> 
      );
}

export default FrontFooter