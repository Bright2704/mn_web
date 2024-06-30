"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import ModalComponent, { Product as ImportedProduct } from '../components/buylist_detail/ModalComponent';
import AddLotModal from '../components/lot_detail/AddLotModal';

type LocalProduct = {
  order_id: string;
  cus_id: string;
  product: string;
  note: string;
  status: string;
  // Add other fields if necessary
};

const defaultProduct: ImportedProduct = {
  order_id: '',
  cus_id: '',
  product: '',
  note: '',
  trans_type: '',
  status: '',
};

const statuses = [
  { label: 'เข้าโกดังจีนครบ', value: 'เข้าโกดังจีนครบ' },
];

const searchTopics = [
  { label: 'ทั้งหมด', value: 'order_id' },
  { label: 'รถ', value: 'cus_id' },
  { label: 'เรือ', value: 'cus_id' },
];

const BuylistPage: React.FC = () => {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showAddLotModal, setShowAddLotModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ImportedProduct | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchTopic, setSearchTopic] = useState<keyof LocalProduct>('order_id');

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

  const handleShowModal = (product: ImportedProduct) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleShowAddLotModal = () => {
    setShowAddLotModal(true);
  };

  const handleCloseAddLotModal = () => {
    setShowAddLotModal(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="card-body">
      <form className="form-inline mb-4" onSubmit={handleSearch}>
        <div className="input-group" style={{ width: '60%' }}>
          <input
            type="text"
            className="form-control col-md-6"
            placeholder="ค้นหา"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-control col-md-2"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value as keyof LocalProduct)}
          >
            {searchTopics.map(topic => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
          <div className="input-group-append col-md-3">
            <button type="submit" className="btn btn-outline-secondary w-10">
              <i className="fa fa-search"></i>
            </button>
          </div>
          <div className="input-group-append col-md-2">
          <button
              type="button"
              onClick={handleShowAddLotModal}
              className="btn btn-primary ml-2"
            >
              เพิ่มล็อตสินค้า
            </button>
          </div>
          <div className="input-group-append col-md-2">
            <button
              type="button"
              onClick={handleShowAddLotModal}
              className="btn btn-primary ml-2"
            >
              พิมพ์
            </button>
          </div>
        </div>
      </form>
      <div className="table-responsive _mgbt-30 _pdbt-50">
        <table className="table table-borderless table-forwarder-show">
          <thead>
            <tr>
              <th>หมายเลข</th>
              <th>หมายเหตุ</th>
              <th>เข้าโกดัง</th>
              <th>ออกจากโกดัง</th>
              <th>ถึงไทย</th>
              <th>จำนวน</th>
              <th>จำนวนที่ส่งออก</th>
              <th>ผู้แก้ไขล่าสุด</th>
              <th>ไฟล์แนบ</th>
              <th>พิมพ์</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-3">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center p-3">Error: {error}</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-3">No orders found.</td>
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
                    <td>{product.note}</td>
                    <td>{product.status}</td>
                    <td>
                      <button
                        onClick={() => handleShowModal(product as ImportedProduct)}
                        className="btn btn-success"
                      >
                        จัดการ
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
        <ModalComponent show={showModal} onClose={handleCloseModal} product={selectedProduct} />
        <AddLotModal show={showAddLotModal} onClose={handleCloseAddLotModal} />
      </div>
    </div>
  );
};

export default BuylistPage;
