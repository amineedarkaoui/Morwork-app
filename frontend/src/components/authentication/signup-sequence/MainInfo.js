import { Alert, Autocomplete, Button, IconButton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { fetchAllSkills } from "../../../api/app";
import { LoadingButton } from "@mui/lab";
import { Cancel } from "@mui/icons-material";

export default function MainInfo(props) {
    const [value, setValue] = useState(null)
    const [inputValue, setInputValue] = useState('')
    const [allSkills, setAllSkills] = useState(null)
    const [error, setError] = useState(null)
    const [isFirstTime, setIsFirstTime] = useState(true)

    const handleChange = (event) => {
        props.setData(prevData => ({
            ...prevData,
            [event.target.name]: event.target.value
        }))
    }

    const addSkill = () => {
        if (value) {
            if (inputValue === value.name) {
                if (!props.skills.some(skill => skill.id === value.id || skill.name === value.name)) {
                    setError(null)
                    props.setData(prevData => (
                        {
                            ...prevData,
                            skills:[...prevData.skills, value]
                        }
                    ))
                }
                else
                    setError("You already have the skill: " + value.name)
            }
        } else {
            setError("Please select a skill")
        }
        
    }

    const deleteSkill = (skillId) => {
        props.setData(prevData => ({
            ...prevData,
            skills: prevData.skills.filter(skill => skill.id !== skillId)
        }))
    }


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

    useEffect(() => {
        if (!isFirstTime)
            props.handleNext()
        else setIsFirstTime(false)
    }, [props.version])


    return (
        <div>
            <label style={{marginTop:10, marginBottom:0}} htmlFor="title" className="medium-label">Title</label>
            <TextField 
                id='title'
                name='title'
                value={props.title}
                onChange={handleChange}
                style={{width: '100%'}}
                variant="standard"
                placeholder="Ex: Software engineer"
            />

            <label style={{marginTop:10, marginBottom:4}} htmlFor="about" className="medium-label">About you</label>
            <TextField 
                id="about"
                name="about"
                fullWidth
                multiline
                placeholder="What do you want people to know about you?"
                value={props.about}
                onChange={handleChange}
                maxRows={10}
            />

            <div style={{display:"flex", flexDirection:"column", margin:'0 0px'}}>
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
                        <Button 
                            style={{marginRight:'auto'}}
                            variant="contained"
                            onClick={addSkill}
                        >
                            Add
                        </Button>
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
                    {props.skills.map(
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
            </div>
        </div>
    )
}