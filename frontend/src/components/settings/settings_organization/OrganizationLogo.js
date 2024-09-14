import React, { useEffect, useRef, useState } from "react";
import { getDefaultLogo } from "../../../api/app";
import { Cropper } from "react-cropper";
import { Alert } from "@mui/material";

export default function OrganizationLogo(props) {
    const [defaultLogo, setDefaultLogo] = useState(null)
    const [error, setError] = useState(null)
    const [isFirstTime, setIsFirstTime] = useState(true)

    const cropperRef = useRef(null);

    const handleNext = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            const canvas = cropperRef.current?.cropper.getCroppedCanvas()
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Error converting canvas to blob');
                    setError(() => true)
                    return;
                }
                const croppedImage = new File([blob], props.fileName, {type: 'image/png'})
                props.setCropData(prev => ({...prev, logo: croppedImage}));
                
            })
        }
        props.handleNext()
    }

    useEffect(() => {
        const getData = async () => {
            const logo = await getDefaultLogo(props.type)
            if (!(logo instanceof Error)) {
                setDefaultLogo(logo)
            }
            else {
                console.error(logo)
            }
        }
        
        getData()
    },[props.type])

    useEffect(() => {
        if (!isFirstTime)
            handleNext()
        else setIsFirstTime(false)
    }, [props.version])


    return (
        <div style={{display:"grid"}}>
            {
                props.image === null ?
                <img className="elevation-1" style={{maxWidth:'100%', maxHeight:390, margin:'10px auto'}} src={defaultLogo} />
                :
                <div style={{ maxWidth:'100%', maxHeight:390, position: 'relative', margin:'10px auto' }}>
                    <Cropper 
                        ref={cropperRef}
                        style={{ height: "100%", width: "100%" }}
                        aspectRatio={1/1}
                        dragMode="move"
                        src={props.image}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        checkOrientation={false} 
                        guides={true}
                    />
                </div>
            }
            {
                error !== null &&
                <Alert style={{marginTop:10}} severity="error" variant="text" color="red">{error}</Alert>
            }
            
        </div>
    )
}