"use client";

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Row, Col } from 'antd';
import axios from 'axios';
import AddressForm from '../components/createpayment/AddressForm';
import PaymentSummary from '../components/createpayment/PaymentSummary';
import TrackingTable from '../components/createpayment/TrackingTable';
import ColorStatus from '../components/StatusStyle';
import { getSession } from "next-auth/react";

// Define the interface for tracking data
interface TrackingData {
    tracking_id: string;
  mnemonics: string;
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
  new_wrap: number;
  other: number;
  image_item_paths: string[];
  lot_type: string;
  cal_price: number;
  type_cal: "weightPrice" | "volumePrice";
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

    const [transportFee, setTransportFee] = useState(0);
    const [serviceFee, setServiceFee] = useState(0);
    const [selectedCarrier, setSelectedCarrier] = useState('');
    const [currentSenderOption, setCurrentSenderOption] = useState('0');
    const handleTransportTypeChange = (value: string, carrier?: string) => {
        // Reset values
        setTransportFee(0);
        setServiceFee(0);
        setSelectedCarrier('');

        // Set new values
        if (value === "-99") {
            setServiceFee(20);
            if (carrier) {
                setTransportFee(250);
                setSelectedCarrier(carrier);
            }
        } else if (value === "2") {
            setTransportFee(690);
            setSelectedCarrier("บริษัทจัดส่ง 690 บาท (เฉพาะเขตกรุงเทพ)");
        } else {
            setSelectedCarrier("รับสินค้าเอง (รับสินค้าเองได้ทุกวัน 09.00-21.00 น.)");
        }

        // Restore sender option fee if applicable
        if (currentSenderOption === "-99") {
            setServiceFee(prev => prev + 10);
        }
    };
    // const handleSenderOptionChange = (value: string) => {
    //     if (value === "-99") {
    //         setServiceFee(prev => prev + 10);
    //     } else {
    //         // If changing from -99 to another option, remove the 10 baht fee
    //         if (senderOption === "-99") {
    //             setServiceFee(prev => prev - 10);
    //         }
    //     }
    // };
    const handleSenderOptionChange = (value: string) => {
        setCurrentSenderOption(value);
        if (value === "-99") {
            setServiceFee(prev => prev + 10);
        } else if (currentSenderOption === "-99") {
            setServiceFee(prev => Math.max(0, prev - 10));
        }
    };

    const calculateSelectedTotals = () => {
        return trackingData.reduce((acc, row) => {
            const weightPrice = row.type_cal === "weightPrice" ? row.cal_price * row.number : 0;
            const volumePrice = row.type_cal === "volumePrice" ? row.cal_price * row.number : 0;
            const serviceFee = row.check_product_price + row.new_wrap + row.transport + row.price_crate + row.other;

            return {
                serviceFee: acc.serviceFee + serviceFee,
                weightPrice: acc.weightPrice + weightPrice,
                volumePrice: acc.volumePrice + volumePrice
            };
        }, { serviceFee: 0, weightPrice: 0, volumePrice: 0 });
    };

    const totals = calculateSelectedTotals();
    const total = totals.serviceFee + totals.weightPrice + totals.volumePrice;
    const grandTotal = total + transportFee + serviceFee;

    const [balance, setBalance] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:5000/balances")
            .then((response) => {
                const fetchedBalances = response.data;
                if (fetchedBalances.length > 0) {
                    setBalance(fetchedBalances[fetchedBalances.length - 1].balance_total);
                }
            })
            .catch((error) => console.error("Error fetching balance:", error));
    }, []);

    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            if (session?.user) {
                const userId = (session.user as { user_id?: string }).user_id;
                if (userId) {
                    setUserName(userId);
                }
            }
        };
        fetchSession();
    }, []);


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
                <AddressForm 
            address={address} 
            handleAddressChange={handleAddressChange}
            onTransportChange={handleTransportTypeChange}
            onSenderOptionChange={handleSenderOptionChange}
        />
                </Col>
                <Col lg={11} xl={9}>
                    <PaymentSummary 
                        totalAmount={totalAmount}
                        handleSavePayments={handleSavePayments}
                        transportFee={transportFee}
                        serviceFee={serviceFee}
                        selectedCarrier={selectedCarrier}
                        total={totals.serviceFee + totals.weightPrice + totals.volumePrice}
                        grandTotal={total + transportFee + serviceFee}
                        balance={balance}
                        userName={userName}
                    />
                </Col>
            </Row>

            {/* Tracking Table for tracking data */}
            <TrackingTable 
    trackingData={trackingData}
    calculateVolume={calculateVolume}
    calculateSum={calculateSum}
    transportFee={transportFee}
    serviceFee={serviceFee}
/>

            {/* Color status component */}
            <ColorStatus />
        </main>
    );
};

export default CreatePayment;
