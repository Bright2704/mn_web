import React, { useState, useEffect } from 'react';

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
  note?: string;
}

const ModalWithdrawDetails: React.FC<ModalWithdrawDetailsProps> = ({ show, withdrawId, onClose }) => {
  const [withdrawDetails, setWithdrawDetails] = useState<WithdrawDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showRejectionModal, setShowRejectionModal] = useState<boolean>(false);
  const [rejectionNote, setRejectionNote] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchWithdrawDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/withdraws/${withdrawId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setWithdrawDetails(data);
      } catch (error) {
        console.error('Error fetching withdraw details:', error);
        setError('ไม่สามารถดึงข้อมูลการถอนเงินได้');
      } finally {
        setLoading(false);
      }
    };

    if (show && withdrawId) fetchWithdrawDetails();
  }, [show, withdrawId]);

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

  const handleUpdateStatus = async (newStatus: 'success' | 'failed') => {
    if (newStatus === 'success' && !file) {
      setError('กรุณาแนบหลักฐานการโอนเงิน');
      return;
    }

    setProcessingStatus(true);
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      formData.append(
        'date_success',
        newStatus === 'success'
          ? new Date()
              .toLocaleString('th-TH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
              .replace(',', '')
          : ''
      );

      if (file) {
        const fileExtension = file.name.split('.').pop();
        const newFile = new File([file], `${withdrawId}.${fileExtension}`, {
          type: file.type,
        });
        formData.append('slip', newFile);
      }

      const response = await fetch(
        `http://localhost:5000/withdraws/${withdrawId}/status`,
        {
          method: 'PATCH',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('ไม่สามารถอัพเดทสถานะได้');
    } finally {
      setProcessingStatus(false);
    }
  };

  const renderSlipSection = () => {
    if (withdrawDetails?.status === "success" && withdrawDetails.slip) {
      // Display the saved slip image for successful withdrawals
      return (
        <div className="border rounded-lg p-6">
          <h6 className="text-lg font-medium mb-4 text-gray-900">
            หลักฐานการโอนเงิน
          </h6>
          <div className="mt-4">
            <img
              src={`http://localhost:5000${withdrawDetails.slip}`}
              alt="Slip"
              className="max-w-full h-auto rounded-lg cursor-pointer"
              onClick={() =>
                window.open(
                  `http://localhost:5000${withdrawDetails.slip}`,
                  "_blank"
                )
              }
            />
          </div>
        </div>
      );
    } else if (withdrawDetails?.status === "wait") {
      // Show file upload for pending withdrawals
      return (
        <div className="border rounded-lg p-6">
          <h6 className="text-lg font-medium mb-4 text-gray-900">
            หลักฐานการโอนเงิน
          </h6>
          <div className="form-group">
            <div className="custom-file mb-4">
              <input
                className="form-control block w-full px-3 py-2 text-base text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                name="slip"
                id="file-slip"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={true}
              />
            </div>
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Slip Preview"
                  className="max-w-full h-auto rounded-lg cursor-pointer"
                  onClick={() => window.open(previewUrl, "_blank")}
                />
              </div>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      );
    } else {
      // Show message for failed status
      return (
        <div className="border rounded-lg p-6">
          <h6 className="text-lg font-medium mb-4 text-gray-900">
            หลักฐานการโอนเงิน
          </h6>
          <p className="text-gray-500 text-center">ไม่มีหลักฐานการโอนเงิน</p>
        </div>
      );
    }
  };

  const handleReject = () => {
    setShowRejectionModal(true);
  };

  const handleRejectionSubmit = async () => {
    if (!rejectionNote.trim()) {
      setError('กรุณาระบุเหตุผลในการปฏิเสธ');
      return;
    }

    setProcessingStatus(true);
    try {
      const formData = new FormData();
      formData.append('status', 'failed');
      formData.append('note', rejectionNote);
      formData.append(
        'date_success',
        new Date()
          .toLocaleString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(',', '')
      );

      const response = await fetch(
        `http://localhost:5000/withdraws/${withdrawId}/status`,
        {
          method: 'PATCH',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');

      setShowRejectionModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('ไม่สามารถอัพเดทสถานะได้');
    } finally {
      setProcessingStatus(false);
    }
  };

  const renderStatusSection = () => {
    if (withdrawDetails?.status === 'wait') {
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-lg font-medium mb-2 text-center">
            สถานะปัจจุบัน:
            <span className="text-yellow-600"> รอตรวจสอบ</span>
          </div>
        </div>
      );
    }
  
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-center">
        <div className="text-lg font-medium mb-2">
          สถานะปัจจุบัน:
          <span className={withdrawDetails?.status === 'success' ? 'text-green-600' : 'text-red-600'}>
            {withdrawDetails?.status === 'success' ? ' อนุมัติแล้ว' : ' ปฏิเสธแล้ว'}
          </span>
        </div>
        {withdrawDetails?.status === 'failed' && withdrawDetails.note && (
          <div className="mt-2 p-3 bg-red-50 rounded-lg">
            <div className="text-gray-700 font-medium mb-1">เหตุผลที่ปฏิเสธ:</div>
            <div className="text-red-600">{withdrawDetails.note}</div>
          </div>
        )}
      </div>
    );
  };


  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
    window.location.reload();
  };

  const renderRejectionModal = () => {
    if (!showRejectionModal) return null;

  

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={() => setShowRejectionModal(false)}
        />
        <div className="relative bg-white rounded-lg shadow-lg p-6 w-96">
          <h3 className="text-xl font-medium mb-4">ระบุเหตุผลในการปฏิเสธ</h3>
          <textarea
            className="w-full p-2 border rounded-lg mb-4 min-h-[100px]"
            placeholder="กรุณาระบุเหตุผล..."
            value={rejectionNote}
            onChange={(e) => setRejectionNote(e.target.value)}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowRejectionModal(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleRejectionSubmit}
              disabled={processingStatus}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              ยืนยัน
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </div>
      </div>
    );
  };
 
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto">
        {/* ... header remains the same ... */}
        <div className="flex items-center justify-between p-4 border-b">
          <h5 className="text-xl font-semibold">รายละเอียดการถอนเงิน</h5>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <span className="text-2xl leading-none">&times;</span>
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-center">
              {error}
            </div>
          ) : (
            withdrawDetails && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... left side details remain the same ... */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h6 className="text-lg font-medium mb-4 text-gray-900">
                      ข้อมูลการถอนเงิน
                    </h6>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <dt className="text-gray-600">เลขที่รายการ</dt>
                      <dd className="font-medium">
                        {withdrawDetails.withdraw_id}
                      </dd>
                      <dt className="text-gray-600">รหัสผู้ใช้</dt>
                      <dd className="font-medium">{withdrawDetails.user_id}</dd>
                      <dt className="text-gray-600">วันที่ทำรายการ</dt>
                      <dd className="font-medium">
                        {withdrawDetails.date_withdraw}
                      </dd>
                      <dt className="text-gray-600">จำนวนเงิน</dt>
                      <dd className="font-medium text-green-600">
                        {withdrawDetails.withdraw_amount.toLocaleString()} ฿
                      </dd>
                    </dl>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h6 className="text-lg font-medium mb-4 text-gray-900">
                      ข้อมูลบัญชีธนาคาร
                    </h6>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <dt className="text-gray-600">ธนาคาร</dt>
                      <dd className="font-medium">{withdrawDetails.bank}</dd>
                      <dt className="text-gray-600">ชื่อบัญชี</dt>
                      <dd className="font-medium">
                        {withdrawDetails.account_name}
                      </dd>
                      <dt className="text-gray-600">เลขบัญชี</dt>
                      <dd className="font-medium">
                        {withdrawDetails.account_number}
                      </dd>
                      <dt className="text-gray-600">สาขา</dt>
                      <dd className="font-medium">{withdrawDetails.branch}</dd>
                    </dl>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border rounded-lg p-6">
                  {renderSlipSection()}
                  </div>

                  {/* Status update buttons */}
                  <div className="border rounded-lg p-6">
                    <h6 className="text-lg font-medium mb-6 text-gray-900">
                      การดำเนินการ
                    </h6>
                    {renderStatusSection()}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        
      </div>
      {showRejectionModal && renderRejectionModal()}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleSuccessModalClose}
          />
          <div className="relative bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h3 className="text-xl font-medium mb-4">ดำเนินการเรียบร้อยแล้ว</h3>
            <button
              onClick={handleSuccessModalClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
    );
  };
  
  export default ModalWithdrawDetails;