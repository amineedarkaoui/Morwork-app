import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function LoginPage() {
    const auth = useAuth()

    const [isLoading, setLoading] = useState(false)
    const [emailError, setEmailError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [formData, setData] = useState(
        {
            email:"",
            password:""
        }
    )

    const handleChange = (event) => {
        setData((prevData) => ({
            ...prevData,
            [event.target.name]: event.target.value
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setEmailError(null)
        setPasswordError(null)

        if (formData.email.length === 0) {
            setEmailError("Empty field!")
            return
        }
        if (formData.password.length === 0) {
            setPasswordError("Empty field!")
            return
        }

        
        setLoading(true)

        const body = await auth.loginAction(formData)
        console.log("status:  " + body.status)
        if (body.status == 401) {
            if (body.data.includes("password")) {
                setPasswordError(body.data)
            }
            if (body.data.includes("User")) {
                setEmailError(body.data)
            }
        }

        setLoading(false)

    }

    return (
        <div className="login-card radius elevation-1">
            <p className="logo">MorWork</p>
            <div className="login-fields">
                <p className="large-title">Login</p>
                <form className="login-fields" onSubmit={handleSubmit}>
                    <TextField 
                        variant="outlined" 
                        label="Email" 
                        type="email" 
                        name="email" 
                        onChange={handleChange} 
                        value={formData.email} 
                        error={emailError}
                        helperText={emailError}
                    />
                    <TextField 
                        variant="outlined" 
                        label="Password" 
                        type="password" 
                        name="password" 
                        onChange={handleChange} 
                        value={formData.password} 
                        error={passwordError}
                        helperText={passwordError}
                    />
                    
                    <LoadingButton 
                        className="auth-btn" 
                        color="primary" 
                        variant="contained" 
                        type="submit"
                        loading={isLoading}
                    >
                            Login
                    </LoadingButton>
                </form>
                
                <p className="no-acc">
                    no account?&nbsp;
                    <Link className="link" to="/sign-up">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}