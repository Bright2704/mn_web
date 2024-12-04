"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Head from "next/head";
import axios from "axios";
import { Row, Col, Button, Tooltip } from "antd";
import { UserOutlined } from '@ant-design/icons';
import {
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import StatusCard from "../components/StatusCard";
import { Modal } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ColorStatus from "../components/StatusStyle";
import { Select } from "antd";
const { Option } = Select;

interface TrackingData {
  tracking_id: string;
  mnemonics: string;
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
  new_wrap: number;
  other: number;
  image_item_paths: string[];
  lot_type: string;
  cal_price: number;
  type_cal: "weightPrice" | "volumePrice";
  user_rate: string;
}

interface User {
  user_id: string;
  name: string;
  phone?: string;
  line_id?: string;
  facebook?: string;
}

const StatusPage: React.FC = () => {
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [totalAmount, setTotalAmount] = useState(0); // Total sum of the price
  const [totalItems, setTotalItems] = useState(0); // Count of selected items
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize the useRouter hook for client-side navigation
  const [allSelected, setAllSelected] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); // Store the user_id

  // Image Preview Modal state
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const swiperRef = useRef<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setUserError(null);
      try {
        // Updated URL to match backend route
        const response = await axios.get("http://localhost:5001/users/ids");
        
        if (response.data) {
          setUsers(response.data);
        } else {
          throw new Error('No data received from server');
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        if (error.response?.status === 404) {
          setUserError("ไม่พบเส้นทางการเรียกข้อมูล กรุณาติดต่อผู้ดูแลระบบ");
        } else {
          setUserError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
        }
        setUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };
  
    fetchUsers();
  }, []);

  const handleUserSelect = async (value: string) => {
    setSelectedUserId(value);
    try {
      const { data } = await axios.get("http://localhost:5001/tracking");
      const filteredData = data.filter(
        (item: TrackingData) => item.user_id === value && item.lot_id
      );
      setTrackingData(filteredData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (userId) {
          const { data } = await axios.get("http://localhost:5001/tracking");

          // Filter tracking data by the current userId AND lot_id exists
          const filteredData = data.filter(
            (item: TrackingData) => item.user_id === userId && item.lot_id
          );
          setTrackingData(filteredData);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Handle selecting/deselecting rows
  const handleSelectRow = (index: number) => {
    const tracking = trackingData[index];
    // Only allow selection if in_th has a value
    if (tracking.in_th) {
      if (selectedRows.includes(index)) {
        setSelectedRows(selectedRows.filter((i) => i !== index));
      } else {
        setSelectedRows([...selectedRows, index]);
      }
    }
  };

  // Sum Calculation
  const calculateSum = (key: keyof TrackingData) => {
    return trackingData.reduce((sum, row) => {
      let value = row[key];

      // Ensure the value is a number (handle strings, arrays, and undefined values)
      if (typeof value === "string") {
        value = parseFloat(value);
      } else if (Array.isArray(value)) {
        value = 0; // If it's an array (e.g., `image_item_paths`), we ignore it for summation
      }

      const numericValue =
        typeof value === "number" && !isNaN(value) ? value : 0;
      return sum + numericValue;
    }, 0);
  };

  // Volume Calculation
  const calculateVolume = (wide: number, long: number, high: number) =>
    (wide * long * high) / 1000000;

  // Calculate total sum of prices and count selected items
  useEffect(() => {
    const selectedData = trackingData.filter((_, index) =>
      selectedRows.includes(index)
    );

    const total = selectedData.reduce(
      (sum, tracking) =>
        sum +
        calculateVolume(tracking.wide, tracking.long, tracking.high) *
          tracking.number,
      0
    );
    const itemsCount = selectedData.length;

    setTotalAmount(total);
    setTotalItems(itemsCount);
  }, [selectedRows, trackingData]);

  const navigateToCreatePayment = () => {
    const selectedParcels = trackingData.filter((_, index) =>
      selectedRows.includes(index)
    );
    
    const selectedUserData = users.find(user => user.user_id === selectedUserId);
    
    localStorage.setItem("selectedParcels", JSON.stringify(selectedParcels));
    localStorage.setItem("selectedUser", JSON.stringify(selectedUserData));
  
    router.push("/admin/createpayment");
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

  // Select All Rows
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]); // Deselect all
    } else {
      // Only select rows that have in_th value
      const selectableIndices = trackingData
        .map((tracking, index) => (tracking.in_th ? index : -1))
        .filter((index) => index !== -1);
      setSelectedRows(selectableIndices);
    }
    setAllSelected(!allSelected);
  };

  const calculateSelectedTotals = () => {
    let importCost = 0;
    let totalCost = 0;

    selectedRows.forEach((index) => {
      const row = trackingData[index];
      importCost += row.cal_price * row.number;
      totalCost +=
        row.cal_price * row.number +
        row.check_product_price +
        row.new_wrap +
        row.transport +
        row.price_crate +
        row.other;
    });

    return { importCost, totalCost };
  };

  const getRowClassName = (tracking: TrackingData) => {
    const hasCheckProduct = tracking.check_product_price > 0;
    const hasCrate = tracking.price_crate > 0;
    let colorClass = "";

    if (hasCheckProduct && hasCrate) {
      // Yellow background for both check and crate
      colorClass = "bg-[#F9FFA5]"; // or use 'bg-[rgb(249,255,165)]'
    } else if (hasCheckProduct) {
      // Green background for check only
      colorClass = "bg-[#A5FFC5]"; // or use 'bg-[rgb(165,255,197)]'
    } else if (hasCrate) {
      // Orange background for crate only
      colorClass = "bg-[#FFDFA5]"; // or use 'bg-[rgb(255,223,165)]'
    }

    // Combine with text-center class
    return `text-center ${colorClass}`;
  };

  const getRowStyle = (tracking: TrackingData) => {
    const hasCheckProduct = tracking.check_product_price > 0;
    const hasCrate = tracking.price_crate > 0;

    if (hasCheckProduct && hasCrate) {
      return { backgroundColor: "rgb(249, 255, 165)" }; // Yellow
    } else if (hasCheckProduct) {
      return { backgroundColor: "rgb(165, 255, 197)" }; // Green
    } else if (hasCrate) {
      return { backgroundColor: "rgb(255, 223, 165)" }; // Orange
    }
    return {};
  };

  return (
    <div className="card">
      <Head>
        <title>Dashboard</title>
      </Head>
      <main>
        <Row
          gutter={[16, 16]}
          className="items-center flex-nowrap overflow-x-auto"
        >
          <Col flex="1">
  <StatusCard
    card={{
      title: "รหัสสมาชิก",
      count: selectedUserId || '-',
      backgroundColor: "rgb(84, 209, 174)",
      color: "white",
      icon: <UserOutlined style={{ fontSize: '24px' }} />
    }}
  />
</Col>
          <Col flex="1">
            <StatusCard
              card={{
                title: "จำนวนรายการ",
                count: totalItems,
                backgroundColor: "rgb(84, 209, 174)",
                color: "white",
              }}
            />
          </Col>
          <Col flex="1">
            <StatusCard
              card={{
                title: "ค่านำเข้า",
                count: `${calculateSelectedTotals().importCost.toFixed(2)} ฿`,
                backgroundColor: "rgb(255, 153, 177)",
                color: "white",
              }}
            />
          </Col>
          <Col flex="1">
            <StatusCard
              card={{
                title: "ยอดที่ต้องชำระ",
                count: `${calculateSelectedTotals().totalCost.toFixed(2)} ฿`,
                backgroundColor: "rgb(255, 153, 177)",
                color: "white",
              }}
            />
          </Col>
          <Col flex="1">
            <Button
              onClick={navigateToCreatePayment}
              type="primary"
              icon={<PlusOutlined />}
              className="w-50 h-full min-h-[30px] text-base flex items-center justify-center"
            >
              สร้างใบชำระค่าสินค้า
            </Button>
          </Col>
        </Row>

        <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <div className="flex flex-col gap-2 px-4 py-3">
  <Select
    showSearch
    placeholder={isLoadingUsers ? "กำลังโหลดข้อมูล..." : "เลือกรหัสสมาชิก"}
    className="w-64"
    value={selectedUserId}
    onChange={handleUserSelect}
    loading={isLoadingUsers}
    disabled={isLoadingUsers}
    notFoundContent={
      userError 
        ? <span className="text-red-500">ไม่พบข้อมูลผู้ใช้</span> 
        : isLoadingUsers 
          ? <span>กำลังโหลด...</span>
          : <span>ไม่พบข้อมูล</span>
    }
    filterOption={(input, option) =>
      (option?.value?.toString() ?? "")
        .toLowerCase()
        .includes(input.toLowerCase()) ||
      (option?.children?.toString() ?? "")
        .toLowerCase()
        .includes(input.toLowerCase())
    }
  >
    {users.map((user) => (
      <Option key={user.user_id} value={user.user_id}>
        {user.user_id} {user.name ? `- ${user.name}` : ''}
      </Option>
    ))}
  </Select>
  {userError && (
    <div className="text-red-500 text-sm mt-1">
      {userError}
    </div>
  )}
</div>
        </div>
        <table className="table table-width-1" style={{ fontSize: 12 }}>
          <thead>
            <tr className="text-center">
              <th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  disabled={!trackingData.some((item) => item.in_th)}
                  style={{
                    cursor: trackingData.some((item) => item.in_th)
                      ? "pointer"
                      : "not-allowed",
                  }}
                />
              </th>
              <th>ล็อต/ลำดับ</th>
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
              <th>ค่าบริการ</th>
              {/* <th>เข้าโกดังจีน</th>
              <th>ออกจากจีน</th> */}
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
                {trackingData
                  .reduce(
                    (sum, row) =>
                      sum + calculateVolume(row.wide, row.long, row.high),
                    0
                  )
                  .toFixed(4)}
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
              {/* <td></td>
              <td></td> */}
              <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                {trackingData
                  .reduce(
                    (sum, row) =>
                      sum +
                      (row.type_cal === "weightPrice"
                        ? row.cal_price * row.number
                        : 0),
                    0
                  )
                  .toFixed(2)}
              </td>
              <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                {trackingData
                  .reduce(
                    (sum, row) =>
                      sum +
                      (row.type_cal === "weightPrice"
                        ? 0
                        : row.cal_price * row.number),
                    0
                  )
                  .toFixed(2)}
              </td>
            </tr>

            {/* Data Rows */}
            {trackingData.length > 0 ? (
              trackingData.map((tracking, index) => (
                <tr
                  key={index}
                  className="text-center"
                  style={getRowStyle(tracking)}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(index)}
                      onChange={() => handleSelectRow(index)}
                      disabled={!tracking.in_th} // Disable checkbox if in_th is empty
                      style={{
                        cursor: tracking.in_th ? "pointer" : "not-allowed",
                      }}
                    />
                  </td>
                  <td>
                    {tracking.lot_type} {tracking.lot_id}
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
                              openImagePreview(tracking.image_item_paths, i)
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
                    ).toFixed(4)}
                  </td>
                  <td>{tracking.user_rate}</td>
                  <td>
                    <Tooltip
                      title={
                        <div>
                          <p>
                            ค่าเช็คสินค้า:{" "}
                            {tracking.check_product_price?.toFixed(2)}
                          </p>
                          <p>ค่าห่อใหม่: {tracking.new_wrap?.toFixed(2)}</p>
                          <p>ค่าขนส่งจีน: {tracking.transport?.toFixed(2)}</p>
                          <p>ค่าตีลัง: {tracking.price_crate?.toFixed(2)}</p>
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
                      ).toFixed(2)}
                    </Tooltip>
                  </td>
                  {/* <td>{tracking.in_cn}</td>
                  <td>{tracking.out_cn}</td> */}
                  <td>{tracking.in_th}</td>
                  <td>
                    {tracking.type_cal === "weightPrice"
                      ? (tracking.cal_price * tracking.number).toFixed(2)
                      : 0}
                  </td>
                  <td>
                    {tracking.type_cal === "weightPrice"
                      ? 0
                      : (tracking.cal_price * tracking.number).toFixed(2)}
                  </td>
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
                {trackingData
                  .reduce(
                    (sum, row) =>
                      sum + calculateVolume(row.wide, row.long, row.high),
                    0
                  )
                  .toFixed(4)}
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
              {/* <td></td>
              <td></td> */}
              <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                {trackingData
                  .reduce(
                    (sum, row) =>
                      sum +
                      (row.type_cal === "weightPrice"
                        ? row.cal_price * row.number
                        : 0),
                    0
                  )
                  .toFixed(2)}
              </td>
              <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>
                {trackingData
                  .reduce(
                    (sum, row) =>
                      sum +
                      (row.type_cal === "weightPrice"
                        ? 0
                        : row.cal_price * row.number),
                    0
                  )
                  .toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Image Preview Modal */}
        <Modal
          open={modalOpen}
          footer={null}
          onCancel={handlePreviewClose}
          centered
        >
          <Swiper
            ref={swiperRef}
            initialSlide={previewIndex}
            onSlideChange={(swiper) => setPreviewIndex(swiper.activeIndex)}
            navigation={false}
            modules={[Navigation]}
          >
            {previewImages.map((image, index) => (
              <SwiperSlide key={index}>
                <Image
                  src={image}
                  alt={`Preview ${index + 1}`}
                  layout="responsive" // Ensure responsive layout
                  width={100} // Percentage width
                  height={80} // Adjust height based on "vh" equivalent or use a pixel value
                  objectFit="contain" // Maintain the "contain" behavior
                  style={{ maxHeight: "80vh" }} // For limiting max height
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
              background: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              borderRadius: "50%",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={() => swiperRef.current?.swiper?.slidePrev()}
          >
            <LeftOutlined />
          </button>

          {/* Right Arrow */}
          <button
            className="swiper-button-next"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              background: "rgba(0, 0, 0, 0.5)",
              color: "#fff",
              borderRadius: "50%",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={() => swiperRef.current?.swiper?.slideNext()}
          >
            <RightOutlined />
          </button>
        </Modal>

        <ColorStatus />
      </main>
    </div>
  );
};

export default StatusPage;
