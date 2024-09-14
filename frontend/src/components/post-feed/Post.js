import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import PostInteraction from "./PostInteraction";
import { getPosts, likePost, getLikes, deleteStandartPost, updateStandartPost, savePost, getSaves, repost, getFollowStatus, unfollowUser, followUser } from "../../api/app";
import { NavLink } from "react-router-dom";

import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Modal, Button } from "react-bootstrap";
import EditPostModal from "./EditPostModal";
import { formatPostTime } from "./Feed";
import ListGroup from 'react-bootstrap/ListGroup';


export default function Post(props) {
  const [expanded, setExpanded] = useState(false);
  const MAX_CONTENT_LENGTH = 105;
  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [likeText, setLikeText] = useState("Like")
  const [likesCount, setLikesCount] = useState(0)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false) 

  const [isSaved, setIsSaved] = useState(false);
  const [showLikes, setShowLikes] = useState(false)
  const [followed, setFollowed] = useState()
  


  const handleSaveChanges = (postId,editedContent,editedImage) => {
    updateStandartPost(postId,editedContent, editedImage)
    .then(res => console.log(res))
    .then(window.location.reload())
    setShowEditModal(false);
  };
  const handleUpdatePost = () => {
    toggleDropDown()
    setShowEditModal(true); 
  };
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown)
}

  const handleCloseDeleteConfirmation = () => setShowDeleteConfirmation(false);
  const handleshowDeleteConfirmation = () => {
    toggleDropDown()
    setShowDeleteConfirmation(true)
};

  const handleToggleExpansion = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (videoRef.current) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5 
      };

      const handleIntersection = (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const video = entry.target;
            video.play().catch(error => console.error("Failed to play video:", error));
            setIsVideoPlaying(true);
          } else if (isVideoPlaying) {
            const video = entry.target;
            video.pause();
            setIsVideoPlaying(false);
          }
        });
      };

      const observer = new IntersectionObserver(handleIntersection, options);

      observer.observe(videoRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, [videoRef.current, isVideoPlaying]);



  const handleLikePost = () => {
    likePost(props.id, Number(localStorage.getItem("userId")), props.postType)
    .then(()=>{
      setLikeText(currentLikeText => currentLikeText === "Like" ? "Liked" : "Like")
      setLikesCount(prevLikesCount => likeText === "Like" ? prevLikesCount + 1 : prevLikesCount - 1);
    })
    .then(res => console.log(res))

  }
  const [userLikes, setUserLikes] = useState([])
  
  useEffect(() => {

    getLikes(props.id)
      .then(res => {
        setUserLikes(res.data)
        const userLiked = res.data.some(like => like.user.id === Number(localStorage.getItem("userId")));
        if (userLiked) {
          setLikeText("Liked");
        } else {
          setLikeText("Like");
        }
        setLikesCount(res.data.length)
      })
      .catch(error => {
        console.error("Error fetching likes:", error);
      });

      //save .... TODO!!!!!!
      const postSaved = props.saves.some(save => save.user.id === Number(localStorage.getItem("userId")))
      setIsSaved(postSaved)

      getFollowStatus(props.userId)
      .then(res => res ? setFollowed(true) : setFollowed(false))
  }, []);

  const handleSavePost = () => {
    console.log(props.postType)
    savePost(Number(localStorage.getItem("userId")), props.id, props.postType)
    .then(res => console.log(res))
    .then(setIsSaved(prevIsSaved => prevIsSaved ? false : true))
    setShowDropDown(false)
  }
  
  const handleRepost = () => {
    const postId = props.postType === "STANDART_POST" ? props.id : props.originalPost.id
    repost(Number(localStorage.getItem("userId")), postId)
    .then(res => console.log(res))
    .then(window.location.reload())
  }

  const handleLikesPage = () => {

    
    if(userLikes.length > 0){
      userLikes.map(like => console.log(like.user.firstName))
      setShowLikes(true)
    }
    
  }
  const handleCloseLikes = () =>{
    setShowLikes(false)
  }

  const handleFollow = () => {
    if(followed){
      unfollowUser(props.userId)
      .then(setFollowed(false))
    }else{
      followUser(props.userId)
      .then(setFollowed(true))
    }
  }
  
  return (
    <div className="radius post">
      <div className="top-section">
        <div>
        {props.postType === "REPOSTED" &&
         
        <div className="user-profile" style={{height:"50px"}}>
          <img className="avatar" style={{height:"30px", width:"30px"}} src={props.userImage === null ? `http://localhost:8081/media/avatar.jpg` : `http://localhost:8081/media/${props.userImage}`} alt="User avatar" />
          <div className="user-info">
          <p className="small-title">
              {props.postType === "REPOSTED" && (
                  <>
                      <NavLink to={`/profile/${props.repostUser}`} style={{textDecoration:"none", color:"#000"}}>{props.username}</NavLink> <span className="small-text" >has reposted</span>
                  </>
              )}
          </p>

            {/* <p className="small-label">{props.title}</p> */}
            <p className="small-label">{props.time}</p>
          </div>
          
        </div>}
        <div className="user-profile">
          <img className="avatar" src={props.userImage === null ? `http://localhost:8081/media/avatar.jpg` : (props.postType === "REPOSTED" ? `http://localhost:8081/media/${props.OriginalUserImage}` :  `http://localhost:8081/media/${props.userImage}`)} alt="User avatar" />
          <div className="user-info">
            <NavLink to={`/profile/${props.userId}`} style={{textDecoration:"none"}}>
              <p className="medium-title">{props.postType === "REPOSTED" ? props.originalUserName : props.username}</p>
            </NavLink>
            
            <p className="medium-label">{props.postType === "REPOSTED" ? props.originalPost.title : props.title}</p>
            <p className="small-label">{props.postType === "REPOSTED" ? formatPostTime(props.originalPost.date) : props.time}</p>
          </div>
        </div>
        </div>
        
        <div className="options">
          {Number(localStorage.getItem("userId")) !== props.userId && <button className="primary-button text-button" onClick={() => handleFollow()}>{followed ? "Followed" : "Follow"}</button>}
          <Dropdown show={showDropDown} onToggle={toggleDropDown}>
                    <Dropdown.Toggle style={{ background: 'none', border: 'none' }}>
                        <Icon icon="tabler:dots" style={{ cursor: "pointer", color:"black" }} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="my-dropdown-menu">
                        {
                        props.user === Number(localStorage.getItem("userId")) &&
                        <>
                            <div className="dropdown-option delete-option" onClick={handleshowDeleteConfirmation}>Delete</div>
                            {props.postType === "STANDART_POST" && <div className="dropdown-option update-option" onClick={handleUpdatePost}>Update</div>}
                        </>
                        }
                        
                        <div className="dropdown-option save-option" onClick={handleSavePost}>{isSaved ? "Unsave" : "Save"}</div>
                    </Dropdown.Menu>
                </Dropdown>

                <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
                    <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    Are you sure you want to delete this Post?
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={()=>{
                        deleteStandartPost(props.id, props.postType)
                        .then(res => console.log(res))
                        .then(window.location.reload())
                        }}>
                        Delete
                    </Button>
                    </Modal.Footer>
                </Modal>
        </div>
      </div>
      <div className="text-section">
        <p className="normal-text">
          {props.text && (expanded ? props.text : props.text.slice(0, MAX_CONTENT_LENGTH))}
        </p>
        {props.text && props.text.length > MAX_CONTENT_LENGTH && !expanded && (
          <span className="medium-label" onClick={handleToggleExpansion} style={{ cursor: "pointer" }}> See more</span>
        )}
      </div>
      {props.photo && !props.photo.endsWith("mp4") && <img src={`http://localhost:8081/media/${props.photo}`} className="post-media" alt="Post media" />}
      {props.photo && props.photo.endsWith("mp4") && <video ref={videoRef} src={`http://localhost:8081/media/${props.photo}`} className="post-media" controls muted></video>}

      <div className="info-section">
        <p className="medium-label" style={{cursor:"pointer"}} onClick={() => handleLikesPage()}>{likesCount} likes</p>
        <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
        <NavLink to={`/comments/${props.id}/${props.postType}`} style={{textDecoration: "none"}}>
          <p className="medium-label">{props.comments && props.comments.length} comments</p>
        </NavLink>
          
         <p className="medium-label">{props.reposts && props.reposts.length} repost</p> 
        </div>
        
      </div>
      <div className="interaction-section">
        <PostInteraction icon={likeText === "Liked" ? "bxs:like" : "bx:like"} text={likeText} style={likeText === "Liked" ? { color: "blue"} : null} onClick={handleLikePost} />
        <NavLink to={`/comments/${props.id}/${props.postType}`} style={{textDecoration: "none", width:"90px"}}><PostInteraction icon="material-symbols:comment-outline" text="Comment" /></NavLink>
        <PostInteraction icon="zondicons:repost" text="Repost" onClick={handleRepost} />
        <PostInteraction icon="ph:share-fat-bold" text="Share" />
        <PostInteraction icon={isSaved ? "mingcute:bookmark-fill" : "mingcute:bookmark-line"} text={isSaved ? "Saved" : "Save"} onClick={handleSavePost} />
      </div>
      <EditPostModal
        show={showEditModal} 
        handleClose={() => setShowEditModal(false)} 
        handleSave={handleSaveChanges} 
        initialContent={props.text} 
        image={props.photo}
        postId={props.id}
      />

    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={showLikes}
      onHide={handleCloseLikes}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Likes
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {userLikes.map(like => (
            <div className="user-profile">
            <img className="avatar" src={props.userImage === null ? `http://localhost:8081/media/avatar.jpg` : `http://localhost:8081/media/${props.userImage}`} alt="User avatar" width={33} height={33} />
            <div className="user-info">
              <NavLink to={`/profile/${like.user.id}`} style={{textDecoration:"none"}}>
                <p className="medium-title">{`${like.user.firstName} ${like.user.lastName}`}</p>
              </NavLink>
            </div>
          </div>
          ))}
      </ListGroup>
      </Modal.Body>
      
    </Modal>
    </div>
  );
}