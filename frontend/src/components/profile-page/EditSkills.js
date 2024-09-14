import React, { useEffect, useState } from "react";
import PopupWindow from "../main-components/PopupWindow";
import { Alert, Autocomplete, IconButton, TextField } from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { fetchAllSkills, updateAbout, updateUserSkills } from "../../api/app";

export default function EditSkills(props) {
    const [userSkills, setUserSkills] = useState(props.userSkills)
    const [allSkills, setAllSkills] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [value, setValue] = React.useState(null)
    const [inputValue, setInputValue] = React.useState('')



    useEffect   (
        () => {
            const getAllSkills = async () => {
                const skills = await fetchAllSkills()
                if (!(skills instanceof Error)) {
                    setAllSkills(skills)
                }
                else {
                    console.error(skills)
                }
            }
            getAllSkills()
        }
    , [])

    
    const hideWindow = () => {
        setUserSkills(props.userSkills)
        props.hideWindow()
    }

    const addSkill = () => {
        if (value) {
            if (inputValue === value.name) {
                if (!userSkills.some(skill => skill.id === value.id || skill.name === value.name)) {
                    setError(null)
                    setUserSkills(prevSkills => [...prevSkills, value])
                }
                else
                    setError("You already have the skill: " + value.name)
            }
        } else {
            setError("Please select a skill")
        }
        
    }

    const deleteSkill = (skillId) => {
        setUserSkills(prevSkills => prevSkills.filter(skill => skill.id !== skillId))
    }
    
    const saveSkills = async () => {
        setError(false)
        setLoading(true)
        const res = await updateUserSkills(userSkills)
        if (res instanceof Error) {
            setError("An error has occured, try again")
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
            title="Edit your skills"
        >
            <div style={{display:"flex", flexDirection:"column", margin:'0 20px'}}>
                <div style={{margin:'20px 0'}}>
                    <div style={{display:"flex"}}>
                        <Autocomplete
                            style={{marginLeft:'auto', marginRight:20, width: '100%'}}
                            value={value}
                            onChange={(event, newValue) => {setValue(newValue)}}
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {setInputValue(newInputValue)}}
                            options={allSkills}
                            getOptionLabel={option => option.name}
                            getOptionKey={option => option.id}
                            renderInput={(params) => <TextField {...params} label="Add a skill" />}
                            autoHighlight
                        />
                        <LoadingButton 
                            style={{marginRight:'auto'}}
                            loading ={isLoading}
                            variant="contained"
                            onClick={addSkill}
                        >
                            Add
                        </LoadingButton>
                    </div>
                    
                    {
                        error &&
                        <Alert 
                            severity="error" 
                            variant="text" 
                            sx={{color:'#d32f2f'}}
                            icon={false}
                        >
                            {error}
                        </Alert>
                    }
                </div>
                

                <div style={{maxHeight:'300px', overflowY:'scroll', backgroundColor:'white'}}>
                    {userSkills.map(
                        skill => (
                            <div 
                                key={skill.id} 
                                className="skill-line"
                            >
                                <p className="small-title skill">{skill.name}</p>
                                <IconButton onClick={() => deleteSkill(skill.id)}><Cancel color="error" /></IconButton>
                            </div>
                            
                        )
                    )}
                </div>
                
                <div style={{margin:10, marginTop:20, display:"flex", justifyContent: 'end'}}>
                    <LoadingButton 
                        loading ={isLoading}
                        variant="contained"
                        endIcon={<Save/>} 
                        onClick={saveSkills}
                    >
                        Save
                    </LoadingButton>
                </div>
            </div>
            
        </PopupWindow>
    )
}