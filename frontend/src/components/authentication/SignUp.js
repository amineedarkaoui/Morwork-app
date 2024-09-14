import { Alert, Button, TextField } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../../auth/AuthProvider";

export default function SignUp() {
    const auth = useAuth()
    const [isLoading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)
    const [formData, setFormData] = useState({
        firstname:"",
        lastname:"",
        email:"",
        password:"",
        confirm:"",
    })
    const [error, setError] = useState({
        firstname:"",
        lastname:"",
        email:"",
        password:"",
        confirm:"",
    })

    const handleChange = event => {
        setFormData(prevData => ({
            ...prevData,
            [event.target.name]:event.target.value
        }))
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault()

        setAlert(null)
        Object.keys(error).map(key => {
            setError(prevError => ({
                ...prevError,
                [key]: ""
            }))
        })

        let empty = false
        Object.keys(formData).map(key => {
            if (formData[key].length === 0) {
                setError(prevError => ({
                    ...prevError,
                    [key]:"Please fill up this field"
                }))
                empty = true
                
            }
        })
        if (empty) {return}

        if (formData.password !== formData.confirm) {
            setError(prevError => ({
                ...prevError,
                confirm:"Passwords don't match"
            }))
            return
        }
        
        setLoading(true)
        const requestData = {
            firstname:formData.firstname,
            lastname:formData.lastname,
            email:formData.email,
            password:formData.password,
        }
        const res = await auth.register(requestData)
        if (res instanceof Error) {
            console.log(res.response)
            setAlert(res.response.data)
        }
        setLoading(false)

    }


    return ( 
        <div className="login-card radius elevation-1">
            <p className="logo">MorWork</p>
            <form onSubmit={handleSubmit} className="login-fields">
                <p className="large-title">Sign up</p>
                <div className="name-cont">
                    <TextField 
                        className="field" 
                        variant="outlined" 
                        label="First name" 
                        name="firstname"
                        value={formData.firstname}
                        error={error.firstname}
                        helperText={error.firstname}
                        onChange={handleChange}
                    />
                    <TextField 
                        className="field" 
                        variant="outlined" 
                        label="Last name" 
                        name="lastname"
                        value={formData.lastname}
                        error={error.lastname}
                        helperText={error.lastname}
                        onChange={handleChange}
                    />
                </div>
                <TextField 
                    variant="outlined" 
                    label="Email" 
                    type="email" 
                    name="email"
                    value={formData.email}
                    error={error.email}
                    helperText={error.email}
                    onChange={handleChange}
                />
                <TextField 
                    variant="outlined" 
                    label="Password" 
                    type="password" 
                    name="password"
                    value={formData.password}
                    error={error.password}
                    helperText={error.password}
                    onChange={handleChange}
                />
                <TextField 
                    variant="outlined" 
                    label="Confirm password" 
                    type="password" 
                    name="confirm"
                    value={formData.confirm}
                    error={error.confirm}
                    helperText={error.confirm}
                    onChange={handleChange}
                />
                {alert && 
                    <Alert
                        severity="error"
                    >
                        {alert}
                    </Alert>
                }
                <LoadingButton 
                    className="auth-btn next" 
                    color="primary" 
                    variant="contained"
                    type="submit"
                    loading={isLoading}
                >
                    Sign up
                </LoadingButton>
                <p className="no-acc">
                    already have an account?&nbsp;
                    <Link className="link" to="/login">
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    )
}