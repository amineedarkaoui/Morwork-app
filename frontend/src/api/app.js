import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.11.102:8081/morwork/api/v1",
    headers: {
        "ngrok-skip-browser-warning": "true"
    }
});

export const getPosts = () => {
    const token = localStorage.getItem("token");
    if (token) {
        return api.get("/post", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } else {
        return Promise.reject(new Error("Token not available"));
    }
};

export const newPost = (postData) => {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            return api.post("/post/newPost", postData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch(err) {
            console.error(err)
        }
        
    } else {
        return Promise.reject(new Error("Token not available"));
    }
};

export const likePost = (postId, userId, postType) => {
    const token = localStorage.getItem("token");
    
    if (token) {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append("postType", postType)
        
        return api.post(`/post/${postId}/like`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' 
            }
        });
    } else {
        return Promise.reject(new Error("Token not available"));
    }
};


export const getLikes = (id) =>{
    const token = localStorage.getItem("token");
    
    if (token) {

        
        return api.get(`/post/likes/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                
            }
        });
    } else {
        return Promise.reject(new Error("Token not available"));
    }

}

export const userCard = async () => {
    try {
        const res = await api.get(
            `/user/user-card?id=${localStorage.getItem('userId')}`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res.data
    } catch(err) {
        console.error(err)
    }
}
export const getUserCard = async (id) => {
    try {
        const res = await api.get(
            `/user/user-card?id=${id}`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res.data
    } catch(err) {
        console.error(err)
    }
}

export const getPostById = (postId, postType)=>{
    const token = localStorage.getItem("token");
    if (token) {
        
        return api.get(`/post/${postId}/${postType}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } else {
        return Promise.reject(new Error("Token not available"));
    }
}

export const getAllCommentLikesByPostId = (postId)=>{
    const token = localStorage.getItem("token");
    if (token) {
        
        return api.get(`/post/${postId}/commentLikes`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } else {
        return Promise.reject(new Error("Token not available"));
    }
}

export const newComment = (postId, userId, content,postType)=>{
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("postId", postId)
    data.append("userId", userId)
    data.append("content", content)
    data.append("postType", postType)
    
    if(token){
        return api.post("/post/newComment", data,{
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    }
}


export const likeComment = (commentId, userId)=>{
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("userId", userId);
    if(token){
        return api.post(`/post/likeComment/${commentId}`, data, {
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
    }
}


export const newReply = (commentId, userId, content) => {
    const token = localStorage.getItem("token")

    if(token){
        const data = new FormData()
        data.append("userId", userId)
        data.append("commentId", commentId)
        data.append("content", content)

        return api.post("/post/newReply", data,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
    }
}

export const likeReply = (replyId, userId)=>{
    const token = localStorage.getItem("token");
    if(token){
        const data = new FormData();
        data.append("replyId", replyId)
        data.append("userId", userId)
        return api.post("/post/likeReply", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
    
}



export const userProfile = (userId) => {
    try {
        return api.get(
            `/user/user-profile?id=${userId}`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
    } catch(err) {
        console.log("fuuuucking error")
        console.error(err)
    }
}

export const getPhoto = () => {
    return api.get(
        `/user/user-photo?id=${localStorage.getItem('userId')}`,
        {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
    )
}


export const deleteComment = (commentId) => {
    const token = localStorage.getItem("token");
    if (token) {
        return api.delete(`/post/${commentId}/comment`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } else {
        return Promise.reject(new Error("Token not available"));
    }
};
export const deleteStandartPost = (postId, postType) => {
    const token = localStorage.getItem("token");
    const data = new FormData();
    data.append("postType", postType)
    console.log(postType)
    if (token) {
        return api.delete(`/post/${postId}/Post/${postType}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } else {
        return Promise.reject(new Error("Token not available"));
    }
};
export const deleteReply = (replyId) => {
    const token = localStorage.getItem("token");
    if (token) {
        return api.delete(`/post/${replyId}/reply`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } else {
        return Promise.reject(new Error("Token not available"));
    }
};
export const updateComment = (commentId, content) => {
    const token = localStorage.getItem("token");
    if (token) {
        const data = new FormData()
        data.append("updatedContent", content)
        return api.put(`/post/${commentId}/comment`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } else {
        return Promise.reject(new Error("Token not available"));
    }
};
export const updateReply = (replyId, content) => {
    const token = localStorage.getItem("token");
    if (token) {
        const data = new FormData()
        data.append("updatedContent", content)
        return api.put(`/post/${replyId}/reply`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } else {
        return Promise.reject(new Error("Token not available"));
    }
};
export const updateStandartPost = (postId, content, image) => {
    console.log(postId)
    const token = localStorage.getItem("token");
    if (token) {
        const data = new FormData()
        data.append("content", content)
        data.append("image", image)
        return api.put(`/post/${postId}`,data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } else {
        return Promise.reject(new Error("Token not available"));
    }
};


export const savePost = (userId, postId, postType) => {
    const token = localStorage.getItem("token");
    if(token){
        const data = new FormData();
        data.append("userId", userId)
        data.append("postId", postId)
        data.append("postType", postType)
        
        return api.post("/post/savePost", data,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }else{
        return Promise.reject(new Error("Token not available"))
    }
}

export const repost = (userId, postId) => {
    const token = localStorage.getItem("token");
    if(token){
        const data = new FormData()
        data.append("userId", userId)
        data.append("postId", postId)
        return api.post("/post/repost", data,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }else{
        return Promise.reject(new Error("Token not available"))
    }
}

export const getUserById = (id) => {
    const token = localStorage.getItem("token");
    if(token){
        return api.get(`/user/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }else{
        return Promise.reject(new Error("Token not available"))
    }
} 

export const getNotificationsByUserId = (userId) =>{
    const token = localStorage.getItem("token")
    if(token){
        const data = new FormData()
        data.append("userId", userId)
        return api.get(`/notification/${userId}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}

export const updateToSeen = () => {
    const token = localStorage.getItem("token");

    if (token) {
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        return api.put(`/notification/notif`, null, config);
    } else {
        return Promise.reject(new Error("Token not available"));
    }
};




export const updateProfilePicture = async (image) => {
    const data = new FormData()
    data.append("image", image)
    data.append("userId", localStorage.getItem('userId'))

    try {
        const res = await api.put(
            `/user/update-profile-picture`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const updateCoverPicture = async (image) => {
    const data = new FormData()
    data.append("image", image)
    data.append("userId", localStorage.getItem('userId'))

    try {
        const res = await api.put(
            `/user/update-cover-picture`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const updateAbout = async (content) => {
    const data = new FormData()
    data.append("content", content)
    data.append("userId", localStorage.getItem('userId'))

    try {
        const res = await api.put(
            `/user/update-about`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const fetchAllSkills = async () => {
    try {
        const skills = await api.get(
            "/skills/get-all-skills",
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return skills.data
    } catch(err) {
        return err
    }
}

export const fetchAllCompanies = async () => {
    try {
        const companies = await api.get(
            "/company/get-all-companies",
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return companies.data
    } catch(err) {
        return err
    }
}

export const fetchAllSchools = async () => {
    try {
        const schools = await api.get(
            "/company/get-all-schools",
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return schools.data
    } catch(err) {
        return err
    }
}

export const fetchAllCities = async () => {
    try {
        const cities = await api.get(
            "/city/get-all-cities",
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return cities.data
    } catch(err) {
        return err
    }
}

export const fetchAllJobTypes = async () => {
    try {
        const jobTypes = await api.get(
            "/job-type/get-all-job-types",
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return jobTypes.data
    } catch(err) {
        return err
    }
}

export const fetchAllIndustries = async () => {
    try {
        const industries = await api.get(
            "/industry/get-all-industries",
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return industries.data
    } catch(err) {
        return err
    }
}

export const updateUserSkills = async (skills) => {
    try {
        const res = await api.put(
            `/skills/update-user-skills?userId=${localStorage.getItem('userId')}`,
            skills,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const deleteUserProfilePicture = async () => {
    try {
        const res = await api.put(
            `/user/delete-profile-picture?userId=${localStorage.getItem('userId')}`,
            {},
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const deleteUserCoverPicture = async () => {
    try {
        const res = await api.put(
            `/user/delete-cover-picture?userId=${localStorage.getItem('userId')}`,
            {},
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const addNewExperience = async (data) => {
    try {
        const res = await api.post(
            `/user/add-new-experience?userId=${localStorage.getItem('userId')}`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const addNewEducation = async (data) => {
    try {
        const res = await api.post(
            `/user/add-new-education?userId=${localStorage.getItem('userId')}`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const deleteExperience = async (id) => {
    try {
        const res = await api.put(
            `/experience/delete-experience?id=${id}`,
            {},
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const deleteEducation = async (id) => {
    try {
        const res = await api.put(
            `/education/delete-education?id=${id}`,
            {},
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const updateExperience = async (data) => {
    try {
        const res = await api.put(
            `/experience/update-experience`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const updateEducation = async (data) => {
    try {
        const res = await api.put(
            `/education/update-education`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const getFollowStatus = async (userId) => {
    try {
        const status = await api.get(
            `/user/get-follow-status?userId=${localStorage.getItem("userId")}&id=${userId}`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return status.data
    } catch(err) {
        return err
    }
}

export const followUser = async (userId) => {
    try {
        const response = await api.put(
            `/user/follow-user?userId=${localStorage.getItem("userId")}&id=${userId}`,
            {},
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return response.data
    } catch(err) {
        return err
    }
}

export const unfollowUser = async (userId) => {
    try {
        const response = await api.put(
            `/user/unfollow-user?userId=${localStorage.getItem("userId")}&id=${userId}`,
            {},
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return response.data
    } catch(err) {
        return err
    }
}

export const getUserOrganization = async () => {
    try {
        const organization = await api.get(
            `/user/get-user-company?userId=${localStorage.getItem("userId")}`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return organization.data
    } catch(err) {
        return err
    }
}

export const getDefaultLogo = async (type) => {
    try {
        const organization = await api.get(
            `/company/get-default-logo?type=${type}`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return organization.data
    } catch(err) {
        return err
    }
}

export const getDefaultCover = async () => {
    try {
        const organization = await api.get(
            `/company/get-default-cover`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return organization.data
    } catch(err) {
        return err
    }
}

export const addNewOrganization = async (logo, cover, formData) => {
    try {

        const res = await api.post(
            `/company/add-new-organization`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    "userId": localStorage.getItem("userId")
                }
            }
        )
        return res.data
    } catch (err) {
        return err
    }
}
    
export const updateOrganizationLogo = async (image, id) => {
    console.log("it's called nigga")
    const data = new FormData()
    data.append("image", image)
    data.append("id", id)

    try {
        const res = await api.put(
            `/company/update-company-image`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const updateOrganizationCover = async (cover, id) => {
    const data = new FormData()
    data.append("cover", cover)
    data.append("id", id)

    try {
        const res = await api.put(
            `/company/update-company-cover`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const isUserAdmin = async (id) => {
    try {
        const isAdmin = await api.get(
            `/user/is-user-admin?userId=${localStorage.getItem("userId")}&id=${id}`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return isAdmin.data
    } catch(err) {
        return err
    }
}

export const deleteOrganizationLogo = async (id) => {
    try {
        const res = await api.put(
            `/company/delete-image?id=${id}`,
            {},
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const deleteOrganizationCover = async (id) => {
    try {
        const res = await api.put(
            `/company/delete-cover?id=${id}`,
            {},
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const updateDescription = async (content, id) => {
    const data = new FormData()
    data.append("content", content)
    data.append("id", id)

    try {
        const res = await api.put(
            `/company/update-description`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const leaveOrganization = async () => {
    const data = new FormData()
    data.append("userId", localStorage.getItem("userId"))

    try {
        const res = await api.put(
            `/user/leave-organization`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const updateOrganizationInfo = async (data) => {
    try {
        const res = await api.put(
            `/company/update-info`,
            data,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const postJobOffer = async (id, data) => {
    try {
        const res = await api.post(
            `/post/post-job-offer`,
            data,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                params: {
                    "id": id
                }
            }
        )
        return res.data
    } catch (err) {
        return err
    }
}

export const getCompanyOffers = async (id) => {
    try {
        const offers = await api.get(
            `/post/get-company-offers?id=${id}`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return offers.data
    } catch(err) {
        return err
    }
}

export const getAllOffers = async () => {
    try {
        const offers = await api.get(
            `/post/get-all-offers`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return offers.data
    } catch(err) {
        return err
    }
}
    
export const getOrganization = async (id) => {
    try {
        const response = await api.get(
            `/company/get-company?id=${id}`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return response.data
    } catch(err) {
        return err
    }
}

export const NewApply = async (userId, description, jobId) => {
    const data = new FormData()
    data.append("userId", userId)
    data.append("description", description)
    data.append("jobId", jobId)

    try{
        const res = await api.post(`/job-type/new-apply`, data,
            {headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }}
        )
    }catch(err){
        return err;
    }
}

export const getAllApplies = async () => {
    try{
        const result = await api.get("/job-type/applies",
        {headers:{
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }}
        )
        return result;
    }catch(err){
        return err;
    }
}

export const getAppliesByJobId = async (id) => {
    try{
        const res = await api.get(`/job-type/applies/${id}`,
            {headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }}
        )
        return res
    }catch(err){
        return err;
    }
}

export const searchUser = async (keyWord) => {
    try{
        const res = await api.get(`/user/search-users?keyWord=${keyWord}`,
            {headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }}
        )
        return res.data
    }catch(err){
        return err;
    }
}
export const searchCompany = async (keyWord) => {
    try{
        const res = await api.get(`/user/search-company?keyWord=${keyWord}`,
            {headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }}
        )
        return res.data
    }catch(err){
        return err;
    }
}

export const searchJobs = async (keyWord) => {
    try{
        const res = await api.get(`/post/get-jobs-by-keyword?keyWord=${keyWord}`,
            {headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }}
        )
        return res.data
    }catch(err){
        return err;
    }
}
export const searchPosts = async (keyWord) => {
    try{
        const res = await api.get(`/post/get-posts-by-keyword?keyWord=${keyWord}`,
            {headers:{
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }}
        )
        return res.data
    }catch(err){
        return err;
    }
}

export const isUserSignedUp = async () => {
    try {
        const response = await api.get(
            `/user/is-signed-up?userId=${localStorage.getItem("userId")}`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return response.data
    } catch(err) {
        return err
    }
}

export const updateUserInfo = async (data) => {
    try {
        const res = await api.put(
            `/user/update-user-info`,
            data.skills,
            {
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
                params: {
                    "about":data.about, 
                    "title": data.title,
                    "userId": localStorage.getItem("userId")
                }
            }
        )
        return res
    } catch (err) {
        console.error(err)
        return err
    }
}

export const demoRequest = async () => {
    try {
        const response = await api.get(
            `/demo/hello`,
            {headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}}
        )
        return response
    } catch(err) {
        return err
    }
}

export const getChatUsers = async () => {
    try {
        const response = await api.get(
            `/message/get-chat-users`,
            {
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
                params: {
                    id: localStorage.getItem("userId"),
                }
            }
        )
        return response.data
    } catch(err) {
        return err
    }
}

export const sendMessage = async (receiverId, content) => {
    try {
        const response = await api.post(
            `/message/send-message`,
            {},
            {
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
                params: {
                    receiverId: receiverId,
                    senderId: localStorage.getItem("userId"),
                    content: content,
                }
            }
        )
        return response.data
    } catch(err) {
        return err
    }
}

export const getUserChat = async (senderId) => {
    try {
        const response = await api.get(
            `/message/get-user-chat`,
            {
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
                params: {
                    receiverId: localStorage.getItem("userId"),
                    senderId: senderId,
                }
            }
        )
        return response.data
    } catch(err) {
        return err
    }
}

export const getUserLastMessage = async (senderId) => {
    try {
        const response = await api.get(
            `/message/get-user-last-message`,
            {
                headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`},
                params: {
                    receiverId: localStorage.getItem("userId"),
                    senderId: senderId,
                }
            }
        )
        return response.data
    } catch(err) {
        return err
    }
}