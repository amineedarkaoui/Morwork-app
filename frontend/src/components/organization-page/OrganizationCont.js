import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrganization } from "../../api/app";
import Header from "../navigation/header";
import OrganizationPage from "./OrganizationPage";

export default function OrganizationCont() {
    const [organization, setOrganization] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [updateOrganization, setUpdateOrganization] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [version, setVersion] = useState(0)

    const {id} = useParams()


    const getData = async () => {
        setLoading(true)
        const organization = await getOrganization(id)
        if (organization instanceof Error) {
            setError("An error has occured")
        } else {
            setOrganization(organization)
            setVersion(prev => prev+1)
            setLoading(false)
            setError(null)
        }
    }

    useEffect(() => {
        getData()
    },[updateOrganization])


    return (
        <div style={{width:"100%", maxWidth:1000, margin:"auto"}}>
            <Header isVisible={true} />
            <OrganizationPage
                isLoading={isLoading}
                setLoading={setLoading}
                {...organization}
                update={() => setUpdateOrganization(prev => !prev)}
                version={version}
            />
        </div>
    )
}