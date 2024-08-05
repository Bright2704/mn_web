"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../../styles/globals.css';
import ModalDeposit from '../../components/wallet/deposit/ModalDeposit'; // Import the modal component

type Deposit = {
  deposit_id: string;
  date: string;
  user_id: string;
  amount: number | string;
  status: string;
};

const statuses = [
  { label: 'สถานะทั้งหมด', value: 'all' },
  { label: 'รอตรวจสอบ', value: 'รอตรวจสอบ' },
  { label: 'สำเร็จ', value: 'สำเร็จ' },
  { label: 'ไม่สำเร็จ', value: 'ไม่สำเร็จ' },
  // Add other statuses if needed
];

const searchTopics = [
  { label: 'หมายเลข', value: 'deposit_id' },
  { label: 'ลูกค้า', value: 'user_id' },
];

const DepositPage: React.FC = () => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTopic, setSearchTopic] = useState<keyof Deposit>('deposit_id');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null); // State to store selected deposit

  useEffect(() => {
    const fetchDeposits = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedStatus === 'all') {
          const requests = statuses.filter(status => status.value !== 'all').map(status =>
            axios.get<Deposit[]>(`http://localhost:5000/deposits/status/${status.value}`)
          );
          const results = await Promise.all(requests);
          const allDeposits = results.flatMap(result => result.data);
          response = { data: allDeposits };
        } else {
          response = await axios.get<Deposit[]>(`http://localhost:5000/deposits/status/${selectedStatus}`);
        }
        setDeposits(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deposits:', error);
        setError('Failed to fetch deposit data');
        setLoading(false);
      }
    };

    fetchDeposits();
  }, [selectedStatus]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement search functionality here if needed
  };

  const handleManageClick = (deposit: Deposit) => {
    if (deposit.status === 'รอตรวจสอบ') {
      setSelectedDeposit(deposit); // Set the selected deposit data
      setShowModal(true);
    } else {
      // Handle other statuses if needed
    }
  };

  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">รายการฝากเงิน</h3>
      </div>

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
        <table className="table table-width-1">
          <thead>
            <tr className="text-center">
              <th>หมายเลขการฝาก</th>
              <th>ผู้ใช้</th>
              <th>วันที่</th>
              <th>จำนวนเงิน</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-3">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center p-3">Error: {error}</td>
              </tr>
            ) : deposits.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-3">No deposits found.</td>
              </tr>
            ) : (
              deposits
                .filter(deposit =>
                  deposit[searchTopic].toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(deposit => (
                  <tr key={deposit.deposit_id}>
                    <td>{deposit.deposit_id}</td>
                    <td>{deposit.user_id}</td>
                    <td>{deposit.date}</td>
                    <td>{deposit.amount}</td>
                    <td>{deposit.status}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => handleManageClick(deposit)}>
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
            {/* Add pagination controls here */}
          </ul>
        </div>
      </div>

      {/* Pass the selected deposit to the ModalDeposit component */}
      {selectedDeposit && (
        <ModalDeposit show={showModal} onHide={() => setShowModal(false)} deposit={selectedDeposit} />
      )}
    </div>
  );
};

export default DepositPage;
