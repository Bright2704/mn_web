"use client";

import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../../styles/globals.css';
import ModalWithdraw from '../../components/wallet/withdraw/ModalWithdraw';
import ModalWithdrawDetails from '../../components/wallet/withdraw/ModalWithdrawDetails';

interface Withdraw {
  withdraw_id: string;
  date_withdraw: string;
  date_success: string;
  withdraw_amount: number;
  bank: string;
  slip: string;
  status: string;
}

const statuses = [
  { label: 'สถานะทั้งหมด', value: 'all' },
  { label: 'รอตรวจสอบ', value: 'wait' },
  { label: 'สำเร็จ', value: 'success' },
  { label: 'ไม่สำเร็จ', value: 'failed' },
];

const WithdrawPageUser: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [withdraws, setWithdraws] = useState<Withdraw[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWithdrawId, setSelectedWithdrawId] = useState<string>('');
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Fetch user session
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id;
        setUserId(userId || null);
      }
    };
    fetchSession();
  }, []);

  // Fetch withdraws when userId or selectedStatus changes
  useEffect(() => {
    const fetchWithdraws = async () => {
      if (!userId) return;
      
      try {
        const response = await axios.get(`http://localhost:5000/withdraws/user/${userId}`);
        let filteredWithdraws = response.data;
        
        if (selectedStatus !== 'all') {
          filteredWithdraws = filteredWithdraws.filter(
            (withdraw: any) => withdraw.status === selectedStatus
          );
        }
        
        setWithdraws(filteredWithdraws);
      } catch (error) {
        console.error('Error fetching withdraws:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdraws();
  }, [userId, selectedStatus, showDetailsModal]); // Include showWithdrawModal to refresh after new withdraw

  const handleOpenModal = () => {
    setShowWithdrawModal(true);
  };

  const handleCloseModal = () => {
    setShowWithdrawModal(false);
  };

  // Function to translate status to Thai
  const getStatusInThai = (status: string) => {
    switch (status) {
      case 'wait':
        return 'รอตรวจสอบ';
      case 'success':
        return 'สำเร็จ';
      case 'failed':
        return 'ไม่สำเร็จ';
      default:
        return status;
    }
  };

  // Function to get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'wait':
        return 'bg-warning text-dark';
      case 'success':
        return 'bg-success text-white';
      case 'failed':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const handleCheckDetails = (withdrawId: string) => {
    setSelectedWithdrawId(withdrawId);
    setShowDetailsModal(true);
  };

  const fetchLastBalance = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/balances/user/${userId}/last`);
      if (response.data) {
        console.log('Latest balance record:', response.data); // Debug log
        setTotalAmount(response.data.balance_total);
      } else {
        console.log('No balance records found'); // Debug log
        setTotalAmount(0);
      }
    } catch (error) {
      console.error('Error fetching last balance:', error);
      setTotalAmount(0);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id;
        if (userId) {
          setUserId(userId);
          // Fetch the last balance once we have the user ID
          await fetchLastBalance(userId);
        } else {
          console.error('User ID not found in session');
        }
      }
    };
  
    fetchSession();
  }, []);
  
  // Add this useEffect to refresh the balance when deposits change
  useEffect(() => {
    if (userId) {
      fetchLastBalance(userId);
    }
  }, [withdraws, showDetailsModal, showModal]); 


  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">ถอนเงินออกจากระบบ</h3>
        <div className="d-flex align-items-center" style={{ gap: "24px" }}>
          {/* Total Amount Information */}
          <div>
            {/* Action Buttons */}
            <div className="d-flex align-items-center" style={{ gap: "20px" }}>
              <p
                className="mb-1"
                style={{ color: "#198754", fontSize: "24px" }}
              >
                ยอดเงินในระบบ{" "}
              </p>
              <div className="bg-light p-2 rounded">
                <h5
                  className="mb-0"
                  style={{ color: "#198754", fontSize: "30px" }}
                >
                  {totalAmount.toLocaleString()} ฿
                </h5>
              </div>
              <button
          className="btn btn-success px-4 py-2.5 ml-2 mr-10"
          style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
          onClick={handleOpenModal}
        >
          ถอนเงินออกจากระบบ
        </button>
            </div>
          </div>
        </div>
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
                <td colSpan={7} className="text-center p-3">Loading...</td>
              </tr>
            ) : withdraws.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-3">ไม่พบข้อมูล</td>
              </tr>
            ) : (
              withdraws.map((withdraw) => (
                <tr key={withdraw.withdraw_id} className="text-center">
                  <td>{withdraw.date_withdraw}</td>
                  <td>{withdraw.date_success || '-'}</td>
                  <td>{withdraw.withdraw_amount.toLocaleString()} ฿</td>
                  <td>{withdraw.bank}</td>
                  <td>
                    {withdraw.slip ? (
                      <button className="btn btn-sm btn-info">ดูหลักฐาน</button>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(withdraw.status)} px-2 py-1`}>
                      {getStatusInThai(withdraw.status)}
                    </span>
                  </td>
                  <td>
                  <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleCheckDetails(withdraw.withdraw_id)}
                    >
                      ตรวจสอบ
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

      {/* Withdraw Modal */}
      {showWithdrawModal && <ModalWithdraw show={showWithdrawModal} onClose={handleCloseModal} />}
      {showDetailsModal && (
        <ModalWithdrawDetails
          show={showDetailsModal}
          withdrawId={selectedWithdrawId}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default WithdrawPageUser;