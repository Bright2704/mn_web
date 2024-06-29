// app/user/pages/dashboard.tsx

import React from 'react';
import Layout from '../layout';  // Update the import path as necessary
import TrackingWidget from '../components/TrackingWidget';  // Import your widget
// import Announcement from '@/app/user/components/Annoucement';
const dashboard = () => {
    return (
            <div className="content">
                    <TrackingWidget />  {/* Use your widget here */}
                    {/* Add more widgets as needed */}
            </div>
    );
};

export default dashboard;