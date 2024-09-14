import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { userCard } from "../../api/app";
import { useNavigate } from "react-router-dom";

export default function ProfileCard() {
    const [isLoading, setLoading] = useState(true)
    const [userData, setUserData] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            const cardData = await userCard() 
            setUserData(cardData)
            if (cardData) {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    return (
        <div className="elevation-1 radius profile-card">
            <div className="cover-img">
                { isLoading ?
                    <Skeleton height={120} />
                    :
                    <img src={userData.coverPicture} className="radius" />
                    
                }
            </div>
            <div className="user-info-cont">
                { isLoading ?
                    <Skeleton className="avatar" circle />
                    :
                    <img src={userData.profilePicture} className="avatar" />
                }
                
                <div className="flex">
                    <div className="flex">
                        { isLoading ?
                            <Skeleton height={30} width={150} />
                            :
                            <p className="medium-title">{userData.firstName} {userData.lastName}</p>
                        }
                        
                        { isLoading ?
                            <Skeleton height={10} width={100} />
                            :
                            <p className="large-label" style={{textAlign:'center'}}>{userData.title}</p>
                        }
                        
                    </div>
                    <div className="separator"></div>
                    { isLoading ?
                        <Skeleton height={20} width={100} />
                        :
                        <button 
                            className="blue-button text-button"
                            onClick={() => navigate(`profile/${localStorage.getItem("userId")}`)}
                        >
                            Visit profile
                        </button>
                    }
                    
                </div>
            </div>
        </div>
    )
}