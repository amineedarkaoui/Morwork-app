import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Post from "../post-feed/Post";
import ProfileExp from "./ProfileExp";
import ProfileEdu from "./ProfileEdu";
import Skeleton from "react-loading-skeleton";
import PostSkeleton from "../post-feed/PostSkeleton";
import { deleteUserCoverPicture, deleteUserProfile, deleteUserProfilePicture, followUser, getFollowStatus, unfollowUser, userProfile } from "../../api/app";
import { json, useParams } from "react-router-dom";
import { formatPostTime } from "../post-feed/Feed";
import { Button, Menu, MenuItem } from "@mui/material";
import UploadProfile from "./UploadProfile";
import UploadCover from "./UploadCover";
import EditAbout from "./EditAbout";
import EditSkills from "./EditSkills";
import AddExperience from "./AddExperence";
import EditExperiences from "./EditExperiences";
import AddEducation from "./AddEducation";
import EditEducation from "./EditEducation";


export default function UserProfile(props) {
    // 0 for profile and 1 for posts
    const [currentTab, setCurrentTab] = useState(parseInt(localStorage.getItem("currentTab")) || 0)
    const [isLoading, setLoading] = useState(true)
    const [userData, setUserData] = useState(null)
    const [isCurrentUser, setCurrentUser] = useState()
    const [profileAnchorEl, setProfileAnchorEl] = useState(null)
    const [coverAnchorEl, setCoverAnchorEl] = useState(null)
    const [showProfileWindow, setShowProfileWindow] = useState("hidden")
    const [showCoverWindow, setShowCoverWindow] = useState("hidden")
    const [showAboutWindow, setShowAboutWindow] = useState("hidden")
    const [showSkillsWindow, setShowSkillsWindow] = useState("hidden")
    const [showAddExperienceWindow, setShowAddExperienceWindow] = useState("hidden")
    const [showAddEducationWindow, setShowAddEducationWindow] = useState("hidden")
    const [showEditExperiencesWindow, setShowEditExperiencesWindow] = useState("hidden")
    const [showEditEducationWindow, setShowEditEducationWindow] = useState("hidden")
    const [updateProfile, setUpdateProfile] = useState(false)
    const [experience, setExperience] = useState(null)
    const [education, setEducation] = useState(null)
    const [isFollowed, setIsFollowed] = useState(false)

    const profileOpen = Boolean(profileAnchorEl)
    const coverOpen = Boolean(coverAnchorEl)
    const [posts, setPosts] = useState([])



    const {userId} = useParams()

    

    const changeTab = (tab) => {
        localStorage.setItem("currentTab", tab)
        setCurrentTab(tab)
    }
    
    const handleClose = () => {
        setProfileAnchorEl(null)
        setCoverAnchorEl(null)
    }

    const deleteProfilePicture = async () => {
        const res = await deleteUserProfilePicture()
        if (res instanceof Error) {
            console.log(res)
        } else {
            handleClose()
            setUpdateProfile(prev => !prev)
        }
    }
    
    const deleteCoverPicture = async () => {
        const res = await deleteUserCoverPicture()
        if (res instanceof Error) {
            console.log(res)
        } else {
            handleClose()
            setUpdateProfile(prev => !prev)
        }
    }

    const updateExp = (exp) => {
        setExperience(exp)
        setShowAddExperienceWindow('visible')
    }
    const updateEdu = (edu) => {
        setEducation(edu)
        setShowAddEducationWindow('visible')
    }

    const followStatus = async () => {
        if (!isCurrentUser) {
            const isFollowed = await getFollowStatus(userId);
            setIsFollowed(isFollowed)
        }
    }

    const handleFollow = async () => {
        if (!isFollowed) {
            const res = await followUser(userId)
        } else {
            const res = await unfollowUser(userId)
        }
        followStatus()
        setUpdateProfile(prev => !prev)
    }


    useEffect(() => {
        const getProfile = async () => {
            const response = await userProfile(userId)
            setUserData(response.data)

            if (!isCurrentUser) {
                const isFollowed = await getFollowStatus(userId)
            }

            setLoading(false)
            
            setCurrentUser(() => localStorage.getItem('userId') === userId)
            followStatus()
        }
        
        getProfile()
    }, [updateProfile])

    return (
        <div className="user-profile-page">
            <div className="user-header radius">
                <div className="cover-cont">
                    <div className="cover-img">
                        { isLoading ?
                            <Skeleton height={240} />
                            :
                            <img src={userData.coverPicture} />
                        }
                        
                    </div>
                    <div className="user-profile-cont">
                        { isLoading ?
                            <Skeleton className="avatar" />
                            :
                            <div className="avatar cont">
                                <img src={userData.profilePicture} className="avatar elevation-1" />
                                {
                                    isCurrentUser &&
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
                                    <MenuItem onClick={() => {handleClose(); setShowProfileWindow(() => "visible")}}>
                                        Change profile picture
                                    </MenuItem>
                                    <MenuItem onClick={deleteProfilePicture}>Delete profile picture</MenuItem>
                                </Menu>
                                <UploadProfile 
                                    isVisible={showProfileWindow} 
                                    hideWindow={() => setShowProfileWindow(() => "hidden")}
                                    updateProfile={() => setUpdateProfile(prev => !prev)}
                                />
                                
                            </div>
                        }
                        
                        { !isLoading && isCurrentUser &&
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
                            <MenuItem onClick={() => {handleClose(); setShowCoverWindow(() => "visible")}}>Change cover picture</MenuItem>
                            <MenuItem onClick={deleteCoverPicture}>Delete cover picture</MenuItem>
                        </Menu>
                        <UploadCover
                            isVisible={showCoverWindow} 
                            hideWindow={() => setShowCoverWindow(() => "hidden")}
                            updateProfile={() => setUpdateProfile(prev => !prev)}
                        />

                        
                    </div>
                </div>
                <div className="user-info">
                    <div className="flex">
                        <div className="flex">
                            { isLoading ?
                                <Skeleton height={30} width={150} />
                                :
                                <p className="medium-title">{userData.firstName} {userData.lastName}</p>
                            }
                            { isLoading ?
                                <Skeleton height={10} width={180} />
                                :
                                <p className="normal-text">{userData.title}</p>
                            }
                            
                        </div>
                        { isLoading ?
                                <Skeleton className="primary-button" height={20} width={80} />
                                :
                                <p className="primary-button">{userData.followersNum} follower</p>
                        }
                        
                    </div>
                </div>
                { !isCurrentUser && !isLoading &&
                    <div style={{display:"flex", justifyContent:"end", padding:"0 20px 20px 20px"}}>
                        <Button
                            variant="contained"
                            sx={{background: isFollowed && "#c5c6c9", ":hover": {background: isFollowed && "#c5c6c9"}}}
                            onClick={handleFollow}
                        >
                            {isFollowed? "Unfollow" : "Follow"}
                        </Button>
                    </div>
                }
                
            </div>
            

            <div className="details-section">
                <div className="profile-selector">
                    <div className={`item profile ${!currentTab && "on"}`} onClick={() => changeTab(0)}>
                        <p className="small-title">Profile</p>
                    </div>
                    <div className={`item posts ${currentTab && "on"}`} onClick={() => changeTab(1)}>
                        <p className="small-title">Posts</p>
                    </div>
                </div>

                <div className={`user-details ${!currentTab && "show"}`}>
                    <div className="user-profile-section radius">
                        <div className="title-cont">
                            { isLoading ?
                                <Skeleton className="primary-button" height={30} width={100} />
                                :
                                <p className="large-title">About</p>
                            }
                            { !isLoading && isCurrentUser &&
                                <Icon onClick={() => setShowAboutWindow('visible')} className="icon" icon="material-symbols:edit-outline" />
                            }
                            
                        </div>
                        { !isLoading &&  showAboutWindow !== 'hidden' &&
                           <EditAbout 
                                isVisible={showAboutWindow}
                                content={() => userData && userData.about}
                                hideWindow={() => setShowAboutWindow('hidden')}
                                updateProfile={() => setUpdateProfile(prev => !prev)}
                            />
 
                        }
                        
                        <div className="section-content">
                            { isLoading ?
                                <Skeleton className="primary-button" height={15} count={6} />
                                :
                                <p className="normal-text">
                                    {userData.about}
                                </p>
                            }
                            
                        </div>
                    </div>

                    <div className="user-profile-section radius">
                        <div className="title-cont">
                            { isLoading ?
                                <Skeleton className="primary-button" height={30} width={100} />
                                :
                                <p className="large-title">Experiences</p>
                            }
                            { !isLoading && isCurrentUser &&
                                <div className="icons-cont">
                                    <Icon onClick={() => setShowAddExperienceWindow('visible')} className="icon" icon="ic:baseline-plus" />
                                    <Icon onClick={() => {setShowEditExperiencesWindow('visible')}} className="icon" icon="material-symbols:edit-outline" />
                                </div>
                            }
                            
                        </div>
                        { showAddExperienceWindow !== 'hidden' &&
                            <AddExperience 
                                isVisible='visible'
                                hideWindow={() => setShowAddExperienceWindow('hidden')}
                                updateProfile={() => setUpdateProfile(prev => !prev)}
                                experience={experience}
                                resetExp={() => setExperience(null)}
                                showEditExp={() => {setShowEditExperiencesWindow('visible')}}
                            />
                        }
                        { showEditExperiencesWindow !== 'hidden' &&
                           <EditExperiences 
                                isVisible={showEditExperiencesWindow}
                                experiences={userData && userData.experiences}
                                hideWindow={() => setShowEditExperiencesWindow('hidden')}
                                updateProfile={() => setUpdateProfile(prev => !prev)}
                                addExperience={() => setShowAddExperienceWindow('visible')}
                                updateExp={(exp) => updateExp(exp)}
                            />
 
                        }
                        
                        { isLoading ?
                            <div className="section-content">
                                <ProfileExp isLoading={isLoading} />
                                <ProfileExp isLoading={isLoading} />
                                <ProfileExp isLoading={isLoading} />
                            </div>
                            :
                            <div className="section-content">
                                {userData.experiences.map(
                                    experience => <ProfileExp key={experience.id} {...experience} />
                                )}
                            </div>
                        }
                        
                    </div>

                    <div className="user-profile-section radius">
                        <div className="title-cont">
                            { isLoading ?
                                <Skeleton className="primary-button" height={30} width={100} />
                                :
                                <p className="large-title">Education</p>
                            }
                            { !isLoading && isCurrentUser &&
                                <div className="icons-cont">
                                    <Icon onClick={() => setShowAddEducationWindow('visible')} className="icon" icon="ic:baseline-plus" />
                                    <Icon onClick={() => setShowEditEducationWindow('visible')} className="icon" icon="material-symbols:edit-outline" />
                                </div>
                            }
                            
                        </div>
                        { isLoading ?
                            <div className="section-content">
                                <ProfileEdu isLoading={isLoading} />
                                <ProfileEdu isLoading={isLoading} />
                            </div>
                            :
                            <div className="section-content">
                                {userData.education.map(
                                    edu => <ProfileEdu {...edu} />
                                )}
                            </div>
                        }
                        { showAddEducationWindow !== 'hidden' &&
                            <AddEducation 
                                isVisible='visible'
                                hideWindow={() => setShowAddEducationWindow('hidden')}
                                updateProfile={() => setUpdateProfile(prev => !prev)}
                                education={education}
                                resetEdu={() => setEducation(null)}
                                showEditEdu={() => {setShowEditEducationWindow('visible')}}
                            />
                        }
                        { showEditEducationWindow !== 'hidden' &&
                           <EditEducation 
                                isVisible={showEditEducationWindow}
                                education={userData && userData.education}
                                hideWindow={() => setShowEditEducationWindow('hidden')}
                                updateProfile={() => setUpdateProfile(prev => !prev)}
                                addEducation={() => setShowAddEducationWindow('visible')}
                                updateEdu={(edu) => updateEdu(edu)}
                            />
 
                        }
                        
                    </div>

                    <div className="user-profile-section radius">
                        <div className="title-cont">
                            { isLoading ?
                                <Skeleton className="primary-button" height={30} width={100} />
                                :
                                <p className="large-title">Skills</p>
                            }
                            { !isLoading && isCurrentUser &&
                                <div className="icons-cont">
                                    <Icon onClick={() => setShowSkillsWindow('visible')} className="icon" icon="material-symbols:edit-outline" />
                                </div>
                            }
                            
                        </div>
                        { isLoading ?
                            <div className="section-content">
                                <Skeleton  width={160} height={15} count={4} />
                            </div>
                            
                            :   
                            <div className="section-content">
                                {userData.skills.map(
                                    skill => <p className="small-title skill">{skill.name}</p>
                                )}
                            </div>
                        }
                        { !isLoading && showSkillsWindow !== 'hidden' &&
                           <EditSkills 
                                isVisible={showSkillsWindow}
                                userSkills={() => userData && userData.skills}
                                hideWindow={() => setShowSkillsWindow('hidden')}
                                updateProfile={() => setUpdateProfile(prev => !prev)}
                            />
 
                        }
                        
                    </div>
                </div>



                <div className={`posts-feed ${currentTab && "show"}`}>
                    { isLoading ?
                        <>
                            <PostSkeleton />
                            <PostSkeleton />
                            <PostSkeleton /> 
                        </>
                        
                        :
                        <>
                            { userData.posts.length > 0 ?
                            userData.posts.map(
                                post => {return post.type === "STANDART_POST" ?
                                <Post
                                    key={post.id}
                                    username={`${post.firstName} ${post.lastName}`}
                                    title={post.title}
                                    time={formatPostTime(post.date)}
                                    text={post.content}
                                    photo={post.image}
                                    likes={post.likes}
                                    comments={post.comments}
                                    id={post.id}
                                    user={post.userId}
                                    saves={post.saves}
                                    reposts={post.reposts}
                                    postType={post.type}
                                    userId={post.userId}
                                    userImage={post.userProfilePicture}
                                />
                                :
                                <Post
                                    key={post.id}
                                    username={`${post.firstName} ${post.lastName}`}
                                    title={post.title}
                                    time={formatPostTime(post.date)}
                                    text={post.originalPost.content}
                                    photo={post.originalPost.image}
                                    // likes={post.likes}
                                    comments={post.comments}
                                    id={post.id}
                                    user={post.userId}
                                    saves={post.saves}
                                    originalPost={post.originalPost}
                                    originalUserName={`${post.originalPost.firstName} ${post.originalPost.lastName}`}
                                    reposts={post.reposts}
                                    postType={post.type}
                                    userId={post.originalPost.userId}
                                    OriginalUserImage={post.originalPost.userProfilePicture}
                                    userImage={post.userProfilePicture}
                                />
                                }
                            ) :
                            <p className="small-text"style={{margin:20}}>no posts yet</p>
                        }
                        </>
                    }
                    
                    
                </div>
                
            </div>
        </div>
    )
}