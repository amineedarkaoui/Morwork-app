import React, { useEffect, useState } from "react";
import ProfileExp from "../../profile-page/ProfileExp";
import { Button, IconButton } from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";

export default function ExperiencesStep(props) {
    const [isFirstTime, setIsFirstTime] = useState(true)


    const addExperience = () => {
        props.addExperience()
    }

    const mapExperiences = () => (
        props.experiences.map(exp => (
            <div>
                <div style={{display:'flex', alignItems:'center'}}>
                    <ProfileExp isDesc={true} {...exp} />
                </div> 
                <div className="separator" />
            </div>
        ))
    )


    useEffect(() => {
        if (!isFirstTime)
            props.handleNext()
        else setIsFirstTime(false)
    }, [props.version])

    return (
        <div>
            <div style={{paddingBottom:10, display:'flex', marginTop:20}}>
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addExperience}
                    style={{width:'95%',margin:'auto'}}
                >
                    Add a new experience
                </Button>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:20, margin:20, overflowY:'scroll', maxHeight:460}}>
                {mapExperiences()}
            </div>
        </div>
    )
}