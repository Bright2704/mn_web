'use client'; // This marks the component as a client component

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import EasyMDE from 'easymde'; // นำเข้า EasyMDE
import { marked } from 'marked'; // นำเข้า Marked.js สำหรับแปลง Markdown
import 'easymde/dist/easymde.min.css'; // โหลด CSS ของ EasyMDE

const API_URL = 'http://localhost:5001/api/announcement'; // ระบุ URL ของ API ที่ backend

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newColor, setNewColor] = useState('#FFF9C4');
  const [originalContent, setOriginalContent] = useState('');
  const editorRef = useRef(null);

  // ดึงข้อมูลประกาศจาก Backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${API_URL}/get`);
        setAnnouncements(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };
    fetchAnnouncements();
  }, []);

  const startEditing = (id, content) => {
    if (editingId && editingId !== id) {
      alert('กรุณาบันทึกหรือยกเลิกการแก้ไขก่อนหน้า');
      return;
    }
    setEditingId(id);
    setOriginalContent(content);

    setTimeout(() => {
      const textarea = document.getElementById(`editor-${id}`);
      if (textarea && !editorRef.current) {
        editorRef.current = new EasyMDE({
          element: textarea,
          initialValue: content,
          autoDownloadFontAwesome: true,
          toolbar: [
            "bold", "italic", "heading", "|",
            "quote", "unordered-list", "ordered-list", "|",
            "link", "image", "|",
            "preview", "side-by-side", "fullscreen",
          ],
        });
      }
    }, 300);
  };

  const saveEdit = async (id) => {
    if (!editorRef.current) return;

    const updatedContent = editorRef.current.value();
    try {
      await axios.post(`${API_URL}/update/${id}`, { content: updatedContent });
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement._id === id ? { ...announcement, content: updatedContent } : announcement
        )
      );
      destroyEditor();
      setEditingId(null);
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const cancelEdit = () => {
    destroyEditor();
    setEditingId(null);
  };

  const destroyEditor = () => {
    if (editorRef.current) {
      try {
        editorRef.current.toTextArea();
      } catch (error) {
        console.error('Error destroying EasyMDE:', error);
      }
      editorRef.current = null;
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const addAnnouncement = async () => {
    try {
      const response = await axios.post(`${API_URL}/create`, {
        content: 'ประกาศใหม่',
        color: newColor,
      });
      setAnnouncements([...announcements, response.data]);
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#FCE4EC', borderRadius: '8px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#444' }}>รายการประกาศ</h1>
      {announcements.map((announcement) => (
        <div
          key={announcement._id}
          style={{
            backgroundColor: announcement.color || '#FFF9C4',
            margin: '10px 0',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {editingId === announcement._id ? (
            <div>
              <textarea id={`editor-${announcement._id}`} />
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <button
                  onClick={() => saveEdit(announcement._id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    marginRight: '10px',
                    cursor: 'pointer',
                  }}
                >
                  บันทึก
                </button>
                <button
                  onClick={cancelEdit}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div
                className="markdown-content"
                style={{ whiteSpace: 'pre-wrap', fontSize: '16px' }}
                dangerouslySetInnerHTML={{ __html: marked(announcement.content || 'ไม่มีข้อความ') }}
              />
              <div style={{ textAlign: 'right', marginTop: '10px' }}>
                <button
                  onClick={() => startEditing(announcement._id, announcement.content)}
                  style={{
                    marginRight: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => deleteAnnouncement(announcement._id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  ลบ
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <label htmlFor="colorPicker" style={{ marginRight: '10px' }}>
          เลือกสีพื้นหลัง:
        </label>
        <input
          id="colorPicker"
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          style={{
            cursor: 'pointer',
            marginRight: '10px',
          }}
        />
        <button
          onClick={addAnnouncement}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          เพิ่มประกาศ
        </button>
      </div>
    </div>
  );
};

export default AnnouncementList;
