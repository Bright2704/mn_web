"use client"
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Breadcrumb, Card, Row, Col, Table, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import StatusCard from '../components/StatusCard';
import ColorStatus from '../components/StatusStyle';
import '../../../node_modules/antd/dist/reset.css';

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

const StatusPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/orders');
        const formattedData = data.map((order: any) => ({
          ...order,
          price: extractPrice(order.note)
        }));
        setOrders(formattedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const extractPrice = (note: string) => {
    const priceMatch = note.match(/รวม\s?:\s?(\d+,\d+\.\d+)/);
    return priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
  };
  
  const onSelectChange = (selectedKeys: React.Key[], selectedRows: Order[]) => {
    console.log("Selected Keys:", selectedKeys);  // Debugging output
    console.log("Selected Rows:", selectedRows);  // More debugging output
    setSelectedRowKeys(selectedKeys);  // Update state with the selected keys
    const total = selectedRows.reduce((sum, record) => sum + extractPrice(record.note), 0);
    console.log("Total Amount Calculated:", total);  // Debugging total calculation
    setTotalAmount(total);  // Update the total amount state
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: Order) => ({
      disabled: record.status === 'Disabled', // Disable selection based on status if needed
    }),
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
    window.location.href = '/user/createpayment';  // Ensure this navigates correctly
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
              <StatusCard card={card} />
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
          rowKey={record => record._id}  // This ensures each row can be uniquely identified
        />
        <ColorStatus/>
      </main>
    </div>
  );
};

export default StatusPage;
