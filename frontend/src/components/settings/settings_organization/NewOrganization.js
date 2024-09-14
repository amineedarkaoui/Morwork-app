import React, { useEffect, useRef, useState } from "react";
import PopupWindow from "../../main-components/PopupWindow";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Alert, Box, Button } from "@mui/material";
import OrganizationInfo from "./OrganizationInfo";
import { LoadingButton } from "@mui/lab";
import OrganizationLogo from "./OrganizationLogo";
import OrganizationCover from "./OrganizationCover";
import { addNewOrganization, updateOrganizationCover, updateOrganizationLogo } from "../../../api/app";


export default function NewOrganization(props) {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [activeStep, setActiveStep] = useState(0);
    const [version, setVersion] = useState(0)
    const [image, setImage] = useState({
        logo:null,
        cover:null
    })
    const [fileName, setFileName] = useState({
        logo:null,
        cover:null
    })
    const [cropData, setCropData] = useState({
        logo:null,
        cover:null
    })
    const [formData, setFormData] = useState({
        id:"",
        name:"",
        industryInputValue:"",
        industry:null,
        type:"",
        headquarters:null,
        description:"",
        cityInputValue:"",
        creationDate:null,
        employesNum:"",
        tagline:"",
    })

    const hiddenFileInput = useRef(null)
    const steps = ["Main info", "Logo", 'Cover picture'];

    const handleImageChange = (event) => {
        event.preventDefault();

        if (event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = () => {
                if (activeStep === 1)
                    setImage(prev => ({...prev, logo:reader.result}));
                else
                 setImage(prev => ({...prev, cover:reader.result}))
            };
            reader.readAsDataURL(event.target.files[0]);
            setFileName(prev => 
                activeStep === 1 ? 
                ({...prev, logo:event.target.files[0].name}) : 
                ({...prev, cover:event.target.files[0].name})
            )
        }
        
    }

    const handleUploadClick = () => {
        setError(() => false)
        hiddenFileInput.current.click()
    }

    const handleNext = async (cover) => {
        console.log("invoked3")
        if (activeStep === steps.length-1) {
            setError(null)
            setLoading (true)

            const id = await addNewOrganization(cropData.logo, cover, formData)
            if (id instanceof Error) {
                setError("an error has occured")
            } else {
                if (cropData.logo !== null) {
                    const response = await updateOrganizationLogo(cropData.logo, id)
                    if (response instanceof Error) {
                        setError("an error has occured")
                    }
                }
                if (cover !== null) {
                    const response = await updateOrganizationCover(cover, id)
                    if (response instanceof Error) {
                        setError("an error has occured")
                    }
                }
                hideWindow()
            }
            setLoading(false)
        } else
            setActiveStep(prev => prev+1)
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const hideWindow = () => {
        props.update()
        props.hideWindow()
    }


    return(
        <PopupWindow 
            isVisible={props.isVisible}
            hide={hideWindow}
            title="Add a new organization"
        >
            <div style={{display:"flex", flexDirection:"column", maxHeight:490, overflowY:"scroll", overflowX:"hidden", position:"relative"}}>
            <Stepper style={{width:"100%", padding:"10px"}} className="elevation-1" activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};
                return (
                    <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                );
                })}
            </Stepper>
            
            {activeStep === 0 &&
                <OrganizationInfo 
                    formData={formData} 
                    setFormData={setFormData} 
                    handleNext={handleNext}
                    version={version}
                />
            }  
            {
                activeStep === 1 &&
                <OrganizationLogo 
                    type={formData.type}
                    image={image.logo}
                    setCropData={setCropData}
                    handleNext={handleNext}
                    version={version}
                    fileName={fileName.logo}
                />
            }
            {
                activeStep === 2 &&
                <OrganizationCover 
                    image={image.cover}
                    setCropData={setCropData}
                    handleNext={handleNext}
                    version={version}
                    fileName={fileName.cover}
                />
            }
            {
                error &&
                <Alert style={{position:"absolute", bottom:0, right:0, left:0}} severity="error">{error}</Alert>
            }
            
            </div>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, margin: "0 8px 8px 8px" }}>
                <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                >
                Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {(activeStep === 1 || activeStep === 2) && (
                <div>
                    <Button onClick={handleUploadClick} sx={{ mr: 1 }}>
                        Upload new Picture
                    </Button>
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        style={{ display: 'none' }}
                        onChange={handleImageChange}
                    />
                </div>
                
                )}

                <LoadingButton 
                    onClick={() => setVersion(prev => prev+1)} 
                    variant="contained"
                    loading={isLoading}
                > 
                    {activeStep === steps.length - 1 ? 'Save' : 'Next'}
                </LoadingButton>
            </Box>
            
        </PopupWindow>
    )
}