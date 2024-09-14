import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

export default function EditPostModal(props) {
  const [editedContent, setEditedContent] = useState(props.initialContent);
  const [editedImage, setEditedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(props.image);

 
  const handleChange = (event) => {
    setEditedContent(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setEditedImage(file);
  
    if (file && file.type.startsWith("image")) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    } else {
      setImagePreview(null);
    }
  };
  
  const handleSaveChanges = () => {
    props.handleSave(props.postId, editedContent, editedImage);
    props.handleClose();
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <textarea
          value={editedContent}
          onChange={handleChange}
          className="form-control"
          rows="4"
          style={{resize:"none"}}
        />
        <form>
            {/* <label htmlFor="file" className="file-input-label">
                <i className="fa-solid fa-file"></i> Choose File
            </label> */}
            <input type="file" id="file" onChange={(event) => handleImageChange(event)} className="file-input" />
        </form>


        {imagePreview && (
          <img
            src={imagePreview.startsWith("blob")
            ?
            imagePreview:
            `http://localhost:8081/media/${imagePreview}`
            
            }
            alt="Preview"
            style={{ maxWidth: "100%", marginTop: "10px" }}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
