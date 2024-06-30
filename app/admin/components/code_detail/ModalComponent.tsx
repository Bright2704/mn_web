import React, { useState } from 'react';
import axios from 'axios';

export interface Product {
  order_id: string;
  cus_id: string;
  product: string;
  note: string;
  trans_type: string;
  status: string;
}

interface ModalProps {
  show: boolean;
  onClose: () => void;
  product: Product | null;
}

const ModalComponent: React.FC<ModalProps> = ({ show, onClose, product }) => {
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!show || !product) {
    return null;
  }

  const handleUpdateStatus = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleStatusChange = (status: string) => {
    setNewStatus(status);
    setDropdownVisible(false);
  };

  const handleConfirmStatus = async () => {
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/orders/${product.order_id}/status`, { status: newStatus });
      console.log('Status updated:', response.data);
      setLoading(false);
      onClose(); // Close the modal after successful update
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">ทำรายการอัพเดทพัสดุเป็น: <span className="text-red-500">{product.status}</span></h5>
          <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose} style={{ background: 'none', border: 'none' }}>
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4">*ยืนยันพัสดุถึงโกดังจีนแล้วและกำลังจัดส่งมาไทย ต้องการเปลี่ยนสถานะเป็น “รอพัสดุถึงไทย”</p>
          <div className="flex items-center">
            <input
              type="text"
              className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="ระบุหมายเลขพัสดุ"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            />
            <button
              type="button"
              className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleConfirmStatus}
            >
              อัพเดทสถานะ
            </button>
          </div>
          {loading && <p className="text-center mt-4">Updating status...</p>}
          {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ModalComponent;
