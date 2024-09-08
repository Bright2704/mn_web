import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Modal } from 'antd';  
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/swiper-bundle.css';  
import { LeftOutlined, RightOutlined } from '@ant-design/icons';


interface ModalManageLotProps {
  show: boolean;
  onClose: () => void;
  lotId: string;
}

interface LotData {
  lot_id: string;
  note: string;
  lot_type: string;
  num_item: number;
  file_path?: string;
  image_path?: string;
}

interface TrackingData {
  tracking_id: string;
  weight: number;
  wide: number;
  high: number;
  long: number;
  number: number;
  lot_id: string;
  in_cn: string;
  out_cn: string;
  in_th: string;
  user_id: string;
  type_item: string;
  check_product_price: number;
  transport: number;
  price_crate: number;
  other: number;
  image_item_paths: string[];
  lot_type:string;
}

const ModalManageLot: React.FC<ModalManageLotProps> = ({ show, onClose, lotId }) => {
  const [lotData, setLotData] = useState<LotData>({
    lot_id: '',
    note: '',
    lot_type: '1',
    num_item: 0,
  });
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [isCardExpanded, setIsCardExpanded] = useState<{ [key: number]: boolean }>({});
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // State for selected field and date
  const [selectedField, setSelectedField] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  // Image Preview Modal state
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const swiperRef = useRef<any>(null);

  // searchQuery Modal state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTrackingIds, setFilteredTrackingIds] = useState<string[]>([]);
  const [selectedTracking, setSelectedTracking] = useState<TrackingData | null>(null);



  // Fetch Lot Data
  const refreshData = () => {
    fetch(`http://localhost:5000/lots/${lotId}`)
      .then((response) => response.json())
      .then((data) => {
        setLotData(data);
      })
      .catch((error) => console.error('Error fetching lot data:', error));
  };

  // Fetch Tracking Data
  const fetchTrackingData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/tracking/lot/${lotId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tracking data');
      }
      const data = await response.json();
      setTrackingData(data);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    }
  };

  useEffect(() => {
    if (show && lotId) {
      refreshData();
      fetchTrackingData().then(() => {
        console.log('Tracking data after fetching:', trackingData);
      });
    }
  }, [show, lotId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setLotData({ ...lotData, [id]: value });
  };

  const handleLotTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLotData({ ...lotData, lot_type: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    // Create FormData object for lot update
    const formData = new FormData();
    formData.append('lot_id', lotData.lot_id);
    formData.append('note', lotData.note);
    formData.append('lot_type', lotData.lot_type);
    formData.append('num_item', String(lotData.num_item));
  
    if (file) formData.append('lotFile', file);
    if (image) formData.append('lotImage', image);
  
    try {
      // Update the lot
      const lotResponse = await fetch(`http://localhost:5000/lots/${lotId}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!lotResponse.ok) {
        const errorData = await lotResponse.json();
        throw new Error(errorData.error || 'Failed to update lot');
      }
  
      // If there's a selected tracking, update it as well
      if (selectedTracking) {
        const trackingResponse = await fetch(`http://localhost:5000/tracking/${selectedTracking.tracking_id}/update-lot-id`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newLotId: lotData.lot_id }),
        });
  
        if (!trackingResponse.ok) {
          const errorData = await trackingResponse.json();
          throw new Error(errorData.error || 'Failed to update tracking lot_id');
        }
      }
  
      // Refresh data after updates are successful
      setIsDataUpdated(true);
      refreshData();
      fetchTrackingData();
      setFile(null);
      setImage(null);
      alert('Lot data updated successfully!');
    } catch (error) {
      console.error('Error updating data:', error);
      
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      alert(`Error updating data: ${errorMessage}`);
    }
  };

  const handleClose = () => {
    if (isDataUpdated) {
      onClose();
      window.location.reload(); // Refresh the page
    } else {
      onClose();
    }
  };

  const toggleCard = (cardId: number) => {
    // Toggle the specific card by updating its state
    setIsCardExpanded((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId],
    }));
  };

  // Sum Calculation
  const calculateSum = (key: keyof TrackingData) => {
    return trackingData.reduce((sum, row) => {
      let value = row[key];
      
      // Ensure the value is a number (handle strings, arrays, and undefined values)
      if (typeof value === 'string') {
        value = parseFloat(value);
      } else if (Array.isArray(value)) {
        value = 0; // If it's an array (e.g., `image_item_paths`), we ignore it for summation
      }
  
      const numericValue = typeof value === 'number' && !isNaN(value) ? value : 0;
      return sum + numericValue;
    }, 0);
  };

  // Volume Calculation
  const calculateVolume = (wide: number, long: number, high: number) => (wide * long * high) / 1000;

  // Select All Rows
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]); // Deselect all
    } else {
      setSelectedRows(Array.from(Array(trackingData.length).keys())); // Select all rows
    }
    setAllSelected(!allSelected);
  };

  // Select Individual Row
  const handleSelectRow = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(e.target.value);
    console.log("Selected field:", e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    console.log("Selected date:", e.target.value);
  };


  const handleUpdateTracking = async () => {
    if (!selectedField || !selectedDate) {
      alert("Please select both a field and a date.");
      return;
    }

    const selectedTrackings = selectedRows.map(index => trackingData[index].tracking_id);

    try {
      await Promise.all(
        selectedTrackings.map(async (trackingId) => {
          const response = await fetch(
            `http://localhost:5000/tracking/${trackingId}/updateFields`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ [selectedField]: selectedDate }), 
            }
          );

          if (!response.ok) {
            throw new Error(`Failed to update tracking for ID: ${trackingId}`);
          }
        })
      );

      fetchTrackingData();
    } catch (error) {
      console.error("Error updating tracking data:", error);
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

  // Close image preview modal
  const handlePreviewClose = () => {
    setModalOpen(false);
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value) {
      try {
        const response = await fetch(`http://localhost:5000/tracking/search?q=${value}&lotId=${lotData.lot_id}`);
        const data = await response.json();
        setFilteredTrackingIds(data);
      } catch (error) {
        console.error('Error fetching tracking IDs:', error);
      }
    } else {
      setFilteredTrackingIds([]);
    }
  };

  const handleTrackingSelect = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/tracking/${id}`);
      const tracking = await response.json();
  
      if (tracking.lot_id && tracking.lot_id !== lotData.lot_id) {
        alert(`This tracking ID belongs to a different lot (Lot ID: ${tracking.lot_id}). You can't add it to this lot.`);
      } else {
        setSelectedTracking(tracking);
        setSearchQuery(id);
        setFilteredTrackingIds([]);
      }
    } catch (error) {
      console.error('Error fetching tracking details:', error);
      alert("Error fetching tracking details.");
    }
  };
  
  
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/10 md:w-11/12 max-h-screen overflow-y-auto relative">
        <header className="modal-header">
          <h5 className="modal-title">จัดการล็อตสินค้า</h5>
          <button type="button" className="close" onClick={handleClose}>
            &times;
          </button>
        </header>
        <div className="modal-body p-2">
          <div className="card">
            <div className="header-cardx p-2 flex justify-between items-center">
              <h3 className="mb-0">ล๊อตสินค้า : {lotData.lot_id}</h3>
              <button onClick={() => toggleCard(1)} className="focus:outline-none">
                {isCardExpanded[1] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            {isCardExpanded[1]&& (
              <div className="p-2">
                <div className="row">
                  <div className="col-md-12">
                    <div role="group" className="form-row form-group">
                      <label htmlFor="lot_id" className="col-md col-form-label">หมายเลขรายการ : {lotData.lot_id}</label>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div role="group" className="form-row form-group">
                      <label htmlFor="note" className="col-md-3 col-form-label">หมายเหตุ:</label>
                      <div className="col">
                        <textarea
                          id="note"
                          rows={2}
                          className="form-control"
                          value={lotData.note}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div role="group" className="form-row form-group">
                      <label htmlFor="lot_type" className="col-md-3 col-form-label">ประเภทการขนส่ง:</label>
                      <div className="col">
                        <div className="demo-inline-spacing mt-n1">
                          <div className="custom-control custom-radio">
                            <input
                              type="radio"
                              name="lot_type"
                              className="custom-control-input"
                              value="รถ"
                              id="car-transport"
                              checked={lotData.lot_type === 'รถ'}
                              onChange={handleLotTypeChange}
                            />
                            <label className="custom-control-label" htmlFor="car-transport">
                              รถ
                            </label>
                          </div>
                          <div className="custom-control custom-radio">
                            <input
                              type="radio"
                              name="lot_type"
                              className="custom-control-input"
                              value="เรือ"
                              id="ship-transport"
                              checked={lotData.lot_type === 'เรือ'}
                              onChange={handleLotTypeChange}
                            />
                            <label className="custom-control-label" htmlFor="ship-transport">
                              เรือ
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div role="group" className="form-row form-group">
                      <label htmlFor="num_item" className="col-md-3 col-form-label">จำนวนที่ส่งออก:</label>
                      <div className="col">
                        <input
                          id="num_item"
                          type="number"
                          className="w-25 form-control"
                          value={lotData.num_item}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div role="group" className="form-row form-group">
                      <label htmlFor="file-upload" className="col-md-3 col-form-label">แนบไฟล์:</label>
                      <div className="col">
                        <input
                          id="file-upload"
                          type="file"
                          onChange={handleFileChange}
                          className="form-control-file"
                        />
                        {lotData.file_path && (
                          <a href={`http://localhost:5000${lotData.file_path}`} target="_blank" rel="noopener noreferrer">
                            View current file
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div role="group" className="form-row form-group">
                      <label htmlFor="image-upload" className="col-md-3 col-form-label">แนบรูปภาพ:</label>
                      <div className="col">
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="form-control-file"
                        />
                        {lotData.image_path && (
                          <img src={`http://localhost:5000${lotData.image_path}`} alt="Lot" className="mt-2" style={{ maxWidth: '200px' }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              <div className="absolute bottom-4 right-4">
              <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                บันทึก
              </button>
            </div>
          </div>
          )}
        </div>
      </div>



      {/* Card for adding a tracking ID and showing selected tracking details */}
      <div className="modal-body p-2">
        <div className="card">
          <div className="header-cardx p-2 flex justify-between items-center">
            <h3 className="mb-0">เพิ่มรหัสพัสดุ</h3>
            <button onClick={() => toggleCard(2)} className="focus:outline-none">
              {isCardExpanded[2] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {isCardExpanded[2] && (
            <div className="p-2">
              <div className="row">
                {/* Input for searching tracking ID */}
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

                {/* Display the selected tracking details */}
                {selectedTracking && (
                  <div className="w-full">
                    {/* Two-column grid structure */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Customer Information */}
                      <div className="col-span-1 md:col-span-2">
                        <h6 className="text-lg font-semibold mb-2">ข้อมูลลูกค้า</h6>
                        <div className="mb-3">
                          <label htmlFor="user_id" className="block mb-1">รหัสลูกค้า:</label>
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
                          <label htmlFor="tracking_id" className="block mb-1">รหัสพัสดุ:</label>
                          <input
                            id="tracking_id"
                            className="w-full p-2 border rounded"
                            value={selectedTracking.tracking_id}
                            readOnly
                            type="text"
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="buylist_id" className="block mb-1">หมายเลขใบสั่งซื้อ:</label>
                          <input id="buylist_id" className="w-full p-2 border rounded" value="" type="text" readOnly />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="mnemonics" className="block mb-1">วลีช่วยจำ:</label>
                          <input id="mnemonics" className="w-full p-2 border rounded" value="" type="text" readOnly />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="lot_type" className="block mb-1">การขนส่ง:</label>
                          <select id="lot_type" className="w-full p-2 border rounded" value={selectedTracking.lot_type} disabled>
                            <option value="รถ">รถ</option>
                            <option value="เรือ">เรือ</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="type_item" className="block mb-1">ประเภทสินค้า:</label>
                          <select id="type_item" className="w-full p-2 border rounded" value={selectedTracking.type_item} disabled>
                            <option value="ทั่วไป">ทั่วไป</option>
                            <option value="มอก./อย.">มอก./อย.</option>
                            <option value="พิเศษ">พิเศษ</option>
                          </select>
                        </div>
                        <div>
                            <h6>รูปภาพที่มีอยู่:</h6>
                            <div className="image-gallery" style={{ display: "flex", gap: "10px" }}>
                              {selectedTracking.image_item_paths.map((imagePath, index) => (
                                <div
                                  key={index}
                                  className="image-wrapper"
                                  style={{ width: "50px", height: "50px", cursor: "pointer" }}
                                  onClick={() => openImagePreview(selectedTracking.image_item_paths, index)}
                                >
                                  <img
                                    src={imagePath}
                                    alt={`Image ${index + 1}`}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                          <label htmlFor="weight" className="block mb-1">น้ำหนัก (กก.):</label>
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
                          <label htmlFor="wide" className="block mb-1">กว้าง (ซม.):</label>
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
                          <label htmlFor="high" className="block mb-1">สูง (ซม.):</label>
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
                          <label htmlFor="long" className="block mb-1">ยาว (ซม.):</label>
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
                          <label htmlFor="number" className="block mb-1">จำนวน:</label>
                          <input
                            id="number"
                            className="w-full p-2 border rounded"
                            value={selectedTracking.number}
                            type="number"
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Pricing and Rates */}
                      <div>
                        <h6 className="text-lg font-semibold mb-2">ราคาและอัตรา</h6>
                        <div className="mb-3">
                          <label htmlFor="pricing" className="block mb-1">คิดราคาตาม:</label>
                          <select id="pricing" className="w-full p-2 border rounded" value="อัตโนมัติ" disabled>
                            <option value="อัตโนมัติ">อัตโนมัติ</option>
                            <option value="น้ำหนัก">น้ำหนัก</option>
                            <option value="ปริมาตร">ปริมาตร</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="user_rate" className="block mb-1">เรท:</label>
                          <select id="user_rate" className="w-full p-2 border rounded" value="A" disabled>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="crate" className="block mb-1">ตีลังไม้:</label>
                          <select id="crate" className="w-full p-2 border rounded" value="ไม่ตี" disabled>
                            <option value="ไม่ตี">ไม่ตี</option>
                            <option value="ตี">ตี</option>
                          </select>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="check_product" className="block mb-1">เช็คสินค้า:</label>
                          <select id="check_product" className="w-full p-2 border rounded" value="ไม่เช็ค" disabled>
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
                            className="w-full p-2 border rounded"
                            type="date"
                            value={selectedTracking.in_cn}
                            readOnly
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="out_cn" className="block mb-1">ออกโกดังจีน:</label>
                          <input
                            id="out_cn"
                            className="w-full p-2 border rounded"
                            type="date"
                            value={selectedTracking.out_cn}
                            readOnly
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="in_th" className="block mb-1">เข้าโกดังไทย:</label>
                          <input
                            id="in_th"
                            className="w-full p-2 border rounded"
                            type="date"
                            value={selectedTracking.in_th}
                            readOnly
                          />
                        </div>
                      </div>

                      {/* Additional Costs */}
                      <div>
                        <h6 className="text-lg font-semibold mb-2">ค่าใช้จ่ายเพิ่มเติม</h6>
                        <div className="mb-3">
                          <label htmlFor="check_product_price" className="block mb-1">ค่าเช็คสินค้า:</label>
                          <input
                            id="check_product_price"
                            step="0.01"
                            className="w-full p-2 border rounded"
                            value={selectedTracking.check_product_price}
                            type="number"
                            readOnly
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="transport" className="block mb-1">ค่าขนส่งจีน:</label>
                          <input
                            id="transport"
                            step="0.01"
                            className="w-full p-2 border rounded"
                            value={selectedTracking.transport}
                            type="number"
                            readOnly
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="price_crate" className="block mb-1">ค่าตีลัง:</label>
                          <input
                            id="price_crate"
                            step="0.01"
                            className="w-full p-2 border rounded"
                            value={selectedTracking.price_crate}
                            type="number"
                            readOnly
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="other" className="block mb-1">ค่าอื่นๆ:</label>
                          <input
                            id="other"
                            step="0.01"
                            className="w-full p-2 border rounded"
                            value={selectedTracking.other}
                            type="number"
                            readOnly
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-4 right-4">
                      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                        เพิ่มลงในล็อต
                      </button>
                    </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>


 
       


      {/* Tracking Data Table */}
      <div className="modal-body p-2">
        <div className="card">
          <div className="header-cardx p-2 flex justify-between items-center">
            <h3 className="mb-0">รายการรหัสพัสดุ</h3>
          </div>

          <div className="p-4 flex flex-col border-t">
            <div className="d-flex align-items-center " style={{ display: 'flex', gap: '750px' }}>
              <div className="mb-3" style={{ display: 'flex', gap: '10px' }}>
                <label htmlFor="in_cn" className="block mb-1"></label>
                <input
                    id="in_cn"
                    type="date"
                    className="w-full p-2 border rounded"
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                <label htmlFor="user_rate" className="block mb-1"></label>
                <select
                    id="user_rate"
                    className="w-full p-2 border rounded"
                    value={selectedField}
                    onChange={handleFieldChange}
                  >
                    <option value="in_cn">เข้าโกดังจีน</option>
                    <option value="out_cn">ออกจากจีน</option>
                    <option value="in_th">ถึงไทย</option>
                  </select>
              </div>
              <div className="mb-3" style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={handleUpdateTracking}  // Call the handleUpdateTracking function on click
              >
                บันทึก
              </button>
              <button
                type="button"
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                รีเซ็ต
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                พิมพ์
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                ใบสินค้า
              </button>
              
              </div>
            </div>       
          </div>


          <div className="table-container">
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
                  <th>เข้าโกดังจีน</th>
                  <th>ออกจากจีน</th>
                  <th>ถึงไทย</th>
                  <th>รหัสลูกค้า</th>
                  <th>จำนวน</th>
                  <th>น้ำหนัก</th>
                  <th>กว้าง</th>
                  <th>สูง</th>
                  <th>ยาว</th>
                  <th>คิว.</th>
                  <th>ประเภท</th>
                  <th>เช็คสินค้า</th>
                  <th>ขนส่งจีน</th>
                  <th>อื่นๆ</th>
                  <th>ตีลัง</th>
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
                  <td></td>
                  <td></td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('number')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('weight')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('wide')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('high')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('long')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {trackingData.reduce((sum, row) => sum + calculateVolume(row.wide, row.long, row.high), 0)}
                  </td>
                  <td></td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('check_product_price')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('transport')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('other')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('price_crate')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {trackingData.reduce((sum, row) => sum + row.weight * row.number, 0)}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {trackingData.reduce((sum, row) => sum + calculateVolume(row.wide, row.long, row.high) * row.number, 0)}
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
                      <td>{index + 1}</td>
                      <td>{tracking.tracking_id}</td>
                      <td>
                        <div className="image-gallery" style={{ display: 'flex', gap: '5px' }}>
                            {tracking.image_item_paths.length > 0 ? (
                                tracking.image_item_paths.map((imagePath, i) => (
                                    <div
                                        key={i}
                                        className="image-wrapper"
                                        onClick={() => openImagePreview(tracking.image_item_paths, i)}
                                        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                                    >
                                        <img
                                            src={imagePath}
                                            alt={`Image ${i + 1}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))
                            ) : (
                                <span>No images</span>
                            )}
                        </div>
                      </td>
                      <td>{tracking.in_cn}</td>
                      <td>{tracking.out_cn}</td>
                      <td>{tracking.in_th}</td>
                      <td>{tracking.user_id}</td>
                      <td>{tracking.number}</td>
                      <td>{tracking.weight}</td>
                      <td>{tracking.wide}</td>
                      <td>{tracking.high}</td>
                      <td>{tracking.long}</td>
                      <td>{calculateVolume(tracking.wide, tracking.long, tracking.high)}</td>
                      <td>{tracking.type_item}</td>
                      <td>{tracking.check_product_price}</td>
                      <td>{tracking.transport}</td>
                      <td>{tracking.other}</td>
                      <td>{tracking.price_crate}</td>
                      <td>{tracking.weight * tracking.number}</td>
                      <td>{calculateVolume(tracking.wide, tracking.long, tracking.high) * tracking.number}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={20}>No tracking data available for this lot.</td>
                  </tr>
                )}
                <tr className="text-center">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('number')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('weight')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('wide')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('high')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('long')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {trackingData.reduce((sum, row) => sum + calculateVolume(row.wide, row.long, row.high), 0)}
                  </td>
                  <td></td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('check_product_price')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('transport')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('other')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {calculateSum('price_crate')}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {trackingData.reduce((sum, row) => sum + row.weight * row.number, 0)}
                  </td>
                  <td style={{ backgroundColor: 'rgb(255, 167, 163)' }}>
                    {trackingData.reduce((sum, row) => sum + calculateVolume(row.wide, row.long, row.high) * row.number, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
            
            {/* Image Preview Modal */}
            <Modal open={modalOpen} footer={null} onCancel={handlePreviewClose} centered>
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
                                alt={`Preview ${index + 1}`}
                                style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Left Arrow */}
                <button
                    className="swiper-button-prev"
                    style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: '10px',
                        cursor: 'pointer',
                    }}
                    onClick={() => swiperRef.current?.swiper?.slidePrev()}
                >
                    <LeftOutlined />
                </button>

                {/* Right Arrow */}
                <button
                    className="swiper-button-next"
                    style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                        borderRadius: '50%',
                        padding: '10px',
                        cursor: 'pointer',
                    }}
                    onClick={() => swiperRef.current?.swiper?.slideNext()}
                >
                    <RightOutlined />
                </button>
            </Modal>


          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default ModalManageLot;
