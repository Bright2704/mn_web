import React, { useState } from 'react';
import axios from 'axios';

interface AddTaxInformationModalProps {
  show: boolean;
  onClose: () => void;
  selectedUser: User | null;
}

interface User {
  user_id: string;
  name: string;
  phone?: string;
}

const customerTypes = [
  'บุคคลธรรมดา',
  'บริษัท',
  'ห้างหุ้นส่วนจำกัด'
];

const AddTaxInformationModal: React.FC<AddTaxInformationModalProps> = ({
  show,
  onClose,
  selectedUser,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [taxId, setTaxId] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [document, setDocument] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!selectedUser) {
      setError("โปรดเลือกผู้ใช้");
      return;
    }

    if (!name || !address || !phone || !taxId || !customerType || !document) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('user_id', selectedUser.user_id);
      formData.append('name', name);
      formData.append('address', address);
      formData.append('phone', phone);
      formData.append('taxId', taxId);
      formData.append('customerType', customerType);
      formData.append('document', document);

      await axios.post('http://localhost:5001/tax_info', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onClose();
    } catch (error) {
      console.error('Error saving tax information:', error);
      setError('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
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
            aria-label="ปิด"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="mb-4">
            <label htmlFor="name" className="block font-semibold">ชื่อ</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block font-semibold">ที่อยู่</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block font-semibold">เบอร์โทรศัพท์</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="taxId" className="block font-semibold">เลขผู้เสียภาษี</label>
            <input
              id="taxId"
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="customerType" className="block font-semibold">ประเภทลูกค้า</label>
            <select
              id="customerType"
              value={customerType}
              onChange={(e) => setCustomerType(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">เลือกประเภทลูกค้า</option>
              {customerTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="document" className="block font-semibold">เอกสาร</label>
            <input
              id="document"
              type="file"
              onChange={(e) => setDocument(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded"
              accept=".pdf,.jpg,.jpeg,.png"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 mr-2"
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaxInformationModal ;