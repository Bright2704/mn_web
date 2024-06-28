// app/user/pages/dashboard.tsx
import { metadata } from '../app/user/metadata';
import React from 'react';
import Layout from '../app/user/layout';  // Update the import path as necessary
import TrackingWidget from '../app/user/components/TrackingWidget';  // Import your widget
import Announcement from '@/app/user/components/Annoucement';
const dashboard = () => {
    return (
        <Layout>
            <div className="dashboard">
                <Announcement/>
            </div>
            <div className="content">
                    <TrackingWidget />  {/* Use your widget here */}
                    {/* Add more widgets as needed */}
            </div>
        </Layout>
    );
};

export default dashboard;