"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';
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

const DepositPage: React.FC = () => {
  const [allDeposits, setAllDeposits] = useState<DepositNew[]>([]);
  const [deposits, setDeposits] = useState<DepositNew[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedDepositId, setSelectedDepositId] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id;
        if (userId) {
          setUserId(userId);
        } else {
          console.error('User ID not found in session');
        }
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchAllDeposits = async () => {
      setLoading(true);
      setError(null);

      try {
        if (userId) {
          const response = await axios.get(`http://localhost:5001/deposits/user_id/${userId}/status/${selectedStatus}`);

          setAllDeposits(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deposits:', error);
        setError('Failed to fetch deposit data');
        setLoading(false);
      }
    };

    if (userId) {
      fetchAllDeposits();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedStatus === 'all') {
      setDeposits(allDeposits);
    } else {
      const filteredDeposits = allDeposits.filter(deposit => deposit.status === selectedStatus);
      setDeposits(filteredDeposits);
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

  const fetchLastBalance = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/balances/user/${userId}/last`);
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
  }, [deposits, showDetailsModal, showModal]); 

  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">รายการฝากเงิน</h3>
        <div className="d-flex align-items-center" style={{ gap: "24px" }}>
          {/* Total Amount Information */}
          <div>
            {/* Action Buttons */}
            <div className="d-flex align-items-center px-5 py-3 rounded-2xl" 
                style={{  gap: "20px" , 
                          backgroundColor:'#f8d7da',
                          boxShadow:'0 0 15px rgba(0, 0, 0, 0.1)'}}>
              <p
                className="mb-1"
                style={{ color: "#721c24", fontSize: "24px" }}
              >
                ยอดเงินในระบบ{" "}
              </p>
              <div className="bg-light p-2 rounded">
                <h5
                  className="mb-0"
                  style={{ color: "#721c24", fontSize: "24px" }}
                >
                  {totalAmount.toLocaleString()} ฿
                </h5>
              </div>
              <button
                className="transition-all duration-200 text-white bg-blue-600 px-3 py-2 hover:bg-blue-800 ml-2"
                style={{ /* backgroundColor: '#dc3545', borderColor: '#dc3545', */boxShadow:'0 0 15px rgba(0, 0, 0, 0.1)',borderRadius:'10px'}}
                onClick={() => setShowModal(true)}
              >
                เติมเงินเข้าระบบ
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
                <td colSpan={9} className="text-center p-3">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center p-3">Error: {error}</td>
              </tr>
            ) : deposits.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-3">ไม่มีรายการ</td>
              </tr>
            ) : (
              deposits.map(deposit => (
                <tr key={deposit.deposit_id}>
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
      </div>

      {showModal && (
        <ModalDeposit show={showModal} onClose={handleCloseModal} />
      )}

      {showDetailsModal && selectedDepositId && (
        <ModalDepositDetails show={showDetailsModal} depositId={selectedDepositId} onClose={handleCloseDetailsModal} />
      )}
    </div>
  );
};

export default DepositPage;
