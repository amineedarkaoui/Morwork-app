import React, { useEffect, useState } from "react";
import { updateUserInfo, userProfile } from "../../../api/app";
import { Box, Button, Step, StepLabel, Stepper } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import AddExperience from "../../profile-page/AddExperence";
import AddEducation from "../../profile-page/AddEducation";
import { useNavigate } from "react-router-dom";
import MainInfo from "./MainInfo";
import ExperiencesStep from "./ExperiencesStep";
import EducationStep from "./EducationStep";

export default function SignUpSequence() {
    const [isLoading, setLoading] = useState(false)
    const [userData, setUserData] = useState(null)
    const [activeStep, setActiveStep] = useState(0);
    const [updateProfile, setUpdateProfile] = useState(false)
    const [error, setError] = useState(null)
    const [version, setVersion] = useState(null)
    const [showAddExperienceWindow, setShowAddExperienceWindow] = useState(false)
    const [showAddEducationWindow, setShowAddEducationWindow] = useState(false)

    const navigate = useNavigate()
    const steps = ["Main info", "Experiences", 'Education'];


    const handleNext = async (cover) => {
        if (activeStep === steps.length-1) {
            setError(null)
            setLoading (true)
            const res = await updateUserInfo(userData)
            if (res instanceof Error) {
                setError("an error has occured")
            } else {
                navigate("/")
            }
            setLoading(false)
        } else
            setActiveStep(prev => prev+1)
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    useEffect(() => {
        const getProfile = async () => {
            const response = await userProfile(localStorage.getItem("userId"))
            setUserData(response.data)
            setLoading(false)
        }
        
        getProfile()
    }, [updateProfile])




    return ( 
        <div className="login-card sign-up radius elevation-1">
            <div style={{display:"grid", marginBottom:"auto"}}>
                <Stepper style={{width:"100%", padding:"10px"}} activeStep={activeStep} alternativeLabel>
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
                
                {
                    activeStep === 0 && userData !== null &&
                    <MainInfo
                     title={userData.title}
                     about={userData.about}
                     skills={userData.skills}
                     setData={setUserData}
                     version={version}
                     handleNext={handleNext}
                    />
                }

                {
                    activeStep === 1 && userData !== null &&
                    <ExperiencesStep 
                        experiences={userData.experiences}
                        setError={setError}
                        setLoading={setLoading}
                        addExperience={() => setShowAddExperienceWindow(true)}
                        version={version}
                        handleNext={handleNext}
                    />
                }
                { showAddExperienceWindow &&
                    <AddExperience 
                        isVisible='visible'
                        hideWindow={() => setShowAddExperienceWindow(false)}
                        updateProfile={() => setUpdateProfile(prev => !prev)}
                        experience={null}
                        resetExp={() => console.log('none')}
                    />
                }

                {
                    activeStep === 2 && userData !== null &&
                    <EducationStep 
                        education={userData.education}
                        setError={setError}
                        setLoading={setLoading}
                        addEducation={() => setShowAddEducationWindow(true)}
                        version={version}
                        handleNext={handleNext}
                    />
                }
                { showAddEducationWindow &&
                    <AddEducation 
                        isVisible='visible'
                        hideWindow={() => setShowAddEducationWindow(false)}
                        updateProfile={() => setUpdateProfile(prev => !prev)}
                        education={null}
                        resetEdu={() => console.log('none')}
                    />
                }
            </div>
            

            <Box 
                sx={{ display: 'flex', 
                    flexDirection: 'row', 
                    pt: 2, 
                    margin: "auto 8px 8px 8px", 
                    position:"sticky", 
                    bottom:0, 
                    right:0, 
                    left:0, 
                    background:"white" 
                }}
            >
                <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                >
                Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                <div>
                    <Button onClick={() => setVersion(prev => prev+1)} sx={{ mr: 1 }}>
                        Skip
                    </Button>
                </div>

                <LoadingButton 
                    onClick={() => setVersion(prev => prev+1)} 
                    variant="contained"
                    loading={isLoading}
                > 
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </LoadingButton>
            </Box>
        </div>
    )
}