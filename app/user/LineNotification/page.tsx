// app/user/pages/LineNotification.tsx

import React from 'react';
import LineNotification from '../components/LineNotification';  // Import your widget

const dashboard = () => {
    return (
        <div className="content">
                <LineNotification />  {/* Use your widget here */}
                {/* Add more widgets as needed */}
        </div>
    );
};

export default dashboard;