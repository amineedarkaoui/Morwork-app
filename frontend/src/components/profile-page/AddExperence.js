import React, { useEffect, useState } from "react";
import PopupWindow from "../main-components/PopupWindow";
import { Alert, Autocomplete, Box, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { addNewExperience, fetchAllCities, fetchAllCompanies, fetchAllJobTypes, updateAbout, updateExperience } from "../../api/app";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

export default function AddExperience(props) {
    const [cities, setCities] = useState(null)
    const [companies, setCompanies] = useState(null)
    const [jobTypes, setJobTypes] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({
        id:props.experience !== null ? props.experience.id : "",
        title:(props.experience !== null ? props.experience.title : ""),
        description:(props.experience !== null ? props.experience.description : ""),
        companyLabel:(props.experience !== null ? (props.experience.company !== null ? props.experience.company.name : props.experience.companyLabel): ""),
        company:(props.experience !== null ? props.experience.company : null),
        cityInputValue:(props.experience !== null ? props.experience.city.name : ""),
        city:(props.experience !== null ? props.experience.city : null),
        jobTypeInputValue:(props.experience !== null ? props.experience.jobType.name : ""),
        jobType:(props.experience !== null ? props.experience.jobType : null),
        startDate:(props.experience !== null ? dayjs(props.experience.startDate) : null),
        endDate:(props.experience !== null ? dayjs(props.experience.endDate) : null),
    })
    const [fieldError, setFieldError] = useState({
        title:"",
        companyLabel:"",
        cityInputValue:"",
        jobTypeInputValue:"",
        startDate:"",
        endDate:"",
    })


    useEffect(
        () => {
            const getCs = async () => {
                const companies = await fetchAllCompanies()
                const cities = await fetchAllCities()
                const jobTypes = await fetchAllJobTypes()
                if (!(cities instanceof Error) && !(companies instanceof Error) && !(jobTypes instanceof Error)) {
                    setCities(cities)
                    setCompanies(companies)
                    setJobTypes(jobTypes)
                }
                else {
                    console.error(cities)
                }
            }
            getCs()
        }
    , [])



    const handleChange = (event) => {
        setFormData(prevData => ({
            ...prevData,
            [event.target.name]:event.target.value,
        }))
    }

    const hideWindow = () => {
        props.resetExp()
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
            if (key !== "company" && key !== "description" && key !== "city" && key !== "jobType" && key !== "id") {
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
        

        if (formData.jobType === null || formData.jobType.name !== formData.jobTypeInputValue) {
            setFieldError(prev => ({
                ...prev,
                jobTypeInputValue:"Please select a job type"
            }))
            setLoading(false)
            return
        }

        let res = null;
        if (props.experience === null) {
            res = await addNewExperience(formData)
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
            isVisible={props.isVisible}
            hide={hideWindow}
            title="Add a new experience"
        >
            <div style={{display:"flex", flexDirection:"column", margin:"0 20px", maxHeight:510, overflowY:"scroll"}}>
                <label style={{marginTop:10, marginBottom:4}} htmlFor="title" className="medium-label">Title</label>
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
                <label style={{marginTop:10, marginBottom:4}} htmlFor="description" className="medium-label">Description</label>
                <TextField 
                    id='description'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    maxRows={10}
                    style={{width: '100%'}}
                    variant="outlined"
                    placeholder="Description"
                />
                <label style={{marginTop:10, marginBottom:4}} htmlFor="company" className="medium-label">Company</label>
                <Autocomplete
                    id='company'
                    freeSolo
                    style={{width: '100%'}}
                    value={formData.company}
                    onChange={(event, newValue) => {setFormData(prev => ({...prev, company: newValue}))}}
                    inputValue={formData.companyLabel}
                    onInputChange={(event, newInputValue) => {setFormData(prev => ({...prev, companyLabel: newInputValue}))}}
                    options={companies}
                    getOptionLabel={option => option.name}
                    getOptionKey={option => option.id}
                    renderInput={(params) => <TextField
                         variant="outlined" 
                         {...params} 
                         label="Company" 
                         error={fieldError.companyLabel}
                        helperText={fieldError.companyLabel}
                    />}
                    renderOption={(props, option) => (
                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                          <img
                            loading="lazy"
                            width="30"
                            height={30}
                            src={option.image}
                            alt=""
                          />
                          {option.name}
                        </Box>
                      )}
                    autoHighlight
                />
                <label style={{marginTop:10, marginBottom:4}} htmlFor="city" className="medium-label">City</label>
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
                <label style={{marginTop:10, marginBottom:4}} htmlFor="job-type" className="medium-label">Job type</label>
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
                <div style={{display:'flex', justifyContent:'space-between', gap:10}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <div style={{display:'grid'}}>
                            <label style={{marginTop:10, marginBottom:4}} htmlFor="start-date" className="medium-label">Start date</label>
                            <DatePicker
                                name='startDate'
                                value={formData.startDate}
                                onChange={value => setFormData(prev => ({...prev, startDate:value}))}
                                id="start-date" 
                                maxDate={formData.endDate}
                                required
                            />
                        </div>
                        <div style={{display:'grid'}}>
                            <label style={{marginTop:10, marginBottom:4}} htmlFor="end-date" className="medium-label">End date</label>
                            <DatePicker 
                                name='endDate'
                                value={formData.endDate}
                                onChange={value => setFormData(prev => ({...prev, endDate:value}))}
                                id="end-date" 
                                minDate={formData.startDate}
                            />
                        </div>
                    </LocalizationProvider>
                    
                    
                </div>
                {
                    (fieldError.startDate || fieldError.endDate) &&
                    <Alert sx={{color:"#d32f2f"}} variant="text" severity="error" icon={false}>Please fill up the date fields</Alert>
                }
                    

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
            <div style={{margin:10, marginTop:10, display:"flex", justifyContent: 'end'}}>
                    <LoadingButton 
                        loading ={isLoading}
                        variant="contained"
                        endIcon={<Save/>} 
                        onClick={saveExperience}z
                    >
                        Save
                    </LoadingButton>
                </div>
            
        </PopupWindow>
    )
}