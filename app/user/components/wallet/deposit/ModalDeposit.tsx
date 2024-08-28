import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ModalDepositProps {
  show: boolean;
  onClose: () => void;
}

const ModalDeposit: React.FC<ModalDepositProps> = ({ show, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('1');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleImport = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('File:', file);
    console.log('Status:', status);
    console.log('Selected Date:', selectedDate);
    onClose(); // Close the modal after import
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-4/5 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">เติมเงินเข้าระบบ</h5>
          <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose} style={{ background: 'none', border: 'none' }}>
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <div className="p-4 flex flex-wrap md:flex-row">
          <div className="w-full md:w-1/2 md:pr-4">
            <h5 className="mb-4">รายละเอียด</h5>
            <form action="https://member.mn1688express.com/wallets/deposit" method="post" encType="multipart/form-data" onSubmit={handleImport}>
              <input type="hidden" name="_token" value="7sHEIAg380X3AR0zIL5482LNKiSF7m8nWj7lhNCu" />
              <div className="form-group">
                <label className="_fw-200 _fs-16" htmlFor="bank-id">ธนาคารที่โอน</label>
                <select name="bank_id" id="bank-id" className="form-control deposituser-select" required>
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
                  <select id="time" name="min" className="form-control deposituser-select" required style={{ width: '100%' }}>
                    {Array.from(Array(24).keys()).map(minute => (
                      <option key={minute} value={minute.toString().padStart(2, '0')}>
                        {minute.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="mx-2">:</span>
                <div className="form-group ml-1" style={{ flexBasis: '10%' }}>
                  <select id="time" name="sec" className="form-control deposituser-select" required style={{ width: '100%' }}>
                    {Array.from(Array(60).keys()).map(second => (
                      <option key={second} value={second.toString().padStart(2, '0')}>
                        {second.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="_fw-300 _fs-16" htmlFor="amount">จำนวนเงิน</label>
                <input className="form-control deposituser-select" name="amount" step="0.01" id="amount" type="number" required />
              </div>
              <div className="form-group">
                <label className="_fw-300 _fs-16" htmlFor="file-slip">หลักฐานการชำระเงิน (pay slip)</label>
                <div className="custom-file">
                  <input className="custom-file-input" name="slip" id="file-slip" type="file" required onChange={handleFileChange} />
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
            </form>
          </div>
          <div className="w-full md:w-1/2 md:pl-4 mt-8 md:mt-0">
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

          {/* New div added below in the same row */}
          <div className="w-full md:pl-4 mt-8 md:mt-0">
            <div className="card-body">
              <div className="new-content">
                {/* Buttons are now in the same row */}
                <div className="form-group _tal-r-lg _mgt-30" style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                  <button className="btn btn-secondary" style={{ backgroundColor: '#28a745', borderColor: '#28a745' }} type="submit">บันทึก</button>
                  <button className="btn btn-secondary ml-3" style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }} type="button" onClick={onClose}>ยกเลิก</button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>  
    </div>
  );
};

export default ModalDeposit;
