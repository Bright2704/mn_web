'use client';

import React, { useState, useEffect } from 'react';

const LineLoginPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<string>(''); // ใช้สถานะเดียว
  const [userIdFromServer, setUserIdFromServer] = useState<string>(''); // เก็บ user_id ที่ดึงมา

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
        setIsLoggedIn(true);
        setLoading(false);
        updateUserLineId(profile);
        setLoginStatus('success');  // เมื่อ login สำเร็จ
      })
      .catch((err: any) => {
        console.error('Failed to get user profile', err);
        setLoading(false);
        setLoginStatus('failed');
      });
  };

  const updateUserLineId = async (profile) => {
    try {
      // ดึง User ID จาก session
      const responseSession = await fetch('http://localhost:5000/api/users/get-user-id');
      const data = await responseSession.json();
      
      if (data.user_id) {
        // ส่งข้อมูลไปอัปเดตในฐานข้อมูล
        const response = await fetch(`http://localhost:5000/api/users/update/${data.user_id}`, {
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
      } else {
        console.error('User ID not found in session');
      }
    } catch (error) {
      console.error('Error updating user line ID:', error);
    }
  };

  // ฟังก์ชันสำหรับดึง user ID จากเซิร์ฟเวอร์
  const getUserId = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/get-user-id');
      const data = await response.json();

      if (data.user_id) {
        setUserIdFromServer(data.user_id); // เก็บ user_id ที่ดึงมา
      } else {
        console.error('No user ID found');
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
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
      {loginStatus === 'success' && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: 9999,
          }}
        >
          Login สำเร็จ
        </div>
      )}

      {loginStatus === 'failed' && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#dc3545',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: 9999,
          }}
        >
          Login ล้มเหลว
        </div>
      )}

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

      {/* ปุ่มสำหรับเรียกใช้ get-user-id */}
      <button
        onClick={getUserId}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Get User ID
      </button>

      {userIdFromServer && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>User ID from Server:</strong> {userIdFromServer}</p>
        </div>
      )}
    </div>
  );
};

export default LineLoginPage;
