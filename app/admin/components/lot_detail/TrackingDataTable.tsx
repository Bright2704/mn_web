import React, { useState, useRef } from 'react';
import { Modal,Tooltip } from "antd";
import Image from "next/image";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { LotData, TrackingData } from './types';

interface TrackingDataTableProps {
  lotData: LotData;
  trackingData: TrackingData[];
  fetchTrackingData: () => void;
}

const TrackingDataTable: React.FC<TrackingDataTableProps> = ({
  lotData,
  trackingData,
  fetchTrackingData
}) => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedField, setSelectedField] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<any>(null);

  const calculateVolume = (wide: number, long: number, high: number) => 
    (wide * long * high) / 1000000;

  const calculateSum = (key: keyof TrackingData) => {
    return trackingData.reduce((sum, row) => {
      let value = row[key];
      if (typeof value === "string") value = parseFloat(value);
      if (Array.isArray(value)) value = 0;
      return sum + (typeof value === "number" && !isNaN(value) ? value : 0);
    }, 0);
  };

  const handleSelectAll = () => {
    setSelectedRows(allSelected ? [] : Array.from(Array(trackingData.length).keys()));
    setAllSelected(!allSelected);
  };

  const handleSelectRow = (index: number) => {
    setSelectedRows(
      selectedRows.includes(index) 
        ? selectedRows.filter(i => i !== index)
        : [...selectedRows, index]
    );
  };

  const handleUpdateTracking = async () => {
    if (!selectedField || !selectedDate) {
      setError("Please select both a field and a date");
      return;
    }
  
    try {
      setIsLoading(true);
      setError(null);
  
      await Promise.all(
        selectedRows.map(async (index) => {
          const tracking = trackingData[index];
  
          // Determine the new status dynamically, including the selectedField
          let newStatus = "wait_cn"; // Default status
          if (selectedField === "in_cn" || tracking.in_cn) newStatus = "in_cn";
          if (selectedField === "out_cn" || tracking.out_cn) newStatus = "out_cn";
          if (selectedField === "in_th" || tracking.in_th) newStatus = "in_th";
  
          // Update the selected field with the new date and adjust the status
          const response = await fetch(
            `http://localhost:5000/tracking/${tracking.tracking_id}/updateFields`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                [selectedField]: selectedDate,
                status: newStatus,
                lot_order: index + 1,
              }),
            }
          );
  
          if (!response.ok) {
            throw new Error(`Failed to update tracking ${tracking.tracking_id}`);
          }
        })
      );
  
      // Refresh table data
      await fetchTrackingData();
      setSelectedRows([]); // Clear selected rows
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error updating tracking data");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleRemoveFromLot = async () => {
    if (selectedRows.length === 0) {
      setError("Please select items to remove");
      return;
    }
  
    try {
      setIsLoading(true);
      setError(null);
  
      await Promise.all(
        selectedRows.map(async (index) => {
          const trackingId = trackingData[index].tracking_id;
  
          await fetch(
            `http://localhost:5000/tracking/${trackingId}/removeFromLot`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lot_id: null,
                lot_order: null,
                in_cn: null,
                out_cn: null,
                in_th: null,
                status: "wait_cn",
              }),
            }
          );
        })
      );
  
      // Refresh table data
      await fetchTrackingData();
      setSelectedRows([]); // Clear selected rows
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error removing items");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const handleReset = async () => {
    if (selectedRows.length === 0) {
      setError("Please select items to reset");
      return;
    }
  
    try {
      setIsLoading(true);
      setError(null);
  
      await Promise.all(
        selectedRows.map(async (index) => {
          const trackingId = trackingData[index].tracking_id;
  
          await fetch(
            `http://localhost:5000/tracking/${trackingId}/resetDates`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                in_cn: null,
                out_cn: null,
                in_th: null,
                status: "wait_cn",
              }),
            }
          );
        })
      );
  
      // Refresh table data
      await fetchTrackingData();
      setSelectedRows([]); // Clear selected rows
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "Error resetting dates");
    } finally {
      setIsLoading(false);
    }
  };
  

  const openImagePreview = (images: string[], index: number) => {
    setPreviewImages(images);
    setPreviewIndex(index);
    setModalOpen(true);
    setTimeout(() => {
      if (swiperRef.current?.swiper) {
        swiperRef.current.swiper.slideTo(index);
      }
    }, 0);
  };

  return (
    <div className="modal-body p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">รายการรหัสพัสดุ</h3>
        </div>

        <div className="p-4">
          {/* Controls section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex gap-2 items-center">
              <input
                type="date"
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={isLoading}
              />
              <select
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Select field</option>
                <option value="in_cn">เข้าโกดังจีน</option>
                <option value="out_cn">ออกจากจีน</option>
                <option value="in_th">ถึงไทย</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleUpdateTracking}
                disabled={isLoading}
              >
                บันทึก
              </button>
              <button
                className={`px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleReset}
                disabled={isLoading}
              >
                รีเซ็ต
              </button>
              <button
                className={`px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleRemoveFromLot}
                disabled={isLoading}
              >
                นำออกจากล็อต
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                พิมพ์
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                ใบสินค้า
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
          <table className="table table-width-1" style={{ fontSize: 14 }}>
                <thead>
                  <tr className="text-center">
                    <th>
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>ลำดับ</th>
                    <th>รหัสพัสดุ</th>
                    <th>รูปภาพ</th>
                    <th>รหัสสมาชิก</th>
                    <th>วลีช่วยจำ</th>
                    <th>จำนวน</th>
                    <th>น้ำหนัก</th>
                    <th>กว้าง</th>
                    <th>สูง</th>
                    <th>ยาว</th>
                    <th>คิว.</th>
                    <th>ประเภท</th>

                    <th>
                      
                        ค่าบริการ 
                    </th>

                    <th>เข้าโกดังจีน</th>
                    <th>ออกจากจีน</th>
                    <th>ถึงไทย</th>
                    <th>ราคากิโล</th>
                    <th>ราคาคิว</th>
                  </tr>
                </thead>

                <tbody>
                  {/* Summary Row */}
                  <tr className="text-center">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {calculateSum("number")}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {calculateSum("weight")}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {calculateSum("wide")}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {calculateSum("high")}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {calculateSum("long")}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {trackingData.reduce(
                        (sum, row) =>
                          sum + calculateVolume(row.wide, row.long, row.high),
                        0
                      )}
                    </td>
                    <td></td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {(
                        calculateSum("check_product_price") +
                        calculateSum("new_wrap") +
                        calculateSum("transport") +
                        calculateSum("price_crate") +
                        calculateSum("other")
                      ).toFixed(2)}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {trackingData.reduce(
                        (sum, row) =>
                          sum +
                          (row.type_cal === "weightPrice"
                            ? row.cal_price * row.number
                            : 0),
                        0
                      )}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {trackingData.reduce(
                        (sum, row) =>
                          sum +
                          (row.type_cal === "weightPrice"
                            ? 0
                            : row.cal_price * row.number),
                        0
                      )}
                    </td>
                  </tr>
                  {/* Data Rows */}
                  {trackingData.length > 0 ? (
                    trackingData.map((tracking, index) => (
                      <tr key={index} className="text-center">
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(index)}
                            onChange={() => handleSelectRow(index)}
                          />
                        </td>
                        <td>
                          {index+1}
                        </td>
                        <td>{tracking.tracking_id}</td>
                        <td>
                          <div
                            className="image-gallery"
                            style={{ display: "flex", gap: "5px" }}
                          >
                            {tracking.image_item_paths.length > 0 ? (
                              tracking.image_item_paths.map((imagePath, i) => (
                                <div
                                  key={i}
                                  className="image-wrapper"
                                  onClick={() =>
                                    openImagePreview(
                                      tracking.image_item_paths,
                                      i
                                    )
                                  }
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    cursor: "pointer",
                                  }}
                                >
                                  <Image
                                    src={imagePath}
                                    alt={`Image ${i + 1}`}
                                    layout="responsive"
                                    width={100}
                                    height={100}
                                    objectFit="cover"
                                  />
                                </div>
                              ))
                            ) : (
                              <span>No images</span>
                            )}
                          </div>
                        </td>
                        <td></td>
                        <td>{tracking.mnemonics}</td>
                        <td>{tracking.number}</td>
                        <td>{tracking.weight}</td>
                        <td>{tracking.wide}</td>
                        <td>{tracking.high}</td>
                        <td>{tracking.long}</td>
                        <td>
                          {calculateVolume(
                            tracking.wide,
                            tracking.long,
                            tracking.high
                          )}
                        </td>
                        <td>{tracking.type_item}</td>
                        <td>
                          <Tooltip
                            title={
                              <div>
                                <p>
                                  ค่าเช็คสินค้า:{" "}
                                  {tracking.check_product_price?.toFixed(2)}
                                </p>
                                <p>
                                  ค่าห่อใหม่: {tracking.new_wrap?.toFixed(2)}
                                </p>
                                <p>
                                  ค่าขนส่งจีน: {tracking.transport?.toFixed(2)}
                                </p>
                                <p>
                                  ค่าตีลัง: {tracking.price_crate?.toFixed(2)}
                                </p>
                                <p>ค่าอื่นๆ: {tracking.other?.toFixed(2)}</p>
                              </div>
                            }
                          >
                            {(
                              tracking.check_product_price +
                              tracking.new_wrap +
                              tracking.transport +
                              tracking.price_crate +
                              tracking.other
                            ).toFixed(2)}{" "}
                          </Tooltip>
                        </td>
                        <td>{tracking.in_cn}</td>
                        <td>{tracking.out_cn}</td>
                        <td>{tracking.in_th}</td>
                        <td>
                          {tracking.type_cal === "weightPrice"
                            ? tracking.cal_price * tracking.number
                            : 0}
                        </td>
                        <td>
                          {tracking.type_cal === "weightPrice"
                            ? 0
                            : tracking.cal_price * tracking.number}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={20}>
                        No tracking data available for this lot.
                      </td>
                    </tr>
                  )}
                  <tr className="text-center">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {calculateSum("number")}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {calculateSum("weight")}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {calculateSum("wide")}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {calculateSum("high")}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {calculateSum("long")}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {trackingData.reduce(
                        (sum, row) =>
                          sum + calculateVolume(row.wide, row.long, row.high),
                        0
                      )}
                    </td>
                    <td></td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {(
                        calculateSum("check_product_price") +
                        calculateSum("new_wrap") +
                        calculateSum("transport") +
                        calculateSum("price_crate") +
                        calculateSum("other")
                      ).toFixed(2)}
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {trackingData.reduce(
                        (sum, row) =>
                          sum +
                          (row.type_cal === "weightPrice"
                            ? row.cal_price * row.number
                            : 0),
                        0
                      )}
                    </td>
                    <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                      {trackingData.reduce(
                        (sum, row) =>
                          sum +
                          (row.type_cal === "weightPrice"
                            ? 0
                            : row.cal_price * row.number),
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        </div>

        {/* Image Preview Modal */}
        <Modal
          open={modalOpen}
          footer={null}
          onCancel={() => setModalOpen(false)}
          centered
          width="80%"
          bodyStyle={{ padding: 0 }}
        >
          <div className="relative">
            <Swiper
              ref={swiperRef}
              initialSlide={previewIndex}
              onSlideChange={(swiper) => setPreviewIndex(swiper.activeIndex)}
              navigation={false}
              modules={[Navigation]}
              className="w-full"
            >
              {previewImages.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full" style={{ height: '80vh' }}>
                    <Image
                      src={image}
                      alt={`Preview ${index + 1}`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 focus:outline-none"
              onClick={() => swiperRef.current?.swiper?.slidePrev()}
            >
              <LeftOutlined />
            </button>

            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 focus:outline-none"
              onClick={() => swiperRef.current?.swiper?.slideNext()}
            >
              <RightOutlined />
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default TrackingDataTable;