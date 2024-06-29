// ModalComponent.jsx
import React from 'react';

export interface Product {
    order_id: string;
    cus_id: string;
    product: string; // ObjectId as string
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
  if (!show || !product) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    }}>
      <h2>รายละเอียดสินค้า</h2>
      <p><strong>หมายเลข:</strong> {product.order_id}</p>
      <p><strong>ลูกค้า:</strong> {product.cus_id}</p>
      <p><strong>สินค้า:</strong></p>
      <img src={`http://localhost:5000/files/${product.product}`} alt="Product" style={{ width: '100px', height: '100px' }} />
      <p><strong>วลีช่วยจำ(ผู้ดูแล):</strong> {product.note}</p>
      <p><strong>สถานะ:</strong> {product.status}</p>
      <button onClick={onClose} style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px' }}>ปิด</button>
    </div>
  );
};

export default ModalComponent;
