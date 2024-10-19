import React, { useState, useEffect } from 'react';
import { Select, Form, Card, Row, Col, Input, Button, Radio, Checkbox } from 'antd';
import addressData from '../AddressData';
import TransportData from '../TransportData'; // Import the TransportData
import { getSession } from "next-auth/react"; // Import getSession

const { Option } = Select;

interface Address {
    province: string;
    district: string;
    subdistrict: string;
    postalCode: string;
    transport: string;
}

interface AddressFormProps {
    address: Address;
    handleAddressChange: (field: string, value: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, handleAddressChange }) => {
    const [selectedTransport, setSelectedTransport] = useState<string>(''); // State to track selected transport option
    const [selectedShippingPayment, setSelectedShippingPayment] = useState<string>(''); // State for shipping payment method
    const [selectedCarrier, setSelectedCarrier] = useState<string>(''); // State for selected carrier
    const [senderOption, setSenderOption] = useState<string>('0'); // State to track selected sender option
    const [showReceiptOptions, setShowReceiptOptions] = useState<string>(''); // State to track radio selection for receipt options
    const [userName, setUserName] = useState<string>(''); // State to store user name

    const handleTransportChange = (e: any) => {
        setSelectedTransport(e.target.value);
    };

    const handleShippingPaymentChange = (e: any) => {
        setSelectedShippingPayment(e.target.value);
    };

    const handleCarrierChange = (value: string) => {
        setSelectedCarrier(value);
    };

    const handleSenderOptionChange = (value: string) => {
        setSenderOption(value);
    };

    const handleReceiptRadioChange = (e: any) => {
        setShowReceiptOptions(e.target.value); // Show receipt options if 'showReceipt' radio is selected
    };

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            if (session?.user) {
                const userId = (session.user as { user_id?: string }).user_id; // Type assertion
                if (userId) {
                    // Simulate fetching the user name based on userId
                    // You might want to replace this with an actual API call to fetch the user details
                    setUserName(`${userId}`); // Example: setting a mock name from userId
                } else {
                    console.error("User ID not found in session");
                }
            }
        };

        fetchSession();
    }, []);
    
    // Handler for changing the user's name in the input
    const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value); // Update the state when the user types
    };

    return (
        <Card
            title={(
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ marginBottom: 0 }}>ที่อยู่ผู้รับสินค้า</h3>
                    <Button type="primary" style={{ height: '40px' }}>
                        เลือกที่อยู่ผู้รับจากสมุดที่อยู่
                    </Button>
                </div>
            )}
        >
            <Form layout="vertical">
                {/* Name */}
                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>ชื่อ - สกุล </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={16} style={{ textAlign: 'right' }}>
                        <Input
                            className="ant-input-lg"
                            value={userName}
                            onChange={handleUserNameChange} // Handle change to update state
                        />
                    </Col>
                </Row>

                {/* Address */}
                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>ที่อยู่ </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={16} style={{ textAlign: 'right' }}>
                        <textarea
                            rows={3}
                            className="ant-input ant-input-lg"
                            placeholder="บ้านเลขที่ ถนน ซอย"
                            style={{
                                width: '100%',
                                height: '100px',
                                resize: 'none',
                                border: '1px solid #d9d9d9',
                                padding: '10px',
                                borderRadius: '4px',
                            }}
                        />
                    </Col>
                </Row>

                {/* Province */}
                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>จังหวัด </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={16}>
                        <Select
                            showSearch
                            value={address.province}
                            onChange={(value) => handleAddressChange('province', value)}
                            placeholder="Select Province"
                            style={{ width: '100%' }}
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
                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>อำเภอ </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={16}>
                        <Select
                            showSearch
                            value={address.district}
                            onChange={(value) => handleAddressChange('district', value)}
                            placeholder="Select District"
                            disabled={!address.province}
                            style={{ width: '100%' }}
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
                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>ตำบล </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={16}>
                        <Select
                            showSearch
                            value={address.subdistrict}
                            onChange={(value) => handleAddressChange('subdistrict', value)}
                            placeholder="Select Subdistrict"
                            disabled={!address.district}
                            style={{ width: '100%' }}
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
                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>รหัสไปรษณีย์ </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={16}>
                        <Select
                            value={address.postalCode}
                            onChange={(value) => handleAddressChange('postalCode', value)}
                            placeholder="Select Postal Code"
                            disabled={!address.subdistrict}
                            style={{ width: '100%' }}
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

                {/* Tel */}
                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>เบอร์โทรศัพท์ </span>&nbsp; &nbsp;
                    </Col>
                    <Col span={16} style={{ textAlign: 'right' }}>
                        <Input className="ant-input-lg" value="" />
                    </Col>
                </Row>

                {/* Transport Type */}
                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={5} style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 600 }}>ประเภทการจัดส่ง </span>&nbsp;&nbsp;
                    </Col>
                    <Col span={16}>
                        <Radio.Group onChange={handleTransportChange} value={selectedTransport}>
                            <Radio value="1">รับสินค้าเอง (รับสินค้าเองได้ทุกวัน 09.00-21.00 น.)</Radio>
                            <Radio value="2" style={{ display: 'block', marginTop: '8px' }}>
                                บริษัทจัดส่ง 690 บาท (เฉพาะเขตกรุงเทพ)
                            </Radio>
                            <Radio value="-99" style={{ display: 'block', marginTop: '8px' }}>
                                ขนส่งเอกชน (แจ้งก่อน 12.00 น.)
                            </Radio>
                        </Radio.Group>

                        {/* Conditionally render extra options if "ขนส่งเอกชน" is selected */}
                        {selectedTransport === '-99' && (
                            <div style={{ marginLeft: '16px', marginTop: '16px' }}>
                                <Radio.Group onChange={handleShippingPaymentChange} value={selectedShippingPayment}>
                                    <Radio value="0" style={{ marginBottom: '12px' }}>
                                        จ่ายค่าขนส่งต้นทาง
                                    </Radio>
                                    <br />
                                    <Radio value="1" style={{ marginBottom: '12px' }}>
                                        จ่ายค่าขนส่งปลายทาง
                                    </Radio>
                                </Radio.Group>

                                {/* Dropdown for selecting carrier */}
                                <Select
                                    className="ant-input ant-input-lg"
                                    value={selectedCarrier}
                                    onChange={handleCarrierChange}
                                    style={{ width: '100%', marginTop: '12px' }}
                                >
                                    {TransportData.companies.map((company, index) => (
                                        <Option key={index} value={company}>
                                            {company}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </Col>
                </Row>
                 {/* Add gray line */}
                <div style={{ borderBottom: '2px solid gray', marginTop: '20px' }}></div>

                {/* Additional section starts here */}
                <Row style={{ marginLeft: '-8px', marginRight: '-8px', marginTop: '5px', rowGap: '16px' }}>
                    <Col span={18} style={{ paddingLeft: '8px', paddingRight: '8px' }}>
                        <Row style={{ marginTop: '16px', marginLeft: '20px' }}>
                            <Col span={8} style={{ textAlign: 'right', paddingTop: '6px' }}>
                                <span style={{ fontWeight: '600' }}>ที่อยู่ผู้ส่ง</span>&nbsp; &nbsp;
                            </Col>
                            <Col span={16}>
                                <Select
                                    className="ant-input ant-input-lg"
                                    value={senderOption}
                                    onChange={handleSenderOptionChange}
                                >
                                    <Option value="0">- กรุณาเลือก -</Option>
                                    <Option value="5e58b0dfab8e4289895405c8">MN1688 EXPRESS</Option>
                                    <Option value="5e58b0e7f809c665644b48d7">ไม่แสดงราคา</Option>
                                    <Option value="-99">กรอกใหม่</Option>
                                </Select>
                            </Col>
                        </Row>

                        {/* Conditionally render the hidden section if "กรอกใหม่" is selected */}
                        {senderOption === '-99' && (
                            <div style={{ marginLeft: '20px' }}>
                                <Row style={{ marginBottom: '4px', marginTop: '16px' }}>
                                    <Col span={8} style={{ textAlign: 'right', paddingTop: '6px' }}>
                                        <span style={{ fontWeight: '600' }}>ชื่อผู้ส่ง</span>&nbsp; &nbsp;
                                    </Col>
                                    <Col span={16}>
                                        <div style={{ color: 'red' }}>การกรอกผู้ส่งเองจะถูกคิดค่าบริการ 10฿</div>
                                        <Input className="ant-input-lg" value="" />
                                    </Col>
                                </Row>

                                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Col span={8} style={{ textAlign: 'right', paddingTop: '6px' }}>
                                        <span style={{ fontWeight: '600' }}>ที่อยู่ :</span>&nbsp; &nbsp;
                                    </Col>
                                    <Col span={16} style={{ textAlign: 'right' }}>
                                        <textarea
                                            rows={3}
                                            className="ant-input ant-input-lg"
                                            placeholder="บ้านเลขที่ ถนน ซอย"
                                            style={{
                                                width: '100%',
                                                height: '100px',
                                                resize: 'none',
                                                border: '1px solid #d9d9d9',
                                                padding: '10px',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </Col>
                                </Row>

                                <Row style={{ marginBottom: '4px' }}>
                                    <Col span={8} style={{ textAlign: 'right', paddingTop: '6px' }}>
                                        <span style={{ fontWeight: '600' }}>เบอร์ติดต่อผู้ส่ง</span>&nbsp; &nbsp;
                                    </Col>
                                    <Col span={16}>
                                        <Input className="ant-input-lg" value="" />
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Col>

                    {/* Button Section */}
                    <Col span={3} style={{ paddingLeft: '8px', paddingRight: '8px', textAlign: 'right' }}>
                        <Button type="primary" style={{ marginTop: '16px' }} icon={<svg viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg>}>
                            ดูตัวอย่าง
                        </Button>
                    </Col>

                    {/* Add gray line */}
                <div style={{ borderBottom: '2px solid gray', marginTop: '20px' }}></div>

                {/* Conditionally render extra options if "ขนส่งเอกชน" is selected */}
                {showReceiptOptions === 'showReceipt' && (
                    <div style={{ marginLeft: '16px', marginTop: '16px' }}>
                        <Radio.Group onChange={handleShippingPaymentChange} value={selectedShippingPayment}>
                            <Radio value="0" style={{ marginBottom: '12px' }}>
                                จ่ายค่าขนส่งต้นทาง
                            </Radio>
                            <br />
                            <Radio value="1" style={{ marginBottom: '12px' }}>
                                จ่ายค่าขนส่งปลายทาง
                            </Radio>
                        </Radio.Group>

                        {/* Dropdown for selecting carrier */}
                        <Select
                            className="ant-input ant-input-lg"
                            value={selectedCarrier}
                            onChange={handleCarrierChange}
                            style={{ width: '100%', marginTop: '12px' }}
                        >
                            {TransportData.companies.map((company, index) => (
                                <Option key={index} value={company}>
                                    {company}
                                </Option>
                            ))}
                        </Select>
                    </div>
                )}
                </Row>
                
                {/* Receipt Options */}
                <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Col span={5} style={{ textAlign: 'right' }}>
                        <span style={{ fontWeight: 600 }}>ต้องการใบเสร็จ?   </span>&nbsp;&nbsp;
                    </Col>
                    <Col span={16}>
                        <Radio.Group onChange={handleReceiptRadioChange} value={showReceiptOptions}>
                            <Radio value="1">ต้องการใบเสร็จ</Radio>
                            <Radio value="2">ไม่ต้องการใบเสร็จ</Radio>
                        </Radio.Group>

                        {/* Conditionally render extra options if "ขนส่งเอกชน" is selected */}
                        {showReceiptOptions === '1' && (
                            <div style={{ marginLeft: '16px', marginTop: '16px' }}>
                                <Button type="primary" style={{ height: '40px' }}>
                                            เลือกข้อมูลผู้เสียภาษี หรือ ใบรับรองบริษัท
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>
                
                {/* Coupon Section */}
                <Row style={{ marginTop: '16px', marginLeft: '20px' }}>
                    <Col span={6} style={{ textAlign: 'right', paddingTop: '6px' }}>
                        <span style={{ fontWeight: '600' }}>คูปอง</span>&nbsp; &nbsp;
                    </Col>
                    <Col span={12}>
                    <Button
                        type="dashed"
                        style={{
                            borderColor: 'rgb(239, 68, 68)', // Set the custom border color
                            color: 'rgb(239, 68, 68)' // Optionally set the text color to match
                        }}
                    >
                        เลือกคูปอง
                    </Button>
                    </Col>
                </Row>

            </Form>
        </Card>
    );
};

export default AddressForm;
