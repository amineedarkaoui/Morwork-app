import React, { useState } from "react";
import PopupWindow from "../main-components/PopupWindow";
import { Alert, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { updateAbout, updateDescription } from "../../api/app";

export default function EditDescription(props) {
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
        const res = await updateDescription(content, props.id)
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
            title="Update organization's description"
        >
            <div style={{display:"flex", flexDirection:"column", margin:"20px 20px"}}>
                <label style={{marginTop:10, marginBottom:4}} htmlFor="about" className="medium-label">Organization's description</label>
                <TextField 
                    id="about"
                    fullWidth
                    multiline
                    variant="standard"
                    placeholder="Describe your organization in a few lines"
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