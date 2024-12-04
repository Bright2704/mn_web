import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ModalDepositDetailsProps {
  show: boolean;
  depositId: string;
  onClose: () => void;
}

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




const ModalDepositDetails: React.FC<ModalDepositDetailsProps> = ({ show, depositId, onClose }) => {
  const [depositDetails, setDepositDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (show && depositId) {
      setLoading(true);
      setError(''); // Reset error before fetching
      axios
        .get(`http://localhost:5001/deposits/${depositId}`)
        .then((response) => {
          setDepositDetails(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Error fetching deposit details.');
          setLoading(false);
        });
    }
  }, [show, depositId]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">รายละเอียดการเติมเงิน</h5>
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
          ) : depositDetails ? (
            <>
              <div className="w-1/2 pr-4 flex items-center">
                <div>
                  <p><strong>No :</strong> {depositDetails.deposit_id}</p>
                  <p><strong>ผู้ทำรายการ :</strong> {depositDetails.user_id}</p>
                  <p><strong>วันที่ทำรายการ :</strong> {depositDetails.date_deposit}</p>
                  <p><strong>วันที่อนุมัติ :</strong> {depositDetails.date_success}</p>
                  <p><strong>จำนวน :</strong> {depositDetails.amount}</p>
                  <p><strong>ธนาคารที่โอน :</strong> {(() => {
                      const bank = bankOptions.find(b => b.value === depositDetails.bank);
                      return bank ? (
                        <img 
                          src={bank.image} 
                          alt={bank.label}
                          className="centered-img_icon_bank"
                          style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                        />
                      ) : (
                        depositDetails.bank // Fallback in case no match is found
                      );
                    })()}
                  </p>
                  <p><strong>สถานะ:</strong> {(() => {
                      const status = statuses.find(s => s.value === depositDetails.status);
                      return status ? status.label : depositDetails.status; // Fallback to deposit.status if no match is found
                    })()}</p>
                  <p><strong>Note:</strong> {depositDetails.note}</p>
                </div>
              </div>
              <div className="w-1/2 pl-4">
                {depositDetails.slip ? (
                  <div>
                    <strong>หลักฐาน</strong>
                    <img src={depositDetails.slip} alt="Slip" style={{ width: '80%', marginTop: '10px' }} />
                  </div>
                ) : (
                  <p>No slip available.</p>
                )}
              </div>
            </>
          ) : (
            <p>No deposit details available.</p>
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

export default ModalDepositDetails;
