"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import ModalComponent, { Product as ImportedProduct } from '../components/code_detail/ModalComponent';
import ImportModal from '../components/code_detail/ImportModal'; // Import the new modal component

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
  { label: 'รอพัสดุเข้าโกดัง', value: 'รอพัสดุเข้าโกดัง' },
  { label: 'ปิดตู้', value: 'ปิดตู้' },
  { label: 'รอพัสดุถึงไทย', value: 'รอพัสดุถึงไทย' },
  { label: 'รอชำระเงิน', value: 'รอชำระเงิน' },
  { label: 'เตรียมส่ง', value: 'เตรียมส่ง' },
  { label: 'ส่งแล้ว', value: 'ส่งแล้ว' },
];

const defaultProduct: ImportedProduct = {
  order_id: '',
  cus_id: '',
  product: '',
  note: '',
  trans_type: '',
  status: '',
};

const BuylistPage: React.FC = () => {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false); // State for the new modal
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
          // Fetch all statuses separately and combine the results
          const requests = statuses.filter(status => status.value == 'all').map(status =>
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

  const handleShowImportModal = () => {
    setShowImportModal(true);
  };

  const handleCloseImportModal = () => {
    setShowImportModal(false);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="card-body">
      <div className="d-flex justify-content-between mb-4 ml-0 mr-1">
        <div>
          {statuses.map(status => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className="btn mr-2 mb-2"
              style={{
                borderRadius: '9999px',
                backgroundColor: selectedStatus === status.value ? '#dc3545' : '#e9e9e9',
                color: selectedStatus === status.value ? 'white' : 'black'
              }}
            >
              {status.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={handleShowImportModal}
          className="btn btn-warning ml-1" // Added margin-left for spacing
        >
          นำเข้าเลขพัสดุ
        </button>
      </div>
      <form className="form-inline mb-4" onSubmit={handleSearch}>
        <div className="input-group" style={{ width: '50%' }}>
          <input
            type="text"
            className="form-control col-md-6"
            placeholder="แทร็คกิ้ง, เลขออเดอร์"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="input-group-append col-md-3">
            <button type="submit" className="btn btn-outline-secondary w-10">
              <i className="fa fa-search"></i>
            </button>
          </div>
          <div className="input-group-append col-md-2">
            <button
              type="button"
              onClick={() => handleShowModal(defaultProduct)}
              className="btn btn-primary ml-2"
            >
              อัพเดทสถานะ
            </button>
          </div>
        </div>
      </form>
      <div className="table-responsive _mgbt-30 _pdbt-50">
        <table className="table table-borderless table-forwarder-show">
          <thead>
            <tr>
              <th>หมายเลข</th>
              <th>ลูกค้า</th>
              <th>สินค้า</th>
              <th>วลีช่วยจำ(ผู้ดูแล)</th>
              <th>สถานะ</th>
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
        <ImportModal show={showImportModal} onClose={handleCloseImportModal} /> 
      </div>
    </div>
  );
};

export default BuylistPage;
