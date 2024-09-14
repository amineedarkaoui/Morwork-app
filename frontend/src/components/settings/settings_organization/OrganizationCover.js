import React, { useEffect, useRef, useState } from "react";
import { getDefaultCover } from "../../../api/app";
import { Cropper } from "react-cropper";
import { Alert } from "@mui/material";

export default function OrganizationCover(props) {
    const [defaultCover, setDefaultCover] = useState(null)
    const [error, setError] = useState(null)
    const [isFirstTime, setIsFirstTime] = useState(true)

    const cropperRef = useRef(null);

    const handleNext = () => {
        console.log("invoked2")
        if (typeof cropperRef.current?.cropper !== "undefined") {
            const canvas = cropperRef.current?.cropper.getCroppedCanvas()
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Error converting canvas to blob');
                    setError(() => true)
                    return;
                }
                const croppedImage = new File([blob], props.fileName, {type: 'image/png'})
                props.setCropData(prev => {props.handleNext(croppedImage);return ({...prev, cover: croppedImage})});
                
            })
        }
    }

    useEffect(() => {
        const getData = async () => {
            const cover = await getDefaultCover()
            if (!(cover instanceof Error)) {
                setDefaultCover(cover)
            }
            else {
                console.error(cover)
            }
        }
        
        getData()
    },[])

    useEffect(() => {
        console.log("invoked")
        if (!isFirstTime)
            handleNext()
        else setIsFirstTime(false)
    }, [props.version])


    return (
        <div style={{display:"grid"}}>
            {
                props.image === null ?
                <img className="elevation-1" style={{maxWidth:'100%', maxHeight:390, margin:'10px auto'}} src={defaultCover} />
                :
                <div style={{ maxWidth:'100%', maxHeight:390, position: 'relative', margin:'10px auto' }}>
                    <Cropper 
                        ref={cropperRef}
                        style={{ height: "100%", width: "100%" }}
                        aspectRatio={4/1}
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