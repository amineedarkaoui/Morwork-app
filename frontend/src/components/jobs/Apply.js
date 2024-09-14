import { LoadingButton } from "@mui/lab";
import { Snackbar, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { NewApply } from "../../api/app";



export const Apply = (props) => {

    const [isApplyLoading, setIsApplyLoading] = React.useState(false)

    const [description, setDescription] = React.useState("")
    const [showApplyConfirmation, setShowApplyConformation] = React.useState(false)

    const addApply = async () => {
        try {
            setIsApplyLoading(true);
            await NewApply(Number(localStorage.getItem("userId")), description, Number(props.selectedJobId))

            //props.handleCloseNewApply();
            window.location.reload()
        } catch (error) {
            console.error("Error while adding apply:", error);
        }
    };
    
    

    
    return(
        <>
            <Modal show={props.showNewApply} onHide={props.handleCloseNewApply}>
                <Modal.Header closeButton>
                    <Modal.Title>Apply now</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <label style={{marginTop:10, marginBottom:4}} htmlFor="description" className="medium-label">Description</label>
                <TextField 
                        id='description'
                        name='description'
                        // value={props.formData.description}
                        // onChange={handleChange}
                        multiline
                        maxRows={10}
                        style={{width: '100%'}}
                        variant="outlined"
                        placeholder="Provide context for your resume and expand on key points"
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value)
                        }}
                    />

                    <p className="medium-label" style={{margin:"14px 3px", marginBottom:"0"}}>By submitting your application, you agree that your CV will be considered as your Morwork profile. Please ensure that your profile is complete and up-to-date, as it will help increase your chances of being selected.</p>
                </Modal.Body>
                <Modal.Footer>
                    <LoadingButton loading={isApplyLoading} variant="contained" onClick={() => {addApply()}}>Apply</LoadingButton>
                </Modal.Footer>
            </Modal> 
            
        </>
    )
}