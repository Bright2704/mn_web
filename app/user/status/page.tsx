"use client"
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Head from 'next/head';
import axios from 'axios';
import { Breadcrumb, Card, Row, Col, Table, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BasketIcon from '../components/BasketIcon';
import ColorStatus from '../components/StatusStyle';
// import 'antd/dist/antd.css';
import DataCard from '../components/DataCard';

// Define interfaces for your data
interface Order {
    _id: string;
    order_id: string;
    cus_id: string;
    product: string;
    note: string;
    trans_type: string;
    status: string;
    date: string;
    // other fields...
}
interface CardInfo {
    title: string;
    count: number | string;
    color: string; // for icon color
}
const columns = [
    { title: 'Order ID', dataIndex: 'order_id', key: 'order_id' },
    { title: 'Customer ID', dataIndex: 'cus_id', key: 'cus_id' },
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Price', dataIndex: 'note', key: 'note'},
    { title: 'Date', dataIndex: 'date', key: 'date'},
    // other columns...
    
];

// const data: TableData[] = [
//     { key: '1', lot: 'LOT1663/71', code : '1231456' },
//     { key: '2', lot: 'LOT1663/72', code : '1231546' },
//     // other data...
// ];


const ServicePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/orders/status/เข้าโกดังไทยครบ'); // Change the URL according to your API endpoint
        // const { data } = await axios.get('http://localhost:5000/orders');
        const formattedData = data.map((order: any) => ({
          ...order,
          price: extractPrice(order.note)
        }));
        
        setOrders(formattedData);
        console.log(orders)
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const extractPrice = (note: string) => {
    const priceMatch = note.match(/รวม\s?:\s?(\d+,\d+\.\d+)/); // Adjust regex as per your actual note format
    return priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
  };
  
  const onSelectChange = (selectedKeys: React.Key[], selectedRows: Order[]) => {
    setSelectedRowKeys(selectedKeys);
    const total = selectedRows.reduce((sum, record) => {
      const price = extractPrice(record.note);
      return sum + price;
    }, 0);
  
    setTotalAmount(total);
    // console.log("Total Amount:", total); // This will log the total each time the selection changes
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  const cards: CardInfo[] = [
    {
      title: 'จำนวนรายการ',
      count: selectedRowKeys.length,
      color: 'rgb(84, 209, 174)', // Teal color
    },
    {
      title: 'ยอดที่ต้องชำระ',
      count: `${totalAmount.toFixed(2)} ฿`,
      color: 'rgb(255, 153, 177)', // Pink color
    }
  ];
  const navigateToCreatePayment = () => {
    const selectedOrders = orders.filter(order => selectedRowKeys.includes(order._id));
    localStorage.setItem('selectedOrders', JSON.stringify(selectedOrders));
    window.location.href = '/createpayment'; // Navigate to CreatePayment page
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
          {cards.map((card, index) => (
            <Col key={index} xs={24} sm={8} lg={7} xl={8} xxl={6} style={{ paddingLeft: '8px', paddingRight: '8px' }}>
              <Card className="_pm_cardList_1xea5_211" style={{ borderRadius: '12px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', color: card.color }}>
                <BasketIcon style={{ color: 'rgb(84, 209, 174)', fontSize: '50px', backgroundColor: 'rgb(255, 255, 255)', borderRadius: '10px' }} />
                  {/* <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style={{ fontSize: '50px', backgroundColor: 'rgb(255, 255, 255)', borderRadius: '10px' }}> */}
                    {/* Placeholder for SVG path */}
                  {/* </svg> */}
                  <div style={{ marginLeft: '12px' }}>
                    <span>{card.title}</span>
                    <p>{card.count}</p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
          <Col xs={12} sm={8} lg={10} xl={8} xxl={6} offset={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', padding: '8px' }}>
            <Button onClick={navigateToCreatePayment} type="primary" href='/user/createpayment' icon={<PlusOutlined />} style={{ width: '50%', height: '40%' }}>
              สร้างใบชำระค่าสินค้า
            </Button>
          </Col>
        </Row>

        <Table 
          rowSelection={rowSelection} 
          columns={columns} 
          dataSource={orders} 
          pagination={false} 
          rowKey={record => record._id}
        />
        <ColorStatus/>
      </main>
    </div>
  );
};

export default ServicePage;
