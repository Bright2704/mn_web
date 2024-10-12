"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import Head from 'next/head';
import axios from 'axios';
import { Breadcrumb, Row, Col, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import StatusCard from '../components/StatusCard';
import ColorStatus from '../components/StatusStyle';

interface TrackingData {
  tracking_id: string;
  weight: number;
  wide: number;
  high: number;
  long: number;
  number: number;
  lot_id: string;
  in_cn: string;
  out_cn: string;
  in_th: string;
  user_id: string;
  type_item: string;
  check_product_price: number;
  transport: number;
  price_crate: number;
  other: number;
  image_item_paths: string[];
  lot_type: string;
}

const StatusPage: React.FC = () => {
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [totalAmount, setTotalAmount] = useState(0); // Total sum of the price
  const [totalItems, setTotalItems] = useState(0); // Count of selected items
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize the useRouter hook for client-side navigation

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5000/tracking');
        setTrackingData(data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle selecting/deselecting rows
  const handleSelectRow = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  // Calculate volume based on dimensions
  const calculateVolume = (wide: number, long: number, high: number) => (wide * long * high) / 1000;

  // Calculate total sum of prices and count selected items
  useEffect(() => {
    const selectedData = trackingData.filter((_, index) => selectedRows.includes(index));
    
    const total = selectedData.reduce(
      (sum, tracking) => sum + calculateVolume(tracking.wide, tracking.long, tracking.high) * tracking.number,
      0
    );
    const itemsCount = selectedData.length;
    
    setTotalAmount(total);
    setTotalItems(itemsCount);
  }, [selectedRows, trackingData]);

  const navigateToCreatePayment = () => {
    const selectedParcels = trackingData.filter((_, index) => selectedRows.includes(index));
    localStorage.setItem('selectedParcels', JSON.stringify(selectedParcels));
    
    // Use Next.js router to navigate
    router.push('/user/createpayment');
  };

  return (
    <div className="container">
      <Head>
        <title>Dashboard</title>
      </Head>

      <main>
        <Breadcrumb>
          <Breadcrumb.Item><a href="/user/dashboard">Dashboard</a></Breadcrumb.Item>
          <Breadcrumb.Item>Status and Notifications</Breadcrumb.Item>
        </Breadcrumb>

        <Row gutter={[16, 16]} style={{ margin: '8px' }}>
          {/* First Card: Total Items */}
          <Col xs={24} sm={8} lg={7} xl={8} xxl={6} style={{ paddingLeft: '8px', paddingRight: '8px' }}>
            <StatusCard 
              card={{
                title: 'จำนวนรายการ', 
                count: totalItems, // Display the total number of selected items
                color: 'rgb(84, 209, 174)', // Teal color
              }} 
            />
          </Col>

          {/* Second Card: Total Price */}
          <Col xs={24} sm={8} lg={7} xl={8} xxl={6} style={{ paddingLeft: '8px', paddingRight: '8px' }}>
            <StatusCard 
              card={{
                title: 'ยอดที่ต้องชำระ', 
                count: `${totalAmount.toFixed(2)} ฿`, // Display the total price
                color: 'rgb(255, 153, 177)', // Pink color
              }} 
            />
          </Col>

          <Col xs={12} sm={8} lg={10} xl={8} xxl={6} offset={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', padding: '8px' }}>
            <Button onClick={navigateToCreatePayment} type="primary" icon={<PlusOutlined />} style={{ width: '50%', height: '40%' }}>
              สร้างใบชำระค่าสินค้า
            </Button>
          </Col>
        </Row>

        <table className="table table-width-1" style={{ fontSize: 14 }}>
          <thead>
            <tr className="text-center">
              <th></th>
              <th>รหัสพัสดุ</th>
              <th>รูปภาพ</th>
              <th>รหัสลูกค้า</th>
              <th>จำนวน</th>
              <th>ประเภท</th>
              <th>ราคา</th>
            </tr>
          </thead>

          <tbody>
            {trackingData.length > 0 ? (
              trackingData.map((tracking, index) => (
                <tr key={index} className="text-center">
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(index)}
                      onChange={() => handleSelectRow(index)}
                    />
                  </td>
                  <td>{tracking.tracking_id}</td>
                  <td>
                    <div className="image-gallery" style={{ display: 'flex', gap: '5px' }}>
                      {tracking.image_item_paths.length > 0 ? (
                        tracking.image_item_paths.map((imagePath, i) => (
                          <div key={i} className="image-wrapper" style={{ width: '50px', height: '50px', cursor: 'pointer' }}>
                            <Image
                              src={imagePath}
                              alt={`Image ${i + 1}`}
                              layout="responsive"
                              width={100}
                              height={100}
                              objectFit="cover"
                            />
                          </div>
                        ))
                      ) : (
                        <span>No images</span>
                      )}
                    </div>
                  </td>
                  <td>{tracking.user_id}</td>
                  <td>{calculateVolume(tracking.wide, tracking.long, tracking.high)}</td>
                  <td>{tracking.type_item}</td>
                  <td>{(calculateVolume(tracking.wide, tracking.long, tracking.high) * tracking.number).toFixed(2)} ฿</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No tracking data available for this lot.</td>
              </tr>
            )}
          </tbody>
        </table>

        <ColorStatus />
      </main>
    </div>
  );
};

export default StatusPage;
