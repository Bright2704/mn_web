// AddAddressModal.tsx
import React, { useState, useEffect } from 'react';
import { Select, Row, Col, Input } from 'antd';
const { Option } = Select;
import axios from 'axios';
import { getSession } from 'next-auth/react';
import addressData from '../../../user/components/AddressData'; // Make sure this path is correct

interface AddAddressModalProps {
  show: boolean;
  onClose: () => void;
  selectedUserId: string | null;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({
  show, onClose, selectedUserId
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [province, setProvince] = useState('');
  const [districts, setDistricts] = useState('');
  const [subdistricts, setSubdistricts] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id;
        if (userId) {
          setUserId(userId);
        } else {
          console.error("User ID not found in session");
        }
      }
    };

    fetchSession();
  }, []);

  const handleSaveAddress = async () => {
    if (!name || !address || !province || !districts || !subdistricts || !postalCode || !phone) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const addressData = {
        user_id: selectedUserId,
        name,
        address,
        province,
        districts,
        subdistricts,
        postalCode,
        phone
      };

      await axios.post("http://localhost:5001/book_address", addressData);
      setError(null);
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      setError("ไม่สามารถบันทึกที่อยู่ได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-medium">เพิ่มที่อยู่</h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
            style={{ background: 'none', border: 'none' }}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        {/* Modal Body */}
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold">ชื่อ - สกุล</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="กรอกชื่อ-นามสกุล"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block font-semibold">ที่อยู่</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="กรอกที่อยู่"
              rows={3}
            />
          </div>

          {/* Province */}
<Row style={{ marginBottom: '4px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Col span={4} style={{ textAlign: 'right', paddingTop: '6px' }}>
        <span style={{ fontWeight: '600' }}>จังหวัด </span>&nbsp; &nbsp;
    </Col>
    <Col span={16}>
        <Select
            showSearch
            value={province}
            onChange={(value) => {
                setProvince(value);
                setDistricts('');
                setSubdistricts('');
                setPostalCode('');
            }}
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
            value={districts}
            onChange={(value) => {
                setDistricts(value);
                setSubdistricts('');
                setPostalCode('');
            }}
            placeholder="Select District"
            disabled={!province}
            style={{ width: '100%' }}
        >
            {addressData.provinces
                .find((p) => p.name === province)
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
            value={subdistricts}
            onChange={(value) => {
                const selectedSubdistrict = addressData.provinces
                    .find(p => p.name === province)
                    ?.districts.find(d => d.name === districts)
                    ?.subdistricts.find(s => s.name === value);

                setSubdistricts(value);
                if (selectedSubdistrict?.postalCodes?.[0]) {
                    setPostalCode(selectedSubdistrict.postalCodes[0]);
                }
            }}
            placeholder="Select Subdistrict"
            disabled={!districts}
            style={{ width: '100%' }}
        >
            {addressData.provinces
                .find((p) => p.name === province)
                ?.districts.find((d) => d.name === districts)
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
            value={postalCode}
            placeholder="Postal Code"
            onChange={(e) => setPostalCode(e.target.value)}
            style={{ width: '100%' }}
        />
    </Col>
</Row>

          <div className="mb-4">
            <label htmlFor="phone" className="block font-semibold">เบอร์โทรศัพท์</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="กรอกเบอร์โทรศัพท์"
            />
          </div>
        </form>

        {/* Display error message if any */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Modal Footer */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={onClose}
          >
            ยกเลิก
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSaveAddress}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;