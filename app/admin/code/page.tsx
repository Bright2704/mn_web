"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
// import './OrdersPage.css';

const statuses = [
  { label: 'สถานะทั้งหมด', value: 'all' },
  { label: 'รอพัสดุเข้าโกดัง', value: 'รอพัสดุเข้าโกดัง' },
  { label: 'รอพัสดุถึงไทย', value: 'รอพัสดุถึงไทย' },
  { label: 'รอชำระเงิน', value: 'รอชำระเงิน' },
  { label: 'เตรียมส่ง', value: 'เตรียมส่ง' },
  { label: 'ส่งแล้ว', value: 'ส่งแล้ว' },
];

const OrdersPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/items`, {
        params: {
          status: selectedStatus,
          page: currentPage,
          term: searchTerm,
        },
      });
      console.log('Fetched items:', response.data.items); // Debug: Log the fetched data
      setItems(response.data.items);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setError('Failed to fetch item data');
      setLoading(false);
    }
  }, [selectedStatus, currentPage, searchTerm]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page when status changes
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchItems();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="card-body">
      <form className="_mgbt-16 form-row align-items-center" onSubmit={handleSearchSubmit}>
        <div className="col">
          <ul className="nav nav-pills nav-secondary tab-status">
            {statuses.map((status) => (
              <li className="nav-item" key={status.value}>
                <a
                  href="#"
                  className={`nav-link ${selectedStatus === status.value ? 'active' : ''}`}
                  onClick={() => handleStatusChange(status.value)}
                >
                  {status.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-auto">
          <input
            type="text"
            name="term"
            placeholder="แทร็คกิ้ง, รหัสผู้ใช้"
            value={searchTerm}
            className="form-control"
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-outline-secondary _mgr-10">ค้นหา</button>
        </div>
        <div className="col-auto">
          <button type="button" data-toggle="modal" data-target="#modal-update-item-to-th" className="btn btn-secondary">อัพเดทสถานะ</button>
        </div>
      </form>
      <div className="table-responsive _mgbt-30 _pdbt-50">
        <table className="table table-borderless table-forwarder-show">
          <thead>
            <tr>
              <th>รหัสผู้ใช้</th>
              <th>เลขพัสดุ</th>
              <th>ล็อต</th>
              <th className="_tal-ct">ประเภท/ขนส่ง</th>
              <th className="_tal-ct">คิดตาม</th>
              <th className="_tal-ct">ค่าส่งจีน</th>
              <th className="_tal-ct">ตีลัง</th>
              <th className="_tal-ct">เช็คสินค้า</th>
              <th className="_tal-ct">เข้าโกดัง</th>
              <th className="_tal-ct">ออกจากจีน</th>
              <th className="_tal-ct">ถึงไทย</th>
              <th>สถานะ</th>
              <th className="_tal-ct">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={13} style={{ textAlign: 'center', padding: '8px' }}>Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={13} style={{ textAlign: 'center', padding: '8px' }}>Error: {error}</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={13} style={{ textAlign: 'center', padding: '8px' }}>No items found.</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  <td><a href={`#`}>{item.user_id}</a></td>
                  <td><a href={`#`}>{item.tracking_number}</a></td>
                  <td>{item.lot}</td>
                  <td className="_tal-ct">{item.type_transport}</td>
                  <td className="_tal-ct">{item.follow_by}</td>
                  <td className="_tal-ct">{item.china_shipping_cost}</td>
                  <td className="_tal-ct"><i className={`fas fa-${item.packaging === 'x' ? 'times _cl-grey' : 'check _cl-success'}`}></i></td>
                  <td className="_tal-ct"><i className={`fas fa-${item.check_product === 'x' ? 'times _cl-grey' : 'check _cl-success'}`}></i></td>
                  <td className="_tal-ct">{item.warehouse_entry}</td>
                  <td className="_tal-ct">{item.departure_from_china}</td>
                  <td className="_tal-ct">{item.arrival_in_thailand}</td>
                  <td>{item.status}</td>
                  <td className="_tal-ct">
                    <div className="dropdown">
                      <button
                        className="btn btn-secondary dropdown-toggle"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        จัดการ
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="#">
                          อัพเดท รอพัสดุถึงไทย
                        </a>
                        <a className="dropdown-item" href="#">
                          วัดพัสดุ
                        </a>
                        <a className="dropdown-item" href="#">
                          ดูรายละเอียด
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>‹</button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>›</button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default OrdersPage;
