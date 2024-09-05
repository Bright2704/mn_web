"use client";

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../styles/globals.css';
import ModalWait from '../components/tracking/ModalAddTrack';
import ModalAddTrack from '../components/tracking/ModalAddTrack'; // Import ModalAddTrack

type TrackingItem = {
  user_id: string;
  tracking_id: string;
  lot_id: string;
  lot_type: string;
  pricing: string;
  transport: number;
  crate: string;
  check_product: string;
  in_cn: string;
  out_cn: string;
  in_th: string;
  status: string;
};

const statuses = [
  { label: 'สถานะทั้งหมด', value: 'all' },
  { label: 'รอเข้าโกดังจีน', value: 'รอเข้าโกดังจีน' },
  { label: 'เข้าโกดังจีน', value: 'เข้าโกดังจีน' },
  { label: 'ออกจากจีน', value: 'ออกจากจีน' },
  { label: 'ถึงไทย', value: 'ถึงไทย' },
  { label: 'รอชำระเงิน', value: 'รอชำระเงิน' },
  { label: 'เตรียมส่ง', value: 'เตรียมส่ง' },
  { label: 'ส่งแล้ว', value: 'ส่งแล้ว' }
];

const searchTopics = [
  { label: 'เลขพัสดุ', value: 'tracking_id' },
  { label: 'รหัสผู้ใช้', value: 'user_id' },
];

const TrackPage: React.FC = () => {
  const [allTrackingItems, setAllTrackingItems] = useState<TrackingItem[]>([]);  // All items
  const [trackingItems, setTrackingItems] = useState<TrackingItem[]>([]);  // Filtered items
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchTopic, setSearchTopic] = useState<keyof TrackingItem>('tracking_id');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalAddTrack, setShowModalAddTrack] = useState<boolean>(false); // ModalAddTrack state

  // Fetch data on component load
  useEffect(() => {
    const fetchTrackingItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/tracking');
        if (!response.ok) {
          throw new Error('Failed to fetch tracking data');
        }
        const data = await response.json();
        setAllTrackingItems(data);  // Store the full dataset
        setTrackingItems(data);     // Also store in the visible tracking items
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tracking items:', error);
        setError('Failed to fetch tracking data');
        setLoading(false);
      }
    };
  
    fetchTrackingItems();
  }, []);  // Only fetch the data on initial load

  // Update trackingItems when selectedStatus changes
  useEffect(() => {
    if (selectedStatus === 'all') {
      setTrackingItems(allTrackingItems);  // Show all items if "all" is selected
    } else {
      const filteredItems = allTrackingItems.filter(item => item.status === selectedStatus);
      setTrackingItems(filteredItems);  // Filter by selected status
    }
  }, [selectedStatus, allTrackingItems]);  // Re-run when selectedStatus or allTrackingItems change

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (!searchTerm) {
      setTrackingItems(allTrackingItems); // Reset to full data if search term is cleared
      return;
    }

    const filteredItems = allTrackingItems.filter((item) => {
      const value = item[searchTopic]; // Get the value for the selected search topic

      // Convert value to string and check if it includes the search term
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });

    setTrackingItems(filteredItems); // set the filtered items to state
  };

  const handleManageClick = (status: string) => {
    if (status === 'รอตรวจสอบ') {
      setShowModal(true);
    } else {
      // Handle other statuses if needed
    }
  };

  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">รายการสั่งซื้อ</h3>
        <div className="d-flex align-items-center">
          <input 
            type="text" 
            placeholder="ค้นหา" 
            className="anan-input__input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="w-50 ml-1 custom-select custom-select-sm"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value as keyof TrackingItem)}
          >
            <option value="tracking_id">เลขพัสดุ</option>
            <option value="user_id">รหัสผู้ใช้</option>
          </select>
          <button type="submit" className="btn btn-outline-secondary ml-2 w-15" onClick={handleSearch}>
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>

      {/* Navigation panel for status filtering */}
      <div className="nav-panel">
        <div className="anan-tabs__nav">
          <div className="anan-tabs__nav-warp px-2 table-container" style={{ marginTop: '5px' }}>
            <div className="anan-tabs__nav-tabs">
              {statuses.map(status => (
                <div 
                  key={status.value} 
                  className={`anan-tabs__nav-tab ${selectedStatus === status.value ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(status.value)}
                >
                  <span>{status.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 table-container">
      <div className="p-1">
        <div className="flex mb-4">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => setShowModalAddTrack(true)}  // Open Add Lot modal on click
          >
            เพิ่มล็อตสินค้า
          </button>
        </div>
      </div>
        <table className="table table-width-1">
          <thead>
            <tr className="text-center">
              <th>รหัสผู้ใช้</th>
              <th>เลขพัสดุ</th>
              <th>ล็อต</th>
              <th>ประเภท/ขนส่ง</th>
              <th>คิดตาม</th>
              <th>ค่าส่งจีน</th>
              <th>ตีลัง</th>
              <th>เช็คสินค้า</th>
              <th>เข้าโกดังจีน</th>
              <th>ออกจากจีน</th>
              <th>ถึงไทย</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={13} className="text-center">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={13} className="text-center text-danger">{error}</td>
              </tr>
            ) : trackingItems.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center">No tracking items found.</td>
              </tr>
            ) : (
              trackingItems.map((item) => (
                <tr key={item.tracking_id}>
                  <td>{item.user_id}</td>
                  <td>{item.tracking_id}</td>
                  <td>{item.lot_id}</td>
                  <td>{item.lot_type}</td>
                  <td>{item.pricing}</td>
                  <td>{item.transport}</td>
                  <td>{item.crate}</td>
                  <td>{item.check_product}</td>
                  <td>{item.in_cn}</td>
                  <td>{item.out_cn}</td>
                  <td>{item.in_th}</td>
                  <td>{item.status}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => handleManageClick(item.status)}>
                      จัดการ
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="demo-spacing-0 d-flex justify-content-end">
          <ul className="pagination mb-0">
            {/* Add pagination controls here if needed */}
          </ul>
        </div>
      </div>

      {/* Show ModalAddTrack */}
      <ModalAddTrack 
        show={showModalAddTrack} 
        onClose={() => setShowModalAddTrack(false)} 
      />

      {/* Other modal */}
      <ModalWait show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default TrackPage;
