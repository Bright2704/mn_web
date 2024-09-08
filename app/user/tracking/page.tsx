"use client";

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import "../../../styles/globals.css";
import ModalAddTrack from "../components/tracking/ModalAddTrack";
import ModalTrackDetails from "../components/tracking/ModalTrackDetails";
import { Modal } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react'; 
import { Navigation } from 'swiper/modules'; 
import 'swiper/swiper-bundle.css';

type TrackingItem = {
  user_id: string;
  tracking_id: string;
  lot_id: string;
  order_lot: string;
  lot_type: string;
  type_item: string;
  pricing: string;
  cal_price: number;
  transport: number;
  crate: string;
  check_product: string;
  in_cn: string;
  out_cn: string;
  in_th: string;
  status: string;
  mnemonics: string;
  note: string;
  bill_id: string;
  number: number;
  image_item_paths: string[];
  weight: number;
  wide: number;
  high: number;
  long: number;
  buylist_id: string;
  user_rate: string;
  check_product_price: number;
  new_wrap: number;
  price_crate: number;
  other: number;
  not_owner: string;
};

const statuses = [
  { label: "สถานะทั้งหมด", value: "all" },
  { label: "รอเข้าโกดังจีน", value: "รอเข้าโกดังจีน" },
  { label: "เข้าโกดังจีน", value: "เข้าโกดังจีน" },
  { label: "ออกจากจีน", value: "ออกจากจีน" },
  { label: "ถึงไทย", value: "ถึงไทย" },
  { label: "รอชำระเงิน", value: "รอชำระเงิน" },
  { label: "เตรียมส่ง", value: "เตรียมส่ง" },
  { label: "ส่งแล้ว", value: "ส่งแล้ว" },
];

const searchTopics = [
  { label: "เลขพัสดุ", value: "tracking_id" },
  { label: "รหัสผู้ใช้", value: "user_id" },
];

const VerticalTimeline = ({ events }: { events: { title: string; date: string }[] }) => {
  return (
    <div className="flex justify-center">
      <ul className="relative app-timeline">
        {events.map((event, index) => (
          <li key={index} className="timeline-item">
            {/* Timeline marker */}
            <span className={`fixed-marker ${index === 0 ? 'fixed-marker-filled' : 'fixed-marker-empty'}`}></span>
            {/* Timeline content */}
            <div className="timeline-content">
              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
              <time className="text-sm font-normal leading-none text-gray-400">{event.date}</time>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TrackPage: React.FC = () => {
  const [allTrackingItems, setAllTrackingItems] = useState<TrackingItem[]>([]);
  const [trackingItems, setTrackingItems] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTopic, setSearchTopic] = useState<keyof TrackingItem>("tracking_id");
  const [showModalAddTrack, setShowModalAddTrack] = useState<boolean>(false);
  const [showModalManageTrack, setShowModalManageTrack] = useState<boolean>(false);
  const [selectedTrackingItem, setSelectedTrackingItem] = useState<TrackingItem | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const swiperRef = useRef<any>(null); // Ref for the Swiper instance

  useEffect(() => {
    const fetchTrackingItems = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/tracking");
        if (!response.ok) {
          throw new Error("Failed to fetch tracking data");
        }
        const data = await response.json();
        setAllTrackingItems(data);
        setTrackingItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tracking items:", error);
        setError("Failed to fetch tracking data");
        setLoading(false);
      }
    };

    fetchTrackingItems();
  }, []);

  useEffect(() => {
    if (selectedStatus === "all") {
      setTrackingItems(allTrackingItems);
    } else {
      const filteredItems = allTrackingItems.filter((item) => item.status === selectedStatus);
      setTrackingItems(filteredItems);
    }
  }, [selectedStatus, allTrackingItems]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm) {
      setTrackingItems(allTrackingItems);
      return;
    }

    const filteredItems = allTrackingItems.filter((item) => {
      const value = item[searchTopic];
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });

    setTrackingItems(filteredItems);
  };

  const handleManageClick = (item: TrackingItem) => {
    setSelectedTrackingItem(item);
    setShowModalManageTrack(true);
  };

  const openImagePreview = (images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setModalOpen(true);

    setTimeout(() => {
      if (swiperRef.current && swiperRef.current.swiper) {
        swiperRef.current.swiper.slideTo(index); // Go to the clicked image
      }
    }, 0);
  };

  const handlePreviewClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">รหัสพัสดุ</h3>
        <div className="d-flex align-items-center">
          <input
            type="text"
            placeholder="ค้นหา"
            className="anan-input__input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="w-50 ml-1 custom-select custom-select-sm"
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value as keyof TrackingItem)}
          >
            <option value="tracking_id">เลขพัสดุ</option>
            <option value="user_id">รหัสผู้ใช้</option>
          </select>
          <button type="submit" className="btn btn-outline-secondary ml-2 w-15" onClick={handleSearch}>
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>

      {/* Navigation panel for status filtering */}
      <div className="nav-panel">
        <div className="anan-tabs__nav">
          <div className="anan-tabs__nav-warp px-2 table-container" style={{ marginTop: "5px" }}>
            <div className="anan-tabs__nav-tabs">
              {statuses.map((status) => (
                <div
                  key={status.value}
                  className={`anan-tabs__nav-tab ${selectedStatus === status.value ? "active" : ""}`}
                  onClick={() => setSelectedStatus(status.value)}
                >
                  <span>{status.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 table-container">
        <div className="p-1">
          <div className="flex mb-4">
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => setShowModalAddTrack(true)}
            >
              เพิ่มรหัสพัสดุ
            </button>
          </div>
        </div>
        <table className="table table-width-1">
          <thead>
            <tr className="text-center">
              <th>รายละเอียด</th>
              <th>คำนวณราคา</th>
              <th>สถานะขนส่ง</th>
              <th>ออกบิล</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {trackingItems.map((item) => {
              const events = [];
              
              if (item.bill_id) {
                events.push({ date: item.bill_id, title: "นำออกแล้ว" });
              }
              if (item.in_th) {
                events.push({ date: item.in_th, title: "ถึงไทย" });
              }
              if (item.out_cn) {
                events.push({ date: item.out_cn, title: "ออกจากจีน" });
              }
              if (item.in_cn) {
                events.push({ date: item.in_cn, title: "เข้าโกดังจีน" });
              }
            
              return (
                <tr key={item.tracking_id} className="ant-table-row ant-table-row-level-0 table-row-dark">
                  <td className="ant-table-cell header-center f-small line-height-item">
                    <div className="tracking-details-container">
                      <div className="tracking-details">
                        <div><span className="label">รหัสผู้ใช้</span><span className="colon">:</span><span className="value">{item.user_id}</span></div>
                        <div><span className="label">หมายเลขใบสั่งซื้อ</span><span className="colon">:</span><span className="value">{item.buylist_id}</span></div>
                        <div><span className="label">รหัสพัสดุ</span><span className="colon">:</span><span className="value">{item.tracking_id}</span></div>
                        <div><span className="label">ล็อต/ลำดับ</span><span className="colon">:</span><span className="value">{item.lot_type} {item.order_lot}</span></div>
                        <div><span className="label">ประเภท</span><span className="colon">:</span><span className="value">{item.type_item}</span></div>
                        <div><span className="label">วลีช่วยจำ</span><span className="colon">:</span><span className="value">{item.mnemonics}</span></div>
                        <div><span className="label">หมายเหตุ</span><span className="colon">:</span><span className="value">{item.note}</span></div>
                      </div>
                    </div>
                  </td>

                  <td className="ant-table-cell header-center f-small line-height-item">
                    <div className="tracking-details-container">
                      <div className="tracking-details">
                        <div><span className="label">กว้างxยาวxสูง (ซม.)</span><span className="colon">:</span><span className="value">({item.wide} X {item.long} X {item.high})</span></div>
                        <div><span className="label">น้ำหนัก (กิโล.)</span><span className="colon">:</span><span className="value">({item.weight} X {item.number})</span></div>
                        <div><span className="label">จำนวน</span><span className="colon">:</span><span className="value">{item.number}</span></div>
                        <div><span className="label">คิดราคาแบบ {item.pricing} </span><span className="colon">:</span><span className="value">{item.cal_price}</span></div>
                        
                        <div className="ant-form-item-control mt-2">
                          <div className="ant-col ant-form-item-control-input-content">
                            <div className="image-gallery" style={{ display: 'flex', gap: '2px', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', justifyItems: 'center' }}>
                              {Array.isArray(item.image_item_paths) && item.image_item_paths.length > 0 ? (
                                item.image_item_paths.map((imagePath: string, index: number) => (
                                  <div
                                    className="image-wrapper"
                                    key={index}
                                    style={{
                                      width: '50px',
                                      height: '50px',
                                      position: 'relative',
                                      // overflow: 'hidden',
                                      borderRadius: '8px',
                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                      cursor: 'pointer',
                                    }}
                                    onClick={() => openImagePreview(item.image_item_paths, index)}
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
                    </div>
                  </td>

                  <td className="ant-table-cell header-center tracking small p-1">
                    <VerticalTimeline events={events} />
                  </td>

                  <td className="ant-table-cell header-center small" style={{ textAlign: "center" }}>
                    <a href={`/export/${item.bill_id}`}>{item.bill_id}</a>
                  </td>

                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => handleManageClick(item)}>
                      จัดการ
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="demo-spacing-0 d-flex justify-content-end">
          <ul className="pagination mb-0"></ul>
        </div>
      </div>

      {/* Show ModalAddTrack */}
      <ModalAddTrack show={showModalAddTrack} onClose={() => setShowModalAddTrack(false)} />

      {/* Show ModalTrackDetails */}
      {selectedTrackingItem && (
        <ModalTrackDetails
        show={showModalManageTrack}
        onClose={() => setShowModalManageTrack(false)}
        trackingId={selectedTrackingItem?.tracking_id}  // Pass the tracking_id here
      />
      )}

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
            {/* Close Button */}
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

            <div className="vue-lightbox-content">
              <div className="vue-lightbox-figure">
              <Swiper
                ref={swiperRef}  // Ensure the ref is passed here
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
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TrackPage;
