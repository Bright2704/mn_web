'use client';

import React, { useState, useEffect } from 'react';

const LineLoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<string>(''); // ใช้สถานะเดียว
  const [userIdFromServer, setUserIdFromServer] = useState<string>(''); // เก็บ user_id ที่ดึงมา
  const [showPopup, setShowPopup] = useState(false); // สถานะการแสดง popup

  useEffect(() => {
    if (loading) {
      const script = document.createElement('script');
      script.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
      script.onload = () => {
        initializeApp();
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [loading]);

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
      window.liff.login();
    }
  };

  const getProfile = () => {
    window.liff.getProfile()
      .then((profile: any) => {
        setUserProfile(profile);
        console.log('User profile:', profile);
        setIsLoggedIn(true);
        setLoading(false);
        updateUserLineId(profile); // อัพเดต lineId
        setLoginStatus('success');
        setShowPopup(true); // แสดง popup เมื่อ login สำเร็จ
      })
      .catch((err: any) => {
        console.error('Failed to get user profile', err);
        setLoading(false);
        setLoginStatus('failed');
      });
  };
  const updateUserLineId = async (profile) => {
    try {
      // Fetch the session data
      const responseSession = await fetch('http://localhost:3000/api/auth/session');
      const data = await responseSession.json();
      console.log('Session data:', data);
  
      // Check if user_id exists in the session data (inside the user object)
      if (!data.user || !data.user.user_id) {
        console.error('User ID not found in session data');
        return; // Exit early if user_id is missing
      }
  
      // Proceed with the PATCH request to update the user
      const response = await fetch(`http://localhost:5000/users/update/${data.user.user_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineId: profile.userId,  // ใช้ profile.userId ที่ได้จาก LIFF
        }),
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
  

  const logout = () => {
    window.liff.logout();
    window.location.reload();
  };

  if (loading) {
    return <p>กำลังล็อกอิน...</p>;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
  

      {!isLoggedIn ? (
        <button
          onClick={() => setLoading(true)}
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
      ) : (
        <>
          <h2>User Profile</h2>
          <p><strong>Display Name:</strong> {userProfile.displayName}</p>
          <p><strong>Status Message:</strong> {userProfile.statusMessage}</p>
          <p><strong>User ID:</strong> {userProfile.userId}</p>
          <p><strong>Language:</strong> {userProfile.language}</p>
          <img src={userProfile.pictureUrl} alt="User Profile" />
          <button
            onClick={logout}
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </>
      )}

      {userIdFromServer && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>User ID from Server:</strong> {userIdFromServer}</p>
        </div>
      )}
    </div>
  );
};

export default LineLoginPage;
