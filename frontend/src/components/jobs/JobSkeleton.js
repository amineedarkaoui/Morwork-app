import React from "react";
import Skeleton from 'react-loading-skeleton';

const JobSkeleton = () => {
    return (
        <div style={{width:"100%"}}>
            <div className="jobItem">
                <div className="top-job">
                    <div className="shortInfo-job">
                        <Skeleton circle width={40} height={40} />
                        <div className="info-job">
                            <Skeleton width={120} />
                            <Skeleton width={80} />
                            <Skeleton width={100} />
                        </div>
                    </div>
                    <div className="small-label"><Skeleton width={60} /></div>
                </div>
                <div className="bottom-job">
                    <div className="primary-button" onClick={() => {}}>
                        <Skeleton width={80} />
                    </div>
                </div>
            </div>
            <div className="separator"></div>
            <div className="jobDetailContainer">
                <div className="separator"></div>
                <h1 className="medium-title"><Skeleton width={150} /></h1>
                <div className="jobDetail medium-text">
                    <Skeleton count={3} />
                </div>
                <div className="supplementaireInfo">
                    <div className="postHour"><span><Skeleton width={40} /></span></div>
                    <div className="salary"><span> <Skeleton width={50} /></span></div>
                </div>
            </div>
            <div className="separator"></div>
        </div>
    );
};

export default JobSkeleton;
