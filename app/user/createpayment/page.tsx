"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Row, Col } from 'antd';
import axios from 'axios';
import AddressForm from '../components/createpayment/AddressForm';
import PaymentSummary from '../components/createpayment/PaymentSummary';
import TrackingTable from '../components/createpayment/TrackingTable';
import ColorStatus from '../components/StatusStyle';

// Define the interface for tracking data
interface TrackingData {
    tracking_id: string;
    mnemonics?: string;
    weight: number;
    wide: number;
    high: number;
    long: number;
    number: number;
    lot_id: string;
    in_cn?: string;
    out_cn?: string;
    in_th?: string;
    user_id: string;
    type_item: string;
    check_product_price?: number;
    transport?: number;
    price_crate?: number;
    other?: number;
    image_item_paths: string[];
    lot_type?: string;
}


interface Address {
    province: string;
    district: string;
    subdistrict: string;
    postalCode: string;
    transport: string;
}

const CreatePayment: React.FC = () => {
    const router = useRouter();
    const [trackingData, setTrackingData] = useState<TrackingData[]>([]); // Use TrackingData[] type
    const [totalAmount, setTotalAmount] = useState(0);
    const [address, setAddress] = useState<Address>({
        province: '',
        district: '',
        subdistrict: '',
        postalCode: '',
        transport: '',
    });

    useEffect(() => {
        // Load the selected parcels from localStorage
        const loadedTrackingData = JSON.parse(localStorage.getItem('selectedParcels') || '[]');
        setTrackingData(loadedTrackingData);
    }, []);

    useEffect(() => {
        const total = trackingData.reduce(
            (sum, tracking) => sum + calculateVolume(tracking.wide, tracking.long, tracking.high) * tracking.number,
            0
        );
        setTotalAmount(total);
    }, [trackingData]);

    const calculateVolume = (wide: number, long: number, high: number) => (wide * long * high) / 1000;

    const calculateSum = (key: keyof TrackingData) => {
        return trackingData.reduce((sum, item) => sum + (item[key] as number || 0), 0);
    };

    // Handle address change
    const handleAddressChange = (field: string, value: string) => {
        setAddress({ ...address, [field]: value });
    };

    // Handle saving payment
    const handleSavePayments = async () => {
        try {
            const responseCount = await axios.get('/api/payments');
            const paymentCount = responseCount.data.length;
            const paymentNumber = `PAY-${(paymentCount + 1).toString().padStart(4, '0')}`;

            const newPayment = {
                user_id: trackingData.length > 0 ? trackingData[0].user_id : 'Unknown Customer',
                tracking: trackingData.map((tracking) => ({
                    trackingID: tracking.tracking_id,
                    lotNumber: tracking.lot_id,
                    price: calculateVolume(tracking.wide, tracking.long, tracking.high) * tracking.number,
                })),
                totalPrice: totalAmount,
                paymentNumber: paymentNumber,
                date: new Date().toISOString(),
                address,
                transport: address.transport,
            };

            await axios.post('/api/payments', newPayment);
            alert('Payment has been successfully processed!');
            router.push('/user/status');
        } catch (error) {
            console.error('Failed to process payment:', error);
            alert('Failed to process payment.');
        }
    };

    return (
        <main style={{ padding: '24px 16px', background: 'rgb(240, 242, 245)' }}>
            {/* Breadcrumb for navigation */}
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="/user/status">เช็คสถานะสินค้าและแจ้งนำออก</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>ชำระเงินค่าขนส่งสินค้า</Breadcrumb.Item>
            </Breadcrumb>

            {/* Address Form and Payment Summary */}
            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col lg={15} xl={14}>
                    <AddressForm address={address} handleAddressChange={handleAddressChange} />
                </Col>

                <Col lg={11} xl={9}>
                    <PaymentSummary totalAmount={totalAmount} handleSavePayments={handleSavePayments} />
                </Col>
            </Row>

            {/* Tracking Table for tracking data */}
            <TrackingTable 
                trackingData={trackingData} 
                calculateVolume={calculateVolume} 
                calculateSum={calculateSum} 
            />

            {/* Color status component */}
            <ColorStatus />
        </main>
    );
};

export default CreatePayment;
