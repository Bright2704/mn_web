// AddTaxInformationModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getSession } from 'next-auth/react';

interface AddTaxInformationModalProps {
    show: boolean;
    onClose: () => void;
  }
const customerTypes = [
  'บุคคลธรรมดา',
  'บริษัท',
  'ห้างหุ้นส่วนจำกัด'
];

const AddTaxInformationModal: React.FC<AddTaxInformationModalProps> = ({
    show,
    onClose
  }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [taxId, setTaxId] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id;
        if (userId) {
          setUserId(userId);
        }
      }
    };
    fetchSession();
  }, []);

  const handleSave = async () => {
    if (!name || !address || !phone || !taxId || !customerType || !document) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('user_id', userId!);
      formData.append('name', name);
      formData.append('address', address);
      formData.append('phone', phone);
      formData.append('taxId', taxId);
      formData.append('customerType', customerType);
      formData.append('document', document);

      await axios.post('http://localhost:5001/tax_info', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setError(null);
      onClose();
    } catch (error) {
      console.error('Error saving tax information:', error);
      setError('Failed to save tax information. Please try again.');
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h5 className="text-xl font-medium">เพิ่มข้อมูลผู้เสียภาษี</h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        <form>
          <div className="mb-4">
            <label className="block font-semibold">ชื่อ</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">ที่อยู่</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">เบอร์โทรศัพท์</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">เลขผู้เสียภาษี</label>
            <input
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold">ประเภทลูกค้า</label>
            <select
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">เลือกประเภทลูกค้า</option>
              {customerTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-semibold">เอกสาร</label>
            <input
              type="file"
              onChange={(e) => setDocument(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </form>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
            onClick={handleSave}
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddTaxInformationModal ;