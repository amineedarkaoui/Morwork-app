import React, { useState } from "react";
import JobItem from "./JobItem";
import JobSkeleton from "./JobSkeleton";
import { getAllOffers, getUserById } from "../../api/app";
import { Modal } from "react-bootstrap";
import { TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Apply } from "./Apply";
import { SignalWifiStatusbarNullSharp } from "@mui/icons-material";


export default function Jobs(){
    const [isLoading, setIsLoading] = React.useState(true)
    const [jobs, setJobs] = useState(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [error, setError] = useState(null)
    
    const [showNewApply, setShowNewApply] = React.useState(false)

    const [selectedJobId, setSelectedJobId] = React.useState(null)

    const [user, setUser] = React.useState({})

    const handleCloseNewApply = () =>{
        setShowNewApply(false)
    }
    const handleOpenNewApply = () => {
        setShowNewApply(true)
    }

    const getOffers = async () => {
        setIsLoading(true)
        const offers = await getAllOffers()
        if (offers instanceof Error) {
            setError("An error has occured")
        } else {
            setJobs(offers)
            setIsLoading(false)
            setError(null)
        }
    }
    console.log(jobs)



    const getUser = async () => {
        const res = await getUserById(Number(localStorage.getItem("userId")))
        if(res instanceof Error){
            console.log("erroooor")
        }else{
            console.log(res.data)
            setUser(res.data)
        }
    }

    React.useEffect(() => {
        getOffers()
        getUser()
    }, []);

    return(
        <div className="Jobs-container radius">
            <div className="title-job-container">
                <h1 className="large-title jobs-title">Jobs in Morocco</h1>
                <p className="large label">Explore Jobs near you</p>
            </div>
        {
            isLoading ?
                <JobSkeleton />
            :
            (jobs === null || jobs.length === 0 ?
                <p className="small-text"style={{margin:20, textAlign:"center"}}>no job offer posts yet</p>
            :
            <div>
                {jobs.map(offer => <JobItem 
                    //isAdmin={isAdmin}
                    isAdmin={user.company?.id === offer.company?.id}
                    key={offer.id}
                    handleOpenNewApply={handleOpenNewApply}
                    handleCloseNewApply={handleCloseNewApply}
                    setSelectedJobId={setSelectedJobId}
                    id={offer.id}
                    {...offer}
                />
                )}
            </div>
            )
        }
        <Apply
            showNewApply={showNewApply}
            handleCloseNewApply={handleCloseNewApply}
            selectedJobId={selectedJobId}
        />
        </div>
    )
}