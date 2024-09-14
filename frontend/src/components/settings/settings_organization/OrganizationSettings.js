import React, { useContext, useEffect, useState } from "react";
import { HeaderContext } from "../Settings";
import { getUserOrganization } from "../../../api/app";
import { Add } from "@mui/icons-material";
import { Button } from "@mui/material";
import NewOrganization from "./NewOrganization";
import OrganizationPage from "../../organization-page/OrganizationPage";

export default function OrganizationSettings() {
    const {setHeader} = useContext(HeaderContext)
    const [organization, setOrganization] = useState(null)
    const [showPopup, setShowPopup] = useState(false)
    const [updateOrganization, setUpdateOrganization] = useState(false)
    const [error, setError] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [version, setVersion] = useState(0)



    const getOrganization = async () => {
        setLoading(true)
        const organization = await getUserOrganization()
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
        setHeader("Organization")
        getOrganization()
    },[updateOrganization])


    return (
        <div style={{maxHeight: "100%", overflowY:"scroll", display:"grid", zIndex:300}}>
            {!isLoading && (organization === null || organization  === "") ?
                <Button
                    variant="outlined"
                    startIcon={<Add />}
                    style={{width:'80%', maxWidth: 300, margin:'50px auto'}}
                    onClick={() => setShowPopup(true)}
                >
                    Create an organization
                </Button>

                :
                <OrganizationPage
                    isLoading={isLoading}
                    setLoading={setLoading}
                    {...organization}
                    update={() => setUpdateOrganization(prev => !prev)}
                    version={version}
                />
            }

                { showPopup &&
                    <NewOrganization
                        isVisible='visible'
                        hideWindow={() => setShowPopup(false)}
                        update={() => setUpdateOrganization(prev => !prev)}
                    />
                }
        </div>
    )
}