import React from 'react'
import { Button } from 'react-bootstrap'
import { FaWhatsapp } from 'react-icons/fa'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Floatbutton = () => {
  return (
    <div>
        
          {/* Social Icons */}
        <div
          className="position-fixed 
          top-50 end-0 translate-middle-y p-2 
          rounded-start-4 d-flex flex-column 
          align-items-center fs-5"
          style={{ zIndex: 1000, background: "#9b1c1f" }}
        >
          <a href="#" className="text-white my-2"><FaFacebookF /></a>
          <a href="#" className="text-white my-2"><FaTwitter /></a>
          <a href="#" className="text-white my-2"><FaInstagram /></a>
          <a href="#" className="text-white my-2"><FaLinkedinIn /></a>
        </div>

      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        <Button variant="success" size="sm">
          GET 10% OFF
        </Button>
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Button variant="success" size="lg">
          <FaWhatsapp />
        </Button>
      </div>
    </div>
  )
}

export default Floatbutton