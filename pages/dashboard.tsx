// app/user/pages/dashboard.tsx
import { metadata } from '../app/user/metadata';
import React from 'react';
import Layout from '../app/user/layout';  // Update the import path as necessary
import TrackingWidget from '../app/user/components/TrackingWidget';  // Import your widget

const dashboard = () => {
    return (
        <Layout>
            <div className="dashboard">
                <h1>Dashboard</h1>
                <div className="content">
                    <TrackingWidget />  {/* Use your widget here */}
                    {/* Add more widgets as needed */}
                </div>
            </div>
        </Layout>
    );
};

export default dashboard;