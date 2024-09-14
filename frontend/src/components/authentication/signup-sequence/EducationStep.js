import React, { useEffect, useState } from "react";
import ProfileEdu from "../../profile-page/ProfileEdu";
import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

export default function EducationStep(props) {
    const [isFirstTime, setIsFirstTime] = useState(true)


    const mapEducation = () => (
        props.education.map(edu => (
            <div>
               <div style={{display:'flex', alignItems:'center'}}>
                    <ProfileEdu isDesc={true} {...edu} />
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
                    onClick={props.addEducation}
                    style={{width:'95%',margin:'auto'}}
                >
                    Add a new education
                </Button>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:20, margin:20, overflowY:'scroll', maxHeight:460}}>
                {mapEducation()}
                
            </div>  
        </div>
    )
}