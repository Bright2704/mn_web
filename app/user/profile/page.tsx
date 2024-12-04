"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card, Avatar, Upload, Button, Input, Form, Typography, Tag, Table, Modal, Space } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/lib/table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getSession } from 'next-auth/react';
import "../../../styles/globals.css";
import BankBookModal from '../components/user_profile/AddBankAccountModal';
import EditBankAccountModal from '../components/user_profile/EditBankAccountModal';
import AddressBookModal from '../components/user_profile/AddressBookModal';
import EditAddressModal from '../components/user_profile/EditAddressModal';

type Balance = {
  user_id: string;
  balance_id: string;
  balance_date: string;
  balance_type: string;
  balance_descri: string;
  balance_amount: number;
  balance_total: number;
};

interface BankAccount {
  _id: string;
  bank: string;
  account_name: string;
  account_number: string;
  branch: string;
}

interface Address {
  _id: string;
  name: string;
  address: string;
  province: string;
  districts: string;
  subdistricts: string;
  postalCode: string;
  phone: string;
}

const ProfilePage: React.FC = () => {
  const { Title } = Typography;
  const [balances, setBalances] = useState<Balance[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showEditAddressModal, setShowEditAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Fetch balances
  useEffect(() => {
    axios.get('http://localhost:5001/balances')
      .then(response => {
        const fetchedBalances: Balance[] = response.data;
        setBalances(fetchedBalances);
        if (fetchedBalances.length > 0) {
          const latestBalanceTotal = fetchedBalances[fetchedBalances.length - 1].balance_total;
          setTotalAmount(latestBalanceTotal);
        }
      })
      .catch(error => {
        console.error('Error fetching balances:', error);
      });
  }, []);

  // Fetch session and set user ID
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

  // Bank account functions
  const fetchBankAccounts = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:5001/book_bank/user/${userId}`);
      setBankAccounts(response.data);
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBankAccounts();
    }
  }, [userId]);

  const handleDelete = async (accountId: string) => {
    Modal.confirm({
      title: 'ยืนยันการลบบัญชี',
      content: 'คุณต้องการลบบัญชีนี้ใช่หรือไม่?',
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5001/book_bank/${accountId}`);
          fetchBankAccounts();
        } catch (error) {
          console.error('Error deleting bank account:', error);
        }
      }
    });
  };

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    line_id: '',
    facebook: '',
    status: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const fetchUserData = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:5001/users/${userId}`);
      if (response.status === 200) {
        const data = response.data;
        setUserData(data);
        form.setFieldsValue(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Modal.error({
        title: 'Error',
        content: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้'
      });
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    form.setFieldsValue(userData);
    setIsEditing(false);
  };
  
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`http://localhost:5001/users/${userId}`, values);
      setUserData(values);
      setIsEditing(false);
      Modal.success({
        content: 'บันทึกข้อมูลสำเร็จ'
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      Modal.error({
        title: 'Error',
        content: 'ไม่สามารถบันทึกข้อมูลได้'
      });
    }
  };

  // Address functions
  const fetchAddresses = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:5001/book_address/user/${userId}`);
      setAddresses(response.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const handleDeleteAddress = async (addressId: string) => {
    Modal.confirm({
      title: 'ยืนยันการลบที่อยู่',
      content: 'คุณต้องการลบที่อยู่นี้ใช่หรือไม่?',
      okText: 'ยืนยัน',
      cancelText: 'ยกเลิก',
      okType: 'danger',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5001/book_address/${addressId}`);
          fetchAddresses();
        } catch (error) {
          console.error('Error deleting address:', error);
        }
      }
    });
  };

  // Column definitions
  const bankColumns: ColumnsType<BankAccount> = [
    { 
      title: 'ชื่อธนาคาร',
      dataIndex: 'bank',
      key: 'bank',
      align: 'center'
    },
    {
      title: 'ชื่อบัญชี',
      dataIndex: 'account_name',
      key: 'account_name',
      align: 'center'
    },
    {
      title: 'เลขที่บัญชี',
      dataIndex: 'account_number',
      key: 'account_number',
      align: 'center'
    },
    {
      title: 'สาขา',
      dataIndex: 'branch',
      key: 'branch',
      align: 'center'
    },
    {
      title: 'จัดการ',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <span>
          <Button
            type="link"
            onClick={() => {
              setSelectedAccount(record);
              setShowEditModal(true);
            }}
          >
            แก้ไข
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record._id)}
          >
            ลบ
          </Button>
        </span>
      ),
    }
  ];

  const addressColumns: ColumnsType<Address> = [
    { 
      title: 'ชื่อ - สกุล',
      dataIndex: 'name',
      key: 'name',
      align: 'center'
    },
    {
      title: 'ที่อยู่',
      dataIndex: 'address',
      key: 'address',
      align: 'center'
    },
    {
      title: 'จังหวัด',
      dataIndex: 'province',
      key: 'province',
      align: 'center'
    },
    {
      title: 'อำเภอ',
      dataIndex: 'districts',
      key: 'districts',
      align: 'center'
    },
    {
      title: 'ตำบล',
      dataIndex: 'subdistricts',
      key: 'subdistricts',
      align: 'center'
    },
    {
      title: 'รหัสไปรษณีย์',
      dataIndex: 'postalCode',
      key: 'postalCode',
      align: 'center'
    },
    {
      title: 'เบอร์โทรศัพท์',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center'
    },
    {
      title: 'จัดการ',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <span>
          <Button
            type="link"
            onClick={() => {
              setSelectedAddress(record);
              setShowEditAddressModal(true);
            }}
          >
            แก้ไข
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteAddress(record._id)}
          >
            ลบ
          </Button>
        </span>
      ),
    }
  ];



  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
      <Card 
  title="ข้อมูลส่วนตัว"
  extra={
    isEditing ? (
      <Space>
        <Button onClick={handleCancel}>
          ยกเลิก
        </Button>
        <Button type="primary" onClick={handleSave}>
          บันทึก
        </Button>
      </Space>
    ) : (
      <Button type="primary" onClick={handleEdit}>
        แก้ไขข้อมูล
      </Button>
    )
  }
>
  <Form
    form={form}
    layout="vertical"
    initialValues={userData}
  >
    <Form.Item 
      label={<span>ชื่อ - สกุล <span style={{ color: 'red' }}>*</span></span>}
      name="name"
      rules={[{ required: true, message: 'กรุณากรอกชื่อ-นามสกุล' }]}
    >
      <Input disabled={!isEditing} />
    </Form.Item>

    <Form.Item 
      label={<span>อีเมล์ <span style={{ color: 'red' }}>*</span></span>}
      name="email"
      rules={[
        { required: true, message: 'กรุณากรอกอีเมล์' },
        { type: 'email', message: 'กรุณากรอกอีเมล์ให้ถูกต้อง' }
      ]}
    >
      <Input disabled={!isEditing} />
    </Form.Item>

    <Form.Item 
      label={<span>เบอร์โทรศัพท์ <span style={{ color: 'red' }}>*</span></span>}
      name="phone"
      rules={[
        { required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' },
        { pattern: /^[0-9]{10}$/, message: 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง' }
      ]}
    >
      <Input disabled={!isEditing} />
    </Form.Item>

    <Form.Item 
      label="LINE ID"
      name="line_id"
    >
      <Input disabled={!isEditing} />
    </Form.Item>

    <Form.Item 
      label="Facebook"
      name="facebook"
    >
      <Input disabled={!isEditing} />
    </Form.Item>

    <Form.Item label="สถานะ">
      <Tag color="green">{userData.status || 'อนุมัติแล้ว'}</Tag>
    </Form.Item>
  </Form>
</Card>
      </Col>
      
      <Col xs={24} md={12}>
        <Card title="ยอดเงินคงเหลือในระบบ">
          <div className="d-flex align-items-center" style={{ gap: '20px' }}>
            <p className="mb-1" style={{ color: '#198754', fontSize: '24px' }}>ยอดเงินในระบบ </p>
            <div className="bg-light p-2 rounded">
              <h5 className="mb-0" style={{ color: '#198754', fontSize: '30px' }}>
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

        <Card title="ข้อมูลบัญชี" style={{ marginTop: 16 }}>
          <Button 
            type="primary"
            onClick={() => setShowBankModal(true)}
            style={{ marginBottom: 16 }}
          >
            เพิ่มบัญชีธนาคาร
          </Button>
          <Table
            columns={bankColumns}
            dataSource={bankAccounts.map(account => ({
              ...account,
              key: account._id
            }))}
            pagination={false}
            size="small"
          />
          <BankBookModal
            show={showBankModal}
            onClose={() => {
              setShowBankModal(false);
              fetchBankAccounts();
            }}
          />
          {selectedAccount && (
            <EditBankAccountModal
              show={showEditModal}
              onClose={() => {
                setShowEditModal(false);
                setSelectedAccount(null);
              }}
              account={selectedAccount}
              onSave={() => {
                fetchBankAccounts();
                setShowEditModal(false);
                setSelectedAccount(null);
              }}
            />
          )}
        </Card>

        <Card title="ที่อยู่" style={{ marginTop: 16 }}>
          <Button 
            type="primary"
            onClick={() => setShowAddressModal(true)}
            style={{ marginBottom: 16 }}
          >
            เพิ่มที่อยู่
          </Button>
          <Table
            columns={addressColumns}
            dataSource={addresses.map(address => ({
              ...address,
              key: address._id
            }))}
            pagination={false}
            size="small"
          />
          <AddressBookModal
            show={showAddressModal}
            onClose={() => {
              setShowAddressModal(false);
              fetchAddresses();
            }}
            onSelectAddress={() => {}}
          />
          {selectedAddress && (
            <EditAddressModal
              show={showEditAddressModal}
              onClose={() => {
                setShowEditAddressModal(false);
                setSelectedAddress(null);
              }}
              address={selectedAddress}
              onSave={() => {
                fetchAddresses();
                setShowEditAddressModal(false);
                setSelectedAddress(null);
              }}
            />
          )}
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