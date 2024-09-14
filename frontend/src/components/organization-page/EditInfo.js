import React, { useState } from "react";
import PopupWindow from "../main-components/PopupWindow";
import { Alert, TextField } from "@mui/material";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { updateDescription } from "../../api/app";
import OrganizationInfo from "../settings/settings_organization/OrganizationInfo";
import dayjs from "dayjs";

export default function EditInfo(props) {
    const [isLoading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [version, setVersion] = useState(0)
    const [formData, setFormData] = useState({
        id:props.id,
        name:props.name,
        industryInputValue:props.industry.name,
        industry:props.industry,
        type:props.type,
        headquarters:props.headquarters,
        description:props.description,
        cityInputValue:props.headquarters.name,
        creationDate:dayjs(props.creationDate),
        employesNum:props.employesNum,
        tagline:props.tagline,
    })


    return(
        <PopupWindow 
            isVisible="visible"
            hide={props.hideWindow}
            title="Update Organization's info"
        >
            <div style={{maxHeight:500, overflowY:"scroll"}}>
                <OrganizationInfo 
                    formData={formData} 
                    setFormData={setFormData} 
                    version={version}
                    setLoading={setLoading}
                    update={props.update}
                    edit={true}
                    hideWindow={props.hideWindow}
                />
            </div>
            
            <div style={{margin:10, marginTop:20, display:"flex", justifyContent: 'end'}}>
                    <LoadingButton 
                        loading ={isLoading}
                        variant="contained"
                        endIcon={<Save/>} 
                        onClick={() => setVersion(prev => prev+1)}
                    >
                        Save
                    </LoadingButton>
                </div>
        </PopupWindow>
    )
}