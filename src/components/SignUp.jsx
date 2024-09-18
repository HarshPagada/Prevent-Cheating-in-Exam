import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const SignUp = (props) => {

    const [credentials, setCredentials] = useState({
        id: "", name: "", email: "", password: ""
    });

    let navigate = useNavigate()
    // console.log(navigate)

    const handlesubmit = async (e) => {
        try {
            e.preventDefault();
            const { id, name, email, password } = credentials;
            const response = await fetch("http://localhost:5000/auth/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id:id, name:name, email:email, password:password }),
            })
            const json = await response.json();
           
            if (json.msg.success) {
                console.log(json)
                window.localStorage.setItem('token', json.msg.authToken)
                props.setLoggedInUser(id);           
                navigate('/')
            } else {
                console.log("not success")
            }
        } catch (error) {
            console.error("Error during signup:", error);
        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
      }

    return (
        <>
            <div className=" d-flex align-items-center flex-column">
                <h1>Create an Account</h1>
                <form className="w-50" onSubmit={handlesubmit}>
                    <div className="mb-3">
                        <label htmlFor="cpassword" className="form-label">Student Id</label>
                        <input type="number" className="form-control" onChange={onChange} value={credentials.id} name="id" minLength={5} id="id" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" onChange={onChange} value={credentials.name} id="name" name="name" autoComplete="off" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" onChange={onChange} value={credentials.email} id="email" name="email" aria-describedby="emailHelp" autoComplete="off" required />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" onChange={onChange} value={credentials.password} name="password" minLength={5} id="password" required />
                    </div>

                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
                <p className="text-center my-3">Copyright &copy; 2024-2025 &mdash; Anti Cheat - Already have an account <Link to='/login'>Login</Link></p>
            </div>
        </>
    )
}

export default SignUp
