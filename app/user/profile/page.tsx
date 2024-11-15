"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Avatar, Upload, Button, Input, Form, Typography, Tag, Table } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getSession } from 'next-auth/react';

type Balance = {
  user_id: string;
  balance_id: string;
  balance_date: string;
  balance_type: string;
  balance_descri: string;
  balance_amount: number;
  balance_total: number;
};

const ProfilePage: React.FC = () => {
  const { Title } = Typography;
  const [balances, setBalances] = useState<Balance[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0); // State for total amount
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch balances from the API
    axios.get('http://localhost:5000/balances')
      .then(response => {
        const fetchedBalances: Balance[] = response.data;
        setBalances(fetchedBalances);
        // Calculate totalAmount as the latest balance_total
        if (fetchedBalances.length > 0) {
          const latestBalanceTotal = fetchedBalances[fetchedBalances.length - 1].balance_total;
          setTotalAmount(latestBalanceTotal);
        }
      })
      .catch(error => {
        console.error('Error fetching balances:', error);
      });
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id;
        if (userId) {
          setUserId(userId);
        } else {
          console.error('User ID not found in session');
        }
      }
    };

    fetchSession();
  }, []);

  // Define the data structure for each row in the address table
  interface AddressData {
    key: string;
    name: string;
    phone: string;
    province: string;
    zipcode: string;
    address: string;
  }

  // Define the columns with correct typing
  const addressColumns: ColumnsType<AddressData> = [
    { title: 'ชื่อ - สกุล', dataIndex: 'name', key: 'name', align: 'center' },
    { title: 'เบอร์โทรศัพท์', dataIndex: 'phone', key: 'phone', align: 'center' },
    { title: 'จังหวัด', dataIndex: 'province', key: 'province', align: 'center' },
    { title: 'รหัสไปรษณีย์', dataIndex: 'zipcode', key: 'zipcode', align: 'center' },
    { title: 'ที่อยู่', dataIndex: 'address', key: 'address', align: 'center' },
    {
      title: 'จัดการ',
      key: 'actions',
      align: 'center',
      render: () => <Button type="link" danger>Delete</Button>,
    },
  ];

  // Sample data for the table
  const addressData: AddressData[] = [
    {
      key: '1',
      name: 'Mn1688',
      phone: '0659307185',
      province: 'นครราชสีมา',
      zipcode: '30120',
      address: '206/76 ถนนเทศบาล7',
    },
  ];

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="ข้อมูลส่วนตัว">
          <Row justify="center" style={{ marginBottom: 16 }}>
            <Avatar size={64} icon={<UserOutlined />} />
          </Row>
          <Row justify="center" style={{ marginBottom: 16 }}>
            <Upload>
              <Button icon={<UploadOutlined />}>อัพโหลดรูป</Button>
            </Upload>
          </Row>
          <Form layout="vertical">
            <Form.Item label="ชื่อ - สกุล" required>
              <Input defaultValue="Mn1688" />
            </Form.Item>
            <Form.Item label="อีเมล์" required>
              <Input defaultValue="Mn1688express@gmail.com" />
            </Form.Item>
            <Form.Item label="เบอร์โทรศัพท์" required>
              <Input defaultValue="0659307185" />
            </Form.Item>
            <Form.Item label="LINE ID">
              <Input />
            </Form.Item>
            <Form.Item label="Facebook">
              <Input />
            </Form.Item>
            <Form.Item label="สถานะ">
              <Tag color="green">อนุมัติแล้ว</Tag>
            </Form.Item>
          </Form>
        </Card>
      </Col>
      
      <Col xs={24} md={12}>

        <Card title="ยอดเงินคงเหลือในระบบ">
          <div className="d-flex align-items-center" style={{ gap: '20px' }}>
            <p className="mb-1" style={{ color: '#198754', fontSize: '24px' }}>ยอดเงินในระบบ </p>
            <div className="bg-light p-2 rounded">
              <h5 className="mb-0" style={{ color: '#198754',fontSize: '30px' }}>
                {totalAmount.toLocaleString()} ฿
              </h5>
            </div>
            <a href="/user/wallet/deposit">
              <button type="button" className="btn btn-primary">
                <span>เติมเงิน</span>
              </button>
            </a>
            <a href="/user/wallet/withdraw">
              <button type="button" className="btn btn-secondary">
                <span>ถอนเงิน</span>
              </button>
            </a>
          </div>
        </Card>

        <Card title="ข้อมูลการเข้าใช้งาน" style={{ marginTop: 16 }}>
          <Form layout="vertical">
            <Form.Item label="รหัสลูกค้า">
              <Input defaultValue={userId ?? ''} disabled />
            </Form.Item>
            <Form.Item label="รหัสผ่าน">
              <Input.Password defaultValue="MN1688_EXpress" disabled />
            </Form.Item>
            <Button>เปลี่ยนรหัสผ่าน</Button>
          </Form>
        </Card>

        <Card title="ที่อยู่" style={{ marginTop: 16 }}>
          <Button style={{ marginBottom: 16 }}>เพิ่มที่อยู่</Button>
          <Table
            columns={addressColumns}
            dataSource={addressData}
            pagination={false}
            size="small"
          />
        </Card>
      </Col>

      <Col xs={24}>
        <Card title="การตั้งราคา (พรีออเดอร์ (สั่งซื้อ + นำเข้า))">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Table
                columns={[
                  { title: 'รถ', dataIndex: 'vehicle', key: 'vehicle' },
                  { title: 'คำอธิบาย', dataIndex: 'description', key: 'description' },
                  { title: 'กิโล.', dataIndex: 'kg', key: 'kg', align: 'right' },
                  { title: 'คิว.', dataIndex: 'cbm', key: 'cbm', align: 'right' },
                ]}
                dataSource={[
                  { key: '1', vehicle: 'A', description: 'สินค้าธรรมดา', kg: '15.00 ฿', cbm: '5,500.00 ฿' },
                  { key: '2', vehicle: 'B', description: 'สินค้ามีถ่าน เครื่องใช้ไฟฟ้า ฯลฯ', kg: '20.00 ฿', cbm: '6,000.00 ฿' },
                ]}
                pagination={false}
                bordered
                size="small"
              />
            </Col>
            <Col xs={24} md={12}>
              <Table
                columns={[
                  { title: 'เรือ', dataIndex: 'ship', key: 'ship' },
                  { title: 'คำอธิบาย', dataIndex: 'description', key: 'description' },
                  { title: 'กิโล.', dataIndex: 'kg', key: 'kg', align: 'right' },
                  { title: 'คิว.', dataIndex: 'cbm', key: 'cbm', align: 'right' },
                ]}
                dataSource={[
                  { key: '1', ship: 'A', description: 'สินค้าธรรมดา', kg: '10.00 ฿', cbm: '3,500.00 ฿' },
                  { key: '2', ship: 'B', description: 'สินค้ามีถ่าน เครื่องใช้ไฟฟ้า ฯลฯ', kg: '15.00 ฿', cbm: '4,000.00 ฿' },
                ]}
                pagination={false}
                bordered
                size="small"
              />
            </Col>
          </Row>
          <div className="text-danger" style={{ marginTop: 10 }}>
            **** เราชั่งน้ำหนัก และวัดขนาดตามจริง " คิดราคาแบบไหนได้มากกว่าคิดแบบนั้น " ****
          </div>
          <div className="text-danger">
            **** หากไม่แจ้งชำระค่าขนส่งเกิน 40 วัน สินค้าจะถูกนำออกจำหน่าย เพื่อนำมาชดเชยต้นทุนในการนำเข้า ****
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfilePage;
