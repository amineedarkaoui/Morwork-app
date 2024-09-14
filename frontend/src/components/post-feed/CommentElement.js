import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import PostInteraction from "./PostInteraction";
import { deleteComment, deleteReply, getAllCommentLikesByPostId, likeComment, likeReply, updateComment, updateReply } from "../../api/app";
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Modal, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Reply(props){
    const [isLiked, setIsLiked] = useState(false);
    const [likesReplyCount, setReplyCount] = useState(props.reply.likes.length);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDropDown, setShowDropDown] = useState(false)
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState(props.reply.content);


    const toggleDropDown = () => {
        setShowDropDown(!showDropDown)
    }

    const toggleEditMode = () => {
        toggleDropDown()
        setEditMode(prevMode => !prevMode)

    };

    const handleContentChange = (event) => {
        setEditedContent(event.target.value);
    };

    const handleUpdate = (replyId) => {
        
        updateReply(replyId, editedContent)
        .then(window.location.reload())
    };

  const handleCloseDeleteConfirmation = () => setShowDeleteConfirmation(false);
  const handleshowDeleteConfirmation = () => {
    toggleDropDown()
    setShowDeleteConfirmation(true)
};

    useEffect(() => {
        props.reply.likes.some((like) => like.user.id === Number(localStorage.getItem("userId"))) ?
            setIsLiked(true) : setIsLiked(false);
    }, []);

    function handleLikeReplyState(){
        setReplyCount(prev => (isLiked ? prev - 1 : prev + 1));
        setIsLiked(!isLiked);
    }

    return(
        <div className="reply" style={{width: "88%", position: "relative", right: "-42px"}}>
            <div className="top-section">
                <div className="user-profile">
                    <img className="avatar" width={30} height={30} src={`http://localhost:8081/media/${props.user.profilePicture}`} alt="User avatar" />
                    <div className="user-info">
                    <NavLink to={`/profile/${props.user.id}`} style={{textDecoration:"none"}}>
                           <p className="small-title">{props.userName}</p>
                    </NavLink>
                        
                        <p className="small-label">{`${props.user.title}`}</p>
                    </div>
                </div>
                <div className="options">
                    <p className="small-label">{props.formatTime(props.reply.date)}</p>
                    <Dropdown show={showDropDown} onToggle={toggleDropDown}>
                    <Dropdown.Toggle style={{ background: 'none', border: 'none' }}>
                        <Icon icon="tabler:dots" style={{ cursor: "pointer", color:"black" }} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="my-dropdown-menu">
                        {
                        props.user.id === Number(localStorage.getItem("userId")) &&
                        <>
                            <div className="dropdown-option delete-option" onClick={handleshowDeleteConfirmation}>Delete</div>
                            <div className="dropdown-option update-option" onClick={toggleEditMode}>Update</div>
                        </>
                        }
                        
                        <div className="dropdown-option save-option">Save</div>
                    </Dropdown.Menu>
                </Dropdown>

                <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
                    <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Are you sure you want to delete this Comment?
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={()=>{
                        deleteReply(props.reply.id)
                        .then(window.location.reload())
                        }}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </Modal>
                </div>
            </div>

            <div className="text-section" style={{display: "grid",gridTemplateColumns:"1fr 45px", alignItems:"end", justifyContent:"space-between"}}>
                <div style={{minWidth: "60%", marginLeft:"35px"}}>
                {editMode ? ( 
                    <div style={{display:"flex", alignItems:"end", justifyContent:"space-between", width:"112%"}}>
                        
                        <textarea
                            className="normal-text"
                            style={{border:"0",paddingTop:"0",marginTop:"0", outline:"none", width: "93%", resize:"none", background:"#fff",height:"75px"}}
                            value={editedContent}
                            onChange={handleContentChange}
                        />
                        <div className="primary-button radius save-edit-comment-btn" onClick={()=>handleUpdate(props.reply.id)} style={{marginRight:"38px"}}>save</div>
                    </div>
                    
                ) : (
                    <div className="text-section">
                        <p className="normal-text" style={{minWidth: "93%", marginTop: "-4px", marginBottom: "3px"}}>
                        {props.reply.content}
                    </p>
                    </div>
                )}
                    <div className="options" style={{marginLeft: "-20px"}}>
                        <p className="small-label">{likesReplyCount} likes</p>
                    </div>
                </div>
                {isLiked ? (
                    <PostInteraction
                        icon="bxs:like"
                        style={{ width: "45px", color: "blue" }}
                        onClick={() => {handleLikeReplyState(); props.handleLikeReply(props.reply.id)}}
                    />
                ) : (
                    <PostInteraction
                        icon="bx:like"
                        style={{ width: "45px" }}
                        onClick={() => {handleLikeReplyState(); props.handleLikeReply(props.reply.id)}}
                    />
                )}
            </div>
        </div>
    )
}

// ---------

export default function CommentElement(props){
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(props.likes.length);
    const [showAllReplies, setShowAllReplies] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedContent, setEditedContent] = useState(props.content);
    const [showDropDown, setShowDropDown] = useState(false)

    const toggleDropDown = () => {
        setShowDropDown(!showDropDown)
    }

    const toggleEditMode = () => {
        toggleDropDown()
        setEditMode(prevMode => !prevMode)

    };

    const handleContentChange = (event) => {
        setEditedContent(event.target.value);
    };

    const handleUpdate = (commentId) => {
        updateComment(commentId, editedContent)
        .then(window.location.reload())
    };

  const handleCloseDeleteConfirmation = () => setShowDeleteConfirmation(false);
  const handleshowDeleteConfirmation = () => {
    setShowDeleteConfirmation(true)
    toggleDropDown()
    };


    const handleLikeComment = () => {
        likeComment(props.id, Number(localStorage.getItem("userId")))
            .then(res => {
                setLiked(prevLiked => !prevLiked);
                setLikesCount(prevCount => (liked ? prevCount - 1 : prevCount + 1));
            })
            .catch(error => {
                console.error("Failed to like comment:", error);
            });
    }

    const handleLikeReply = (id) => {
        likeReply(id, Number(localStorage.getItem("userId")))
        
    }

    useEffect(() => {
        getAllCommentLikesByPostId(props.postId)
            .then(res => {
                const likedByCurrentUser = res.data.some(commentLike => 
                    commentLike.comment.id === props.id && 
                    commentLike.user.id === Number(localStorage.getItem("userId"))
                );
                setLiked(likedByCurrentUser);
                const likesForComment = res.data.filter(commentLike => commentLike.comment.id === props.id);
                setLikesCount(likesForComment.length);
            })
            .catch(error => {
                console.error("Failed to fetch comment likes:", error);
            });
    }, [props.postId, props.id]);

    function handleReply(){
        console.log("Reply to "+props.author);
    }

    

    return(
        <div className="comment" style={{margin:"0"}}>
            <div className="top-section">
                <div className="user-profile">
                    <img className="avatar" width={40} height={40} src={`http://localhost:8081/media/${props.user.profilePicture}`} alt="User avatar" />
                    <div className="user-info">
                        <NavLink to={`/profile/${props.user.id}`}  style={{textDecoration:"none"}}>
                            <p className="medium-title">{props.author}</p>
                        </NavLink>
                        
                        <p className="medium-label">{"Java Developper"}</p>
                    </div>
                </div>
                <div className="options">
                <p className="small-label">{props.date}</p>
                <Dropdown show={showDropDown} onToggle={toggleDropDown}>
                    <Dropdown.Toggle style={{ background: 'none', border: 'none' }}>
                        <Icon icon="tabler:dots" style={{ cursor: "pointer", color:"black" }} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="my-dropdown-menu">
                        {
                        props.user.id === Number(localStorage.getItem("userId")) &&
                        <>
                            <div className="dropdown-option delete-option" onClick={handleshowDeleteConfirmation}>Delete</div>
                            <div className="dropdown-option update-option" onClick={toggleEditMode}>Update</div>
                        </>
                        }
                        
                        <div className="dropdown-option save-option">Save</div>
                    </Dropdown.Menu>
                </Dropdown>

                <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
                    <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Are you sure you want to delete this Comment?
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={()=>{
                        deleteComment(props.id)
                        .then(window.location.reload())
                        }}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </Modal>

                
            </div>

            </div>

            <div className="text-section" style={{display: "grid",gridTemplateColumns:"1fr 100px", alignItems:"end"}}>
                <div style={{minWidth: "60%", paddingLeft:"52px"}}>
                {editMode ? ( 
                    <div style={{display:"flex", alignItems:"end", justifyContent:"space-between", width:"112%"}}>
                        
                        <textarea
                            className="normal-text"
                            style={{border:"0",paddingTop:"0",marginTop:"0", outline:"none", width: "93%", resize:"none", background:"#fff",height:"75px"}}
                            value={editedContent}
                            onChange={handleContentChange}
                        />
                        <div className="primary-button radius save-edit-comment-btn" onClick={()=>handleUpdate(props.id)}>save</div>
                    </div>
                    
                ) : (
                    <div className="text-section">
                        <p className="normal-text" style={{minWidth: "93%", marginTop: "-4px", marginBottom: "3px"}}>
                        {props.content}
                    </p>
                    </div>
                )}
                    <div className="options" style={{marginLeft: "-5px"}}>
                        <p className="small-label">{likesCount} Likes | <span style={{cursor:"pointer"}} onClick={()=>props.onReply(props.author, props.id)}> {props.replies.length === 0 ? "" : props.replies.length} Reply</span> </p>
                    </div>
                </div>
                <div className="options" style={{marginLeft:"55px"}}>
                    {liked ?
                        <PostInteraction icon="bxs:like" style={{width: "45px", color: "blue"}} onClick={handleLikeComment} />
                        :
                        <PostInteraction icon="bx:like" style={{width: "45px"}} onClick={handleLikeComment} />
                    }
                </div>
            </div>

            {props.replies.length > 0 && (
                <>
                    <Reply
                        userName={`${props.replies[0].user.firstName} ${props.replies[0].user.lastName}`}
                        user={props.replies[0].user}
                        reply={props.replies[0]}
                        handleLikeReply={handleLikeReply}
                        handleReply={handleReply}
                        formatTime={props.formatTime}
                    />
                    {props.replies.length > 1 && !showAllReplies && (
                        <div className="show-more-replies small-label" onClick={() => setShowAllReplies(true)} style={{cursor:"pointer", marginLeft:"60px", fontWeight:"500"}}>Show more replies</div>
                    )}
                    {showAllReplies && props.replies.slice(1).map(reply => (
                        <Reply
                            key={reply.id}
                            userName={`${reply.user.firstName} ${reply.user.lastName}`}
                            user={reply.user}
                            reply={reply}
                            handleLikeReply={handleLikeReply}
                            handleReply={handleReply}
                            formatTime={props.formatTime}
                        />
                    ))}
                </>
            )}
        </div>
    )
}
