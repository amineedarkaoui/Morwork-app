import React, { useEffect, useState } from "react";
import PopupWindow from "../main-components/PopupWindow";
import { Alert, Autocomplete, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { addNewExperience, fetchAllCities, fetchAllJobTypes, postJobOffer, updateExperience } from "../../api/app";

export default function JobOffer(props) {
    const [cities, setCities] = useState(null)
    const [jobTypes, setJobTypes] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({
        id:"",
        title:"",
        description:"",
        cityInputValue:"",
        city:null,
        jobTypeInputValue:"",
        jobType:null,
        salary:"",
    })
    const [fieldError, setFieldError] = useState({
        title:"",
        cityInputValue:"",
        jobTypeInputValue:"",
        description:"",
    })


    useEffect(
        () => {
            const getCJ = async () => {
                const cities = await fetchAllCities()
                const jobTypes = await fetchAllJobTypes()
                if (!(cities instanceof Error) && !(jobTypes instanceof Error)) {
                    setCities(cities)
                    setJobTypes(jobTypes)
                }
                else {
                    console.error(cities)
                }
            }
            getCJ()
        }
    , [])



    const handleChange = (event) => {
        setFormData(prevData => ({
            ...prevData,
            [event.target.name]:event.target.value,
        }))
    }

    const hideWindow = () => {
        props.hideWindow()
    }
    
    const saveExperience = async () => {
        setError(false)
        setLoading(true)

        Object.keys(fieldError).map(key => {
            setFieldError(prevError => ({
                ...prevError,
                [key]: ""
            }))
        })
        let empty = false
        Object.keys(formData).map(key => {
            if (key !== "salary" && key !== "city" && key !== "jobType" && key !== "id") {
                if (formData[key] === null || formData[key].length === 0) {
                    setFieldError(prevError => ({
                        ...prevError,
                        [key]:"Please fill up this field"
                    }))
                    empty = true   
                }
            }  
        })
        if (empty) {setLoading(false);return}
        

        if (formData.city === null || formData.city.name !== formData.cityInputValue) {
            setFieldError(prev => ({
                ...prev,
                cityInputValue:"Please select a city"
            }))
            setLoading(false)
            return
        }
        if (formData.jobType === null || formData.jobType.name !== formData.jobTypeInputValue) {
            setFieldError(prev => ({
                ...prev,
                jobTypeInputValue:"Please select a job type"
            }))
            setLoading(false)
            return
        }

        let res = null;
        if (props.jobPost === null) {
            res = await postJobOffer(props.id, formData)
            if (res instanceof Error) {
                setError(true)
            } else {
                props.updateProfile()
                hideWindow()
            }
            setLoading(false)
        } else {
            res = await updateExperience(formData)
            if (res instanceof Error) {
                setError(true)
            } else {
                props.showEditExp()
                
                props.updateProfile()
                hideWindow()
            }
            setLoading(false)
        }

        
    }

    return(
        <PopupWindow 
            isVisible="visible"
            hide={hideWindow}
            title="Post a job offer"
        >
            <div style={{display:"flex", flexDirection:"column", margin:"0 20px", maxHeight:500, overflowY:"scroll"}}>
                <label style={{marginTop:10, marginBottom:4}} htmlFor="title" className="medium-label">Title*</label>
                <TextField 
                    id='title'
                    name='title'
                    value={formData.title}
                    onChange={handleChange}
                    style={{width: '100%'}}
                    variant="standard"
                    placeholder="Ex: Software engineer"
                    error={fieldError.title}
                    helperText={fieldError.title}
                />
                <label style={{marginTop:10, marginBottom:4}} htmlFor="description" className="medium-label">Description*</label>
                <TextField 
                    id='description'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    maxRows={10}
                    style={{width: '100%'}}
                    variant="outlined"
                    placeholder="Job description"
                    error={fieldError.description}
                    helperText={fieldError.description}
                />
                
                <label style={{marginTop:10, marginBottom:4}} htmlFor="city" className="medium-label">City*</label>
                <Autocomplete
                    id='city'
                    fullwidth
                    freeSolo
                    value={formData.city}
                    defaultValue={props.experience && [props.experience.city]}
                    onChange={(event, newValue) => {setFormData(prev => ({...prev, city: newValue}))}}
                    inputValue={formData.cityInputValue}
                    onInputChange={(event, newInputValue) => {setFormData(prev => ({...prev, cityInputValue: newInputValue}))}}
                    options={cities}
                    getOptionLabel={option => option.name}
                    getOptionKey={option => option.id}
                    renderInput={(params) => <TextField 
                        variant="outlined" 
                        {...params} 
                        label="City" 
                        error={fieldError.cityInputValue}
                        helperText={fieldError.cityInputValue} 
                    />}
                    autoHighlight
                />
                <label style={{marginTop:10, marginBottom:4}} htmlFor="job-type" className="medium-label">Job type*</label>
                <Autocomplete
                    id='job-type'
                    fullwidth
                    freeSolo
                    value={formData.jobType}
                    onChange={(event, newValue) => {setFormData(prev => ({...prev, jobType: newValue}))}}
                    inputValue={formData.jobTypeInputValue}
                    onInputChange={(event, newInputValue) => {setFormData(prev => ({...prev, jobTypeInputValue: newInputValue}))}}
                    options={jobTypes}
                    getOptionLabel={option => option.name}
                    getOptionKey={option => option.id}
                    renderInput={(params) => <TextField 
                        variant="outlined" 
                        {...params} 
                        label="Job type" 
                        error={fieldError.jobTypeInputValue || fieldError.jobtype}
                        helperText={fieldError.jobTypeInputValue}
                    />}
                    autoHighlight
                />
                <label style={{marginTop:10, marginBottom:4}} htmlFor="salary" className="medium-label">Salary/month (optional)</label>
                <TextField 
                    id='salary'
                    name='salary'
                    value={formData.salary}
                    onChange={handleChange}
                    style={{width: '100%'}}
                    variant="standard"
                    placeholder="Expected salary in DH"
                    error={fieldError.salary}
                    helperText={fieldError.salary}
                    type="number"
                />

                {
                    error &&
                    <Alert 
                        style={{marginTop:10, color:"#d32f2f"}} 
                        severity="error" 
                        variant="text" 
                    >
                        An error has occured, try again
                    </Alert>
                }
                
            </div>
            <div style={{margin:10, marginTop:16, display:"flex", justifyContent: 'end'}}>
                    <LoadingButton 
                        loading ={isLoading}
                        variant="contained"
                        onClick={saveExperience}z
                    >
                        Post
                    </LoadingButton>
                </div>
            
        </PopupWindow>
    )
}