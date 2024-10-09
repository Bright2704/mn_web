import React, { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react'; // Import getSession

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
    lot_type: '',
    crate: false,
    check_product: false,
    weight: '',
    wide: '',
    high: '',
    long: '',
    number: '',
    pricing: '',
    cal_price: '',
    user_rate: 'A',
    in_cn: '',
    out_cn: '',
    in_th: '',
    check_product_price: '',
    new_wrap: '',
    transport: '',
    price_crate: '',
    other: '',
    status: 'รอเข้าโกดังจีน',
  });

  const [userId, setUserId] = useState<string | null>(null); // State to store user_id

  // Fetch the session and extract user_id on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id; // Type assertion
        if (userId) {
          setUserId(userId); // Set the user_id from session
        } else {
          console.error('User ID not found in session');
        }
      }
    };
  
    fetchSession();
  }, []);

  // UseEffect to set formData.user_id when userId is available
  useEffect(() => {
    if (userId) {
      setFormData((prev) => ({
        ...prev,
        user_id: userId, // Set user_id in formData
      }));
    }
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Append non-file fields to formData (from your formData state)
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value as string);
    });

    try {
      const response = await fetch('http://localhost:5000/tracking', {
        method: 'POST',
        body: formDataToSend,
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
          <button type="button" className="close text-2xl" onClick={onClose}>
            &times;
          </button>
        </header>
        <form onSubmit={handleSubmit}>
          <div className="modal-body p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Parcel Information */}
              <div>
                <h6 className="text-lg font-semibold mb-2">ข้อมูลพัสดุ</h6>
                <div className="mb-3">
                  <label htmlFor="tracking_id" className="block mb-1">
                    รหัสพัสดุ: <span className="text-red-500">*</span>
                  </label>
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
                  <label htmlFor="number" className="block mb-1">
                    จำนวน: <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="number"
                    type="number"
                    className="w-full p-2 border rounded"
                    value={formData.number}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="buylist_id" className="block mb-1">
                    หมายเลขใบสั่งซื้อ:
                  </label>
                  <input
                    id="buylist_id"
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.buylist_id}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="mnemonics" className="block mb-1">
                    วลีช่วยจำ:
                  </label>
                  <input
                    id="mnemonics"
                    type="text"
                    className="w-full p-2 border rounded"
                    value={formData.mnemonics}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="lot_type" className="block mb-1">
                    การขนส่ง:
                  </label>
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
              {/* Package Details */}
              <div>
                <h6 className="text-lg font-semibold mb-2 ml-20">รายละเอียดพัสดุ</h6>
                <div className="mb-3 ml-20">
                  <label htmlFor="weight" className="block mb-1">
                    ชื่อผู้รับ : MN1688
                  </label>
                </div>
                <div className="mb-3 ml-20">
                  <label htmlFor="wide" className="block mb-1">
                    ที่อยู่ : 广东省广州市白云区白云湖街道夏茅南约商业街18号9号仓1109-1 PLMCARGO 仓库 (MN1688)
                  </label>
                </div>
                <div className="mb-3 ml-20">
                  <label htmlFor="high" className="block mb-1">
                    รหัสไปรษณีย์ : 510440
                  </label>
                </div>
                <div className="mb-3 ml-20">
                  <label htmlFor="long" className="block mb-1">
                    เบอร์ติดต่อ : 13268241999
                  </label>
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
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              บันทึก
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default ModalAddTrack;
