import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ModalDepositDetailsProps {
  show: boolean;
  depositId: string;
  onClose: () => void;
}

const ModalDepositDetails: React.FC<ModalDepositDetailsProps> = ({ show, depositId, onClose }) => {
  const [depositDetails, setDepositDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (show && depositId) {
      setLoading(true);
      setError(''); // Reset error before fetching
      axios
        .get(`http://localhost:5000/deposits_new/${depositId}`)
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
                  <p><strong>ธนาคารที่โอน :</strong> {depositDetails.bank === 'kbank' ? (
                      <img 
                        src="/storage/icon/bank/kbank.jpg" 
                        alt="ธนาคารกสิกรไทย"
                        className="centered-img_icon_bank"
                        style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                      />
                    ) : (
                      depositDetails.bank
                    )}
                  </p>
                  <p>สาขา: เซนทรัลลาดพร้าว</p>
                  <p>เลขที่บัญชี: 141-3-41660-0</p>
                  <p>ชื่อบัญชี: บริษัท เอ็มเอ็น 1688 คาร์โก้ เอ็กซ์เพรส จำกัด</p>
                  <p><strong>สถานะ:</strong> {depositDetails.status}</p>
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
