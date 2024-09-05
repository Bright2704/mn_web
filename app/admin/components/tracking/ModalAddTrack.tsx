import React, { useState } from 'react';

interface ModalAddTrackProps {
  show: boolean;
  onClose: () => void;
}

const ModalAddTrack: React.FC<ModalAddTrackProps> = ({ show, onClose }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    not_owner: false,
    tracking_id: '',
    buylist_id: '',
    mnemonics: '',
    lot_type: 'รถ',
    type_item: 'ทั่วไป',
    crate: false,
    check_product: false,
    weight: '',
    wide: '',
    high: '',
    long: '',
    number: '',
    pricing: 'อัตโนมัติ',
    user_rate: 'A',
    in_cn: '',
    out_cn: '',
    in_th: '',
    check_product_price: '',
    new_wrap: '',
    transport: '',
    price_crate: '',
    other: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add tracking data');
      }

      const result = await response.json();
      console.log('Tracking data added:', result);
      onClose();
    } catch (error) {
      console.error('Error adding tracking data:', error);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-12/13 md:w-7/8 lg:w-5/6 xl:w-3/4 max-h-screen overflow-y-auto">
        <header className="modal-header p-4 border-b">
          <h5 className="modal-title text-xl font-bold">เพิ่มรหัสพัสดุ</h5>
          <button type="button" className="close text-2xl" onClick={onClose}>&times;</button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="modal-body p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Information */}
              <div className="col-span-1 md:col-span-2">
                <h6 className="text-lg font-semibold mb-2">ข้อมูลลูกค้า</h6>
                <div className="mb-3">
                  <label htmlFor="user_id" className="block mb-1">รหัสลูกค้า: <span className="text-red-500">*</span></label>
                  <input
                    id="user_id"
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.user_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="not_owner"
                      checked={formData.not_owner}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    สินค้าไม่มีเจ้าของ
                  </label>
                </div>
              </div>

              {/* Parcel Information */}
              <div>
                <h6 className="text-lg font-semibold mb-2">ข้อมูลพัสดุ</h6>
                <div className="mb-3">
                  <label htmlFor="tracking_id" className="block mb-1">รหัสพัสดุ: <span className="text-red-500">*</span></label>
                  <input
                    id="tracking_id"
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.tracking_id}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="buylist_id" className="block mb-1">หมายเลขใบสั่งซื้อ:</label>
                  <input
                    id="buylist_id"
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.buylist_id}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="mnemonics" className="block mb-1">วลีช่วยจำ:</label>
                  <input
                    id="mnemonics"
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.mnemonics}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lot_type" className="block mb-1">การขนส่ง:</label>
                  <select
                    id="lot_type"
                    className="w-full p-2 border rounded"
                    value={formData.lot_type}
                    onChange={handleInputChange}
                  >
                    <option value="รถ">รถ</option>
                    <option value="เรือ">เรือ</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="type_item" className="block mb-1">ประเภทสินค้า:</label>
                  <select
                    id="type_item"
                    className="w-full p-2 border rounded"
                    value={formData.type_item}
                    onChange={handleInputChange}
                  >
                    <option value="ทั่วไป">ทั่วไป</option>
                    <option value="มอก./อย.">มอก./อย.</option>
                    <option value="พิเศษ">พิเศษ</option>
                  </select>
                </div>
              </div>

              {/* Package Details */}
              <div>
                <h6 className="text-lg font-semibold mb-2">รายละเอียดพัสดุ</h6>
                <div className="mb-3">
                  <label htmlFor="weight" className="block mb-1">น้ำหนัก (กก.):</label>
                  <input
                    id="weight"
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="wide" className="block mb-1">กว้าง (ซม.):</label>
                  <input
                    id="wide"
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded"
                    value={formData.wide}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="high" className="block mb-1">สูง (ซม.):</label>
                  <input
                    id="high"
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded"
                    value={formData.high}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="long" className="block mb-1">ยาว (ซม.):</label>
                  <input
                    id="long"
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded"
                    value={formData.long}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="number" className="block mb-1">จำนวน:</label>
                  <input
                    id="number"
                    type="number"
                    className="w-full p-2 border rounded"
                    value={formData.number}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Pricing and Rates */}
              <div>
                <h6 className="text-lg font-semibold mb-2">ราคาและอัตรา</h6>
                <div className="mb-3">
                  <label htmlFor="pricing" className="block mb-1">คิดราคาตาม:</label>
                  <select
                    id="pricing"
                    className="w-full p-2 border rounded"
                    value={formData.pricing}
                    onChange={handleInputChange}
                  >
                    <option value="อัตโนมัติ">อัตโนมัติ</option>
                    <option value="น้ำหนัก">น้ำหนัก</option>
                    <option value="ปริมาตร">ปริมาตร</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="user_rate" className="block mb-1">เรท:</label>
                  <select
                    id="user_rate"
                    className="w-full p-2 border rounded"
                    value={formData.user_rate}
                    onChange={handleInputChange}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div>
                <h6 className="text-lg font-semibold mb-2">วันที่</h6>
                <div className="mb-3">
                  <label htmlFor="in_cn" className="block mb-1">เข้าโกดังจีน:</label>
                  <input
                    id="in_cn"
                    type="date"
                    className="w-full p-2 border rounded"
                    value={formData.in_cn}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="out_cn" className="block mb-1">ออกโกดังจีน:</label>
                  <input
                    id="out_cn"
                    type="date"
                    className="w-full p-2 border rounded"
                    value={formData.out_cn}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="in_th" className="block mb-1">เข้าโกดังไทย:</label>
                  <input
                    id="in_th"
                    type="date"
                    className="w-full p-2 border rounded"
                    value={formData.in_th}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Additional Services */}
              <div>
                <h6 className="text-lg font-semibold mb-2">บริการเพิ่มเติม</h6>
                <div className="mb-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="crate"
                      checked={formData.crate}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    ตีลังไม้
                  </label>
                </div>
                <div className="mb-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      id="check_product"
                      checked={formData.check_product}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    เช็คสินค้า
                  </label>
                </div>
              </div>

              {/* Additional Costs */}
              <div>
                <h6 className="text-lg font-semibold mb-2">ค่าใช้จ่ายเพิ่มเติม</h6>
                <div className="mb-3">
                  <label htmlFor="check_product_price" className="block mb-1">ค่าเช็คสินค้า:</label>
                  <input
                    id="check_product_price"
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded"
                    value={formData.check_product_price}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="new_wrap" className="block mb-1">ค่าห่อใหม่:</label>
                  <input
                    id="new_wrap"
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded"
                    value={formData.new_wrap}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="transport" className="block mb-1">ค่าขนส่งจีน:</label>
                  <input
                    id="transport"
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded"
                    value={formData.transport}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="price_crate" className="block mb-1">ค่าตีลัง:</label>
                  <input
                    id="price_crate"
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded"
                    value={formData.price_crate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="other" className="block mb-1">ค่าอื่นๆ:</label>
                  <input
                    id="other"
                    type="number"
                    step="0.01"
                    className="w-full p-2 border rounded"
                    value={formData.other}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <footer className="modal-footer p-4 border-t flex justify-end">
            <button 
              type="button" 
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded mr-2" 
              onClick={onClose}
            >
              ยกเลิก
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              บันทึก
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ModalAddTrack;