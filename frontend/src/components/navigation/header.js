import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { searchCompany, searchUser } from "../../api/app";

export default function Header(props){

    const [showDropDown, setShowDropDown] = React.useState(true)
    const [personSuggestion, setPersonSuggestion] = React.useState([])
    const [companySuggestion, setCompanySuggestion] = React.useState([])
    const [keyWord, setKeyWord] = React.useState("")
    const naviagte = useNavigate()

    const dropdownRef = React.useRef(null);

    function handleSubmit(event){
        event.preventDefault();
    }
    const headerStyle = {
        display: props.isVisible ? "flex" : "none"
    };

    const dropDownStyle = {
        display: showDropDown ? "block" : "none"
    }

    const getSuggestions = async () => {
        if (keyWord.trim().length === 0) {
            setPersonSuggestion([]);
            setShowDropDown(false);
            return;
        }

        try {
            const res1 = await searchUser(keyWord);
            const res2 = await searchCompany(keyWord);
            if (res1 instanceof Error || res2 instanceof Error) {
                console.log("Error fetching suggestions");
                setShowDropDown(false);
            } else {
                setPersonSuggestion(res1);
                setCompanySuggestion(res2)
                setShowDropDown(res1.length > 0 || res2.length > 0);
            }
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setShowDropDown(false);
        }
    };


    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropDown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    React.useEffect(() => {
        getSuggestions()
    }, [keyWord])

    const handleSearch = () => {
        if (keyWord.trim() !== "") {
            naviagte(`/search?keyWord=${keyWord}`, {state :{personSuggestion, companySuggestion}});
        }
    };

    return (
        <div className="header elevation-1" style={headerStyle}>
            <Link className="link" to="/">
                <h1 className="large-title">MorWork</h1>
            </Link>
            
            <form className="search-form" onSubmit={handleSubmit} style={{position:"relative"}}>
                <input placeholder="Search" className="medium-text" onChange={(e)=>{setKeyWord(e.target.value)}} />
                <button className="medium-text"><i class="fa-solid fa-magnifying-glass" onClick={() => handleSearch()}></i></button>
                <ul className="drop-down-search" style={dropDownStyle} ref={dropdownRef}>
                    {personSuggestion.length > 0 && <p className="small-label" style={{marginTop:"5px"}}>Person</p>}

                    {personSuggestion.map(suggestion => (
                        <li onClick={()=>{setShowDropDown(false)}}><NavLink to={`/profile/${suggestion.id}`}>
                        
                            <div className="user-profile" >
                                <img className="avatar" src={suggestion.profilePicture === null ? `http://localhost:8081/media/avatar.jpg` : `http://localhost:8081/media/${suggestion.profilePicture}`} alt="User avatar" width={33} height={33} />
                                <div className="user-info"  style={{padding:"0"}}>
                                <NavLink to={`/profile/${suggestion.id}`} style={{textDecoration:"none"}}>
                                    <p className="medium-title">{`${suggestion.firstName} ${suggestion.lastName}`}</p>
                                    <p className="small-label">{suggestion.title}</p>
                                </NavLink>
                                </div>
                            </div>
    
    
                        </NavLink></li>
                    ))}

                    



                    {companySuggestion.length > 0 && <p className="small-label" style={{marginTop:"5px"}}>Company</p>}
                    {companySuggestion.map(suggestion => (
                        <li onClick={()=>{setShowDropDown(false)}}><NavLink to={``}>
                        
                            <div className="user-profile" >
                                <img className="avatar" src={suggestion.image === null ? `http://localhost:8081/media/avatar.jpg` : `http://localhost:8081/media/${suggestion.image}`} alt="User avatar" width={33} height={33} />
                                <div className="user-info"  style={{padding:"0"}}>
                                <NavLink to={``} style={{textDecoration:"none"}}>
                                    <p className="medium-title">{`${suggestion?.name}`}</p>
                                    <p className="small-label">{`${suggestion.industry?.name}`}</p>
                                </NavLink>
                                </div>
                            </div>
    
    
                        </NavLink></li>
                    ))}


                </ul>
                <i className="fa-regular fa-message medium-text headerIcon"></i>
                <i className="fa-solid fa-gear headerIcon"></i>
            </form>
        
        </div>
    
    )
}