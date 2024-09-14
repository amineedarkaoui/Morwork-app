import React, { useState } from "react";
import PopupWindow from "../main-components/PopupWindow";
import { Alert, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { updateAbout } from "../../api/app";

export default function EditAbout(props) {
    const [isLoading, setLoading] = useState(false)
    const [content, setContent] = useState(props.content)
    const [error, setError] = useState(false)

    const handleChange = (event) => {
        setContent(event.target.value)
    }

    const hideWindow = () => {
        setContent(props.content)
        props.hideWindow()
    }
    
    const saveAbout = async () => {
        setError(false)
        setLoading(true)
        const res = await updateAbout(content)
        if (res instanceof Error) {
            setError(true)
        } else {
            props.updateProfile()
            hideWindow()
        }

        setLoading(false)
    }

    return(
        <PopupWindow 
            isVisible={props.isVisible}
            hide={hideWindow}
            title="Edit your about section"
        >
            <div style={{display:"flex", flexDirection:"column", margin:"20px 20px"}}>
                <label style={{marginTop:10, marginBottom:4}} htmlFor="about" className="medium-label">About you</label>
                <TextField 
                    id="about"
                    fullWidth
                    multiline
                    variant="standard"
                    placeholder="What do you want people to know about you?"
                    value={content}
                    onChange={handleChange}
                    maxRows={16}
                />
                {
                    error &&
                    <Alert 
                        style={{marginTop:10}} 
                        severity="error" 
                        variant="text" 
                        color="red"
                    >
                        An error has occured, try again
                    </Alert>
                }
                
            </div>
            <div style={{margin:10, marginTop:20, display:"flex", justifyContent: 'end'}}>
                    <LoadingButton 
                        loading ={isLoading}
                        variant="contained"
                        endIcon={<Save/>} 
                        onClick={saveAbout}
                    >
                        Save
                    </LoadingButton>
                </div>
        </PopupWindow>
    )
}