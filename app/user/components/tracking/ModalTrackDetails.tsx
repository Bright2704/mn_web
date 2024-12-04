import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from "antd";
import { Swiper, SwiperSlide } from 'swiper/react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';

interface ModalTrackDetailsProps {
  show: boolean;
  onClose: () => void;
  trackingId: string;
}

const ModalTrackDetails: React.FC<ModalTrackDetailsProps> = ({ show, onClose, trackingId }) => {
  const [trackingDetails, setTrackingDetails] = useState<any>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (show && trackingId) {
      setLoading(true);
      axios
        .get(`http://localhost:5001/tracking/${trackingId}`)
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

  const openImagePreview = (images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setModalOpen(true);
    setTimeout(() => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideTo(index); 
      }
    }, 0);
  };

  const handlePreviewClose = () => {
    setModalOpen(false);
  };

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
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            trackingDetails && (
              <>
                {/* Column 1 - Parcel Information */}
                <div >
                  <h6 className="text-lg text-center font-semibold mb-2">ข้อมูลพัสดุ</h6>
                  <div className="tracking-details" >
                    <div><span className="label" >รหัสพัสดุ</span><span className="colon" > : </span><span className="value">{trackingDetails.tracking_id}</span></div>
                    <div><span className="label">จำนวน</span><span className="colon"> : </span><span className="value">{trackingDetails.number}</span></div>
                    <div><span className="label">หมายเลขใบสั่งซื้อ</span><span className="colon"> : </span><span className="value">{trackingDetails.buylist_id}</span></div>
                    <div><span className="label">วลีช่วยจำ</span><span className="colon"> : </span><span className="value">{trackingDetails.mnemonics}</span></div>
                    <div><span className="label">การขนส่ง</span><span className="colon"> : </span><span className="value">{trackingDetails.lot_type}</span></div>
                    <div><span className="label">ประเภทสินค้า</span><span className="colon"> : </span><span className="value">{trackingDetails.type_item}</span></div>
                    <div><span className="label">ตีลังไม้</span><span className="colon"> : </span><span className="value">{trackingDetails.crate}</span></div>
                    <div><span className="label">เช็คสินค้า</span><span className="colon"> : </span><span className="value">{trackingDetails.check_product}</span></div>
                    <div><span className="label">หมายเหตุ</span><span className="colon"> : </span><span className="value">{trackingDetails.note}</span></div>
                    <div className="ant-form-item-control mt-2">
                      <div className="ant-col ant-form-item-control-input-content"></div>
                        <div className="image-gallery" style={{ display: 'flex', gap: '2px', justifyItems: 'center' }}>
                        {Array.isArray(trackingDetails.image_item_paths) && trackingDetails.image_item_paths.length > 0 ? (
                          trackingDetails.image_item_paths.map((imagePath: string, index: number) => (
                            <div
                              className="image-wrapper"
                              key={index}
                              style={{
                                width: '50px',
                                height: '50px',
                                position: 'relative',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                cursor: 'pointer',
                              }}
                              onClick={() => openImagePreview(trackingDetails.image_item_paths, index)}
                            >
                              <img
                                className="image"
                                src={imagePath}
                                alt={`Product Image ${index + 1}`}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  transition: 'transform 0.3s ease',
                                }}
                              />
                            </div>
                          ))
                        ) : (
                          <span></span>
                        )}
                      </div>
                      </div>
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


        <div className="p-4 flex justify-center border-t">
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            ปิดหน้าต่าง
          </button>
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
                      alt={`Product Image ${index + 1}`}
                      className="vue-lightbox-modal-image"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "calc(100vh - 100px)",
                        objectFit: "contain",
                      }}
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
    </div>
  );
};

export default ModalTrackDetails;
