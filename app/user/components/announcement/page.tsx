'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';

const AnnouncementBar = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/announcement/get');
        console.log('Fetched announcements:', response.data); // เพิ่มการ log ข้อมูลที่ได้รับ
        if (Array.isArray(response.data)) {
          setAnnouncements(response.data); 
        } else {
          console.error('Data is not an array:', response.data);
          setAnnouncements([]); 
        }
      } catch (error) {
        console.error('Error fetching announcements:', error); 
        setError('ไม่สามารถดึงข้อมูลประกาศได้');
      } finally {
        setLoading(false); // เมื่อโหลดเสร็จแล้ว
      }
    };
  
    fetchAnnouncements();
  }, []);
  

  if (loading) {
    return <div>กำลังโหลดประกาศ...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (announcements.length === 0) {
    console.log('No announcements to display');
    return null;
  }

  return (
    <div>
      {announcements.map((announcement, index) => (
        <div
          key={index}
          className={`announcement-bar ${announcement.color === '#f44336' ? 'red-bar' : 'green-bar'}`}
          style={{
            backgroundColor: announcement.color || '#FFF9C4',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '10px',
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: marked(announcement.content || '', { breaks: true }), // เพิ่ม { breaks: true }
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default AnnouncementBar;
