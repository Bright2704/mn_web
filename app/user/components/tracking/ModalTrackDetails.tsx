import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ModalTrackDetailsProps {
  show: boolean;
  onClose: () => void;
  trackingId: string; // Pass the tracking ID to fetch details
}

const ModalTrackDetails: React.FC<ModalTrackDetailsProps> = ({ show, onClose, trackingId }) => {
  const [trackingDetails, setTrackingDetails] = useState<any>(null); // State to store the tracking data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch the tracking data whenever the modal is shown and trackingId changes
  useEffect(() => {
    if (show && trackingId) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/tracking/${trackingId}`) // API call to fetch tracking data
        .then((response) => {
          setTrackingDetails(response.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Error fetching tracking details.');
          setLoading(false);
        });
    }
  }, [show, trackingId]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-xl font-medium">รายละเอียดรหัสพัสดุ</h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500"
            onClick={onClose}
            style={{ background: 'none', border: 'none' }}
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          {/* Loading and error handling */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            trackingDetails && (
              <>
                {/* Column 1 */}
                <div>
                  <h6 className="text-lg text-center font-semibold mb-2">ข้อมูลพัสดุ</h6>
                  <div className="tracking-details">
                    <div><span className="label">รหัสพัสดุ</span><span className="colon"> : </span><span className="value">{trackingDetails.tracking_id}</span></div>
                    <div><span className="label">จำนวน</span><span className="colon"> : </span><span className="value">{trackingDetails.number}</span></div>
                    <div><span className="label">หมายเลขใบสั่งซื้อ</span><span className="colon"> : </span><span className="value">{trackingDetails.buylist_id}</span></div>
                    <div><span className="label">วลีช่วยจำ</span><span className="colon"> : </span><span className="value">{trackingDetails.mnemonics}</span></div>
                    <div><span className="label">การขนส่ง</span><span className="colon"> : </span><span className="value">{trackingDetails.lot_type}</span></div>
                    <div><span className="label">ประเภทสินค้า</span><span className="colon"> : </span><span className="value">{trackingDetails.type_item}</span></div>
                    <div><span className="label">ตีลังไม้</span><span className="colon"> : </span><span className="value">{trackingDetails.crate}</span></div>
                    <div><span className="label">เช็คสินค้า</span><span className="colon"> : </span><span className="value">{trackingDetails.check_product}</span></div>
                    <div><span className="label">หมายเหตุ</span><span className="colon"> : </span><span className="value">{trackingDetails.note}</span></div>
                    <div><span className="label">รูปสินค้า</span><span className="colon"> : </span><span className="value">{trackingDetails.image_item_path}</span></div>
                  </div>
                </div>

                {/* Column 2 */}
                <div>
                  <h6 className="text-lg text-center font-semibold mb-2">ขนาด</h6>
                    <div className="tracking-details">
                      <div><span className="label">น้ำหนัก (กก.)</span><span className="colon"> : </span><span className="value">{trackingDetails.weight}</span></div>
                      <div><span className="label">กว้าง (ซม.)</span><span className="colon"> : </span><span className="value">{trackingDetails.wide}</span></div>
                      <div><span className="label">สูง (ซม.)</span><span className="colon"> : </span><span className="value">{trackingDetails.high}</span></div>
                      <div><span className="label">ยาว (ซม.)</span><span className="colon"> : </span><span className="value">{trackingDetails.long}</span></div>
                      <div><span className="label">น้ำหนักรวม (กก.)</span><span className="colon"> : </span><span className="value">{trackingDetails.number*trackingDetails.weight}</span></div>
                      <div><span className="label">คิวรวม</span><span className="colon"> : </span><span className="value">{trackingDetails.number*trackingDetails.weight}</span></div>
                    </div>
                  </div>

                {/* Column 1, Row 2 */}
                <div>
                  <h6 className="text-lg text-center font-semibold mb-2">ราคาและอัตรา</h6>
                    <div className="tracking-details">
                      <div><span className="label">คิดราคาแบบ{trackingDetails.pricing}</span><span className="colon"> : </span><span className="value">{trackingDetails.cal_price}</span></div>
                      <div><span className="label">เช็คสินค้า</span><span className="colon"> : </span><span className="value">{trackingDetails.check_product_price}</span></div>
                      <div><span className="label">ขนส่งจีน</span><span className="colon"> : </span><span className="value">{trackingDetails.transport}</span></div>
                      <div><span className="label">ราคาตีลัง</span><span className="colon"> : </span><span className="value">{trackingDetails.price_crate}</span></div>
                      <div><span className="label">อื่นๆ</span><span className="colon"> : </span><span className="value">{trackingDetails.other}</span></div>
                    </div>
                </div>

                {/* Column 2, Row 2 */}
                <div>
                  <h6 className="text-lg text-center font-semibold mb-2">วันที่</h6>
                    <div className="tracking-details">
                      <div><span className="label">เข้าโกดังจีน</span><span className="colon"> : </span><span className="value">{trackingDetails.in_cn}</span></div>
                      <div><span className="label">ออกโกดังจีน</span><span className="colon"> : </span><span className="value">{trackingDetails.out_cn}</span></div>
                      <div><span className="label">เข้าโกดังไทย</span><span className="colon"> : </span><span className="value">{trackingDetails.in_th}</span></div>
                    </div>
                </div>
              </>
            )
          )}
        </div>

        {/* Footer with Close Button */}
        <div className="p-4 flex justify-center border-t">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTrackDetails;
