import React, { useState, useRef, useEffect } from 'react';
import { Modal } from "antd";
import { Swiper, SwiperSlide } from 'swiper/react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

interface TrackingItem {
  user_id: string;
  tracking_id: string;
  buylist_id: string;
  mnemonics: string;
  lot_type: string;
  type_item: string;
  crate: string;
  check_product: string;
  weight: number;
  wide: number;
  high: number;
  long: number;
  number: number;
  pricing: string;
  cal_price: number;
  user_rate: string;
  in_cn: string;
  out_cn: string;
  in_th: string;
  check_product_price: number;
  new_wrap: number;
  transport: number;
  price_crate: number;
  other: number;
  not_owner: string;
  transport_file_path: string;
  image_item_paths: string[];
}

interface ModalTrackManageProps {
  show: boolean;
  onClose: () => void;
  trackingData: TrackingItem;
}

const ModalTrackManage: React.FC<ModalTrackManageProps> = ({ show, onClose, trackingData }) => {
  const [formData, setFormData] = useState<TrackingItem>(trackingData);
  const [file, setFile] = useState<File | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>(formData.image_item_paths || []);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const swiperRef = useRef<any>(null);
  const [serviceFee, setServiceFee] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData((prev: TrackingItem) => ({
      ...prev,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImageFiles = Array.from(e.target.files);
      setNewImages(prevImages => [...prevImages, ...newImageFiles]);
      setPreviewImages(prevPreviews => [
        ...prevPreviews,
        ...newImageFiles.map(file => URL.createObjectURL(file))
      ]);
    }
  };

  const openImagePreview = (images: string[], index: number) => {
    setPreviewIndex(index);
    setModalOpen(true);
  };

  const handlePreviewClose = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
  
    // Append all other form data fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'image_item_paths' && key !== 'transport_file_path') {
        // Ensure value is not null or undefined before calling toString()
        form.append(key, value != null ? value.toString() : '');
      }
    });
  
    // If no new file is uploaded, retain the existing transport file path
    if (!file && formData.transport_file_path) {
      form.append('transport_file_path', formData.transport_file_path);
    } else if (file) {
      // If a new file is uploaded, append it
      form.append('trackingFile', file);
    }
  
    // If no new images are uploaded, retain the existing image paths
    if (newImages.length === 0 && formData.image_item_paths.length > 0) {
      form.append('existing_image_paths', JSON.stringify(formData.image_item_paths));
    }
  
    // Append new images if uploaded
    if (newImages.length > 0) {
      newImages.forEach((image, index) => {
        form.append('trackingImages', image);
      });
    }
  
    try {
      const response = await fetch(`http://localhost:5000/tracking/${formData.tracking_id}`, {
        method: 'PUT',
        body: form,
      });
  
      if (!response.ok) {
        throw new Error('Failed to update tracking data');
      }
  
      const result = await response.json();
      console.log('Tracking data updated:', result);
      onClose();
    } catch (error) {
      console.error('Error updating tracking data:', error);
    }
  };

  // Function to calculate `cal_price`
  const calculateServiceFee = () => {
    const { pricing, lot_type, user_rate, weight, wide, high, long, number } = formData;
    const volume = (wide * high * long) / 1000000;
    let cal_price = 0;

    if (pricing === "อัตโนมัติ") {
      if (lot_type === "รถ") {
        if (user_rate === "A") {
          cal_price = Math.max(weight * 15, volume * 5900);
        } else if (user_rate === "B") {
          cal_price = Math.max(weight * 20, volume * 6000);
        } else if (user_rate === "C") {
          cal_price = Math.max(weight * 35, volume * 8500);
        }
      } else if (lot_type === "เรือ") {
        if (user_rate === "A") {
          cal_price = Math.max(weight * 10, volume * 3800);
        } else if (user_rate === "B") {
          cal_price = Math.max(weight * 15, volume * 5500);
        } else if (user_rate === "C") {
          cal_price = Math.max(weight * 35, volume * 8500);
        }
      }
    } else if (pricing === "น้ำหนัก") {
      if (lot_type === "รถ") {
        cal_price = user_rate === "A" ? weight * 15 : user_rate === "B" ? weight * 20 : weight * 35;
      } else if (lot_type === "เรือ") {
        cal_price = user_rate === "A" ? weight * 10 : user_rate === "B" ? weight * 15 : weight * 35;
      }
    } else if (pricing === "ปริมาตร") {
      if (lot_type === "รถ") {
        cal_price = user_rate === "A" ? volume * 5900 : user_rate === "B" ? volume * 6000 : volume * 8500;
      } else if (lot_type === "เรือ") {
        cal_price = user_rate === "A" ? volume * 3800 : user_rate === "B" ? volume * 5500 : volume * 8500;
      }
    }

    // Calculate final service fee
    setServiceFee(cal_price * number);
    setFormData((prev) => ({ ...prev, cal_price }));
  };

  useEffect(() => {
    calculateServiceFee();
  }, [
    formData.lot_type,
    formData.user_rate,
    formData.pricing,
    formData.weight,
    formData.wide,
    formData.high,
    formData.long,
    formData.number,
  ]);


  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-12/13 md:w-7/8 lg:w-5/6 xl:w-3/4 max-h-screen overflow-y-auto">
        <header className="modal-header p-4 border-b">
          <h5 className="modal-title text-xl font-bold">แก้ไขพัสดุ</h5>
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
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <label className="flex items-center">
                    สินค้าไม่มีเจ้าของ
                    <input
                      type="checkbox"
                      checked={formData.not_owner === 'true'}
                      onChange={(e) => setFormData(prev => ({ ...prev, not_owner: e.target.checked ? 'true' : 'false' }))}
                      className="ml-2"
                    />
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
                    readOnly // Disable editing for tracking_id, as it's unique
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
                <div className="mb-3">
                  <label htmlFor="user_rate" className="block mb-1">ตีลังไม้:</label>
                  <select
                    id="user_rate"
                    className="w-full p-2 border rounded"
                    value={formData.crate}
                    onChange={handleInputChange}
                  >
                    <option value="ไม่ตี">ไม่ตี</option>
                    <option value="ตี">ตี</option>

                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="user_rate" className="block mb-1">เช็คสินค้า:</label>
                  <select
                    id="user_rate"
                    className="w-full p-2 border rounded"
                    value={formData.check_product}
                    onChange={handleInputChange}
                  >
                    <option value="ไม่เช็ค">ไม่เช็ค</option>
                    <option value="เช็ค">เช็ค</option>

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

              {/* File and Images */}
              <div>
                <h6 className="text-lg font-semibold mb-2">รูปภาพสินค้า/ไฟล์แนบขนส่ง</h6>

                {/* File Input */}
                <div className="mb-3">
                  <label htmlFor="trackingFile" className="block mb-1">แนบไฟล์:</label>
                  <input
                    id="trackingFile"
                    type="file"
                    className="w-full"
                    onChange={handleFileChange}
                  />
                  {file && (
                    <div>
                      <span className="label">ตัวอย่างไฟล์: </span>
                      <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer">
                        {file.name}
                      </a>
                    </div>
                  )}
                  {/* Show existing transport file */}
                  {formData.transport_file_path && (
                    <div>
                      <span className="label">ไฟล์แนบขนส่งที่มีอยู่: </span>
                      <a href={formData.transport_file_path} target="_blank" rel="noopener noreferrer">
                        {formData.transport_file_path.split('/').pop()}
                      </a>
                    </div>
                  )}
                </div>

                {/* Image Input */}
                <div className="mb-3">
                  <label htmlFor="trackingImages" className="block mb-1">แนบรูปภาพ:</label>
                  <input
                    id="trackingImages"
                    type="file"
                    className="w-full"
                    multiple
                    onChange={handleImageChange}
                  />
                  
                  {/* Show image previews (only for new uploads) */}
                  {newImages.length > 0 && (
                    <div>
                      <h6>ตัวอย่างรูปภาพที่เลือกใหม่:</h6>
                      <div className="image-gallery mt-2" style={{ display: 'flex', gap: '10px' }}>
                        {newImages.map((imageFile, index) => (
                          <div
                            key={index}
                            className="image-wrapper"
                            style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                            onClick={() => openImagePreview(previewImages, index)}
                          >
                            <img
                              src={URL.createObjectURL(imageFile)}
                              alt={`Uploaded Image ${index + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Show existing images */}
                {formData.image_item_paths.length > 0 && (
                  <div>
                    <h6>รูปภาพที่มีอยู่:</h6>
                    <div className="image-gallery" style={{ display: 'flex', gap: '10px' }}>
                      {formData.image_item_paths.map((imagePath, index) => (
                        <div
                          key={index}
                          className="image-wrapper"
                          style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                          onClick={() => openImagePreview(formData.image_item_paths, index)}
                        >
                          <img
                            src={imagePath}
                            alt={`Existing Image ${index + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
                </div>
              {/* Additional Costs */}
              <div>
                <h6 className="text-lg font-semibold mb-2">ค่าใช้จ่ายเพิ่มเติม</h6>
                <div className="mb-3">
                  <label htmlFor="cal_price" className="block mb-1">ค่าบริการ:</label>
                  <input
                    id="cal_price"
                    type="text"
                    className="w-full p-2 border rounded"
                    value={(serviceFee || 0).toFixed(2)}
                    readOnly
                  />
                </div>
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

      {/* Image Preview Modal */}
      <Modal
        open={modalOpen}
        footer={null}
        onCancel={handlePreviewClose}
        centered
        width="100%"
        style={{ top: 0, padding: 0 }}
        wrapClassName="custom-full-screen-modal"
        closable={false}
      >
        <div className="modal-mask" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
        }}>
          <div className="modal-container" style={{
            width: "60%",
            background: "#fff",
            borderRadius: "8px",
            padding: "20px",
            position: "relative",
          }}>
            <button
              className="close-button"
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={handlePreviewClose}
            >
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>×</span>
            </button>

            <Swiper
              ref={swiperRef}
              initialSlide={previewIndex}
              onSlideChange={(swiper) => setPreviewIndex(swiper.activeIndex)}
              navigation={false}
              modules={[Navigation]}
            >
              {previewImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`Preview Image ${index + 1}`}
                    className="vue-lightbox-modal-image"
                    style={{ maxWidth: "100%", maxHeight: "calc(100vh - 100px)", objectFit: "contain" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Left Arrow */}
            <button
              className="swiper-button-prev"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (swiperRef.current && swiperRef.current.swiper) {
                  swiperRef.current.swiper.slidePrev();
                }
              }}
            >
              <LeftOutlined style={{ fontSize: "20px" }} />
            </button>

            {/* Right Arrow */}
            <button
              className="swiper-button-next"
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(0, 0, 0, 0.5)",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (swiperRef.current && swiperRef.current.swiper) {
                  swiperRef.current.swiper.slideNext();
                }
              }}
            >
              <RightOutlined style={{ fontSize: "20px" }} />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalTrackManage;