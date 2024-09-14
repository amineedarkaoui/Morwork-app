import React from "react";
import { newPost } from "../../api/app";
import {useAuth} from "../../auth/AuthProvider"

export default function NewPost(props){

    const [content, setContent] = React.useState("");
    const [photo, setPhoto] = React.useState(null);

    function handleImage(event){
        const file = event.target.files[0]
        setPhoto(file)
    }
    
    const {userId} = useAuth();
    const postData = new FormData();
    React.useEffect(() => {
        postData.append("content", content);
        postData.append("image", photo);
        postData.append("author", userId)
    }, [content, photo]);

    async function handleSubmit(event) {
        try {
            await newPost(postData);
            setContent(""); 
            setPhoto(null); 
        } catch (error) {
            console.error("Error submitting post:", error);
        }
    }
    
    return(
        <div className={`darkBackground ${props.isVisible}`} onClick={props.hide}>
            <div className="new-post-content elevation-5 radius" onClick={(event) => event.stopPropagation()}>
                <div className="new-post-header">
                    <h1 className="large-title">New Post</h1>
                    <i class="fa-solid fa-xmark" onClick={props.hide}></i>
                </div>
                <form>
                    <div className="">
                        <textarea className="large-text" placeholder="What do you want to talk about?" onChange={(event) => setContent(event.target.value)}>
                        </textarea>
                    </div>
                    <div>
                        <label htmlFor="file"><i class="fa-solid fa-file"></i></label>
                        <input type="file" id="file" onChange={(event) => handleImage(event)}/>
                        {photo && photo.type.startsWith("image") && <img width={42} height={42} src={URL.createObjectURL(photo)} />}
                        {photo && photo.type.startsWith("video") && <video width={42} height={42} src={URL.createObjectURL(photo)}></video>}
                    </div>
                    <div>
                        <button className="on-button radius" onClick={(event) => handleSubmit(event)}>Poster</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

