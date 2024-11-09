"use client";


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react'; // Import getSession
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../../styles/globals.css';
import ModalDeposit from '../../components/wallet/deposit/ModalDeposit';
import ModalDepositDetails from '../../components/wallet/deposit/ModalDepositDetails';

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

  const DepositPage: React.FC = () => {
  const [allDeposits, setAllDeposits] = useState<DepositNew[]>([]);  // Store all deposits initially
  const [deposits, setDeposits] = useState<DepositNew[]>([]);        // Store filtered deposits
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');  // Store selected status
  const [userId, setUserId] = useState<string | null>(null);           // Store the user_id
  const [showModal, setShowModal] = useState<boolean>(false);           // Store modal visibility
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);  // Store details modal visibility
  const [selectedDepositId, setSelectedDepositId] = useState<string | null>(null);

  // Fetch the session and extract user_id on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id; // Type assertion
        if (userId) {
          setUserId(userId); // Set the user_id from session
        } else {
          console.error('User ID not found in session');
        }
      }
    };

    fetchSession();
  }, []);

  // Fetch all deposits for the user
  useEffect(() => {
    const fetchAllDeposits = async () => {
      setLoading(true);
      setError(null);  // Reset error state before fetching

      try {
        if (userId) {
          const response = await axios.get(`http://localhost:5000/deposits_new/user_id/${userId}/status/all`);
          setAllDeposits(response.data);  // Store all deposits
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deposits:', error);
        setError('Failed to fetch deposit data');
        setLoading(false);
      }
    };

    if (userId) {
      fetchAllDeposits();  // Fetch all deposits for the user
    }
  }, [userId]);  // Only run when userId is available

  // Filter deposits based on selectedStatus
  useEffect(() => {
    if (selectedStatus === 'all') {
      setDeposits(allDeposits);  // Show all deposits if status is "all"
    } else {
      const filteredDeposits = allDeposits.filter(deposit => deposit.status === selectedStatus);
      setDeposits(filteredDeposits);  // Filter deposits by status
    }
  }, [selectedStatus, allDeposits]);
  

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
        <button
          className="btn btn-success px-4 py-2.5 ml-2 mr-10"
          style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
          onClick={() => setShowModal(true)}
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
              {/* <th>No.</th> */}
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
              deposits.map(deposit => (
                <tr key={deposit.deposit_id}>
                  {/* <td>{deposit.deposit_id}</td> */}
                  <td>{deposit.date_deposit}</td>
                  <td>{deposit.date_success}</td>
                  <td>{deposit.amount}</td>
                  <td className="text-center">
                    {deposit.bank === 'kbank' ? (
                      <img 
                        src="/storage/icon/bank/kbank.jpg" 
                        alt="ธนาคารกสิกรไทย"
                        className="centered-img_icon_bank"
                        style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                      />
                    ) : (
                      deposit.bank
                    )}
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
                  <td>{deposit.status}</td>
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

      {/* Existing Modal for Deposit */}
      {showModal && (
        <ModalDeposit show={showModal} onClose={handleCloseModal} />
      )}

      {/* New Modal for Deposit Details */}
      {showDetailsModal && selectedDepositId && (
        <ModalDepositDetails show={showDetailsModal} depositId={selectedDepositId} onClose={handleCloseDetailsModal} />
      )}
    </div>
  );
};

export default DepositPage;
