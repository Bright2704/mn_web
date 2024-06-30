'use client'
import React from 'react';
// import NoticeCard from '../components/NoticeCard';
import dynamic from 'next/dynamic';

const NoticeCard = dynamic(() => import('../components/NoticeCard'), {
    ssr: false,  // This disables server-side rendering for the component
});

const Home = () => {
    return (
        <div>
            <NoticeCard />
        </div>
    );
};

export default Home;
