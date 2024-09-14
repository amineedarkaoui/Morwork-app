import React from "react";
import { NavLink } from "react-router-dom";



export default function Applies (props){

    console.log(props.applies)

    return(
        <div className="applies" style={{marginBottom:"66px"}}>
            { props.applies.length > 0 ?
                (props.applies).map(apply => 
                    <div>
                        <div className="apply" style={{padding:"10px", display:"grid", gridTemplateColumns:"1fr"}}>
                            <div className="user-profile" style={{marginBottom:"10px"}}>
                                <img className="avatar" src={apply.user.profilePicture === null ? `http://localhost:8081/media/avatar.jpg` : `http://localhost:8081/media/${apply.user.profilePicture}`} alt="User avatar" width={33} height={33} />
                                <div className="user-info">
                                    <NavLink to={`/profile/${apply.user.id}`} style={{textDecoration:"none"}}>
                                        <p className="medium-title">{`${apply.user.firstName} ${apply.user.lastName}`}</p>
                                    </NavLink>
                                </div>
                            </div>
                            <div style={{marginLeft:"33px"}}>
                                <p className="medium-title">Apply description</p>
                                <div className="jobDetail normal-text" style={{wordBreak:"break-word", overflowWrap:"break-word"}}>
                                    {apply.description}
                                    Royal Air Maroc and Safran strengthen their partnership through the signing of a new memorandum of understanding aimed at developing aircraft engine maintenance. Marking a significant advancement in the Moroccan aerospace industry, this MoU plans an increase in capacity by 2,000 square meters with an investment of 30 million dirhams, and will increase the number of maintenance operations from 70 to 100 shop
                                </div>
                                <div className="separator"></div>
                            </div>
                        </div>
                    </div>
                    
                )
                :
                <p className="large-label" style={{width:"100%",textAlign:"center", margin:"80px auto"}}>no apply</p>
            }
        </div>
    )
}