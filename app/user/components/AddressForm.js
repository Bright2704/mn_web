// ./component/AddressForm.js

import React, { useState } from 'react';
import { Select, Form, Card } from 'antd';
import AddressData from './AddressData';

const { Option } = Select;

const AddressForm = () => {
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
    const [postalCode, setPostalCode] = useState('');

    return (
        <Card title="Select Your Address">
        <Form layout="vertical">
            <Form.Item label="Province">
            <Select
                showSearch
                value={selectedProvince}
                onChange={setSelectedProvince}
                filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {AddressData.provinces.map(province => (
                <Option key={province.name} value={province.name}>{province.name}</Option>
                ))}
            </Select>
            </Form.Item>
            <Form.Item label="District">
            <Select
                showSearch
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                disabled={!selectedProvince}
                filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {selectedProvince && AddressData.provinces.find(p => p.name === selectedProvince)?.districts.map(district => (
                <Option key={district.name} value={district.name}>{district.name}</Option>
                ))}
            </Select>
            </Form.Item>
            <Form.Item label="Subdistrict">
            <Select
                showSearch
                value={selectedSubdistrict}
                onChange={setSelectedSubdistrict}
                disabled={!selectedDistrict}
                filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {selectedDistrict && AddressData.provinces.find(p => p.name === selectedProvince)?.districts.find(d => d.name === selectedDistrict)?.subdistricts.map(subdistrict => (
                <Option key={subdistrict.name} value={subdistrict.name}>{subdistrict.name}</Option>
                ))}
            </Select>
            </Form.Item>
            <Form.Item label="Postal Code">
            <Select
                value={postalCode}
                onChange={setPostalCode}
                disabled={!selectedSubdistrict}
            >
                {selectedSubdistrict && (
                AddressData.provinces.find(p => p.name === selectedProvince)
                ?.districts.find(d => d.name === selectedDistrict)
                ?.subdistricts.find(s => s.name === selectedSubdistrict)
                ?.postalCodes.map(code => (
                    <Option key={code} value={code}>{code}</Option>
                ))
                )}
            </Select>
            </Form.Item>
        </Form>
        </Card>
    );
};

export default AddressForm;