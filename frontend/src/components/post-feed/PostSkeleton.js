import React from 'react';
import { Icon } from '@iconify/react';
import Skeleton from 'react-loading-skeleton';

const PostSkeleton = () => {
    return (
        <div className="radius post">
            <div className="top-section">
                <div className="user-profile">
                    <Skeleton circle width={40} height={40} />
                    <div className="user-info">
                        <Skeleton width={100} />
                    </div>
                </div>
                <div className="options">
                    <Skeleton width={80} height={32} />
                    <Icon icon="tabler:dots" />
                </div>
            </div>
            <div className="text-section">
                <Skeleton count={1} />
            </div>
            <Skeleton height={300} className="post-media" />
            <div className="info-section">
                <Skeleton width={100} />
                <Skeleton width={120} />
            </div>
            <div className="interaction-section">
                <Skeleton height={20} />
            </div>
        </div>
    );
};

export default PostSkeleton;
