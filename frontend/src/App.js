
import React from "react";
import Main from "./components/main-components/Main";
import Notification from "./components/notifications/Notification";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Feed from "./components/post-feed/Feed";
import UserProfile from "./components/profile-page/UserProfile";
import LoginPage from "./components/authentication/LoginPage";
import SignUp from "./components/authentication/SignUp";
import AuthProvider from "./auth/AuthProvider";
import PrivateRoute from "./auth/PrivateRoute";
import Jobs from "./components/jobs/Jobs";
import Settings from "./components/settings/Settings";
import ProfileSettings from "./components/settings/ProfileSettings";
import CommentPage from "./components/post-feed/CommentPage";
import { getNotificationsByUserId } from "./api/app";
import MessagesPage from "./components/messages/MessagesPage";
import OrganizationSettings from "./components/settings/settings_organization/OrganizationSettings";
import OrganizationCont from "./components/organization-page/OrganizationCont";
import { SearchPage } from "./components/search/SearchPage";
import ServerTester from "./components/main-components/ServerTester";
import ServerErrorPage from "./components/main-components/ServerErrorPage";

export default () => {

  const [notifications, setNotification] = React.useState([])

  React.useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      const fetchNotifications = async () => {
        try {
          const notifications = await getNotificationsByUserId(Number(userId))
          setNotification(notifications.data)
        }
        catch (err) {
          console.error(err)
        }
        
    };

        fetchNotifications();
    }
}, []);


    return (
        <div className="app">
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route element={<PrivateRoute />}>
                <Route element={<OrganizationCont />} path="/organization/:id" />
                <Route element={<Settings/>} path="/settings">
                  <Route element={<ProfileSettings />} path="/settings/profile" />
                  <Route element={<OrganizationSettings />} path="/settings/organization" />
                </Route>
                <Route path="/comments/:postId/:postType" element={<CommentPage />} />
              
              <Route path="/messages" element={<MessagesPage />}></Route>
              
                <Route element={<Main />}>
                    <Route path="/" element={<Feed />} />
                    <Route path="/jobs" element={<Jobs />} />
                    <Route path="/search" element={<SearchPage />}/>
                    <Route path="/notifications" element={<Notification notifications={notifications} />} />
                    <Route path="/profile/:userId" element={<UserProfile />} />  
                </Route>
              </Route>
              <Route element={<ServerTester />}> 
                <Route element={<ServerErrorPage />} path="/error" />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/personal-info" element={<h1>test</h1>} />
                  <Route element={<Settings/>} path="/settings">
                    <Route element={<ProfileSettings />} path="/settings/profile" />
                    <Route element={<OrganizationSettings />} path="/settings/organization" />
                  </Route>
                  <Route path="/comments/:postId/:postType" element={<CommentPage />} />
            
                  <Route path="/messages" element={<MessagesPage />}></Route>
            
                  <Route element={<Main />}>
                      <Route path="/" element={<Feed />} />
                      <Route path="/jobs" element={<Jobs />} />
                      <Route path="/notifications" element={<Notification notifications={notifications} />} />
                      <Route path="/profile/:userId" element={<UserProfile />} />  
                  </Route>
                </Route>
              </Route>
              
            </Routes>
          </AuthProvider>
        </Router>
      </div>
    )
}