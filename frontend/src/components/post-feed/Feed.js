import React, { useState, useEffect } from "react";
import Post from "./Post";
import SideInfo from "../main-components/SideInfo";
import PostSkeleton from "./PostSkeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { getPosts, searchUser } from "../../api/app";

export default function Feed(props) {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [displayedPosts, setDisplayedPosts] = useState(4); 
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        getPosts()
            .then(res => {
                setPosts(res.data);
                setIsLoading(false);
            })
            .catch(err => console.log(err));

        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = document.documentElement || document.body;
            
            const bottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
        
            if (bottom && !loadingMore) {
                if (displayedPosts >= posts.length) {
                    console.log("Les post Lmla7 salaw")
                    return;
                }
                setLoadingMore(true);
                setTimeout(() => {
                    setDisplayedPosts(prev => prev + 4); 
                    setLoadingMore(false);
                }, 300); 
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [displayedPosts, loadingMore, posts.length]);

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
    


    return (
        <div className="home-page">
            <div className="post-feed">
                {isLoading ? (
                    <>
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                    </>
                ) : (
                    
                    posts.slice(0, displayedPosts).map(post => (
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
                    ))
                )}
                {loadingMore && <PostSkeleton />}
            </div>
            <SideInfo />
        </div>
    );
}


export const formatPostTime = (postDate) => {
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