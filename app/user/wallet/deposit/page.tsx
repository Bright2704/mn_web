"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../../styles/globals.css';
import ModalDeposit from '../../components/wallet/deposit/ModalDeposit'; // Import the modal component

type DepositNew = {
  deposit_id: string;
  date_deposit: string;
  date_success: string;
  user_id: string;
  amount: number | string;
  bank: string;
  status: string;
  slip: string;
};

const statuses = [
  { label: 'สถานะทั้งหมด', value: 'all' },
  { label: 'รอตรวจสอบ', value: 'รอตรวจสอบ' },
  { label: 'สำเร็จ', value: 'สำเร็จ' },
  { label: 'ไม่สำเร็จ', value: 'ไม่สำเร็จ' },
];

const searchTopics = [
  { label: 'หมายเลข', value: 'deposit_id' },
  { label: 'ลูกค้า', value: 'user_id' },
];

const DepositPage: React.FC = () => {
  const [deposits, setDeposits] = useState<DepositNew[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTopic, setSearchTopic] = useState<keyof DepositNew>('deposit_id');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchDeposits = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedStatus === 'all') {
          const requests = statuses.filter(status => status.value !== 'all').map(status =>
            axios.get<DepositNew[]>(`http://localhost:5000/deposits_new/status/${status.value}`)
          );
          const results = await Promise.all(requests);
          const allDeposits = results.flatMap(result => result.data);
          response = { data: allDeposits };
        } else {
          response = await axios.get<DepositNew[]>(`http://localhost:5000/deposits_new/status/${selectedStatus}`);
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

  const handleManageClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">รายการฝากเงิน</h3>
        <button
          className="btn btn-success px-4 py-2.5 ml-2 mr-10"
          style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
          onClick={handleManageClick}
        >
          เติมเงินเข้าระบบ
        </button>
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
              <th>ลูกค้า</th>
              <th>วันที่ฝาก</th>
              <th>วันที่สำเร็จ</th>
              <th>จำนวนเงิน</th>
              <th>ธนาคาร</th>
              <th>สถานะ</th>
              <th>สลิป</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center p-3">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center p-3">Error: {error}</td>
              </tr>
            ) : deposits.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-3">No deposits found.</td>
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
                    <td>{deposit.date_deposit}</td>
                    <td>{deposit.date_success}</td>
                    <td>{deposit.amount}</td>
                    <td>{deposit.bank}</td>
                    <td>{deposit.status}</td>
                    <td>{deposit.slip ? <a href={deposit.slip} target="_blank" rel="noopener noreferrer">View</a> : 'N/A'}</td>
                    <td>
                      <button className="btn btn-success" onClick={handleManageClick}>
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

      {/* Modal Component */}
      {showModal && (
      <ModalDeposit show={showModal} onClose={handleCloseModal} />
    )}
    </div>
  );
};

export default DepositPage;
