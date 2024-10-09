import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { getSession } from 'next-auth/react'; // Import getSession

interface ModalDepositProps {
  show: boolean;
  onClose: () => void;
}

const ModalDeposit: React.FC<ModalDepositProps> = ({ show, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [amount, setAmount] = useState<string>('');
  const [bank, setBank] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [selectedHour, setSelectedHour] = useState<string>('00');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [userId, setUserId] = useState<string | null>(null); // State to store user_id

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
  

  if (!show) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleImport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Fetch the next deposit ID
      const response = await axios.get('http://localhost:5000/deposits_new/next-id');
      const nextDepositId = response.data.next_deposit_id;

      // Combine selected date with selected time
      const formattedDate = selectedDate
        ? selectedDate.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }).replace(',', '') + ` ${selectedHour}:${selectedMinute}`
        : '';

      // Prepare the deposit data
      const depositData = new FormData();
      depositData.append('deposit_id', nextDepositId);
      depositData.append('date_deposit', formattedDate);
      depositData.append('date_success', '');
      depositData.append('user_id', userId || ''); // Use the user_id from session
      depositData.append('amount', amount || '0'); // Default to '0' if amount is not set
      depositData.append('bank', bank || ''); // Default to empty string if not set
      depositData.append('status', 'รอตรวจสอบ'); // Fixed status
      if (file) {
        depositData.append('slip', file);
      } else {
        throw new Error('File is required.');
      }

      // Send the deposit data to the backend
      const depositResponse = await axios.post('http://localhost:5000/deposits_new', depositData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Deposit successful:', depositResponse.data);
      setLoading(false);
      setShowSuccessModal(true); // Show success modal
    } catch (error: any) {
      console.error('There was an error!', error);
      setError('There was an error submitting your deposit. Please make sure all fields are filled out correctly.');
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose(); // Close the deposit modal
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-4/5 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">เติมเงินเข้าระบบ</h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
            style={{ background: 'none', border: 'none' }}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <div className="p-4 flex flex-wrap md:flex-row">
          <div className="w-full md:w-1/2 md:pr-4">
            <h5 className="mb-4">รายละเอียด</h5>
            <form onSubmit={handleImport}>
              <div className="form-group">
                <label className="_fw-200 _fs-16" htmlFor="bank-id">ธนาคารที่โอน</label>
                <select
                  name="bank_id"
                  id="bank-id"
                  className="form-control deposituser-select"
                  required
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                >
                  <option value="">เลือกธนาคาร</option>
                  <option value="kbank">ธนาคารกสิกรไทย - (141-3-41660-0)</option>
                </select>
              </div>
              <div className="form-group mt-3 mb-3">
                <label className="_fw-300 _fs-16" htmlFor="time">วันที่</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="form-control _bgcl-tpr deposituser-datepicker"
                  id="datepicker"
                  name="date"
                  required
                />
              </div>
              <label className="_fw-300 _fs-16" htmlFor="datetime-local">เวลาที่โอน</label>
              <div className="d-flex align-items-center">
                <div className="form-group mr-1" style={{ flexBasis: '10%' }}>
                  <select 
                    id="time-hour" 
                    name="hour" 
                    className="form-control deposituser-select" 
                    required 
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                    style={{ width: '100%' }}>
                    {Array.from(Array(24).keys()).map(hour => (
                      <option key={hour} value={hour.toString().padStart(2, '0')}>
                        {hour.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="mx-2">:</span>
                <div className="form-group ml-1" style={{ flexBasis: '10%' }}>
                  <select 
                    id="time-minute" 
                    name="min" 
                    className="form-control deposituser-select" 
                    required 
                    value={selectedMinute}
                    onChange={(e) => setSelectedMinute(e.target.value)}
                    style={{ width: '100%' }}>
                    {Array.from(Array(60).keys()).map(minute => (
                      <option key={minute} value={minute.toString().padStart(2, '0')}>
                        {minute.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="_fw-300 _fs-16" htmlFor="amount">จำนวนเงิน</label>
                <input
                  className="form-control deposituser-select"
                  name="amount"
                  step="0.01"
                  id="amount"
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="_fw-300 _fs-16" htmlFor="file-slip">หลักฐานการชำระเงิน (pay slip)</label>
                <div className="custom-file">
                  <input
                    className="custom-file-input"
                    name="slip"
                    id="file-slip"
                    type="file"
                    required
                    onChange={handleFileChange}
                  />
                  <label className="custom-file-label" htmlFor="file-slip">เลือกไฟล์</label>
                </div>
                {previewUrl && (
                  <img
                    id="file-slip-preview"
                    className="_dp-n img-fluid _mgv-20 _dp-b _mgh-at"
                    src={previewUrl}
                    alt="Slip Preview"
                    style={{ width: '50%', cursor: 'pointer' }}
                    onClick={() => window.open(previewUrl, '_blank')}
                  />
                )}
              </div>
              <div className="form-group _tal-r-lg _mgt-30" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <button className="btn btn-secondary" style={{ backgroundColor: '#28a745', borderColor: '#28a745' }} type="submit" disabled={loading}>
                  {loading ? 'บันทึก...' : 'บันทึก'}
                </button>
                <button className="btn btn-secondary ml-3" style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }} type="button" onClick={onClose}>
                  ยกเลิก
                </button>
              </div>
              {error && <p className="text-danger">{error}</p>}
            </form>
          </div>
          
          <div className="w-full md:w-1/2 md:pl-3 mt-8 md:mt-0">
            <div className="card-body">
              <div className="table-responsive">
                <h5>บัญชีธนาคาร</h5>
                <div className="wallet-bank-wrap mt-4">
                  <div className="wallet-bank-media">
                    <div className="th-bank-logo kbank ml-20 mb-3" style={{ backgroundColor: '#138f2d', width: '100px', height: '100px' }}>
                      <img 
                          src="/storage/icon/bank/kbank.jpg" 
                          alt="bank-icon" 
                          style={{ width: '100px', height: '100px' }} 
                      />
                    </div>
                  </div>
                  <div className="wallet-bank-info">
                    <div className="normal-text">ธนาคาร: กสิกรไทย</div>
                    <div className="normal-text">ชื่อบัญชี: บริษัท เอ็มเอ็น 1688 คาร์โก้ เอ็กซ์เพรส จำกัด</div>
                    <div className="normal-text">เลขบัญชี: 141-3-41660-0</div>
                  </div>
                </div>
              </div>             
            </div>           
          </div>
        </div>

        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center"> {/* Added text-center class here */}
              <h3 className="text-xl font-medium mb-4">ระบบกำลังตรวจสอบกรุณารอสักครู่</h3>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSuccessModalClose}
                style={{ margin: '0 auto' }} // Centering the button
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDeposit;
