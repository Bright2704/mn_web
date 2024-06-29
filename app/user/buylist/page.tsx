"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalComponent, { Product } from '../components/buylist_detail/ModalComponent';

const statuses = [
    "ทั้งหมด",
    "รอตรวจสอบ",
    "รอจ่ายเงิน",
    "จ่ายเงินแล้ว",
    "สั่งซื้อสำเร็จ",
    "มีแทรคครบ",
    "เข้าโกดังครบ",
    "ยกเลิก",
];

const BuylistPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("รอตรวจสอบ");

    useEffect(() => {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await axios.get<Product[]>(`http://localhost:5000/orders/status/${selectedStatus}`);
          setProducts(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setError('Failed to fetch order data');
          setLoading(false);
        }
      };

      fetchProducts();
    }, [selectedStatus]);

    const handleShowModal = (product: Product) => {
      setSelectedProduct(product);
      setShowModal(true);
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setSelectedProduct(null);
    };

    return (
        <div>
            <h1 className='text-3xl py-4'>รายการสั่งซื้อ</h1>
                <div className='bg-red-50'>
                <div style={{ marginBottom: '20px' }}>
                  {statuses.map(status => (
                    <button
                      // className='rounded-full' 
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      style={{
                        padding: '5px 20px',
                        margin: '5px',
                        backgroundColor: selectedStatus === status ? '#088395' : '#939185',
                        color: 'white' ,
                        border: 'none',
                        borderRadius: '9999px',
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>
                <table style={{ width: '100%',
                  //  borderCollapse: 'collapse' 
                   }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '8px', textAlign: 'center' }}>หมายเลข</th>
                      {/* <th style={{ border: '1px solid black', padding: '8px' }}>ลูกค้า</th> */}
                      <th style={{  padding: '8px', textAlign: 'center' }}>สินค้า</th>
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>วลีช่วยจำ(ผู้ดูแล)</th>
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>สถานะ</th>
                      <th style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '8px' }}>Loading...</td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '8px' }}>Error: {error}</td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '8px' }}>No orders found.</td>
                      </tr>
                    ) : (
                      products.map(product => (
                        <tr key={product.order_id}>
                          <td style={{ border: '1px solid black', padding: '8px' }}>{product.order_id}</td>
                          <td style={{ border: '1px solid black', padding: '8px' }}>{product.cus_id}</td>
                          <td style={{ border: '1px solid black', padding: '8px' }}>{product.product}</td>
                          <td style={{ border: '1px solid black', padding: '8px' }}>{product.note}</td>
                          <td style={{ border: '1px solid black', padding: '8px' }}>{product.status}</td>
                          <td style={{ border: '1px solid black', padding: '8px' }}>
                            <button onClick={() => handleShowModal(product)} style={{ padding: '5px 10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>จัดการ</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <ModalComponent show={showModal} onClose={handleCloseModal} product={selectedProduct} />
              </div>
        </div>
    );
};

export default BuylistPage;
