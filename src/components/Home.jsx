import React from 'react'
import { Link,useNavigate } from 'react-router-dom';
import image from '../assets/face.png'
import camera from '../assets/camera.png'
import computer from '../assets/computer.png'
import image2 from '../assets/2.png'


const Home = () => {

  let navigate = useNavigate()

  const clickLogout = () => {
      localStorage.removeItem('token')
      navigate('/login')
  }

  return (
    <>
      <div className='home-main'>
        <h1 className='py-2' style={{ fontSize: "3rem" }}>ONLINE EXAMS MADE FAIRER</h1>
        <p className='py-2' style={{ fontSize: "1rem" }}>Detect cheating in online exams with the power of Artificial Intelligence & Machine Learning</p>
        {!localStorage.getItem('token') ? <Link type="button" className="btn btn-info" to="/Login">Log In</Link>: <button onClick={clickLogout} className='btn btn-primary'>Logout</button>}
      </div>

      {/* Features Section */}

      <h2 className='mx-3'>Features</h2>
      <div className='container-fluid d-flex align-items-center flex-wrap justify-content-center'>

        <div className='box my-2 mx-2 shadow-sm p-3 mb-5 bg-body-tertiary rounded'>
          <img src={image} alt='image' style={{ height: "50px", width: "50px" }}></img>
          <h3>AI Face Detection</h3>
          <p>Advance AI and ML to detect cheating by tracking student’s facial movements</p>
        </div>

        <div className='box mx-2 my-2 shadow-sm p-3 mb-5 bg-body-tertiary rounded'>
          <img src={computer} style={{ height: "50px", width: "50px" }}></img>
          <h3>Blocks Screen Capture</h3>
          <p>The mobile version of the app blocks any form of screen capture</p>
        </div>

        <div className='box mx-2 my-2 shadow-sm p-3 mb-5 bg-body-tertiary rounded'>
          <img src='https://anti-cheat-exam-app.vercel.app/images/icon/cross_icon.svg' alt='image' style={{ height: "50px", width: "50px" }}></img>
          <h3>Blocks App Exit</h3>
          <p>The user cannot exit the app or change tab during exam</p>
        </div>

        <div className='box mx-2 my-2 shadow-sm p-3 mb-5 bg-body-tertiary rounded'>
          <img src='https://anti-cheat-exam-app.vercel.app/images/icon/assesment_icon.svg' alt='image' style={{ height: "50px", width: "50px" }}></img>
          <h3>Assesment and Auditing</h3>
          <p>Support for instant assessment and auditing</p>
        </div>

        <div className='box mx-2 my-2 shadow-sm p-3 mb-5 bg-body-tertiary rounded'>
          <img src={camera} alt='image' style={{ height: "50px", width: "50px" }}></img>
          <h3>Video Proctoring</h3>
          <p>Support for live video proctoring (future support)</p>
        </div>
      </div>

      <h2 className='mx-3'>Contact Us</h2>

      <section className="contact-section">
        <div className="contact-form">
          <input type="text" placeholder="Name" required />
          <input type="email" placeholder="Email" required />
          <textarea placeholder="Message" required></textarea>
          <button type="submit">SEND</button>
        </div>
      </section>


      {/* footer */}
      <div className="App">
        <footer className="footer">
          <nav className="footer-nav">
            <a href="/" className="footer-link">Home</a>
            <a href="/" className="footer-link">Features</a>
            <img src={image2} alt='logo' style={{ height: "50px", width: "50px" }}></img>
            <a href="/" className="footer-link">FAQs</a>
            <a href="https://harshpagada.netlify.app" target='_blank' className="footer-link">About</a>
          </nav>
          <div className="footer-copyright">
            <hr />
            &copy; 2024-2025 Anti-Cheat
          </div>
        </footer>
      </div>

    </>
  )
}

export default Home
