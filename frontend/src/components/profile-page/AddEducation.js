import React, { useEffect, useState } from "react";
import PopupWindow from "../main-components/PopupWindow";
import { Alert, Autocomplete, Box, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { addNewEducation, fetchAllCities, fetchAllSchools, updateEducation } from "../../api/app";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

export default function AddEducation(props) {
    const [cities, setCities] = useState(null)
    const [schools, setSchools] = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [formData, setFormData] = useState({
        id:props.education !== null ? props.education.id : "",
        degree:(props.education !== null ? props.education.degree : ""),
        fieldOfStudy:(props.education !== null ? props.education.fieldOfStudy : ""),
        description:(props.education !== null ? props.education.description : ""),
        school:(props.education !== null ? (props.education.company !== null ? props.education.company.name : props.education.school): ""),
        company:(props.education !== null ? props.education.company : null),
        cityInputValue:(props.education !== null ? props.education.city.name : ""),
        city:(props.education !== null ? props.education.city : null),
        startDate:(props.education !== null ? dayjs(props.education.startDate) : null),
        endDate:(props.education !== null ? dayjs(props.education.endDate) : null),
    })
    const [fieldError, setFieldError] = useState({
        degree:"",
        fieldOfStudy:"",
        school:"",
        cityInputValue:"",
        startDate:"",
        endDate:"",
    })


    useEffect(
        () => {
            const getCs = async () => {
                const schools = await fetchAllSchools()
                const cities = await fetchAllCities()
                if (!(cities instanceof Error) && !(schools instanceof Error)) {
                    setCities(cities)
                    setSchools(schools)
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
        props.resetEdu()
        props.hideWindow()
    }
    
    const saveEducation = async () => {
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
            if (key !== "company" && key !== "description" && key !== "city" && key !== "id") {
                if (formData[key] === null || formData[key].length === 0) {
                    setFieldError(prevError => ({
                        ...prevError,
                        [key]:"Please fill up this field"
                    }))
                    empty = true   
                }
            }  
        })
        console.log(empty)

        if (empty) {setLoading(false);return}

        
        if (formData.city === null || formData.city.name !== formData.cityInputValue) {
            setFieldError(prev => ({
                ...prev,
                cityInputValue:"Please select a city"
            }))
            setLoading(false)
            return
        }

        let res = null;
        if (props.education === null) {
            res = await addNewEducation(formData)
            if (res instanceof Error) {
                setError(true)
            } else {    
                props.updateProfile()
                hideWindow()
            }
            setLoading(false)
        } else {
            res = await updateEducation(formData)
            if (res instanceof Error) {
                setError(true)
            } else {
                props.showEditEdu()
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
            title="Add a new education"
        >
            <div style={{display:"flex", flexDirection:"column", margin:"0 20px", maxHeight:500, overflowY:"scroll"}}>
                <label style={{marginTop:10, marginBottom:0}} htmlFor="degree" className="medium-label">Degree</label>
                <TextField 
                    id='degree'
                    name='degree'
                    value={formData.degree}
                    onChange={handleChange}
                    style={{width: '100%'}}
                    variant="standard"
                    placeholder="Ex: Masters degree"
                    error={fieldError.degree}
                    helperText={fieldError.degree}
                />
                <label style={{marginTop:14, marginBottom:0}} htmlFor="fieldOfStudy" className="medium-label">Field of study</label>
                <TextField 
                    id='fieldOfStudy'
                    name='fieldOfStudy'
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    style={{width: '100%'}}
                    variant="standard"
                    placeholder="Ex: Computer science"
                    error={fieldError.fieldOfStudy}
                    helperText={fieldError.fieldOfStudy}
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
                <label style={{marginTop:10, marginBottom:4}} htmlFor="school" className="medium-label">School</label>
                <Autocomplete
                    id='school'
                    freeSolo
                    style={{width: '100%'}}
                    value={formData.company}
                    onChange={(event, newValue) => {setFormData(prev => ({...prev, company: newValue}))}}
                    inputValue={formData.school}
                    onInputChange={(event, newInputValue) => {setFormData(prev => ({...prev, school: newInputValue}))}}
                    options={schools}
                    getOptionLabel={option => option.name}
                    getOptionKey={option => option.id}
                    renderInput={(params) => <TextField
                         variant="outlined" 
                         {...params} 
                         label="School" 
                         error={fieldError.school}
                        helperText={fieldError.school}
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
                        onClick={saveEducation}
                    >
                        Save
                    </LoadingButton>
                </div>
            
        </PopupWindow>
    )
}