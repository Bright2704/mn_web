// pages/deposit/DepositPage.tsx

"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../../styles/globals.css';
import ModalDeposit from '../../components/wallet/deposit/ModalDeposit'; // Import the existing modal component
// import ModalDeposit from '../../components/wallet/deposit/ModalDeposit'; // Import the new modal component

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
  { label: 'รอตรวจสอบ', value: 'wait' },
  { label: 'สำเร็จ', value: 'succeed' },
  { label: 'ไม่สำเร็จ', value: 'cancel' },
];

const bankOptions = [
  { value: 'bbl', label: 'ธนาคารกรุงเทพ', image: '/storage/icon/bank/bbl.png' },
  { value: 'ktb', label: 'ธนาคารกรุงไทย', image: '/storage/icon/bank/ktb.jpg' },
  { value: 'scbb', label: 'ธนาคารไทยพาณิชย์', image: '/storage/icon/bank/scbb.jpg' },
  { value: 'gsb', label: 'ธนาคารออมสิน', image: '/storage/icon/bank/gsb.jpg' },
  { value: 'bay', label: 'ธนาคารกรุงศรีอยุธยา', image: '/storage/icon/bank/bay.png' },
  { value: 'kbank', label: 'ธนาคารกสิกรไทย', image: '/storage/icon/bank/kbank.jpg' },
  { value: 'kkp', label: 'ธนาคารเกียรตินาคินภัทร', image: '/storage/icon/bank/kkp.jpg' },
  { value: 'citi', label: 'ซิตี้แบงก์', image: '/storage/icon/bank/citi.jpg' },
  { value: 'ttb', label: 'ทีเอ็มบีธนชาต', image: '/storage/icon/bank/ttb.png' },
  { value: 'uobt', label: 'ธนาคารยูโอบี', image: '/storage/icon/bank/uobt.jpg' },
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
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedDepositId, setSelectedDepositId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeposits = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedStatus === 'all') {
          const requests = statuses.filter(status => status.value !== 'all').map(status =>
            axios.get<DepositNew[]>(`http://localhost:5000/deposits/status/${status.value}`)
          );
          const results = await Promise.all(requests);
          const allDeposits = results.flatMap(result => result.data);
          response = { data: allDeposits };
        } else {
          response = await axios.get<DepositNew[]>(`http://localhost:5000/deposits/status/${selectedStatus}`);
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

  const handleManageClick = (depositId: string) => {
    setSelectedDepositId(depositId);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedDepositId(null);
  };

  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">รายการฝากเงิน</h3>
        {/* <button
          className="btn btn-success px-4 py-2.5 ml-2 mr-10"
          style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
          onClick={() => setShowModal(true)}
        >
          เติมเงินเข้าระบบ
        </button> */}
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
              <th>No.</th>
              <th>ผู้ทำรายการ</th>
              <th>วันที่ทำรายการ</th>
              <th>วันที่อนุมัติ</th>
              <th>จำนวน</th>
              <th>ธนาคาร</th>
              <th>หลักฐาน</th>
              <th>สถานะ</th>
              <th>ตรวจสอบ</th>
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
                    <td className="text-center">
                    {(() => {
                      const bank = bankOptions.find(b => b.value === deposit.bank);
                      return bank ? (
                        <img 
                          src={bank.image} 
                          alt={bank.label}
                          className="centered-img_icon_bank"
                          style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                        />
                      ) : (
                        deposit.bank // Fallback in case no match is found
                      );
                    })()}
                  </td>
                    <td className="text-center">
                      {deposit.slip ? (
                        <img 
                          src={deposit.slip} 
                          alt="Slip" 
                          className="centered-img_icon_bank"
                          style={{ width: '70px', height: '70px', objectFit: 'contain', cursor: 'pointer' }}
                          onClick={() => window.open(deposit.slip, '_blank')}
                        />
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>
                    {(() => {
                      const status = statuses.find(s => s.value === deposit.status);
                      return status ? status.label : deposit.status; // Fallback to deposit.status if no match is found
                    })()}
                  </td>
                    <td>
                      <button className="btn btn-success" onClick={() => handleManageClick(deposit.deposit_id)} style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}>
                        รายละเอียด
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

      {/* Existing Modal for Deposit
      {showModal && (
        <ModalDeposit show={showModal} onClose={handleCloseModal} />
      )} */}

      {/* New Modal for Deposit Details */}
      {showDetailsModal && selectedDepositId && (
        <ModalDeposit show={showDetailsModal} depositId={selectedDepositId} onClose={handleCloseDetailsModal} />
      )}
    </div>
  );
};

export default DepositPage;
