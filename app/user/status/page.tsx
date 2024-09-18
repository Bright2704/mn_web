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
interface Parcel {
    _id: string;
    code: string;
    lot: string;
    number: string;
    vehicle: String;
    length: String;
    mnemonic_phrases: String;
    price: String;
    width: String;
    height: String;
    weight: String;
    amount: String;
    pay: String;
    customer: String;
    create_date: Date;
    in_cn: Date;
    out_cn: Date;
    in_th: Date;
    pay_date: Date;
    // other fields...
}
interface CardInfo {
    title: string;
    count: number | string;
    color: string; // for icon color
}

const columns = [
    { title: 'Code ID', dataIndex: 'code', key: 'code' },
    { title: 'Customer ID', dataIndex: 'customer', key: 'customer' },
    { title: 'Lot number', dataIndex: 'lot', key: 'lot' },
    { title: 'create_date', dataIndex: 'create_date', key: 'create_date' },
    { title: 'Price', dataIndex: 'price', key: 'price',render: price => `${price} ฿` },  // Add currency symbol to each price
    // { title: 'Date', dataIndex: 'date', key: 'date'},
    // other columns...
    
];

const StatusPage: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get('/api/parcels');
        const formattedData = data.map((parcel: any) => ({
          ...parcel,
          // price: extractPrice(order.note)
          // price: parcel.price
        }));
        setParcels(formattedData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to fetch parcels');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // const extractPrice = (note: string) => {
  //   const priceMatch = note.match(/รวม\s?:\s?(\d+,\d+\.\d+)/);
  //   return priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
  // };
  
  const onSelectChange = (selectedKeys: React.Key[], selectedRows: Parcel[]) => {
    console.log("Selected Keys:", selectedKeys);  // Debugging output
    console.log("Selected Rows:", selectedRows);  // More debugging output
    setSelectedRowKeys(selectedKeys);  // Update state with the selected keys
    const total = selectedRows.reduce((sum, record) => sum + parseFloat(record.price), 0);
    console.log("Total Amount Calculated:", total);  // Debugging total calculation
    setTotalAmount(total);  // Update the total amount state
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: Parcel) => ({
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
    const selectedParcels = parcels.filter(parcel => selectedRowKeys.includes(parcel._id));
    localStorage.setItem('selectedParcels', JSON.stringify(selectedParcels));
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
          dataSource={parcels} 
          pagination={false} 
          rowKey={record => record._id}  // This ensures each row can be uniquely identified
        />
        <ColorStatus/>
      </main>
    </div>
  );
};

export default StatusPage;
