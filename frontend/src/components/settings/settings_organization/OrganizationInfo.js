import { useEffect, useState } from "react"
import { fetchAllCities, fetchAllIndustries, updateOrganizationInfo } from "../../../api/app"
import { Alert, Autocomplete, MenuItem, TextField } from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DatePicker } from "@mui/x-date-pickers"
import { type } from "@testing-library/user-event/dist/type"
import dayjs from "dayjs"


export default function OrganizationInfo(props) {
    const [industries, setIndustries] = useState(null)
    const [cities, setCities] = useState(null)
    const [isFirstTime, setIsFirstTime] = useState(true)
    const [error, setError] = useState(null)
    const [fieldError, setFieldError] = useState({
        name:"",
        industryInputValue:"",
        type:"",
        description:"",
        cityInputValue:"",
        creationDate:"",
        employesNum:"",
    })

    const types = ["company", "school"]

    const handleChange = (event) => {
        props.setFormData(prevData => ({
            ...prevData,
            [event.target.name]:event.target.value,
        }))
    }

    const validateOrganizationData = () => {
        setError(false)

        Object.keys(fieldError).map(key => {
            setFieldError(prevError => ({
                ...prevError,
                [key]: ""
            }))
        })

        let empty = false
        Object.keys(props.formData).map(key => {
            if (key !== "industry" && key !== "description" && key !== "headquarters" && key !== "logo" && key !== "cover" && key !== "id" && key !== "tagline") {
                if (props.formData[key] === null || props.formData[key].length === 0) {
                    setFieldError(prevError => ({
                        ...prevError,
                        [key]:"Please fill up this field"
                    }))
                    empty = true
                }
            }  
        })
        if (empty) return

         
        if (props.formData.industry === null || props.formData.industry.name !== props.formData.industryInputValue) {
            
            setFieldError(prev => ({
                ...prev,
                industryInputValue:"Please select an industry"
            }))
            return
        }

        if (props.formData.headquarters === null || props.formData.headquarters.name !== props.formData.cityInputValue) {
            setFieldError(prev => ({
                ...prev,
                cityInputValue:"Please select a city"
            }))
            return
        }
       
        if (!props.edit)
            props.handleNext()
    }


    useEffect(() => {
        const getData = async () => {
            const cities = await fetchAllCities()
            const industries = await fetchAllIndustries()
            if (!(cities instanceof Error) && !(industries instanceof Error)) {
                setCities(cities)
                setIndustries(industries)
            }
            else {
                console.error(cities)
            }
        }
        getData()
    },[])

    useEffect(() => {
        const updateInfo = async () => {
            setError(false)
            props.setLoading(true)
            const res = await updateOrganizationInfo(props.formData)
            if (res instanceof Error) {
                setError("An error has occured, try again!")
            } else {
                props.update()
                props.hideWindow()
            }

            props.setLoading(false)
        }


        if (!isFirstTime) {
            validateOrganizationData()
            if(props.edit) {
                updateInfo()
            }
        }                
        else setIsFirstTime(false)
    }, [props.version])


    


    return (
        <div style={{display:"flex", flexDirection:"column", margin:"0px 20px 0 20px"}}>
            <label style={{marginTop:10, marginBottom:0}} htmlFor="name" className="medium-label">Name*</label>
            <TextField 
                id='name'
                name='name'
                value={props.formData.name}
                onChange={handleChange}
                style={{width: '100%'}}
                variant="standard"
                placeholder="Organization name"
                error={fieldError.name}
                helperText={fieldError.name}
            />
            <label style={{marginTop:10, marginBottom:0}} htmlFor="tagline" className="medium-label">Tagline</label>
            <TextField 
                id='tagline'
                name='tagline'
                value={props.formData.tagline}
                onChange={handleChange}
                style={{width: '100%'}}
                variant="standard"
                placeholder="Organization' tagline"
            />
            <label style={{marginTop:10, marginBottom:4}} htmlFor="industry" className="medium-label">Industry*</label>
            <Autocomplete
                id='industry'
                freeSolo
                style={{width: '100%'}}
                value={props.formData.industry}
                onChange={(event, newValue) => {props.setFormData(prev => ({...prev, industry: newValue}))}}
                inputValue={props.formData.industryInputValue}
                onInputChange={(event, newInputValue) => {props.setFormData(prev => ({...prev, industryInputValue: newInputValue}))}}
                options={industries}
                getOptionLabel={option => option.name}
                getOptionKey={option => option.id}
                renderInput={(params) => <TextField
                        variant="outlined" 
                        {...params} 
                        label="Industry" 
                        error={fieldError.industryInputValue}
                        helperText={fieldError.industryInputValue}
                    />}
            />
            <label style={{marginTop:10, marginBottom:4}} htmlFor="type" className="medium-label">Organization type*</label>
            <TextField
                select
                id="type"
                name="type"
                label="Organization's type"
                onChange={handleChange}
                value={props.formData.type}
                error={fieldError.type}
                helperText={fieldError.type}
            >
                {
                    types.map(type => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))
                }
                
            </TextField>
            
            <label style={{marginTop:10, marginBottom:4}} htmlFor="description" className="medium-label">Description</label>
            <TextField 
                id='description'
                name='description'
                value={props.formData.description}
                onChange={handleChange}
                multiline
                maxRows={10}
                style={{width: '100%'}}
                variant="outlined"
                placeholder="Describe your organization in a few lines"
            />
            <label style={{marginTop:10, marginBottom:4}} htmlFor="city" className="medium-label">Headquarter*</label>
            <Autocomplete
                id='city'
                fullwidth
                freeSolo
                value={props.formData.headquarters}
                defaultValue={props.experience && [props.experience.city]}
                onChange={(event, newValue) => {props.setFormData(prev => ({...prev, headquarters: newValue}))}}
                inputValue={props.formData.cityInputValue}
                onInputChange={(event, newInputValue) => {props.setFormData(prev => ({...prev, cityInputValue: newInputValue}))}}
                options={cities}
                getOptionLabel={option => option.name}
                getOptionKey={option => option.id}
                renderInput={(params) => <TextField 
                    variant="outlined" 
                    {...params} 
                    label="Organization's headquarter" 
                    error={fieldError.cityInputValue}
                    helperText={fieldError.cityInputValue} 
                />}
                autoHighlight
            />
            
            <div style={{display:'flex', justifyContent:'space-between', gap:10}}>
                <LocalizationProvider dateAdapter={AdapterDayjs} >
                    <div style={{display:'grid'}}>
                        <label style={{marginTop:10, marginBottom:4}} htmlFor="creationDate" className="medium-label">Creation Date*</label>
                        <DatePicker
                            name='creationDate'
                            value={props.formData.creationDate}
                            onChange={value => props.setFormData(prev => ({...prev, creationDate:value}))}
                            id="creationDate" 
                            required
                            maxDate={dayjs()}
                        />
                        {
                            fieldError.creationDate &&
                            <Alert sx={{color:"#d32f2f"}} variant="text" severity="error" icon={false}>Please fill up the creation date</Alert>
                        }
                    </div>
                </LocalizationProvider>
                <div style={{display:'grid'}}>
                    <label style={{marginTop:10, marginBottom:4}} htmlFor="employees-num" className="medium-label">Employees number*</label>
                    <TextField
                        type="number"
                        id="employees-num"
                        name='employesNum'
                        value={props.formData.employesNum}
                        onChange={handleChange} 
                        style={{width: '100%'}}
                        variant="outlined"
                        placeholder="Employees number"
                        error={fieldError.employesNum}
                        helperText={fieldError.employesNum}
                    />
                </div>
                
            </div>
            
                

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
    )
}