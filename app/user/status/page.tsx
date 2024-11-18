"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import Head from "next/head";
import axios from "axios";
import { Row, Col, Button, Tooltip } from "antd";
import {
  PlusOutlined,
  LeftOutlined,
  RightOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import StatusCard from "../components/StatusCard";
import { Modal } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { getSession } from "next-auth/react"; // Import getSession

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

  // Fetch the session and extract user_id on component mount
  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id; // Type assertion
        if (userId) {
          setUserId(userId); // Set the user_id from session
        } else {
          console.error("User ID not found in session");
        }
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (userId) {
          const { data } = await axios.get("http://localhost:5000/tracking");

          // Filter tracking data by the current userId
          const filteredData = data.filter(
            (item: TrackingData) => item.user_id === userId
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
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
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
    localStorage.setItem("selectedParcels", JSON.stringify(selectedParcels));

    // Use Next.js router to navigate
    router.push("/user/createpayment");
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
      setSelectedRows(Array.from(Array(trackingData.length).keys())); // Select all rows
    }
    setAllSelected(!allSelected);
  };
  const calculateSelectedTotals = () => {
    let importCost = 0;
    let totalCost = 0;

    selectedRows.forEach(index => {
      const row = trackingData[index];
      importCost += row.cal_price * row.number;
      totalCost += (row.cal_price * row.number) + 
                   row.check_product_price +
                   row.new_wrap +
                   row.transport + 
                   row.price_crate +
                   row.other;
    });

    return { importCost, totalCost };
  };
  

 
  return (
    <div className="card">
      <Head>
        <title>Dashboard</title>
      </Head>
      <main>
        <Row gutter={[16, 16]} style={{ margin: "8px" }}>
          <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
            <Row
              gutter={[16, 16]}
              style={{ maxWidth: "1200px", width: "100%" }}
            >
              {/* First Card */}
              <Col xs={24} sm={8} lg={6} xl={6} 
                style={{ display: "flex", justifyContent: "center" }}>
                <StatusCard
                  card={{
                    title: "จำนวนรายการ",
                    count: totalItems,
                    backgroundColor: "rgb(84, 209, 174)",
                    color: "white",
                  }}
                />
              </Col>

              {/* Second Card */}
              <Col xs={24} sm={8} lg={6} xl={6} 
                style={{ display: "flex", justifyContent: "center" }}>
                <StatusCard
                  card={{
                    title: "ค่านำเข้า",
                    count: `${calculateSelectedTotals().importCost.toFixed(2)} ฿`,
                    backgroundColor: "rgb(255, 153, 177)",
                    color: "white",
                  }}
                />
              </Col>

              {/* Third Card */}
              <Col xs={24} sm={8} lg={6} xl={6} 
                style={{ display: "flex", justifyContent: "center" }}>
                <StatusCard
                  card={{
                    title: "ยอดที่ต้องชำระ",
                    count: `${calculateSelectedTotals().totalCost.toFixed(2)} ฿`,
                    backgroundColor: "rgb(255, 153, 177)",
                    color: "white",
                  }}
                />
              </Col>

              {/* Button */}
              <Col
                xs={24}
                sm={24}
                lg={6}
                xl={6}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  onClick={navigateToCreatePayment}
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ width: "auto", minWidth: "200px" }}
                >
                  สร้างใบชำระค่าสินค้า
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <table className="table table-width-1" style={{ fontSize: 12 }}>
          <thead>
            <tr className="text-center">
              <th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
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

              <th>
                <Tooltip
                  title={
                    <div>
                      {
                        trackingData.map((tracking) => (
                          <div key={tracking.tracking_id}>
                            <p>
                              ค่าเช็คสินค้า:{" "}
                              {tracking.check_product_price?.toFixed(2)}
                            </p>
                            <p>ค่าห่อใหม่: {tracking.new_wrap?.toFixed(2)}</p>
                            <p>ค่าขนส่งจีน: {tracking.transport?.toFixed(2)}</p>
                            <p>ค่าตีลัง: {tracking.price_crate?.toFixed(2)}</p>
                            <p>ค่าอื่นๆ: {tracking.other?.toFixed(2)}</p>
                          </div>
                        ))[0]
                      }
                    </div>
                  }
                >
                  ค่าบริการ <QuestionCircleOutlined />
                </Tooltip>
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
              <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>{(calculateSum("check_product_price")
              +calculateSum("new_wrap")
              +calculateSum("transport")
              +calculateSum("price_crate")
              +calculateSum("other")).toFixed(2)}</td>
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
                    )}
                  </td>
                  <td>{tracking.type_item}</td>
                  <td>
                    {(
                      tracking.check_product_price +
                      tracking.new_wrap +
                      tracking.transport +
                      tracking.price_crate +
                      tracking.other
                    ).toFixed(2)}
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
                {trackingData.reduce(
                  (sum, row) =>
                    sum + calculateVolume(row.wide, row.long, row.high),
                  0
                )}
              </td>
              <td></td>
              <td style={{ backgroundColor: "rgb(255, 167, 163)" }}>{(calculateSum("check_product_price")
              +calculateSum("new_wrap")
              +calculateSum("transport")
              +calculateSum("price_crate")
              +calculateSum("other")).toFixed(2)}</td>
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

        {/* <ColorStatus /> */}
      </main>
    </div>
  );
};

export default StatusPage;
