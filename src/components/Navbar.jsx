import React from 'react'
import logo from '../assets/2.png'
import { Link,useNavigate } from 'react-router-dom'

const Navbar = () => {

    let navigate = useNavigate()

    const clickLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <div className='sticky-top'>
            <nav className="navbar navbar-expand-lg bg-secondary">
                <div className="container-fluid">
                    <Link className="navbar-brand fw-bold text-white" to="/">
                        <img src={logo} alt='logo' style={{height: "auto", width: "50px"}} className='mx-2'></img>Don't Cheat</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link text-white" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/exam">Exam</Link>
                            </li>
                        </ul>
                        {!localStorage.getItem('token') ? <Link type="button" class="btn btn-info" to="/SignUp">Sign Up</Link> : <button onClick={clickLogout} className='btn btn-primary'>Logout</button>}
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar
