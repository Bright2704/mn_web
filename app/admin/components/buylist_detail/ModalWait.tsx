import React, { useState } from 'react';

interface ImportModalProps {
  show: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ show, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('1');

  if (!show) {
    return null;
  }

  const handleImport = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle the import logic here
    console.log('File:', file);
    console.log('Status:', status);
    onClose(); // Close the modal after import
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50  bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-4/5 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">จัดการรายการสั่งซื้อ</h5>
          <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose} style={{ background: 'none', border: 'none' }}>
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <div className="p-4 flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 md:pr-4">
            <form method="post" encType="multipart/form-data" onSubmit={handleImport} className="card-body">
              <input type="hidden" name="_token" value="lGT5gLceZdygZhH8Rom1DpJo9FTZMx10xmA2ktwA" />
              <h5 className="mb-4">อัพเดทสถานะสินค้า</h5>
              <div className="form-group">
                <div className="text-red-500 mb-4">
                  *กรุณาตรวจสอบรายละเอียดให้ครบถ้วนก่อนบันทึกรายการ
                </div>
              </div>
              <hr className="my-4" />
              <div className="form-group">
                <label className="font-medium mb-2" htmlFor="status">อัพเดทสถานะสินค้า</label>
                <select className="form-control" name="status" id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">เลือกสถานะ</option>
                <option value="รอตรวจสอบ">รอตรวจสอบ</option>
                <option value="รอชำระเงิน">รอชำระเงิน</option>
                <option value="ยกเลิกการสั่งซื้อ">ยกเลิกการสั่งซื้อ</option>
                </select>
              </div>
              <div className="form-group text-right mt-4">
                <button className="btn btn-secondary" type="submit">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
