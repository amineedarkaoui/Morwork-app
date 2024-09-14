import { Search } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import JobItem from "../jobs/JobItem";
import { searchJobs, searchPosts } from "../../api/app";
import Post from "../post-feed/Post";
import { formatPostTime } from "../post-feed/Feed";

const useQuery = () => {
    return new URLSearchParams(useLocation().search)
}

export const SearchPage = (props) => {
    const query = useQuery()
    const location = useLocation()
    const [currentFilter, setCurrentFilter] = React.useState("all")
    const [keyWord, setKeyWord] = useState(query.get("keyWord") || "")
    const [jobsSuggestions, setJobsSuggestions] = React.useState([])
    const [posts, setPosts] = React.useState([])
    const {personSuggestion = [] , companySuggestion = []} = location.state || {}
    

    useEffect(() => {
        const getJobsByKeyword = async () => {
            if (keyWord.trim() === "") {
                return;
            }
            const res1 = await searchJobs(keyWord);
            const res2 = await searchPosts(keyWord)
            if (res1 instanceof Error || res2 instanceof Error) {
                console.error("Error fetching job suggestions:", res1);
                return;
            } else {
                setJobsSuggestions(res1);
                setPosts(res2)
            }
        };

        getJobsByKeyword();
    }, [keyWord]);

    const style = {
        scrollbarWidth: currentFilter === "posts" ? "none" : "auto"
    }

    return (
        <div className="search-page radius" style={style}>
            <div className="seach-page-header">
                <span className={currentFilter === "all" && "active-search-filter"} onClick={() => setCurrentFilter("all")}>All</span>
                <span className={currentFilter === "person" && "active-search-filter"} onClick={() => setCurrentFilter("person")}>Person</span>
                <span className={currentFilter === "company" && "active-search-filter"} onClick={() => setCurrentFilter("company")}>Company</span>
                <span className={currentFilter === "jobs" && "active-search-filter"} onClick={() => setCurrentFilter("jobs")}>Jobs</span>
                <span className={currentFilter === "posts" && "active-search-filter"} onClick={() => setCurrentFilter("posts")}>Posts</span>
            </div>
            { currentFilter === "all" && 
            <div>
                <div className="all-filter">
                    <p className="medium-title" style={{padding:"4px 13px"}}>Person</p>
                    {personSuggestion.length > 0 ? personSuggestion.map(suggestion => (
                        <NavLink to={`/profile/${suggestion.id}`}>
                            <div className="user-profile " style={{padding:"10px"}}>
                                <img className="avatar" src={suggestion.profilePicture === null ? `http://localhost:8081/media/avatar.jpg` : `http://localhost:8081/media/${suggestion.profilePicture}`} alt="User avatar" width={40} height={40} />
                                <div className="user-info"  style={{padding:"0"}}>
                                <NavLink to={`/profile/${suggestion.id}`} style={{textDecoration:"none"}}>
                                    <p className="medium-title">{`${suggestion.firstName} ${suggestion.lastName}`}</p>
                                    <p className="small-label">{"Software Enginner"}</p>
                                </NavLink>
                                </div>
                            </div>
                        </NavLink>
                    )) : <p className="medium-label" style={{textAlign:"center"}}>No user found</p>}
                </div> 


                <div className="all-filter">
                    <p className="medium-title" style={{padding:"4px 13px"}}>Company</p>
                    {companySuggestion.length > 0 ? companySuggestion.map(suggestion => (
                        <NavLink>
                            <div className="user-profile " style={{padding:"10px"}}>
                                <img className="avatar" src={suggestion.image === null ? `http://localhost:8081/media/ramLogo-922e16d8.jpg` : `http://localhost:8081/media/${suggestion.image}`} alt="User avatar" width={45} height={45} />
                                <div className="user-info"  style={{padding:"0"}}>
                                <NavLink to={`/organization/${props.id}`} style={{textDecoration:"none"}}>
                                    <p className="medium-title">{`${suggestion?.name}`}</p>
                                    <p className="small-label">{suggestion.industry?.name}</p>
                                </NavLink>
                                </div>
                            </div>
                        </NavLink>
                    )) : <p className="medium-label" style={{textAlign:"center"}}>No company found</p>}
                </div> 

                <div className="all-filter">
                    <p className="medium-title" style={{padding:"4px 13px"}}>Jobs</p>
                    {jobsSuggestions.length > 0 ? jobsSuggestions.map(suggestion => (
                        <JobItem
                            company={suggestion.company}
                            city={suggestion.city}
                            title={suggestion.title}
                            description={suggestion.description}    
                        />
                    )) : <p className="medium-label" style={{textAlign:"center"}}>No job found</p>}
                    
                </div> 
            </div>
}
            {
                currentFilter === "person" &&
                <div className="all-filter">
                    <p className="medium-title" style={{padding:"4px 13px"}}>Person</p>
                    {personSuggestion.length > 0 ? personSuggestion.map(suggestion => (
                        <NavLink to={`/profile/${suggestion.id}`}>
                            <div className="user-profile " style={{padding:"10px"}}>
                                <img className="avatar" src={suggestion.profilePicture === null ? `http://localhost:8081/media/avatar.jpg` : `http://localhost:8081/media/${suggestion.profilePicture}`} alt="User avatar" width={40} height={40} />
                                <div className="user-info"  style={{padding:"0"}}>
                                <NavLink to={`/profile/${suggestion.id}`} style={{textDecoration:"none"}}>
                                    <p className="medium-title">{`${suggestion.firstName} ${suggestion.lastName}`}</p>
                                    <p className="small-label">{"Software Enginner"}</p>
                                </NavLink>
                                </div>
                            </div>
                        </NavLink>
                    )) : <p className="medium-label" style={{textAlign:"center"}}>No user found</p>}
                </div> 
            }

            {
                currentFilter === "company" &&
                <div className="all-filter">
                    <p className="medium-title" style={{padding:"4px 13px"}}>Company</p>
                    {companySuggestion.length > 0 ? companySuggestion.map(suggestion => (
                        <NavLink>
                            <div className="user-profile " style={{padding:"10px"}}>
                                <img className="avatar" src={suggestion.image === null ? `http://localhost:8081/media/ramLogo-922e16d8.jpg` : `http://localhost:8081/media/${suggestion.image}`} alt="User avatar" width={45} height={45} />
                                <div className="user-info"  style={{padding:"0"}}>
                                <NavLink to={`/profile/${props.id}`} style={{textDecoration:"none"}}>
                                    <p className="medium-title">{`${suggestion?.name}`}</p>
                                    <p className="small-label">{suggestion.industry?.name}</p>
                                </NavLink>
                                </div>
                            </div>
                        </NavLink>
                    )) : <p className="medium-label" style={{textAlign:"center"}}>No company found</p>}
                </div> 
            }

            {
                currentFilter === "jobs" &&
                <div className="all-filter">
                    <p className="medium-title" style={{padding:"4px 13px"}}>Jobs</p>
                    {jobsSuggestions.length > 0 ? jobsSuggestions.map(suggestion => (
                        <JobItem
                            company={suggestion.company}
                            city={suggestion.city}
                            title={suggestion.title}
                            description={suggestion.description}    
                        />
                    )) : <p className="medium-label" style={{textAlign:"center"}}>No job found</p>}
                    
                </div>  
            }

            {
                currentFilter === "posts" &&
                <div className="all-filter" style={{width:"70%", marginLeft:"auto", marginRight:"auto"}}>
                    <p className="medium-title" style={{padding:"4px 13px"}}>Posts</p>
                    {posts.length > 0 ?  posts.map(post => (
                        post.type === "STANDART_POST" ?
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
                        :
                        <Post
                            key={post.id}
                            username={`${post.firstName} ${post.lastName}`}
                            title={post.title}
                            time={formatPostTime(post.date)}
                            text={post.originalPost.content}
                            photo={post.originalPost.image}
                            //likes={post.likes}
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
                    )) : <p className="medium-label" style={{textAlign:"center"}}>No post found</p>}
                </div>
            }

        </div>
    )
}