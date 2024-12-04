"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../../styles/globals.css';
import ModalWithdraw from '../../components/wallet/withdraw/ModalWithdrawal';

interface Withdraw {
  withdraw_id: string;
  user_id: string;
  date_withdraw: string;
  date_success: string;
  withdraw_amount: number;
  bank: string;
  account_name: string;
  account_number: string;
  branch: string;
  slip: string;
  status: string;
}

const statuses = [
  { label: 'สถานะทั้งหมด', value: 'all' },
  { label: 'รอตรวจสอบ', value: 'wait' },
  { label: 'สำเร็จ', value: 'success' },
  { label: 'ไม่สำเร็จ', value: 'failed' },
];

const WithdrawPageAdmin: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showWithdrawModal, setShowWithdrawModal] = useState<boolean>(false);
  const [withdraws, setWithdraws] = useState<Withdraw[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedWithdrawId, setSelectedWithdrawId] = useState<string>('');
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

  // Fetch all withdraws when selectedStatus changes
  useEffect(() => {
    const fetchWithdraws = async () => {
      try {
        const response = await axios.get('http://localhost:5001/withdraws');
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
  }, [selectedStatus, showDetailsModal]);

  const handleOpenModal = () => {
    setShowWithdrawModal(true);
  };

  const handleCloseModal = () => {
    setShowWithdrawModal(false);
  };

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

  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">รายการสถานะ</h3>
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
                <td colSpan={12} className="text-center p-3">Loading...</td>
              </tr>
            ) : withdraws.length === 0 ? (
              <tr>
                <td colSpan={12} className="text-center p-3">ไม่พบข้อมูล</td>
              </tr>
            ) : (
              withdraws.map((withdraw) => (
                <tr key={withdraw.withdraw_id} className="text-center">
                  <td>{withdraw.withdraw_id}</td>
                  <td>{withdraw.user_id}</td>
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
      </div>
      {showDetailsModal && (
      <ModalWithdraw
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        withdrawId={selectedWithdrawId}
      />
    )}
    </div>
  );
};

export default WithdrawPageAdmin;