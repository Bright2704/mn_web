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
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      width: '80%',
      maxWidth: '600px',
    }}>
      <h2>รายละเอียดสินค้า</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div>
          <p><strong>หมายเลข:</strong> {product.order_id}</p>
          <p><strong>ลูกค้า:</strong> {product.cus_id}</p>
          <p><strong>สินค้า:</strong> {product.product}</p>
        </div>
        <div>
          <p><strong>วลีช่วยจำ(ผู้ดูแล):</strong> {product.note}</p>
          <p><strong>สถานะ:</strong> {product.status}</p>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}>ปิด</button>
        <button onClick={handleUpdateStatus} style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px', marginRight: '10px' }}>อัพเดทสถานะ</button>
        {newStatus && <button onClick={handleConfirmStatus} style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>ยืนยัน</button>}
      </div>
      {dropdownVisible && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <select
            value={newStatus}
            onChange={(e) => handleStatusChange(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', borderColor: 'gray', width: '200px' }}
          >
            <option value="">เลือกสถานะ</option>
            <option value="รอตรวจสอบ">รอตรวจสอบ</option>
            <option value="รอชำระเงิน">รอชำระเงิน</option>
            <option value="จ่ายเงินแล้ว">จ่ายเงินแล้ว</option>
            <option value="สั่งซื้อสำเร็จ">สั่งซื้อสำเร็จ</option>
            <option value="มีแทรคครบ">มีแทรคครบ</option>
            <option value="เข้าโกดังจีนครบ">เข้าโกดังจีนครบ</option>
            <option value="ออกโกดังจีนครบ">ออกโกดังจีนครบ</option>
            <option value="เข้าโกดังไทยครบ">เข้าโกดังไทยครบ</option>
            <option value="ยกเลิกการสั่งซื้อ">ยกเลิกการสั่งซื้อ</option>
          </select>
        </div>
      )}
      {newStatus && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>สถานะใหม่: <strong>{newStatus}</strong></p>
        </div>
      )}
      {loading && <p style={{ textAlign: 'center' }}>Updating status...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ModalComponent;
