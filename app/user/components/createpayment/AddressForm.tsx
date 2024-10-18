// /components/createpayment/AddressForm.tsx

import React from 'react';
import { Select, Form, Card, Row, Col, Input,Button } from 'antd';
import addressData from '../AddressData';

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
    return (
        <Card title="ที่อยู่ผู้รับสินค้า">
    <Form layout="vertical">
        {/* Name */}
        <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
                <span style={{ fontWeight: '600' }}>ชื่อ - สกุล :</span>&nbsp; &nbsp;
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
                <Input className="ant-input-lg" value="Mn1688" />
            </Col>
        </Row>

        {/* Address */}
        <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
                <span style={{ fontWeight: '600' }}>ที่อยู่ :</span>&nbsp; &nbsp;
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
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
                <span style={{ fontWeight: '600' }}>จังหวัด :</span>&nbsp; &nbsp;
            </Col>
            <Col span={8}>
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
                <span style={{ fontWeight: '600' }}>อำเภอ :</span>&nbsp; &nbsp;
            </Col>
            <Col span={8}>
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
                <span style={{ fontWeight: '600' }}>ตำบล :</span>&nbsp; &nbsp;
            </Col>
            <Col span={8}>
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
                <span style={{ fontWeight: '600' }}>รหัสไปรษณีย์ :</span>&nbsp; &nbsp;
            </Col>
            <Col span={8}>
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
                <span style={{ fontWeight: '600' }}>เบอร์โทรศัพท์ :</span>&nbsp; &nbsp;
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
                <Input className="ant-input-lg" value="" />
            </Col>
        </Row>

        {/* Tel */}
        <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
            <Button type="primary" block style={{ height: '40px', width: '100%'}} >
                            เลือกที่อยู่ผู้รับ
            </Button>
            </Col>
        </Row>

        <Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Label row */}
            <Col span={8} style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 600 }}>ประเภทการจัดส่ง :</span>&nbsp;&nbsp;
            </Col>
            <Col span={12}>
                <div className="ant-radio-group ant-radio-group-outline">
                    <label className="ant-radio-wrapper">
                        <span className="ant-radio">
                            <input type="radio" className="ant-radio-input" value="1" />
                            <span className="ant-radio-inner"></span>
                        </span>
                        <span> รับสินค้าเอง (รับสินค้าเองได้ทุกวัน 09.00-21.00 น.)</span>
                    </label>

                    <label className="ant-radio-wrapper" style={{ display: 'block', marginTop: '8px' }}>
                        <span className="ant-radio">
                            <input type="radio" className="ant-radio-input" value="2" />
                            <span className="ant-radio-inner"></span>
                        </span>
                        <span> บริษัทจัดส่ง 690 บาท (เฉพาะเขตกรุงเทพ)</span>
                    </label>

                    <label className="ant-radio-wrapper" style={{ display: 'block', marginTop: '8px' }}>
                        <span className="ant-radio">
                            <input type="radio" className="ant-radio-input" value="-99" />
                            <span className="ant-radio-inner"></span>
                        </span>
                        <span> ขนส่งเอกชน (แจ้งก่อน 12.00 น.)</span>
                    </label>
                </div>
            </Col>
        </Row>


                            

        
    </Form>
</Card>


    );
};

export default AddressForm;
