import React, { useState, useEffect } from 'react';
import { Select, Form, Card, Row, Col, Input, Button, Radio } from 'antd';
import AddressBookModal from '../user_profile/AddressBookModal';
import addressData from '../AddressData';
import TaxInformationModal from '../tax/TaxInformationModal';
import TransportData from '../TransportData';
import { getSession } from "next-auth/react";
import axios from 'axios';

const { Option } = Select;

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

interface TaxInfo {
    name: string;
    address: string;
    phone: string;
    taxId: string;
    customerType: string;
    document: string;
}

interface AddressFormProps {
    address: {
        province: string;
        district: string;
        subdistrict: string;
        postalCode: string;
        transport: string;
    };
    handleAddressChange: (field: string, value: string) => void;
    onTransportChange: (value: string, carrier?: string) => void;
    onSenderOptionChange: (value: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ 
    address, 
    handleAddressChange, 
    onTransportChange,
    onSenderOptionChange
}) => {
    const [selectedTransport, setSelectedTransport] = useState<string>('');
    const [selectedShippingPayment, setSelectedShippingPayment] = useState<string>('');
    const [selectedCarrier, setSelectedCarrier] = useState<string>('');
    const [senderOption, setSenderOption] = useState<string>('0');
    const [showReceiptOptions, setShowReceiptOptions] = useState<string>('');
    const [userName, setUserName] = useState<string>('');
    const [userAddress, setUserAddress] = useState<string>('');
    const [userProvince, setUserProvince] = useState<string>('');
    const [userDistrict, setUserDistrict] = useState<string>('');
    const [userSubdistrict, setUserSubdistrict] = useState<string>('');
    const [userPostalCode, setUserPostalCode] = useState<string>('');
    const [userPhone, setUserPhone] = useState<string>('');
    const [showAddressBookModal, setShowAddressBookModal] = useState<boolean>(false);
    const [showTaxInfoModal, setShowTaxInfoModal] = useState<boolean>(false);
    const [selectedTaxInfo, setSelectedTaxInfo] = useState<TaxInfo | null>(null);
    const [showPreviewCard, setShowPreviewCard] = useState<boolean>(false);
    const cashOnDeliveryCarriers = ["Kerry Express", "Flash Express", "J&T Express"];

    const handleTransportChange = (e: any) => {
        const value = e.target.value;
        setSelectedTransport(value);
        setSelectedCarrier(''); // Clear carrier when transport type changes
        onTransportChange(value);
    };
    
    const handleCarrierChange = (value: string) => {
        setSelectedCarrier(value);
        onTransportChange(selectedTransport, value);
    };
    
    const handleSenderOptionChange = (value: string) => {
        setSenderOption(value);
        onSenderOptionChange(value);
    };

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            if (session?.user) {
                const userId = (session.user as { user_id?: string }).user_id;
                if (userId) {
                    setUserName(`${userId}`);
                }
            }
        };
        fetchSession();
    }, []);


    const handleShippingPaymentChange = (e: any) => setSelectedShippingPayment(e.target.value);
    const handleReceiptRadioChange = (e: any) => {
        setShowReceiptOptions(e.target.value);
        if (e.target.value === '2') setShowPreviewCard(false);
    };

    const handleAddressBookClick = () => setShowAddressBookModal(true);

    const handleAddressSelect = (selectedAddress: Address) => {
        setUserName(selectedAddress.name);
        setUserAddress(selectedAddress.address);
        setUserProvince(selectedAddress.province);
        setUserDistrict(selectedAddress.districts);
        setUserSubdistrict(selectedAddress.subdistricts);
        setUserPostalCode(selectedAddress.postalCode);
        setUserPhone(selectedAddress.phone);
        setShowAddressBookModal(false);
    };

    const handleSubdistrictChange = (value: string) => {
        setUserSubdistrict(value);
        const selectedSubdistrict = addressData.provinces
            .find((p) => p.name === userProvince)
            ?.districts.find((d) => d.name === userDistrict)
            ?.subdistricts.find((s) => s.name === value);

        if (selectedSubdistrict && selectedSubdistrict.postalCodes.length > 0) {
            setUserPostalCode(selectedSubdistrict.postalCodes[0]);
        }
    };

    useEffect(() => {
        const fetchSession = async () => {
            const session = await getSession();
            if (session?.user) {
                const userId = (session.user as { user_id?: string }).user_id;
                if (userId) {
                    setUserName(`${userId}`);
                } else {
                    console.error("User ID not found in session");
                }
            }
        };

        fetchSession();
    }, []);
    
    const handleTaxInfoClick = () => setShowTaxInfoModal(true);

    return (
        <>
            <Card
                title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ marginBottom: 0 }}>ที่อยู่ผู้รับสินค้า</h3>
                        <Button type="primary" style={{ height: '40px' }} onClick={() => setShowAddressBookModal(true)}>
                            เลือกที่อยู่ผู้รับจากสมุดที่อยู่
                        </Button>
                    </div>
                }
                bordered
                style={{ marginBottom: '16px' }}
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
                                onChange={(e) => setUserName(e.target.value)}
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
                                value={userAddress}
                                onChange={(e) => setUserAddress(e.target.value)}
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
                                value={userProvince}
                                onChange={(value) => setUserProvince(value)}
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
                                value={userDistrict}
                                onChange={(value) => setUserDistrict(value)}
                                placeholder="Select District"
                                disabled={!userProvince}
                                style={{ width: '100%' }}
                            >
                                {addressData.provinces
                                    .find((p) => p.name === userProvince)
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
                                value={userSubdistrict}
                                onChange={handleSubdistrictChange}
                                placeholder="Select Subdistrict"
                                disabled={!userDistrict}
                                style={{ width: '100%' }}
                            >
                                {addressData.provinces
                                    .find((p) => p.name === userProvince)
                                    ?.districts.find((d) => d.name === userDistrict)
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
                            <Input
                                value={userPostalCode}
                                placeholder="Postal Code"
                                onChange={(e) => setUserPostalCode(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Row>

                    {/* Phone */}
                    <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
                            <span style={{ fontWeight: '600' }}>เบอร์โทรศัพท์ </span>&nbsp; &nbsp;
                        </Col>
                        <Col span={16}>
                            <Input
                                className="ant-input-lg"
                                value={userPhone}
                                placeholder="Phone Number"
                                onChange={(e) => setUserPhone(e.target.value)}
                            />
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

                <Select
                    className="ant-input ant-input-lg"
                    value={selectedCarrier}
                    onChange={handleCarrierChange}
                    style={{ width: '100%', marginTop: '12px' }}
                >
                    {(selectedShippingPayment === "1" ? cashOnDeliveryCarriers : TransportData.companies).map((company, index) => (
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
                    <span style={{ fontWeight: 600 }}>ต้องการใบเสร็จ?</span>&nbsp;&nbsp;
                </Col>
                <Col span={16}>
                    <Radio.Group onChange={handleReceiptRadioChange} value={showReceiptOptions}>
                        <Radio value="1">ต้องการใบเสร็จ</Radio>
                        <Radio value="2">ไม่ต้องการใบเสร็จ</Radio>
                    </Radio.Group>

                    {/* Conditionally render tax information button if "ต้องการใบเสร็จ" is selected */}
                    {showReceiptOptions === '1' && (
                        <div style={{ marginLeft: '16px', marginTop: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <Button type="primary" style={{ height: '40px' }} onClick={handleTaxInfoClick}>
                                เลือกข้อมูลผู้เสียภาษี หรือ ใบรับรองบริษัท
                            </Button>

                            <Button
                                type="primary"
                                style={{ height: '40px' }}
                                icon={
                                    <svg
                                        viewBox="64 64 896 896"
                                        focusable="false"
                                        data-icon="eye"
                                        width="1em"
                                        height="1em"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z" />
                                    </svg>
                                }
                                onClick={() => setShowPreviewCard(prevState => !prevState)} // Toggle the preview card visibility
                            >
                                ดูตัวอย่าง
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Preview Card */}
            {showReceiptOptions === '1' && showPreviewCard && selectedTaxInfo && (
                <Card style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p><strong>นาม:</strong> {selectedTaxInfo.name}</p>
                    <p><strong>ที่อยู่:</strong> {selectedTaxInfo.address}</p>
                    <p><strong>เบอร์โทรศัพท์:</strong> {selectedTaxInfo.phone}</p>
                    <p><strong>เลขผู้เสียภาษี:</strong> {selectedTaxInfo.taxId}</p>
                    <p><strong>ประเภทลูกค้า:</strong> {selectedTaxInfo.customerType}</p>
                    <p><strong>เอกสาร:</strong> {selectedTaxInfo.document}</p>
                </Card>
            )}

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

        {/* Render the AddressBookModal */}
        <AddressBookModal
                show={showAddressBookModal}
                onClose={() => setShowAddressBookModal(false)}
                onSelectAddress={handleAddressSelect}
            />
        
        {/* Render the TaxInformationModal */}
        <TaxInformationModal
                visible={showTaxInfoModal}
                onClose={() => setShowTaxInfoModal(false)}
                onAddNewEntry={() => alert('Add new entry clicked')}
                onSelect={(taxInfo) => {
                    setSelectedTaxInfo(taxInfo);
                    setShowTaxInfoModal(false);
                }}
            />

    </>
    );
};

export default AddressForm;
