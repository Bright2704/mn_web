import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ModalWithdrawDetailsProps {
  show: boolean;
  withdrawId: string;
  onClose: () => void;
}

const statuses = [
  { label: 'สถานะทั้งหมด', value: 'all' },
  { label: 'รอตรวจสอบ', value: 'wait' },
  { label: 'สำเร็จ', value: 'success' },
  { label: 'ไม่สำเร็จ', value: 'failed' },
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

interface WithdrawDetails {
  withdraw_id: string;
  user_id: string;
  date_withdraw: string;
  date_success: string;
  bank: string;
  account_name: string;
  account_number: string;
  branch: string;
  withdraw_amount: number;
  status: string;
  slip: string;
}

const ModalWithdrawDetails: React.FC<ModalWithdrawDetailsProps> = ({ show, withdrawId, onClose }) => {
  const [withdrawDetails, setWithdrawDetails] = useState<WithdrawDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchWithdrawDetails = async () => {
      if (show && withdrawId) {
        setLoading(true);
        setError('');
        try {
          const response = await axios.get(`http://localhost:5000/withdraws/${withdrawId}`);
          setWithdrawDetails(response.data);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 500) {
              setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
            } else {
              setError('ไม่สามารถดึงข้อมูลการถอนเงินได้');
            }
          } else {
            setError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
          }
          console.error('Error details:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchWithdrawDetails();
  }, [show, withdrawId]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">รายละเอียดการถอนเงิน</h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
            style={{ background: 'none', border: 'none' }}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <div className="p-4 flex">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : withdrawDetails ? (
            <>
              <div className="w-1/2 pr-4 flex items-center">
                <div>
                  <p><strong>No :</strong> {withdrawDetails.withdraw_id}</p>
                  <p><strong>ผู้ทำรายการ :</strong> {withdrawDetails.user_id}</p>
                  <p><strong>วันที่ทำรายการ :</strong> {withdrawDetails.date_withdraw}</p>
                  <p><strong>วันที่อนุมัติ :</strong> {withdrawDetails.date_success || '-'}</p>
                  <p><strong>จำนวน :</strong> {withdrawDetails.withdraw_amount.toLocaleString()} ฿</p>
                  <p><strong>ธนาคารที่โอน :</strong> {(() => {
                      const bank = bankOptions.find(b => b.value === withdrawDetails.bank);
                      return bank ? (
                        <>
                          <img 
                            src={bank.image} 
                            alt={bank.label}
                            className="centered-img_icon_bank"
                            style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                          />
                          <span className="ml-2">{bank.label}</span>
                        </>
                      ) : (
                        withdrawDetails.bank
                      );
                    })()}
                  </p>
                  <p><strong>ชื่อบัญชี :</strong> {withdrawDetails.account_name}</p>
                  <p><strong>เลขที่บัญชี :</strong> {withdrawDetails.account_number}</p>
                  <p><strong>สาขา :</strong> {withdrawDetails.branch}</p>
                  <p><strong>สถานะ :</strong> {(() => {
                      const status = statuses.find(s => s.value === withdrawDetails.status);
                      return status ? status.label : withdrawDetails.status;
                    })()}</p>
                </div>
              </div>
              <div className="w-1/2 pl-4">
                {withdrawDetails.slip ? (
                  <div>
                    <strong>หลักฐาน</strong>
                    <img 
                      src={withdrawDetails.slip} 
                      alt="Slip" 
                      style={{ width: '80%', marginTop: '10px' }} 
                    />
                  </div>
                ) : (
                  <p>ไม่มีหลักฐานการถอนเงิน</p>
                )}
              </div>
            </>
          ) : (
            <p>ไม่พบข้อมูลการถอนเงิน</p>
          )}
        </div>
        <div className="p-4 flex justify-center border-t">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalWithdrawDetails;