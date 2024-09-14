import React, { useState } from "react";
import PopupWindow from "../main-components/PopupWindow";
import { Button, IconButton } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import ProfileExp from "./ProfileExp";
import { deleteEducation } from "../../api/app";
import AddExperience from "./AddExperence";
import ProfileEdu from "./ProfileEdu";

export default function EditEducation(props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const hideWindow = () => {
        props.hideWindow()
    }

    const addEducation = () => {
        props.addEducation()
        hideWindow()
    }

    const deleteEdu = async (id) => {
        setError(null)
        setLoading(true)
        const res = await deleteEducation(id)
        if (res instanceof Error) {
            setError("An error has occured, try again")
        } else {
            props.updateProfile()
        }

        setLoading(false)
    }

    const mapEducation = () => (
        props.education.map(edu => (
            <div>
               <div style={{display:'flex', alignItems:'center'}}>
                    <ProfileEdu isDesc={true} {...edu} />
                    <IconButton onClick={() => {props.updateEdu(edu); hideWindow()}}><Edit /></IconButton>
                    <IconButton onClick={() => deleteEdu(edu.id)}><Delete /></IconButton>
                </div> 
                <p className="normal-text" style={{margin:"10px 0"}}>{edu.description}</p>
                <div className="separator" />
            </div>
        ))
    )


    return (
        <PopupWindow
            isVisible={props.isVisible}
            hide={hideWindow}
            title="Edit your education"
        >
            <div style={{display:'flex', flexDirection:'column', gap:20, margin:20, overflowY:'scroll', maxHeight:460}}>
                {mapEducation()}
                
            </div>
            <div style={{paddingBottom:10, display:'flex'}}>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addEducation}
                    style={{width:'95%',margin:'auto'}}
                >
                    Add a new education
                </Button>
            </div>
        </PopupWindow>
    )
}