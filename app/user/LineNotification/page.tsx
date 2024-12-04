'use client';

import React, { useState, useEffect } from 'react';

const LineLoginPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loginStatus, setLoginStatus] = useState<string>(''); 
    const [statusLine, setStatusLine] = useState<boolean | null>(null); 
    const [showPopup, setShowPopup] = useState<boolean>(false);

    const fetchStatusLine = async () => {
        try {
            const responseSession = await fetch('http://localhost:3000/api/auth/session');
            const data = await responseSession.json();

            if (!data.user || !data.user.user_id) {
                console.error('User ID not found in session data');
                return;
            }

            const responseStatus = await fetch(`http://localhost:5001/users/status/${data.user.user_id}`)
            const statusData = await responseStatus.json();

            if (statusData.status_line !== undefined) {
                setStatusLine(statusData.status_line);
                console.log('Status Line:', statusData.status_line); 
            } else {
                console.error('Status line not found in the response');
            }
        } catch (error) {
            console.error('Error fetching status line:', error);
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
        script.onload = () => {
            initializeApp(); 
        };
        document.body.appendChild(script);

        const storedUserProfile = localStorage.getItem('userProfile');
        if (storedUserProfile) {
            setUserProfile(JSON.parse(storedUserProfile));
            setIsLoggedIn(true);
            setLoginStatus('success');
        }

        fetchStatusLine();

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const initializeApp = () => {
        window.liff.init({ liffId: '2006545984-bnyRkq1E' })
            .then(() => {
                checkLoginStatus();
            })
            .catch((err: any) => {
                console.error('LIFF initialization failed', err);
                setLoading(false);
                setLoginStatus('failed');
            });
    };

    const checkLoginStatus = () => {
        if (window.liff.isLoggedIn()) {
            getProfile();
        } else {
            setIsLoggedIn(false);
        }
        setLoading(false);
    };

    const getProfile = () => {
        window.liff.getProfile()
            .then((profile: any) => {
                setUserProfile(profile);
                console.log('User profile:', profile);
                setIsLoggedIn(true);
                setLoginStatus('success');
                setShowPopup(true);

                localStorage.setItem('userProfile', JSON.stringify(profile));

                updateUserLineId(profile);
            })
            .catch((err: any) => {
                console.error('Failed to get user profile', err);
                setLoginStatus('failed');
            });
    };

    const updateUserLineId = async (profile: any) => {
        try {
            const responseSession = await fetch('http://localhost:3000/api/auth/session');
            const data = await responseSession.json();
            if (!data.user || !data.user.user_id) {
                console.error('User ID not found in session data');
                return;
            }

            const response = await fetch(`http://localhost:5001/users/update/${data.user.user_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lineId: profile.userId }),
      });

        if (response.ok) {
            const updatedUser = await response.json();
            console.log('User updated:', updatedUser);
        } else {
            console.error('Error updating user line ID:', response.status);
        }
    } catch (error) {
        console.error('Error updating user line ID:', error);
    }
};

const deleteUserLineId = async () => {
    try {
        const responseSession = await fetch('http://localhost:3000/api/auth/session');
        const data = await responseSession.json();
        if (!data.user || !data.user.user_id) {
            console.error('User ID not found in session data');
            return;
        }

        const response = await fetch(`http://localhost:5001/users/remove/${data.user.user_id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
      });

    if (response.ok) {
        const updatedUser = await response.json();
        console.log('User line ID removed:', updatedUser);
        setStatusLine(false); // Set status to false when lineId is removed
        setUserProfile(null); // Clear user profile
        window.liff.logout(); // Logout the user from Line
        setIsLoggedIn(false); // Update login status
    } else {
        console.error('Error removing user line ID:', response.status);
    }
} catch (error) {
    console.error('Error removing user line ID:', error);
}
  };

const handleLoginClick = () => {
    setLoading(true);
    window.liff.login();
};

if (loading) {
    return <p>กำลังล็อกอิน...</p>;
}

return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {statusLine === null ? (
            <p>กำลังโหลดสถานะ...</p> 
        ) : statusLine ? (
            <>
                <h2>เชื่อมต่อแล้ว</h2>
                <button
                    onClick={deleteUserLineId}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '10px',
                    }}
                >
                    Logout
                </button>
            </>
        ) : (
            <>
                <button
                    onClick={handleLoginClick}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Login with Line
                </button>
            </>
        )}

        {showPopup && (
            <div style={{ marginTop: '20px' }}>
            </div>
        )}
    </div>
);
};

export default LineLoginPage;