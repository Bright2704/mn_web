"use client"
import React ,{useEffect, useState}from 'react';
import ArrowLeftIcon from '../components/ArrowLeftIcon';
import AddressForm from '../components/PaymentForm';
import ColorStatus from '../components/StatusStyle';
import TermsAndPayment from '../components/TermsAndPayment';
import { Breadcrumb, Card, Form, Input, Button, Radio, Tag, Space, Table } from 'antd';
import { ArrowLeftOutlined, EyeOutlined, SaveOutlined } from '@ant-design/icons';
import li from 'react';
import axios from 'axios';

const columns = [
    { title: 'Order ID', dataIndex: 'order_id', key: 'order_id' },
    { title: 'Customer ID', dataIndex: 'cus_id', key: 'cus_id' },
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Price', dataIndex: 'note', key: 'note'},
    { title: 'Date', dataIndex: 'date', key: 'date'},
    // other columns...
    
];
const CreatePayment: React.FC = () => {
    const [orders, setOrders] = useState([]);
  
    useEffect(() => {
      const loadOrders = () => {
        const storedOrders = localStorage.getItem('selectedOrders');
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      };
      loadOrders();
    }, []);

    const handleSaveOrders = async () => {
        try {
          console.log("Sending orders to save:", orders);  // Log the orders being sent
          const response = await axios.post('http://localhost:5000/api/payment', orders);
          console.log(response.data.message);
          alert('Orders have been successfully saved!');
        } catch (error) {
          console.error('Failed to save orders:', error);
          alert('Failed to save orders.');
        }
      };

    return (
        <main className='flex flex-col space-y-4 m-3' >
            <div style={{ padding: '24px 16px', background: 'rgb(240, 242, 245)' }}>
                <nav className='ant-breadcrumb'>
                    <ol>
                        <li className='mx-2'>
                            <span className='px-1'>
                                <a href='dashboard'>แดชบอร์ด</a>
                            </span>
                            <span className='px-1'>
                               /
                            </span>
                            <span className='px-1'>
                                <a href='status'>เช็คสถานะและแจ้งส่งของ</a>
                            </span>
                            <span className='px-1'>
                               /
                            </span>
                            <span className='px-1'>
                                <a>ชำระเงินค่าขนส่งสินค้า</a>
                            </span>
                        </li>
                    </ol>
                </nav>
                <div className='flex ml-3 mt-3 gap-x-4 items-center' style={{ display: 'flex', marginLeft: '12px', marginTop: '12px' }}>
                    <a href='/user/status'>
                        <ArrowLeftIcon
                            style={{ color: 'black', cursor: 'pointer', background:'transparent', padding:'0px', lineHeight: 'inherit', display:'inline-block' }}
                            onClick={() => console.log('Icon clicked')}
                        />
                    </a>
                    <span className = 'text-xl font-semibold' title='ชำระเงินค่าขนส่งสินค้า'> 
                        ชำระเงินค่าขนส่งสินค้า
                    </span>
                </div>
            </div>
            <div className='flex flex-row gap-5 bg-blue-100 m-3'>
                <div>
                    <AddressForm/>
                    {/* <TermsAndPayment/> */}
                </div> 
         
            </div>
            <Table 
                columns={columns} 
                dataSource={orders} 
                pagination={false} 
                // rowKey={record => record.id}
            />
            <Button onClick={handleSaveOrders} type="primary">Save Orders to Database</Button>
            <ColorStatus/>  

        </main>
    );
    
};
export default CreatePayment;
