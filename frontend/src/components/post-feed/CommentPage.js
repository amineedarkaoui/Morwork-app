import React from "react";
import { getAllCommentLikesByPostId, getCommentById, getPostById, likeComment, newComment, newReply } from "../../api/app";
import { useParams } from "react-router-dom";
import Post from "./Post";
import Header from "../navigation/header";
import CommentElement from "./CommentElement";
import { Icon } from "@iconify/react/dist/iconify.js";
import Alert from 'react-bootstrap/Alert';

export default function CommentPage(){

    const [commentContent, setCommentContent] = React.useState("")
    const [comments, setComments] = React.useState([])
    const [commentLikes, setCommentLikes] = React.useState([])
    const [replyTo, setReplyto] = React.useState(null)




    const postId = useParams()
    const postType = useParams()
    const [post, setPost] = React.useState(null)
    const [error, setError] = React.useState(null); // State for holding error messages

    React.useEffect(() => {
        getPostById(postId.postId, postType.postType)
            .then(res => {
                setPost(res.data);
                const sortedComments = res.data.comments.sort((a, b) => new Date(b.date) - new Date(a.date));
                setComments(sortedComments);
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    setError("Post not found");
                } else {
                    setError("An error occurred while fetching the post.");
                }
            });
    }, [postId, postType]);
    
    const formatPostTime = (postDate) => {
        const currentDate = new Date();
        const postDateTime = new Date(postDate);
        const elapsedTimeInMilliseconds = currentDate - postDateTime;

        const seconds = Math.floor(elapsedTimeInMilliseconds / 1000);
        if (seconds < 60) {
            return `${seconds}s`;
        }

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) {
            return `${minutes}m`;
        }

        const hours = Math.floor(minutes / 60);
        if (hours < 24) {
            return `${hours}h`;
        }

        const days = Math.floor(hours / 24);
        return `${days}d`;
    };


    const handleCommentContent = (event) =>{
        setCommentContent(event.target.value)
    }

    const handleNewComment = () => {

        if(replyTo){
            newReply(replyTo.commentId, Number(localStorage.getItem("userId")), commentContent)
            .then(window.location.reload())
            return;
        }



        newComment(postId.postId, Number(localStorage.getItem("userId")), commentContent, postType.postType)
            .then(() => {
                return getPostById(postId.postId, postType.postType)
                    .then((res) => {
                        const sortedComments = res.data.comments.sort((a, b) => new Date(b.date) - new Date(a.date));
                        return { post: res.data, comments: sortedComments };
                    });
            })
            .then(({ post, comments }) => {
                setPost(post);
                setComments(comments);
                setCommentContent(""); 
            })
            .catch((error) => console.error("Failed to add comment:", error));
    };
    
    

    
    React.useEffect(() => {
        getAllCommentLikesByPostId(postId.postId)
            .then(res => {
                setCommentLikes(res.data)
            })
            .catch(error => {
                console.error("Failed to fetch comment likes:", error);
            });
    }, [postId.postId]);

    
    const handleReply = (username, commentId) => {
        setReplyto({username, commentId})
    }

    const handleCancelReply = ()=>{
        setReplyto(null)
    }

    console.log(post)
    return(
        <div style={{display: "flex", justifyContent: "center" , alignItems: "center", margin:"auto", width:"100%"}}>
        <Header isVisible={true}/>
        {error === null ? <div className="comment-page">
            <div className="post-container">
            {post && post.type === "STANDART_POST" ? (
                        <Post
                            key={post.id}
                            username={`${post.firstName} ${post.lastName}`}
                            title={post.title}
                            time={formatPostTime(post.date)}
                            text={post.content}
                            photo={post.image}
                            likes={post.likes}
                            comments={post.comments}
                            id={post.id}
                            user={post.userId}
                            saves={post.saves}
                            reposts={post.reposts}
                            postType={post.type}
                            userId={post.userId}
                            userImage={post.userProfilePicture}
                        />
                    ) : (post &&
                        <Post
                            key={post.id}
                            username={`${post.firstName} ${post.lastName}`}
                            title={post.title}
                            time={formatPostTime(post.date)}
                            text={post.originalPost.content}
                            photo={post.originalPost.image}
                            comments={post.comments}
                            id={post.id}
                            user={post.userId}
                            saves={post.saves}
                            originalPost={post.originalPost}
                            originalUserName={`${post.originalPost.firstName} ${post.originalPost.lastName}`}
                            reposts={post.reposts}
                            postType={post.type}
                            userId={post.originalPost.userId}
                            repostUser={post.userId}
                            OriginalUserImage={post.originalPost.userProfilePicture}
                            userImage={post.userProfilePicture}
                        />
                    )}
            </div>
            
                <div style={{position:"relative", background:"#FFF"}}>
                    
                <div className="comments-container radius">
                    <div className="large-title messages-list-header">
                        Comments
                    </div>
                    

                    { 
                        comments.map(comment => (
                        <CommentElement 
                        id={comment.id}
                        user={comment.user}
                        author={`${comment.user.firstName} ${comment.user.lastName}`} 
                        content={comment.content} 
                        replies={comment.replies}
                        likes={comment.likes}
                        //commentLikes={commentLikes}
                        postId={postId.postId}
                        onReply={handleReply}
                        formatTime={formatPostTime}
                        date={formatPostTime(comment.date)}
                        />))
                        }
                        
                
                </div>
                {replyTo && (
                        <div className="reply-container">
                            <div>Replying to: <b style={{color:"#000"}}>{replyTo.username}</b></div>
                            <Icon icon="ic:round-cancel" className="cancel-icon" onClick={handleCancelReply} style={{cursor:"pointer", fontSize:"17px"}} />
                        </div>
                )}
                <div className="comment-input-container" >
                    <input type="text" placeholder="leave a comment" name="comment" className="commentInput" onChange={(event)=>handleCommentContent(event)} value={commentContent}/>
                    <button className="primary-button comment-btn radius" onClick={()=>handleNewComment()}>Comment</button>
                </div>
            </div>
            
        </div>
        :
        <Alert variant="danger" style={{width:"50%", margin:"30px 0"}}>
                <Alert.Heading>Ach kadir al akh</Alert.Heading>
                <p>
                {error}
                </p>
        </Alert>
        }
        </div>
    )
}