"use client"
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Card, Form, Input, Button, Radio, Table } from 'antd';
import axios from 'axios';
import ArrowLeftIcon from '../components/ArrowLeftIcon';
import AddressForm from '../components/AddressForm';
import ColorStatus from '../components/StatusStyle';

const columns = [
    { title: 'Order ID', dataIndex: 'order_id', key: 'order_id' },
    { title: 'Customer ID', dataIndex: 'cus_id', key: 'cus_id' },
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Price', dataIndex: 'price', key: 'price'},  // Assuming you have a price field in the order object
    { title: 'Date', dataIndex: 'date', key: 'date'},
];

const CreatePayment = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Load selected orders from local storage
        const loadedOrders = JSON.parse(localStorage.getItem('selectedOrders') || '[]');
        setOrders(loadedOrders);
    }, []);

    const handleSaveOrders = async () => {
        try {
            // Ensure that orders are sent in the correct format expected by the backend
            const response = await axios.post('/api/payments', orders);
            alert('Orders have been successfully saved!');
            console.log(response.data); // Log the response data for debugging
        } catch (error) {
            console.error('Failed to save orders:', error);
            alert('Failed to save orders.');
        }
    };

    return (
        <main className='flex flex-col space-y-4 m-3'>
            <div style={{ padding: '24px 16px', background: 'rgb(240, 242, 245)' }}>
                <nav className='ant-breadcrumb'>
                    <ol>
                        <li className='mx-2'>
                            <a href='dashboard'>แดชบอร์ด</a> / 
                            <a href='status'>เช็คสถานะและแจ้งส่งของ</a> /
                            <span>ชำระเงินค่าขนส่งสินค้า</span>
                        </li>
                    </ol>
                </nav>
                <div className='flex ml-3 mt-3 gap-x-4 items-center'>
                    <ArrowLeftIcon onClick={() => window.history.back()} style={{ cursor: 'pointer' }} />
                    <h1 className='text-xl font-semibold'>ชำระเงินค่าขนส่งสินค้า</h1>
                </div>
            </div>
            <div className='flex flex-row gap-5 bg-blue-100 m-3'>
                <AddressForm/>
            </div>
            <Table 
                columns={columns} 
                dataSource={orders} 
                pagination={false} 
                rowKey={record => record.order_id}
            />
            <Button onClick={handleSaveOrders} type="primary">Save Orders to Database</Button>
            <ColorStatus/>
        </main>
    );
};

export default CreatePayment;
