import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { deleteOrganizationCover, deleteOrganizationLogo, deleteUserCoverPicture, deleteUserProfilePicture, getAllApplies, getAppliesByJobId, getCompanyOffers, isUserAdmin, leaveOrganization } from "../../api/app";
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import UploadProfile from "../profile-page/UploadProfile";
import UploadCover from "../profile-page/UploadCover";
import EditAbout from "../profile-page/EditAbout";
import { Icon } from "@iconify/react/dist/iconify.js";
import UploadLogo from "./UploadLogo";
import UploadOrganizationCover from "./UploadOrganizationCover";
import EditDescription from "./EditDescription";
import { Add, ArrowBack, Edit, KebabDining, KebabDiningRounded, ListAlt, MenuBook, MenuOpen } from "@mui/icons-material";
import EditInfo from "./EditInfo";
import JobOffer from "./JobOffer";
import JobSkeleton from "../jobs/JobSkeleton";
import JobItem from "../jobs/JobItem";
import Applies from "./Applies";

export default function OrganizationPage(props) {
    const [offers, setOffers] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [profileAnchorEl, setProfileAnchorEl] = useState(null)
    const [coverAnchorEl, setCoverAnchorEl] = useState(null)
    const [menuAnchorEl, setMenuAnchorEl] = useState(null)
    const [showProfileWindow, setShowProfileWindow] = useState(false)
    const [showCoverWindow, setShowCoverWindow] = useState(false)
    const [showDescriptionWindow, setShowDescriptionWindow] = useState(false)
    const [showInfoWindow, setShowInfoWindow] = useState(false)
    const [showJobOfferWindow, setShowJobOfferWindow] = useState(false)
    const [currentTab, setCurrentTab] = useState(parseInt(localStorage.getItem("currentTab")) || 0)
    const [error, setError] = useState(null)
    const [isFirstTime, setFirstTime] = useState(true)
    const [applies, setApplies] = React.useState([])
    const [selectedJobId, setSelectedJobId] = useState(null)

    const [showApplies, setShowApplies] = useState(false); 
    const [animationClass, setAnimationClass] = useState(''); 

    const profileOpen = Boolean(profileAnchorEl)
    const coverOpen = Boolean(coverAnchorEl)
    const menuOpen = Boolean(menuAnchorEl)

    const handleLeave = async () => {
        const res = await leaveOrganization()
        if (res instanceof Error) {
            console.error(res)
        } else {
            handleClose()
            props.update()
        }
    }

    const handleClose = () => {
        setProfileAnchorEl(null)
        setCoverAnchorEl(null)
        setMenuAnchorEl(null)
    }

    const changeTab = (tab) => {
        localStorage.setItem("currentTab", tab)
        setCurrentTab(tab)
    }

    const deleteProfilePicture = async () => {
        const res = await deleteOrganizationLogo(props.id)
        if (res instanceof Error) {
            console.log(res)
        } else {
            handleClose()
            props.update()
        }
    }
    const deleteCoverPicture = async () => {
        const res = await deleteOrganizationCover(props.id)
        if (res instanceof Error) {
            console.log(res)
        } else {
            handleClose()
            props.update()
        }
    }

    const getOffers = async () => {
        props.setLoading(true)
        const offers = await getCompanyOffers(props.id)
        if (offers instanceof Error) {
            setError("An error has occured")
        } else {
            setOffers(offers)
            props.setLoading(false)
            setError(null)
        }
    }

    const setAdmin = async () => {
        props.setLoading(true)
        const isAdmin = await isUserAdmin(props.id)
        if (isAdmin instanceof Error) {
            setError("An error has occured")
        } else {
            setIsAdmin(isAdmin)
            props.setLoading(false)
            setError(null)
        }
    }

    useEffect(() => {
        if (!isFirstTime) {
            setAdmin()
            getOffers()
        } else {
            setFirstTime(false)
        }
        
    },[props.version])

    const fetchApplies = async () => {
        const res = await getAllApplies()
        if(res instanceof Error){
            console.log("error")
        }else{
            setApplies(res.data)
        }
    }

    const handleSeeApplies = () => {
        setAnimationClass('slide-out-left'); 
        setTimeout(() => {
            setShowApplies(true);
            setAnimationClass('slide-in-right');
        }, 500);

    };

    const getAppliesById = async (id) => {
        const res = await getAppliesByJobId(id)
        if(res instanceof Error){
            console.log("error")
        }else{
            setApplies(res.data)
        }
    }
    

    return (
        <div>
            {!showApplies ?
                <div className={`user-profile-page ${animationClass}`}>
                <div className="user-header radius">
                    <div className="cover-cont">
                        <div className="cover-img">
                            { props.isLoading ?
                                <Skeleton height={240} />
                                :
                                <img src={props.cover} />
                            }
                            
                        </div>
                        <div className="user-profile-cont">
                            { props.isLoading ?
                                <Skeleton className="avatar" />
                                :
                                <div className="avatar cont">
                                    <img className="elevation-1 company" src={props.image} />
                                    {
                                        isAdmin &&
                                        <div className="edit-button profile" onClick={(event) => setProfileAnchorEl(event.currentTarget)}>
                                            <Icon icon="material-symbols:edit-outline" />
                                        </div>
                                    }
                                    <Menu
                                        id="profile-menu"
                                        anchorEl={profileAnchorEl}
                                        open={profileOpen}
                                        onClose={handleClose}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                        }}
                                    >
                                        <MenuItem onClick={() => {handleClose(); setShowProfileWindow(() => true)}}>
                                            Update logo
                                        </MenuItem>
                                        <MenuItem onClick={deleteProfilePicture}>Delete logo</MenuItem>
                                    </Menu>
                                    {
                                        !props.isLoading && showProfileWindow && 
                                        <UploadLogo 
                                            isVisible='visible' 
                                            hideWindow={() => setShowProfileWindow(() => false)}
                                            updateProfile={props.update}
                                            id={props.id}
                                        />
                                    }
                                    
                                    
                                </div>
                            }
                            
                            { !props.isLoading && isAdmin &&
                                <div className="edit-button" onClick={(event) => setCoverAnchorEl(event.currentTarget)} >
                                    <Icon icon="material-symbols:edit-outline" />
                                </div>
                            }
                            <Menu
                                id="cover-menu"
                                anchorEl={coverAnchorEl}
                                open={coverOpen}
                                onClose={handleClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={() => {handleClose(); setShowCoverWindow(() => "visible")}}>Update cover picture</MenuItem>
                                <MenuItem onClick={deleteCoverPicture}>Delete cover picture</MenuItem>
                            </Menu>
                            
                            {
                                !props.isLoading && showCoverWindow && 
                                <UploadOrganizationCover
                                    isVisible='visible' 
                                    hideWindow={() => setShowCoverWindow(false)}
                                    updateProfile={props.update}
                                    id={props.id}
                                />
                            }

                            
                        </div>
                    </div>
                    <div className="user-info">
                        <div className="flex">
                            <div className="flex">
                                <div style={{display:"flex", justifyContent:"space-between"}}>
                                    { props.isLoading ?
                                        <Skeleton height={30} width={150} />
                                        :
                                        <p className="medium-title">{props.name}</p>
                                    }
                                    { !props.isLoading && isAdmin &&
                                        <div>
                                            <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)} sx={{width:34, height:34}}><Icon icon="charm:menu-kebab" /></IconButton>
                                            <Menu
                                                id="menu"
                                                anchorEl={menuAnchorEl}
                                                open={menuOpen}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                }}
                                                transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                }}
                                            >
                                                <MenuItem onClick={() => {handleClose(); setShowInfoWindow(true)}}>Update Organization's info</MenuItem>
                                                <MenuItem >Organization's admins (ip)</MenuItem>
                                                <MenuItem onClick={() => {handleClose();handleLeave()}}>Leave Organiztion</MenuItem>
                                                <MenuItem >Delete Organization (ip)</MenuItem>
                                            </Menu>
                                        </div>
                                        
                                    }
                                </div>
                                
                                { props.isLoading ?
                                    <Skeleton height={10} width={180} />
                                    :
                                    <div>
                                        <p style={{marginTop:0}} className="normal-text">{props.tagline}</p>
                                        <p className="medium-label">{props.industry.name}  &#183; {props.headquarters.name} &#183; {props.employesNum} employee</p>
                                    </div>
                                    
                                }
                            
                            </div>
                            
                        </div>
                    </div>
                    <div style={{display:"flex"}}>
                        {
                            !props.isLoading && isAdmin &&
                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                style={{width:'80%', maxWidth: 300, margin:'20px auto 10px auto'}}
                                onClick={() => setShowJobOfferWindow(true)}
                            >
                                Post a job offer
                            </Button>
                        }
                        
                    </div>
                    
                </div>
                

                <div className="details-section">
                    <div className="profile-selector">
                        <div className={`item profile ${!currentTab && "on"}`} onClick={() => changeTab(0)}>
                            <p className="small-title">Profile</p>
                        </div>
                        <div className={`item posts ${currentTab && "on"}`} onClick={() => changeTab(1)}>
                            <p className="small-title">Job Offers</p>
                        </div>
                    </div>

                    <div className={`user-details ${!currentTab && "show"}`}>
                        <div className="user-profile-section radius">
                            <div className="title-cont">
                                { props.isLoading ?
                                    <Skeleton className="primary-button" height={30} width={100} />
                                    :
                                    <p className="large-title">About</p>
                                }
                                { !props.isLoading && isAdmin &&
                                    <Icon onClick={() => setShowDescriptionWindow(true)} className="icon" icon="material-symbols:edit-outline" />
                                }
                                
                            </div>
                            { !props.isLoading && showDescriptionWindow &&
                            <EditDescription 
                                    isVisible="visible"
                                    content={() => props && props.description}
                                    updateProfile={props.update}
                                    hideWindow={() => setShowDescriptionWindow(false)}
                                    id={props.id}
                                />
    
                            }
                            
                            <div className="section-content">
                                { props.isLoading ?
                                    <Skeleton className="primary-button" height={15} count={6} />
                                    :
                                    <p className="normal-text">
                                        {props.description}
                                    </p>
                                }
                                
                            </div>
                        </div>
                    </div>


                    {
                        currentTab === 1 &&
                        <div style={{paddingBottom:80}} className={`Jobs-container ${currentTab && "show"}`}>
                            {
                                props.isLoading ?
                                    <JobSkeleton />
                                :
                                (offers === null || offers.length === 0 ?
                                    <p className="small-text"style={{margin:20, textAlign:"center"}}>no job offer posts yet</p>
                                :
                                <div>
                                    {offers.map(offer => <JobItem 
                                        isAdmin={isAdmin}
                                        key={offer.id} 
                                        fromCompany={true}
                                        handleSeeApplies={handleSeeApplies}
                                        setSelectedJobId={setSelectedJobId}
                                        getAppliesById={getAppliesById}
                                        {...offer}
                                    />
                                    )}
                                </div>
                                )
                            }                    
                            
                        </div>
                    }
                    
                    
                </div>

                {
                    !props.isLoading && showInfoWindow &&
                    <EditInfo 
                        id={props.id}
                        name={props.name}
                        type={props.type}
                        headquarters={props.headquarters}
                        description={props.description}
                        creationDate={props.creationDate}
                        employesNum={props.employesNum}
                        tagline={props.tagline}
                        industry={props.industry}
                        hideWindow={() => setShowInfoWindow(false)}
                        update={props.update}
                    />
                }

                { showJobOfferWindow &&
                    <JobOffer 
                        hideWindow={() => setShowJobOfferWindow(false)}
                        updateProfile={props.update}
                        id={props.id}
                        jobPost={null}
                    />
                }
            </div>
            :
            // <h1 className={`${animationClass}`}>Applies here !!</h1>
            <Applies 
                applies={applies}
            />
            }
        </div>
    )
}