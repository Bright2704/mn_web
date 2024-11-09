import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ModalDepositProps {
  show: boolean;
  depositId: string;
  onClose: () => void;
}

interface Deposit {
  _id: string;                  // MongoDB ObjectID in string format
  user_id: string;              // User ID associated with the deposit
  deposit_id: string;           // Unique deposit ID
  date_deposit: string;         // Date of deposit in string format (e.g., "09/11/2024 00:00")
  date_success?: string;        // Date of success, optional as it might be empty initially
  amount: string;               // Amount deposited, stored as a string
  bank: string;                 // Bank identifier (e.g., "citi", "kbank")
  status: string;               // Status of the deposit (e.g., "wait", "succeed", "cancel")
  slip: string;                 // Path to the slip image
  six_digits?: string;          // Last six digits of a reference number or identifier, optional
  note?: string;                // Optional note field for additional information
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

const ModalDeposit: React.FC<ModalDepositProps> = ({ show, depositId, onClose }) => {
  const [depositDetails, setDepositDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for search term
  const [matchingSlipImages, setMatchingSlipImages] = useState<string[]>([]); // State to hold images with same six digits
  const [slipError, setSlipError] = useState<string>(''); // State to hold the error message for slip search
  const [reason, setReason] = useState<string>(''); // State to hold the reason for rejection
  const [isConfirmDisabled, setIsConfirmDisabled] = useState<boolean>(false); // State to disable confirm button
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false); // State to show success popup

  useEffect(() => {
    if (show && depositId) {
      setLoading(true);
      setError(''); // Reset error before fetching
      axios
        .get(`http://localhost:5000/deposits/${depositId}`)
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
    if (searchTerm.length === 6) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/deposits/six_digits/${searchTerm}`)
        .then((response) => {
          const deposits: Deposit[] = response.data;
          
          // Check if there are any matching deposits
          if (deposits.length > 0) {
            setMatchingSlipImages(deposits.map((deposit) => deposit.slip));
            setSlipError('This slip is already in use');
            setIsConfirmDisabled(true);
          } else {
            // No matching deposits found - proceed with updating six_digits
            setMatchingSlipImages([]);
            setSlipError('สลิปนี้สามารถใช้งานได้');
            setIsConfirmDisabled(false);
            
            // Update six_digits
            return axios.put(`http://localhost:5000/deposits/${depositId}/update-six-digits`, {
              six_digits: searchTerm
            });
          }
        })
        .then((updateResponse) => {
          if (updateResponse) {
            setDepositDetails((prevDetails: Deposit) => ({
              ...prevDetails,
              six_digits: searchTerm
            }));
          }
        })
        .catch((err) => {
          console.error('Error:', err);
          setSlipError(err.response?.data?.error || 'Error occurred during search');
          setMatchingSlipImages([]);
          setIsConfirmDisabled(false);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSlipError('กรุณาใส่รหัส 6 ตัว');
      setMatchingSlipImages([]);
      setIsConfirmDisabled(false);
    }
  };


  // Updated date formatter function
  const getCurrentFormattedDate = () => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  // Helper function to format dates for display
  const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return '';
    
    // Check if the date is already in DD/MM/YYYY format
    if (dateString.includes('/') && dateString.split('/')[0].length === 2) {
      return dateString;
    }

    try {
      const [datePart, timePart] = dateString.split(' ');
      const [year, month, day] = datePart.split('/');
      return `${day}/${month}/${year} ${timePart || ''}`.trim();
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original string if parsing fails
    }
  };

  const updateDepositStatus = (status: string, dateSuccess: string) => {
    const updateData = {
      ...depositDetails,
      status,
      date_success: dateSuccess
    };
    
    axios.put(`http://localhost:5000/deposits/${depositId}`, updateData)
      .then((response) => {
        setDepositDetails(response.data);
        setShowSuccessPopup(true);
      })
      .catch((err) => {
        console.error('Error updating deposit details:', err);
        // Add error handling UI feedback here
        alert('Error updating deposit status. Please try again.');
      });
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    onClose(); // Close the current modal
    window.location.reload(); // Refresh the page to show new data
  };
  
  
  const handleReject = () => {
    const currentDateSuccess = getCurrentFormattedDate(); // Get current date and time
  
    if (reason.trim() === '') {
      alert('กรุณากรอกเหตุผลในการปฏิเสธ');
      return;
    }
  
    const updatedDetails = { ...depositDetails, status: 'cancel', note: reason, date_success: currentDateSuccess };
    axios
      .put(`http://localhost:5000/deposits/${depositId}`, updatedDetails)
      .then(() => {
        setDepositDetails(updatedDetails); // Update the local state
        setShowSuccessPopup(true); // Show success popup
      })
      .catch((err) => {
        console.error('Error updating deposit details:', err);
      });
  };

  // Fetch the next balance ID from the backend
  const generateNextBalanceId = async () => {
    try {
      const response = await axios.get('http://localhost:5000/balances/next-id');
      return response.data.nextId;
    } catch (err) {
      console.error('Error generating next balance_id:', err);
      return 'BLA_0001';
    }
  };

  // Fetch the last balance total for a specific user
  const getLastBalanceTotal = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/balances/user/${userId}/last`);
      return response.data?.balance_total || 0;
    } catch (err) {
      console.error('Error fetching last balance total:', err);
      return 0;
    }
  };

  // Create a new balance entry based on the deposit data
  const createBalanceRecord = async () => {
    if (!depositDetails) return;

    try {
      const newBalanceId = await generateNextBalanceId();
      const lastBalanceTotal = await getLastBalanceTotal(depositDetails.user_id);

      const newBalance = {
        user_id: depositDetails.user_id,
        balance_id: newBalanceId,
        balance_date: depositDetails.date_deposit,
        balance_type: 'deposit',
        balance_descri: `รายการเติมเงิน ${depositDetails.deposit_id}`,
        balance_amount: parseFloat(depositDetails.amount),
        balance_total: lastBalanceTotal + parseFloat(depositDetails.amount),
      };

      await axios.post('http://localhost:5000/balances', newBalance);
      console.log('Balance record created successfully');
    } catch (err) {
      console.error('Error creating balance record:', err);
    }
  };

  const handleConfirm = async () => {
    const currentDateSuccess = getCurrentFormattedDate();
    try {
      await updateDepositStatus('succeed', currentDateSuccess);
      await createBalanceRecord(); // Call this after updating the deposit status
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error during confirmation process:', error);
      alert('Error updating deposit status or creating balance record. Please try again.');
    }
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
                  <p><strong>วันที่ทำรายการ :</strong> {formatDateForDisplay(depositDetails.date_deposit)}</p>
                  <p><strong>วันที่อนุมัติ :</strong> {formatDateForDisplay(depositDetails.date_success)}</p>
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
        {/* Conditionally render the search section based on status */}
        {depositDetails && depositDetails.status !== 'succeed' && depositDetails.status !== 'cancel' && (
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
          {matchingSlipImages.length > 0 ? (
            <div className="mt-4">
              {matchingSlipImages.map((image, index) => (
                <img key={index} src={image} alt="Matching Slip" style={{ width: '80%', marginTop: '10px' }} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-green-500">{slipError}</p>
          )}
        </div>

        )}
        {/* Show only the close button if the status is 'สำเร็จ' or 'ไม่สำเร็จ' */}
        <div className="p-4 flex flex-col items-center border-t">
          <div className="flex justify-center mb-4">
            {depositDetails && depositDetails.status !== 'succeed' && depositDetails.status !== 'cancel' && (
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
