"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css';
import 'font-awesome/css/font-awesome.min.css';
import ModalComponent, { Product as ImportedProduct } from '../components/export_detail/ModalComponent';

type LocalProduct = {
    order_id: string;
    cus_id: string;
    product: string;
    note: string;
    status: string;
    parcels: string;
};

type LocalPayment = {
    customerID: string;
    parcels: string;
    totalPrice: string;
    paymentNumber: string;
    date: string;
    export_product: string;
    address: string;
    transport: string; 
    status: string;

  // Add other fields if necessary
};

const statuses = [
  // { label: 'สถานะทั้งหมด', value: 'all' },
  // { label: 'รอตรวจสอบ', value: 'รอตรวจสอบ' },
  // { label: 'รอชำระเงิน', value: 'รอชำระเงิน' },
  { label: 'จ่ายเงินแล้ว', value: 'จ่ายเงินแล้ว' },
  // { label: 'สั่งซื้อสำเร็จ', value: 'สั่งซื้อสำเร็จ' },
  // { label: 'มีแทรคครบ', value: 'มีแทรคครบ' },
  // { label: 'เข้าโกดังจีนครบ', value: 'เข้าโกดังจีนครบ' },
  // { label: 'ออกโกดังจีนครบ', value: 'ออกโกดังจีนครบ' },
  // { label: 'เข้าโกดังไทยครบ', value: 'เข้าโกดังไทยครบ' },
  // { label: 'ยกเลิก', value: 'ยกเลิกการสั่งซื้อ' },
];

// const searchTopics = [
//   { label: 'หมายเลข', value: 'order_id' },
//   { label: 'ลูกค้า', value: 'cus_id' },
// ];


const searchTopics= [
  { "label": "ขนส่งทั้งหมด", "value": "all" },
  { "label": "รับที่โกดัง (ติดต่อแอดมินก่อนรับสินค้า 3-4 ชั่วโมง)", "value": "รับที่โกดัง (ติดต่อแอดมินก่อนรับสินค้า 3-4 ชั่วโมง)" },
  { "label": "Kerry Express (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)", "value": "Kerry Express (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)" },
  { "label": "Flash Express (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)", "value": "Flash Express (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)" },
  { "label": "J&T Express (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)", "value": "J&T Express (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)" },
  { "label": "ไปรษณีย์ไทย EMS (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)", "value": "ไปรษณีย์ไทย EMS (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)" },
  { "label": "บริษัทจัดส่ง 690 บาท (เฉพาะเขตกทม.)", "value": "บริษัทจัดส่ง 690 บาท (เฉพาะเขตกทม.)" },
  { "label": "พาณิชย์การขนส่ง KSD เก็บเงินปลายทาง (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "พาณิชย์การขนส่ง KSD เก็บเงินปลายทาง (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "BEST Express (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)", "value": "BEST Express (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)" },
  { "label": "DHL ล่าช้า 1-2 วัน (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)", "value": "DHL ล่าช้า 1-2 วัน (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)" },
  { "label": "PL ขนส่ง เก็บเงินต้นทาง (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)", "value": "PL ขนส่ง เก็บเงินต้นทาง (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)" },
  { "label": "PL ขนส่ง เก็บเงินปลายทาง (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "PL ขนส่ง เก็บเงินปลายทาง (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "I.T. Transport เก็บเงินปลายทาง (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "I.T. Transport เก็บเงินปลายทาง (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "N.P.ขนส่ง (เชียงใหม่ - หักค่าบริการจัดส่งตามน้ำหนัก ค่าขนส่งจริงเก็บเงินปลายทาง)", "value": "N.P.ขนส่ง (เชียงใหม่ - หักค่าบริการจัดส่งตามน้ำหนัก ค่าขนส่งจริงเก็บเงินปลายทาง)" },
  { "label": "นิ่มซีเส็ง ขนส่ง 1988 ภาคเหนือ (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)", "value": "นิ่มซีเส็ง ขนส่ง 1988 ภาคเหนือ (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)" },
  { "label": "นิ่มซีเส็ง ขนส่ง 1988 ภาคเหนือ (เก็บเงินปลายทาง)", "value": "นิ่มซีเส็ง ขนส่ง 1988 ภาคเหนือ (เก็บเงินปลายทาง)" },
  { "label": "NiM Express (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)", "value": "NiM Express (หักค่าบริการจัดส่งตามน้ำหนักและหักค่าขนส่งไทยตามจริง เงินที่เหลือคืนให้ในระบบ)" },
  { "label": "ธนภาคย์ขนส่ง (สาย3) อุดร-ขอนแก่น-หนองคาย (เก็บปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "ธนภาคย์ขนส่ง (สาย3) อุดร-ขอนแก่น-หนองคาย (เก็บปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "ธนามัยขนส่ง (ขนส่งด่วนอีสาน-เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "ธนามัยขนส่ง (ขนส่งด่วนอีสาน-เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "จันทร์สว่าง ขนส่ง (หักค่าบริการจัดส่งตามน้ำหนัก ค่าขนส่งจริงเก็บเงินปลายทาง)", "value": "จันทร์สว่าง ขนส่ง (หักค่าบริการจัดส่งตามน้ำหนัก ค่าขนส่งจริงเก็บเงินปลายทาง)" },
  { "label": "ขนส่ง เจ อาร์ เอส พานิช(อุดร-ขอนแก่น) เก็บเงินปลายทาง (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "ขนส่ง เจ อาร์ เอส พานิช(อุดร-ขอนแก่น) เก็บเงินปลายทาง (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "บริษัท ส.แก่นนครพัฒนาการขนส่ง (ขอนแก่น มหาสารคาม กาฬสินธุ์ - เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "บริษัท ส.แก่นนครพัฒนาการขนส่ง (ขอนแก่น มหาสารคาม กาฬสินธุ์ - เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "ติ่งขนส่ง (ชลบุรี ทุกอำเภอ-เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "ติ่งขนส่ง (ชลบุรี ทุกอำเภอ-เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "หาดใหญ่ ทัวร์ (หักค่าบริการจัดส่งตามน้ำหนัก ค่าขนส่งจริงเก็บเงินปลายทาง)", "value": "หาดใหญ่ ทัวร์ (หักค่าบริการจัดส่งตามน้ำหนัก ค่าขนส่งจริงเก็บเงินปลายทาง)" },
  { "label": "บริษัท สหไทย (ภาคใต้ขนส่ง - เก็บปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "บริษัท สหไทย (ภาคใต้ขนส่ง - เก็บปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "หจก. มะม่วงขนส่ง (เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "หจก. มะม่วงขนส่ง (เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "ประจวบทองชัยขนส่ง (ประจวบคีรีขันธ์-เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "ประจวบทองชัยขนส่ง (ประจวบคีรีขันธ์-เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "พนมรุ้ง ขนส่ง (บุรีรัมย์ นางรอง - เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "พนมรุ้ง ขนส่ง (บุรีรัมย์ นางรอง - เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "ขนส่งยิ้ม (เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)", "value": "ขนส่งยิ้ม (เก็บเงินปลายทาง) (หักค่าบริการจัดส่งตามน้ำหนัก)" },
  { "label": "ขนส่งอื่นๆ1 (หักค่าบริการจัดส่งตามน้ำหนัก ค่าขนส่งจริงเก็บเงินปลายทาง)", "value": "ขนส่งอื่นๆ1 (หักค่าบริการจัดส่งตามน้ำหนัก ค่าขนส่งจริงเก็บเงินปลายทาง)" }
];


const BuylistPage: React.FC = () => {
  const [products, setProducts] = useState<LocalPayment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<ImportedProduct | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchTopic, setSearchTopic] = useState<keyof LocalPayment>('paymentNumber');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let response;
        if (selectedStatus === 'all') {
          // Fetch all statuses separately and combine the results
          const requests = statuses.filter(status => status.value !== 'all').map(status =>
            // axios.get<LocalProduct[]>(`http://localhost:5000/orders/status/${status.value}`)
            // axios.get<LocalProduct[]>(`/api/orders`)
            axios.get<LocalPayment[]>(`/api/payments`)
          );
          const results = await Promise.all(requests);
          const allProducts = results.flatMap(result => result.data);
          response = { data: allProducts };
        } else {
          response = await axios.get<LocalPayment[]>(`http://localhost:5000/orders/status/${selectedStatus}`);
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

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className="card-body">
      {/* <div className="mb-4">
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
      </div> */}
      <form className="form-inline mb-4" onSubmit={handleSearch}>
        <div className="input-group" style={{ width: '100%' }}>
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
            onChange={(e) => setSearchTopic(e.target.value as keyof LocalPayment)}
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
        </div>
      </form>
      <div className="table-responsive _mgbt-30 _pdbt-50">
        <table className="table table-borderless table-forwarder-show">
          <thead>
            <tr>
              <th>เลขที่ PAY</th>
              <th>customer</th>
              <th>วันที่สร้าง</th>
              <th>วันที่ส่งออก</th>
              <th>ประเภทการจัดส่ง</th>
              <th>ราคา</th>
              <th>สถานะ</th>
              {/* <th>รวม</th> */}
              {/* <th>สถานะ</th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center p-3">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={9} className="text-center p-3">Error: {error}</td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-3">No orders found.</td>
              </tr>
            ) : (
              products
                // .filter(product =>
                //   product[searchTopic].toString().toLowerCase().includes(searchTerm.toLowerCase())
                // )
                .map(product => (
                  <tr key={product.paymentNumber}>
                    <td>{product.paymentNumber}</td>
                    <td>{product.customerID}</td>
                    <td>{product.date}</td>
                    <td>{product.export_product}</td>
                    <td>{product.transport}</td>
                    <td>{product.totalPrice}</td>
                    <td>{product.status}</td>
                    <td>
                      <button
                        onClick={() => handleShowModal(product as unknown as ImportedProduct)}
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
      </div>
    </div>
  );
};

export default BuylistPage;
