"use client"
import React from 'react';
import ReactDOM from 'react-dom';
import Head from 'next/head';
import { Breadcrumb, Card, Row, Col, Table, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BasketIcon from '../components/BasketIcon';
import ColorStatus from '../components/StatusStyle';
// import 'antd/dist/antd.css';
import DataCard from '../components/DataCard';

// Define interfaces for your data
interface TableData {
    key: string;
    lot: string;
    code: string;
    // other fields...
}
interface CardInfo {
  title: string;
  count: number | string;
  color: string; // for icon color
}
const columns = [
    { title: 'Lot/Sequence', dataIndex: 'lot', key: 'lot' },
    { title: 'code', dataIndex: 'code', key: 'code' },
    // other columns...
];

const data: TableData[] = [
    { key: '1', lot: 'LOT1663/71', code : '1231456' },
    { key: '2', lot: 'LOT1663/72', code : '1231546' },
    // other data...
];


const ServicePage : React.FC = () => {
  const cards: CardInfo[] = [
    {
      title: 'จำนวนรายการ',
      count: 0,
      color: 'rgb(84, 209, 174)', // Teal color
    },
    {
      title: 'ยอดที่ต้องชำระ',
      count: '0.00 ฿',
      color: 'rgb(255, 153, 177)', // Pink color
    }
  ];
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
            <Button type="primary" href='/user/createpayment' icon={<PlusOutlined />} style={{ width: '50%', height: '40%' }}>
              สร้างใบชำระค่าสินค้า
            </Button>
          </Col>
        </Row>

        <Table columns={columns} dataSource={data} />
        <ColorStatus/>
      </main>
    </div>
  );
};

export default ServicePage;
