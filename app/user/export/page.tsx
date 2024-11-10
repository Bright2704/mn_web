"use client";

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../styles/globals.css';

type DepositNew = {
  deposit_id: string;
  date_deposit: string;
  date_success: string;
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
  const [deposits, setDeposits] = useState<DepositNew[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleManageClick = (depositId: string) => {
    // Placeholder for managing a deposit
    console.log("Manage deposit ID:", depositId);
  };

  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">รายการฝากเงิน</h3>
        <button
          className="btn btn-success px-4 py-2.5 ml-2 mr-10"
          style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
          onClick={() => console.log("Add money to the system")}
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
            {deposits.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-3">No deposits found.</td>
              </tr>
            ) : (
              deposits.map(deposit => (
                <tr key={deposit.deposit_id}>
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
                    <button
                      className="btn btn-success"
                      onClick={() => handleManageClick(deposit.deposit_id)}
                      style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
                    >
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
    </div>
  );
};

export default DepositPage;
