"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../styles/globals.css';
import ModalWait from '../components/buylist_detail/ModalWait'; // Import the modal component

type LocalProduct = {
  order_id: string;
  cus_id: string;
  product: string;
  note: string;
  status: string;
  trans_type: string;
};

const statuses = [
  { label: 'สถานะทั้งหมด', value: 'all' },
  { label: 'รอตรวจสอบ', value: 'รอตรวจสอบ' },
  { label: 'รอชำระเงิน', value: 'รอชำระเงิน' },
  { label: 'จ่ายเงินแล้ว', value: 'จ่ายเงินแล้ว' },
  { label: 'สั่งซื้อสำเร็จ', value: 'สั่งซื้อสำเร็จ' },
  { label: 'มีแทรคครบ', value: 'มีแทรคครบ' },
  { label: 'เข้าโกดังจีนครบ', value: 'เข้าโกดังจีนครบ' },
  { label: 'ออกโกดังจีนครบ', value: 'ออกโกดังจีนครบ' },
  { label: 'เข้าโกดังไทยครบ', value: 'เข้าโกดังไทยครบ' },
  { label: 'ยกเลิก', value: 'ยกเลิกการสั่งซื้อ' },
];

const searchTopics = [
  { label: 'หมายเลข', value: 'order_id' },
  { label: 'ลูกค้า', value: 'cus_id' },
];

const BuylistPage: React.FC = () => {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchTopic, setSearchTopic] = useState<keyof LocalProduct>('order_id');
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedStatus === 'all') {
          const requests = statuses.filter(status => status.value !== 'all').map(status =>
            axios.get<LocalProduct[]>(`http://localhost:5000/orders/status/${status.value}`)
          );
          const results = await Promise.all(requests);
          const allProducts = results.flatMap(result => result.data);
          response = { data: allProducts };
        } else {
          response = await axios.get<LocalProduct[]>(`http://localhost:5000/orders/status/${selectedStatus}`);
        }
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

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleManageClick = (status: string) => {
    if (status === 'รอตรวจสอบ') {
      setShowModal(true);
    } else {
      // Handle other statuses if needed
    }
  };

  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">รายการสั่งซื้อ</h3>
        <div className="d-flex align-items-center">
          <input 
            type="text" 
            placeholder="ค้นหา" 
            className="anan-input__input" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="w-50 ml-1 custom-select custom-select-sm"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value as keyof LocalProduct)}
          >
            <option value="order_id">หมายเลข</option>
            <option value="cus_id">ลูกค้า</option>
          </select>
          <button type="submit" className="btn btn-outline-secondary ml-2 w-15">
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>

      <div className="nav-panel">
        <div className="anan-tabs__nav">
          <div className="anan-tabs__nav-warp px-2 table-container" style={{ marginTop: '5px' }}>
            <div className="anan-tabs__nav-tabs">
              {statuses.map(status => (
                <div 
                  key={status.value} 
                  className={`anan-tabs__nav-tab ${selectedStatus === status.value ? 'active' : ''}`}
                  onClick={() => setSelectedStatus(status.value)}
                >
                  <span>{status.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 table-container">
        <table className="table table-width-1">
          <thead>
            <tr className="text-center">
              <th>หมายเลข</th>
              <th>ลูกค้า</th>
              <th>สินค้า</th>
              <th>วลีช่วยจำ(ผู้ดูแล)</th>
              <th>รายละเอียด</th>
              <th>จัดส่งโดย</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center p-3">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={8} className="text-center p-3">Error: {error}</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center p-3">No orders found.</td>
              </tr>
            ) : (
              products
                .filter(product =>
                  product[searchTopic].toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(product => (
                  <tr key={product.order_id}>
                    <td>{product.order_id}</td>
                    <td>{product.cus_id}</td>
                    <td>{product.product}</td>
                    <td>...</td>
                    <td>{product.note}</td>
                    <td>{product.trans_type}</td>
                    <td>{product.status}</td>
                    <td>
                      <button className="btn btn-success" onClick={() => handleManageClick(product.status)}>
                        จัดการ
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
        <div className="demo-spacing-0 d-flex justify-content-end">
          <ul className="pagination mb-0">
            {/* Add pagination controls here */}
          </ul>
        </div>
      </div>

      <ModalWait show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default BuylistPage;

