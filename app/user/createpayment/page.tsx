"use client"; // Mark this as a client component

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Card, Form, Input, Button, Radio, Table } from 'antd';
import axios from 'axios';
import ArrowLeftIcon from '../components/ArrowLeftIcon';
import AddressForm from '../components/AddressForm';
import ColorStatus from '../components/StatusStyle';

const columns = [
    { title: 'Code ID', dataIndex: 'code', key: 'code' },
    { title: 'Customer ID', dataIndex: 'customer', key: 'customer' },
    { title: 'Lot number', dataIndex: 'lot', key: 'lot' },
    { title: 'create_date', dataIndex: 'create_date', key: 'create_date' },
    { title: 'Price', dataIndex: 'price', key: 'price',render: price => `${price} ฿` },  // Add currency symbol to each price
    // { title: 'Date', dataIndex: 'date', key: 'date'},
];

const CreatePayment = () => {
    const router = useRouter(); // Initialize the router
    const [parcels, setParcels] = useState([]);
    const [address, setAddress] = useState({ province: '', district: '', subdistrict: '', postalCode: '' });

    useEffect(() => {
        // Load selected parcels from local storage
        const loadedParcels = JSON.parse(localStorage.getItem('selectedParcels') || '[]');
        setParcels(loadedParcels);
    }, []);

    const handleSavePayments = async () => {
        try {
            // Fetch the current length of the payment collection
            const responseCount = await axios.get('/api/payments');
            const paymentCount = responseCount.data.length; // Get the number of existing payments

            // Generate the new payment number
            const paymentNumber = `PAY-${(paymentCount + 1).toString().padStart(4, '0')}`;
            
            const newPayment = {
                customerID: "cus01", // Replace with dynamic value if needed
                parcels: parcels.map(parcel => ({
                    codeID: parcel.code,
                    lotNumber: parcel.lot,
                    create_date: parcel.create_date,
                    price: parcel.price,
                })),
                totalPrice: parcels.reduce((acc, parcel) => acc + parcel.price, 0), // Summing prices
                paymentNumber: paymentNumber, // Add the generated payment number here
                date: new Date().toISOString(), // Current date/time
                address: {
                    province: address.province,
                    district: address.district,
                    subdistrict: address.subdistrict,
                    postalCode: address.postalCode,
                }, // Include address information
                transport: address.transport
            };
        
            // Send the new payment object to the backend
            const response = await axios.post('/api/payments', newPayment);
            alert('Payment has been successfully processed!');
            console.log(response.data);
            // Redirect to the "user/status" page after successful payment
            router.push('/user/status');
        } catch (error) {
            console.error('Failed to process payment:', error.response?.data || error.message);
            alert('Failed to process payment.');
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
                <AddressForm onAddressChange={setAddress} /> {/* Pass callback to update address */}
            </div>
            <Table 
                columns={columns} 
                dataSource={parcels} 
                pagination={false} 
                rowKey={record => record.parcel_id}
            />
            <Button onClick={handleSavePayments} type="primary">Save Payment to Database</Button>
            <ColorStatus/>
        </main>
    );
};

export default CreatePayment;
