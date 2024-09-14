import React, { useState } from "react";
import PopupWindow from "../main-components/PopupWindow";
import { Button, IconButton } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import ProfileExp from "./ProfileExp";
import { deleteExperience } from "../../api/app";
import AddExperience from "./AddExperence";

export default function EditExperiences(props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const hideWindow = () => {
        props.hideWindow()
    }

    const addExperience = () => {
        props.addExperience()
        hideWindow()
    }

    const deleteExp = async (id) => {
        setError(null)
        setLoading(true)
        const res = await deleteExperience(id)
        if (res instanceof Error) {
            setError("An error has occured, try again")
        } else {
            props.updateProfile()
        }

        setLoading(false)
    }

    const mapExperiences = () => (
        props.experiences.map(exp => (
            <div>
               <div style={{display:'flex', alignItems:'center'}}>
                    <ProfileExp isDesc={true} {...exp} />
                    <IconButton onClick={() => {props.updateExp(exp); hideWindow()}}><Edit /></IconButton>
                    <IconButton onClick={() => deleteExp(exp.id)}><Delete /></IconButton>
                </div> 
                <div className="separator" />
            </div>
        ))
    )


    return (
        <PopupWindow
            isVisible={props.isVisible}
            hide={hideWindow}
            title="Edit your experiences"
        >
            <div style={{display:'flex', flexDirection:'column', gap:20, margin:20, overflowY:'scroll', maxHeight:460}}>
                {mapExperiences()}
                
            </div>
            <div style={{paddingBottom:10, display:'flex'}}>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addExperience}
                    style={{width:'95%',margin:'auto'}}
                >
                    Add a new experience
                </Button>
            </div>
        </PopupWindow>
    )
}