import React, { useRef, useState } from "react";
import PopupWindow from "../main-components/PopupWindow";
import { Alert, Button } from "@mui/material";
import { AddAPhoto, Save } from "@mui/icons-material";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { updateCoverPicture, updateProfilePicture } from "../../api/app";
import { LoadingButton } from "@mui/lab";

export default function UploadCover(props) {

    const [image, setImage] = useState(null)
    const [fileName, setFileName] = useState(null)
    const [cropData, setCropData] = useState("#");
    const [error, setError] = useState(false)
    const [isLoading, setLoading] = useState(false)


    const cropperRef = useRef(null);
    const hiddenFileInput = useRef(null)


    const handleUploadClick = () => {
        setError(() => false)
        hiddenFileInput.current.click()
    }

    const handleProfileChange = (event) => {
        event.preventDefault();

        if (event.target.files) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(event.target.files[0]);
            setFileName(event.target.files[0].name)
        }
        
    }

    const saveProfile = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            const canvas = cropperRef.current?.cropper.getCroppedCanvas()
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Error converting canvas to blob');
                    setError(() => true)
                    return;
                }
                const croppedImage = new File([blob], fileName, {type: 'image/png'})
                setCropData(() => {
                    console.log("got here")
                    uploadPhoto(croppedImage)
                    return croppedImage
                });
                
            })
        }
        
        const uploadPhoto = async (croppedImage) => {
            if (cropData) {
                setLoading(() => true)
                const res = await updateCoverPicture(croppedImage)
                setLoading(() => false)
                if (!(res instanceof Error)) {
                    props.updateProfile()
                    props.hideWindow()
                    setCropData(null)
                    setImage(null)
                } else {setError(() => true)}
            }
         }
    };


    return (
        
        <PopupWindow 
            isVisible={props.isVisible}
            hide={props.hideWindow}
            title="Update cover picture"
        >
            {
                !image?
                <div style={{display: 'flex', justifyContent: 'center', margin: '20px'}}>
                    <Button onClick={handleUploadClick} variant="contained" startIcon={<AddAPhoto/>}>
                        Upload photo
                    </Button>
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        style={{ display: 'none' }}
                        onChange={handleProfileChange}
                    />
                </div>
                :
                    <div style={{width:'100%'}}>
                        <div style={{ height: 400, width: "100%", position: 'relative' }}>
                            <Cropper 
                                ref={cropperRef}
                                style={{ height: "100%", width: "100%" }}
                                aspectRatio={4/1}
                                dragMode="move"
                                src={image}
                                viewMode={1}
                                minCropBoxHeight={10}
                                minCropBoxWidth={10}
                                background={false}
                                responsive={true}
                                autoCropArea={1}
                                checkOrientation={false} 
                                guides={true}
                                preview=".preview"
                            />
                            <div className="preview" />
                        </div>
                        
                        {
                            error &&
                            <Alert style={{marginTop:10}} severity="error" variant="text" color="red">Failed to upload photo</Alert>
                        }

                        <div style={{margin:10, marginTop:20, display:"flex", gap:20}}>
                            <Button onClick={handleUploadClick} style={{marginLeft:'auto'}}>
                                Change photo
                            </Button>
                            <input
                                type="file"
                                ref={hiddenFileInput}
                                style={{ display: 'none' }}
                                onChange={handleProfileChange}
                            />
                            <LoadingButton 
                                loading = {isLoading}
                                onClick={saveProfile} 
                                variant="contained" 
                                endIcon={<Save/>} 
                            >
                                Save
                            </LoadingButton>
                        </div>
                    </div>
                    
                    
            }
            
        </PopupWindow>
    )
}