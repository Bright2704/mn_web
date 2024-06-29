// BuylistPage.jsx
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalComponent from '../components/buylist_detail/ModalComponent';

export interface Product {
  order_id: string;
  cus_id: string;
  product: string; // ObjectId as string
  note: string;
  trans_type: string;
  status: string;
}

const BuylistPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    axios.get<Product[]>('http://localhost:5000/products/pending')
      .then(response => {
        console.log('Fetched products:', response.data);
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setError('Failed to fetch product data');
        setLoading(false);
      });
  }, []);

  const handleShowModal = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (products.length === 0) {
    return <div>No products found.</div>;
  }

  return (
    <div>
      <h1>รายการสั่งซื้อ</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>หมายเลข</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>ลูกค้า</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>สินค้า</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>วลีช่วยจำ(ผู้ดูแล)</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>สถานะ</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.order_id}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{product.order_id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{product.cus_id}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <img src={`http://localhost:5000/files/${product.product}`} alt="Product" style={{ width: '50px', height: '50px' }} />
              </td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{product.note}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{product.status}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>
                <button onClick={() => handleShowModal(product)} style={{ padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>จัดการ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalComponent show={showModal} onClose={handleCloseModal} product={selectedProduct} />
    </div>
  );
};

export default BuylistPage;
