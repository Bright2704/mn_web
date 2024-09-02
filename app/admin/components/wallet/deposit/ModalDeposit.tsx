import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ModalDepositProps {
  show: boolean;
  depositId: string;
  onClose: () => void;
}

const ModalDeposit: React.FC<ModalDepositProps> = ({ show, depositId, onClose }) => {
  const [depositDetails, setDepositDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const [slipImage, setSlipImage] = useState<string | null>(null); // State to hold the slip image path
  const [slipError, setSlipError] = useState<string>(''); // State to hold the error message for slip search
  const [reason, setReason] = useState<string>(''); // State to hold the reason for rejection
  const [isConfirmDisabled, setIsConfirmDisabled] = useState<boolean>(false); // State to disable confirm button
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false); // State to show success popup

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

  // Function to handle search
  const handleSearch = () => {
    if (searchTerm.length === 6) { // Ensure the search term is exactly 6 characters
      axios
        .get(`http://localhost:5000/check-slip/${searchTerm}`)
        .then((response) => {
          setSlipImage(response.data.filePath); // Set the path to the image if found
          setSlipError(''); // Clear any previous error
          setIsConfirmDisabled(true); // Enable the confirm button if slip is found
        })
        .catch((err) => {
          setSlipImage(null); // Clear the image if not found
          setSlipError('สลิปนี้สามารถใช้งานได้'); // Set the message
          setIsConfirmDisabled(false); // Disable the confirm button if slip is not found
        });
    } else {
      setSlipError('กรุณาใส่รหัส 6 ตัว'); // Error message for invalid input length
      setSlipImage(null); // Clear the image
      setIsConfirmDisabled(false); // Enable the confirm button
    }
  };

  // Function to format date to 'YYYY-MM-DD HH:MM'
  const getCurrentFormattedDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const handleConfirm = () => {
    const currentDateSuccess = getCurrentFormattedDate(); // Get current date and time
  
    if (!slipImage) {
      // If slipImage is not found, copy and rename the slip from depositDetails
      axios
        .post('http://localhost:5000/copy-slip', {
          originalPath: depositDetails.slip,
          newFilename: `${searchTerm}.jpg`,
        })
        .then(() => {
          const updatedDetails = { ...depositDetails, status: 'สำเร็จ', date_success: currentDateSuccess };
          return axios.put(`http://localhost:5000/deposits_new/${depositId}`, updatedDetails);
        })
        .then(() => {
          setShowSuccessPopup(true); // Show success popup
        })
        .catch((err) => {
          console.error('Error copying slip or updating deposit details:', err);
        });
    } else {
      const updatedDetails = { ...depositDetails, status: 'สำเร็จ', date_success: currentDateSuccess };
      axios
        .put(`http://localhost:5000/deposits_new/${depositId}`, updatedDetails)
        .then(() => {
          setDepositDetails(updatedDetails);
          setShowSuccessPopup(true); // Show success popup
        })
        .catch((err) => {
          console.error('Error updating deposit details:', err);
        });
    }
  };
  
  const handleReject = () => {
    const currentDateSuccess = getCurrentFormattedDate(); // Get current date and time
  
    if (reason.trim() === '') {
      alert('กรุณากรอกเหตุผลในการปฏิเสธ');
      return;
    }
  
    const updatedDetails = { ...depositDetails, status: 'ไม่สำเร็จ', note: reason, date_success: currentDateSuccess };
    axios
      .put(`http://localhost:5000/deposits_new/${depositId}`, updatedDetails)
      .then(() => {
        setDepositDetails(updatedDetails); // Update the local state
        setShowSuccessPopup(true); // Show success popup
      })
      .catch((err) => {
        console.error('Error updating deposit details:', err);
      });
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    onClose(); // Close the current modal
    window.location.reload(); // Refresh the page to show new data
  };

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
        {/* Conditionally render the search section based on status */}
        {depositDetails && depositDetails.status !== 'สำเร็จ' && depositDetails.status !== 'ไม่สำเร็จ' && (
          <div className="p-4 flex flex-col border-t">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="กรุณากรอกรหัสใบเสร็จ 6 ตัวสุดท้าย"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow p-2 border rounded"
                maxLength={6} // Limit input to 6 characters
              />
              <button
                type="button"
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSearch}
              >
                ตรวจสอบ
              </button>
            </div>
            {slipImage && (
              <div className="mt-4">
                <img src={slipImage} alt="Slip found" style={{ width: '80%', marginTop: '10px' }} />
              </div>
            )}
            {slipError && (
              <p className="mt-4 text-green-500">{slipError}</p>
            )}
            {slipImage && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="เหตุผลในการปฏิเสธ"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
          </div>
        )}
        {/* Show only the close button if the status is 'สำเร็จ' or 'ไม่สำเร็จ' */}
        <div className="p-4 flex flex-col items-center border-t">
          <div className="flex justify-center mb-4">
            {depositDetails && depositDetails.status !== 'สำเร็จ' && depositDetails.status !== 'ไม่สำเร็จ' && (
              <>
                <button
                  type="button"
                  className={`mr-2 px-4 py-2 rounded ${isConfirmDisabled ? 'bg-gray-400' : 'bg-green-500'} text-white`}
                  onClick={handleConfirm}
                  disabled={isConfirmDisabled}
                >
                  ยืนยันรายการ
                </button>
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleReject}
                >
                  ปฏิเสธรายการ
                </button>
              </>
            )}
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
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h3 className="text-xl font-medium">ดำเนินการสำเร็จ</h3>
            <button
              type="button"
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleCloseSuccessPopup}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalDeposit;
