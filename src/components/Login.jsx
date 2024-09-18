import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = (props) => {

    const [credentials, setCredentials] = useState({
        stud_id: "", password: ""
    });

    let history = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();
    
        const { stud_id, password } = credentials;
    
        if (!stud_id || !password) {
            console.error("ID or password is missing");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:5000/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ stud_id, password }),
            });
    
            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status}`);
                const errorResponse = await response.json();
                console.error('Error response:', errorResponse);
                return;
            }
    
            const json = await response.json();
    
            console.log('Login Response:', json);
    
            if (json.msg.success) {
                window.localStorage.setItem('token', json.msg.authToken);
                props.setLoggedInUser(stud_id); 
                history('/');
            } else {
                console.log("Login failed:", json.msg || "Unknown error");
            }
        } catch (error) {
            console.error("Error during login:", error);
        }
    }
    

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }

    return (
        <>
            <form onSubmit={handlesubmit}>
                <section className="fire my-4">
                    <div className="h-50">
                        <div className="row justify-content-sm-center h-100">
                            <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
                                <div className="card shadow-lg">
                                    <div className="card-body p-5">
                                        <h1 className="fs-2 card-title text-center fw-bold mb-4">Login</h1>
                                        <div className="mb-3">
                                            <label className="mb-2 text-muted" htmlFor="email">student ID</label>
                                            <input id="id" onChange={onChange} value={credentials.stud_id} type="number" className="form-control" name="stud_id" autoComplete="off" required />
                                        </div>

                                        <div className="mb-3">
                                            <div className="mb-2 w-100">
                                                <label className="text-muted" htmlFor="password">Password</label>
                                            </div>
                                            <input id="password" onChange={onChange} value={credentials.password} type="password" className="form-control" name="password" required />
                                        </div>

                                        <div className="d-flex align-items-center">
                                            <button type="submit" className="btn btn-primary ">
                                                Login
                                            </button>
                                        </div>
                                        <Link className="d-flex justify-content-end" aria-current="page" to="#">Forgot Password?</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </>
    )
}

export default Login
