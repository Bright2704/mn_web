"use client"; // Mark this as a client component

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Form, Input, Radio, Col, Row, Card, Checkbox, Descriptions, Select } from 'antd';
import axios from 'axios';
import Image from 'next/image';
import ColorStatus from '../components/StatusStyle';
import addressData from '../components/AddressData'; // Assuming your address_data file
import TransportData from '../components/TransportData';

const { Option } = Select;

interface TrackingData {
    tracking_id: string;
    weight: number;
    wide: number;
    high: number;
    long: number;
    number: number;
    lot_id: string;
    user_id: string;
    type_item: string;
    image_item_paths: string[];
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

const CreatePayment: React.FC = () => {
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
    const [senderOption, setSenderOption] = useState('0'); // Option for "ที่อยู่ผู้ส่ง"

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

    // Helper to calculate volume
    const calculateVolume = (wide: number, long: number, high: number) => (wide * long * high) / 1000;

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
                totalPrice: totalAmount,
                paymentNumber: paymentNumber,
                date: new Date().toISOString(),
                address: {
                    province: address.province,
                    district: address.district,
                    subdistrict: address.subdistrict,
                    postalCode: address.postalCode,
                },
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

    // Handle address selection
    const handleAddressChange = (field: string, value: string) => {
        setAddress({ ...address, [field]: value });
    };

    // Handle change in "ที่อยู่ผู้ส่ง" dropdown
    const handleSenderOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSenderOption(e.target.value);
    };

    return (
        <main style={{ padding: '24px 16px', background: 'rgb(240, 242, 245)' }}>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <a href="/user/status">เช็คสถานะสินค้าและแจ้งนำออก</a>
                </Breadcrumb.Item>
                <Breadcrumb.Item>ชำระเงินค่าขนส่งสินค้า</Breadcrumb.Item>
            </Breadcrumb>

            <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                <Col lg={15} xl={14}>
                    <Card bordered>
                        <h1 style={{ fontSize: '20px' }}>
                            ที่อยู่ผู้รับสินค้า <span className="text-danger">*</span>
                        </h1>
                        <Form layout="vertical">
                            {/* Form fields for address */}
                            <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex' }}>
                                <Col span={6} style={{ textAlign: 'right', paddingTop: '6px' }}>
                                    <span style={{ fontWeight: '600' }}>ชื่อ - สกุล <span className="text-danger">*</span>:</span>&nbsp; &nbsp;
                                </Col>
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <Input className="ant-input-lg" value="Mn1688" />
                                </Col>
                            </Row>

                            <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex' }}>
                                <Col span={6} style={{ textAlign: 'right', paddingTop: '6px' }}>
                                    <span style={{ fontWeight: '600' }}>ที่อยู่:</span>&nbsp; &nbsp;
                                </Col>
                                <Col span={12} style={{ textAlign: 'right' }}>
                                    <textarea
                                        rows={3}
                                        className="ant-input ant-input-lg"
                                        style={{
                                            width: '100%',
                                            height: '100px',
                                            resize: 'none',
                                            border: '1px solid #d9d9d9',
                                            padding: '10px',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        206/76 ถนนเทศบาล7
                                    </textarea>
                                </Col>
                            </Row>

                            {/* Province */}
                            <Row style={{ marginBottom: '10px', display: 'flex' }}>
                                <Col span={6} style={{ textAlign: 'right', paddingTop: '6px' }}>
                                    <span style={{ fontWeight: '600' }}>จังหวัด:</span>&nbsp;&nbsp;
                                </Col>
                                <Col span={12}>
                                    <Select
                                        showSearch
                                        value={address.province}
                                        onChange={(value) => handleAddressChange('province', value)}
                                        placeholder="Select Province"
                                        style={{ width: '40%' }}
                                    >
                                        {addressData.provinces.map((province) => (
                                            <Option key={province.name} value={province.name}>
                                                {province.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                            </Row>

                            {/* District */}
                            <Row style={{ marginBottom: '10px', display: 'flex' }}>
                                <Col span={6} style={{ textAlign: 'right', paddingTop: '6px' }}>
                                    <span style={{ fontWeight: '600' }}>อำเภอ:</span>&nbsp;&nbsp;
                                </Col>
                                <Col span={12}>
                                    <Select
                                        showSearch
                                        value={address.district}
                                        onChange={(value) => handleAddressChange('district', value)}
                                        placeholder="Select District"
                                        disabled={!address.province}
                                        style={{ width: '40%' }}
                                    >
                                        {address.province &&
                                            addressData.provinces
                                                .find((p) => p.name === address.province)
                                                ?.districts.map((district) => (
                                                    <Option key={district.name} value={district.name}>
                                                        {district.name}
                                                    </Option>
                                                ))}
                                    </Select>
                                </Col>
                            </Row>

                            {/* Subdistrict */}
                            <Row style={{ marginBottom: '10px', display: 'flex' }}>
                                <Col span={6} style={{ textAlign: 'right', paddingTop: '6px' }}>
                                    <span style={{ fontWeight: '600' }}>ตำบล:</span>&nbsp;&nbsp;
                                </Col>
                                <Col span={12}>
                                    <Select
                                        showSearch
                                        value={address.subdistrict}
                                        onChange={(value) => handleAddressChange('subdistrict', value)}
                                        placeholder="Select Subdistrict"
                                        disabled={!address.district}
                                        style={{ width: '40%' }}
                                    >
                                        {address.district &&
                                            addressData.provinces
                                                .find((p) => p.name === address.province)
                                                ?.districts.find((d) => d.name === address.district)
                                                ?.subdistricts.map((subdistrict) => (
                                                    <Option key={subdistrict.name} value={subdistrict.name}>
                                                        {subdistrict.name}
                                                    </Option>
                                                ))}
                                    </Select>
                                </Col>
                            </Row>

                            {/* Postal Code */}
                            <Row style={{ marginBottom: '10px', display: 'flex' }}>
                                <Col span={6} style={{ textAlign: 'right', paddingTop: '6px' }}>
                                    <span style={{ fontWeight: '600' }}>รหัสไปรษณีย์:</span>&nbsp;&nbsp;
                                </Col>
                                <Col span={12}>
                                    <Select
                                        value={address.postalCode}
                                        onChange={(value) => handleAddressChange('postalCode', value)}
                                        placeholder="Select Postal Code"
                                        disabled={!address.subdistrict}
                                        style={{ width: '30%' }}
                                    >
                                        {address.subdistrict &&
                                            addressData.provinces
                                                .find((p) => p.name === address.province)
                                                ?.districts.find((d) => d.name === address.district)
                                                ?.subdistricts.find((s) => s.name === address.subdistrict)
                                                ?.postalCodes.map((code) => (
                                                    <Option key={code} value={code}>
                                                        {code}
                                                    </Option>
                                                ))}
                                    </Select>
                                </Col>
                            </Row>

                            {/* New Row for the button */}
                            <Row style={{ marginTop: '10px', display: 'flex' }}>
                                <Col span={6}></Col> {/* Empty column for alignment */}
                                <Col span={12} style={{ textAlign: 'center' }}>
                                <Button type="primary" block style={{ height: '40px', width: '200px' }} onClick={handleSavePayments}>
                                    เลือกที่อยู่จากสมุดที่อยู่
                                </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>

                {/* Right-side information */}
                <Col lg={11} xl={9}>
                    <Card bordered>
                        <h2>เงื่อนไขและข้อตกลง</h2>
                        <p>
                            เมื่อได้รับสินค้าแล้ว กรุณาถ่ายวิดิโอตอนแกะห่อสินค้า ถ่ายรูปเลขแทร็คกิ้งจีน ถ่ายรูปหน้าห่อหรือกล่องสินค้า
                            ถ่ายรูปห่อหรือกล่องสินค้าที่ได้รับไปทั้งหมด ทั้งตอนที่ยังไม่ได้แกะสินค้าและหลังจากแกะสินค้าออกจากห่อแล้ว หากไม่มีหลักฐาน
                            ทางเราจะสงวนสิทธิ์ไม่รับผิดชอบในกรณีที่ได้รับสินค้าผิดหรือไม่ครบ
                        </p>
                        <Checkbox>MN1688 เข้าใจและยอมรับเงื่อนไขแล้ว</Checkbox>
                    </Card>

                    <Card bordered style={{ marginTop: '16px' }}>
                        <div className="ant-card-body">
                            <div className="ant-descriptions ant-descriptions-small align-right">
                                <div className="ant-descriptions-header">
                                    <div className="ant-descriptions-title">ยอดที่ต้องชำระ</div>
                                </div>
                                <div className="ant-descriptions-view">
                                    <table>
                                        <tbody>
                                            <tr className="ant-descriptions-row">
                                                <td className="ant-descriptions-item setDes setDesPayCre fontBCS" colSpan={1}>
                                                    <div className="ant-descriptions-item-container">
                                                        <span className="ant-descriptions-item-label ant-descriptions-item-no-colon">ยอดเงินในระบบลูกค้า</span>
                                                        <span className="ant-descriptions-item-content">{totalAmount.toFixed(2)} ฿</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="ant-descriptions-row">
                                                <td className="ant-descriptions-item setDes setDesPayCre" colSpan={1}>
                                                    <div className="ant-descriptions-item-container">
                                                        <span className="ant-descriptions-item-label ant-descriptions-item-no-colon">ค่านำเข้า</span>
                                                        <span className="ant-descriptions-item-content">95.52 ฿</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="ant-descriptions-row">
                                                <td className="ant-descriptions-item setDes setDesPayCre" colSpan={1}>
                                                    <div className="ant-descriptions-item-container">
                                                        <span className="ant-descriptions-item-label ant-descriptions-item-no-colon">จัดส่งโดย</span>
                                                        <span className="ant-descriptions-item-content">
                                                            <div style={{ fontWeight: 600, fontSize: '14px' }}>รับสินค้าเอง</div>
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="ant-descriptions-row">
                                                <td className="ant-descriptions-item setDes setDesPayCre" colSpan={1}>
                                                    <div className="ant-descriptions-item-container">
                                                        <span className="ant-descriptions-item-label ant-descriptions-item-no-colon">ค่าบริการ</span>
                                                        <span className="ant-descriptions-item-content">0.00 ฿</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="ant-descriptions-row">
                                                <td className="ant-descriptions-item setDes setDesPayCre" colSpan={1}>
                                                    <div className="ant-descriptions-item-container">
                                                        <span className="ant-descriptions-item-label ant-descriptions-item-no-colon">ค่าขนส่ง</span>
                                                        <span className="ant-descriptions-item-content">0.00 ฿</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="ant-descriptions-row">
                                                <td className="ant-descriptions-item setDes setDesPayCre" colSpan={1}>
                                                    <div className="ant-descriptions-item-container">
                                                        <span className="ant-descriptions-item-label ant-descriptions-item-no-colon">ประเภทการชำระ</span>
                                                        <span className="ant-descriptions-item-content">ตัดเงินในระบบ</span>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr className="ant-descriptions-row">
                                                <td className="ant-descriptions-item setDes setDesPayCre" colSpan={1}>
                                                    <div className="ant-descriptions-item-container">
                                                        <span className="ant-descriptions-item-label ant-descriptions-item-no-colon">
                                                            <span style={{ fontSize: '20px' }}>ยอดรวม</span>
                                                        </span>
                                                        <span className="ant-descriptions-item-content">
                                                            <span style={{ fontSize: '20px' }}>95.52 ฿</span>
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div style={{ fontWeight: 500, fontSize: '15px', marginTop: '5px' }}>หมายเหตุ</div>
                            <div className="ant-row ant-form-item">
                                <div className="ant-col ant-form-item-control">
                                    <div className="ant-form-item-control-input">
                                        <div className="ant-form-item-control-input-content">
                                            <textarea rows={3} id="remark" className="ant-input" style={{ marginTop: '5px' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button type="primary" block style={{ height: '40px' }} onClick={handleSavePayments}>
                                บันทึกรายการ
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>

            <table className="table table-width-1" style={{ fontSize: 14, marginTop: '20px' }}>
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

            <ColorStatus />
        </main>
    );
};

export default CreatePayment;
