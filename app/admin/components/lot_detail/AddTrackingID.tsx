import React, { useState, useRef } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip } from "antd";
import Image from "next/image";
import { LotData, TrackingData } from "./types";

interface AddTrackingIDProps {
  lotData: LotData;
  refreshData: () => void;
  fetchTrackingData: () => void;
}

const AddTrackingID: React.FC<AddTrackingIDProps> = ({
  lotData,
  refreshData,
  fetchTrackingData,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTrackingIds, setFilteredTrackingIds] = useState<string[]>([]);
  const [selectedTracking, setSelectedTracking] = useState<TrackingData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image Preview Modal state
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const swiperRef = useRef<any>(null);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setError(null);

    if (value) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5001/tracking/search?q=${value}&lotId=null` // Changed to only search for null lot_id
        );
        if (!response.ok) throw new Error('Failed to search tracking IDs');
        const data = await response.json();
        setFilteredTrackingIds(data);
      } catch (error) {
        console.error("Error fetching tracking IDs:", error);
        setError('Error searching tracking IDs');
        setFilteredTrackingIds([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setFilteredTrackingIds([]);
    }
  };

  const handleTrackingSelect = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:5001/tracking/${id}`);
      if (!response.ok) throw new Error("Failed to fetch tracking details");
      const tracking = await response.json();

      if (tracking.lot_id && tracking.lot_id !== lotData.lot_id) {
        throw new Error(
          `This tracking ID belongs to Lot ID: ${tracking.lot_id}`
        );
      }

      setSelectedTracking(tracking);
      setSearchQuery(id);
      setFilteredTrackingIds([]);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Error fetching tracking details"
      );
      setSelectedTracking(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTracking) return;

    try {
      setIsLoading(true);
      setError(null);

      // Update tracking to associate with the current lot
      const trackingResponse = await fetch(
        `http://localhost:5001/tracking/${selectedTracking.tracking_id}/update-lot-id`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newLotId: lotData.lot_id }),
        }
      );

      if (!trackingResponse.ok) {
        const errorData = await trackingResponse.json();
        throw new Error(errorData.error || "Failed to update tracking");
      }

      // Refresh parent data and clear selected tracking
      await Promise.all([fetchTrackingData(), refreshData()]);
      setSelectedTracking(null); // Clear the selected tracking data
      setSearchQuery(""); // Clear the search input
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error ? error.message : "Error updating tracking"
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Open image preview function
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
  const renderTrackingDetails = () => {
    if (!selectedTracking) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* Customer Information */}
        <div className="col-span-1 md:col-span-2">
          <h6 className="text-lg font-semibold mb-2">ข้อมูลลูกค้า</h6>
          <div className="mb-3">
            <label htmlFor="user_id" className="block mb-1">
              รหัสลูกค้า:
            </label>
            <input
              id="user_id"
              className="w-full p-2 border rounded"
              value={selectedTracking.user_id}
              readOnly
              type="text"
            />
          </div>
          <div className="mb-3">
            <label className="flex items-center">
              สินค้าไม่มีเจ้าของ
              <input className="ml-2" type="checkbox" disabled />
            </label>
          </div>
        </div>

        {/* Parcel Information */}
        <div>
          <h6 className="text-lg font-semibold mb-2">ข้อมูลพัสดุ</h6>
          <div className="mb-3">
            <label htmlFor="tracking_id" className="block mb-1">
              รหัสพัสดุ:
            </label>
            <input
              id="tracking_id"
              className="w-full p-2 border rounded"
              value={selectedTracking.tracking_id}
              readOnly
              type="text"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="buylist_id" className="block mb-1">
              หมายเลขใบสั่งซื้อ:
            </label>
            <input
              id="buylist_id"
              className="w-full p-2 border rounded"
              value=""
              type="text"
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="mnemonics" className="block mb-1">
              วลีช่วยจำ:
            </label>
            <input
              id="mnemonics"
              className="w-full p-2 border rounded"
              value=""
              type="text"
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lot_type" className="block mb-1">
              การขนส่ง:
            </label>
            <select
              id="lot_type"
              className="w-full p-2 border rounded"
              value={selectedTracking.lot_type}
              disabled
            >
              <option value="รถ">รถ</option>
              <option value="เรือ">เรือ</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="type_item" className="block mb-1">
              ประเภทสินค้า:
            </label>
            <select
              id="type_item"
              className="w-full p-2 border rounded"
              value={selectedTracking.type_item}
              disabled
            >
              <option value="ทั่วไป">ทั่วไป</option>
              <option value="มอก./อย.">มอก./อย.</option>
              <option value="พิเศษ">พิเศษ</option>
            </select>
          </div>
          <div>
            <h6>รูปภาพที่มีอยู่:</h6>
            <div
              className="image-gallery"
              style={{ display: "flex", gap: "10px" }}
            >
              {selectedTracking.image_item_paths.map((imagePath, index) => (
                <div
                  key={index}
                  className="image-wrapper"
                  style={{
                    width: "50px",
                    height: "50px",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    openImagePreview(selectedTracking.image_item_paths, index)
                  }
                >
                  <Image
                    src={imagePath}
                    alt={`Image ${index + 1}`}
                    layout="responsive"
                    width={100}
                    height={100}
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div>
          <h6 className="text-lg font-semibold mb-2">รายละเอียดพัสดุ</h6>
          <div className="mb-3">
            <label htmlFor="weight" className="block mb-1">
              น้ำหนัก (กก.):
            </label>
            <input
              id="weight"
              step="0.01"
              className="w-full p-2 border rounded"
              value={selectedTracking.weight}
              type="number"
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="wide" className="block mb-1">
              กว้าง (ซม.):
            </label>
            <input
              id="wide"
              step="0.01"
              className="w-full p-2 border rounded"
              value={selectedTracking.wide}
              type="number"
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="high" className="block mb-1">
              สูง (ซม.):
            </label>
            <input
              id="high"
              step="0.01"
              className="w-full p-2 border rounded"
              value={selectedTracking.high}
              type="number"
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="long" className="block mb-1">
              ยาว (ซม.):
            </label>
            <input
              id="long"
              step="0.01"
              className="w-full p-2 border rounded"
              value={selectedTracking.long}
              type="number"
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="number" className="block mb-1">
              จำนวน:
            </label>
            <input
              id="number"
              className="w-full p-2 border rounded"
              value={selectedTracking.number}
              type="number"
              readOnly
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-body p-4">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 flex justify-between items-center border-b">
          <h3 className="text-lg font-semibold">เพิ่มรหัสพัสดุ</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="focus:outline-none hover:bg-gray-100 p-2 rounded"
          >
            {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </button>
        </div>

        {isExpanded && (
          <div className="p-4">
            <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search tracking ID"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full p-2 border rounded"
                    />
                    {/* Dropdown for suggestions */}
                    {filteredTrackingIds.length > 0 && (
                      <ul className="absolute z-10 w-full bg-white border rounded shadow-md max-h-60 overflow-y-auto">
                        {filteredTrackingIds.map((id, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleTrackingSelect(id)}
                          >
                            {id}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

            {renderTrackingDetails()}

            {selectedTracking && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? "กำลังเพิ่ม..." : "เพิ่มลงในล็อต"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddTrackingID;
