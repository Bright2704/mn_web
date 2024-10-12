"use client"; // Mark this as a client component

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button } from 'antd';
import axios from 'axios';
import AddressForm from '../components/AddressForm';
import ColorStatus from '../components/StatusStyle';
import Image from 'next/image';

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

interface NewPayment {
    user_id: string;
    tracking: {
        trackingID: string;
        lotNumber: string;
        price: number;
    }[];
    totalPrice: number;
    paymentNumber: string;
    date: string;
    address: {
        province: string;
        district: string;
        subdistrict: string;
        postalCode: string;
    };
    transport: string;
}

const CreatePayment = () => {
    const router = useRouter();
    const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
    const [totalAmount, setTotalAmount] = useState(0); // Total price state
    const [totalItems, setTotalItems] = useState(0); // Total number of items
    const [address, setAddress] = useState({
        province: '',
        district: '',
        subdistrict: '',
        postalCode: '',
        transport: '',
    });

    // Load tracking data from localStorage
    useEffect(() => {
        const loadedTrackingData = JSON.parse(localStorage.getItem('selectedParcels') || '[]');
        setTrackingData(loadedTrackingData);
    }, []);

    useEffect(() => {
        const total = trackingData.reduce(
          (sum, tracking) => sum + calculateVolume(tracking.wide, tracking.long, tracking.high) * tracking.number,
          0
        );
        const itemsCount = trackingData.length;
    
        setTotalAmount(total);
        setTotalItems(itemsCount);
      }, [trackingData]);
    
    // Handle saving payment
    const handleSavePayments = async () => {
        try {
            const responseCount = await axios.get('/api/payments');
            const paymentCount = responseCount.data.length;
            const paymentNumber = `PAY-${(paymentCount + 1).toString().padStart(4, '0')}`;

            const newPayment: NewPayment = {
                user_id: trackingData.length > 0 ? trackingData[0].user_id : 'Unknown Customer',
                tracking: trackingData.map((tracking) => ({
                    trackingID: tracking.tracking_id,
                    lotNumber: tracking.lot_id,
                    price: calculateVolume(tracking.wide, tracking.long, tracking.high) * tracking.number,
                })),
                totalPrice: trackingData.reduce((acc, tracking) => acc + calculateVolume(tracking.wide, tracking.long, tracking.high) * tracking.number, 0),
                paymentNumber: paymentNumber,
                date: new Date().toISOString(),
                address: {
                province: address.province,
                district: address.district,
                subdistrict: address.subdistrict,
                postalCode: address.postalCode,
                }, // Include address information
                transport: address.transport,
            };

            // Send the new payment object to the backend
            const response = await axios.post('/api/payments', newPayment);
            alert('Payment has been successfully processed!');
            console.log(response.data);
            // Redirect to the "user/status" page after successful payment
            router.push('/user/status');
        } catch (error) {
            console.error('Failed to process payment:', error);
            alert('Failed to process payment.');
        }
    };

    // Helper to calculate volume
    const calculateVolume = (wide: number, long: number, high: number) => (wide * long * high) / 1000;

    return (
        <main className="flex flex-col space-y-4 m-3">
            <div style={{ padding: '24px 16px', background: 'rgb(240, 242, 245)' }}>
                <Breadcrumb>
                <Breadcrumb.Item><a href="/user/dashboard">Dashboard</a></Breadcrumb.Item>
                <Breadcrumb.Item><a href="/user/status">Status</a></Breadcrumb.Item>
                <Breadcrumb.Item>Payment</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div className="flex flex-row gap-5 bg-blue-100 m-3">
                    <AddressForm onAddressChange={setAddress} />
            </div>

            <table className="table table-width-1" style={{ fontSize: 14 }}>
                <thead>
                    <tr className="text-center">
                        <th>Tracking ID</th>
                        <th>Images</th>
                        <th>User ID</th>
                        <th>Volume</th>
                        <th>Item Type</th>
                        <th>Price</th>
                    </tr>
                </thead>

                <tbody>
                {trackingData.length > 0 ? (
                    trackingData.map((tracking, index) => (
                        <tr key={index} className="text-center">
                            <td>{tracking.tracking_id}</td>
                            <td>
                                {tracking.image_item_paths.length > 0 ? (
                                    <div className="image-gallery" style={{ display: 'flex', gap: '5px' }}>
                                    {tracking.image_item_paths.map((imagePath, i) => (
                                        <div
                                        key={i}
                                        className="image-wrapper"
                                        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                        >
                                        <Image
                                            src={imagePath}
                                            alt={`Image ${i + 1}`}
                                            layout="responsive"
                                            width={100}
                                            height={100}
                                            objectFit="cover"
                                        />
                                        </div>
                                    ))}
                                    </div>
                                ) : (
                                    <span>No images</span>
                                )}
                            </td>
                            <td>{tracking.user_id}</td>
                            <td>{calculateVolume(tracking.wide, tracking.long, tracking.high)}</td>
                            <td>{tracking.type_item}</td>
                            <td>{(calculateVolume(tracking.wide, tracking.long, tracking.high) * tracking.number).toFixed(2)} ฿</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6}>No tracking data available for this lot.</td>
                    </tr>
                )}
                </tbody>
            </table>

            <Button onClick={handleSavePayments} type="primary">
                Save Payment to Database
            </Button>

            <ColorStatus />
        </main>
    );
};

export default CreatePayment;
