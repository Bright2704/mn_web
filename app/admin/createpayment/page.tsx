"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumb, Row, Col } from "antd";
import axios from "axios";
import AddressForm from "../components/createpayment/AddressForm";
import PaymentSummary from "../components/createpayment/PaymentSummary";
import TrackingTable from "../components/createpayment/TrackingTable";
import ColorStatus from "../components/StatusStyle";
import { getSession } from "next-auth/react";

// Define the interface for tracking data
interface TrackingData {
  tracking_id: string;
  mnemonics: string;
  weight: number;
  wide: number;
  high: number;
  long: number;
  number: number;
  lot_id: string;
  lot_order: string;
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

interface Address {
  userName: string;
  address: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  phone: string;
  transport: string;
}

interface SenderDetails {
  name: string;
  address: string;
  phone: string;
}

interface TaxInfo {
  _id: string; // Added _id field
  name: string;
  address: string;
  phone: string;
  taxId: string;
  customerType: string;
  document: string;
}

interface User {
  user_id: string;
  name: string;
  phone?: string;
}



const CreatePayment: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [address, setAddress] = useState<Address>({
    userName: "",
    address: "",
    province: "",
    district: "",
    subdistrict: "",
    postalCode: "",
    phone: "",
    transport: "",
  });

  const [transportType, setTransportType] = useState("");
  const [shippingPayment, setShippingPayment] = useState("");
  const [selectedCarrier, setSelectedCarrier] = useState("");
  const [senderOption, setSenderOption] = useState("0");
  const [senderDetails, setSenderDetails] = useState<SenderDetails | null>(
    null
  );
  const [receiptRequired, setReceiptRequired] = useState(false);
  const [taxInfo, setTaxInfo] = useState<TaxInfo | null>(null);
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState("");
  const [notes, setNotes] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  const [senderPhone, setSenderPhone] = useState("");

  useEffect(() => {
    // Load the selected parcels from localStorage
    const loadedTrackingData = JSON.parse(
      localStorage.getItem("selectedParcels") || "[]"
    );
    setTrackingData(loadedTrackingData);
  }, []);

  useEffect(() => {
    const loadSelectedData = () => {
      const userData = JSON.parse(localStorage.getItem("selectedUser") || "null");
      if (userData) {
        setSelectedUser(userData);
        setUserName(userData.user_id);
      }
    };

    loadSelectedData();
  }, []);

  useEffect(() => {
    const selectedUser = JSON.parse(localStorage.getItem("selectedUser") || "{}");
    setUserName(selectedUser.user_id || "");
    
    // Pre-fill address form if user exists
    if (selectedUser) {
      setAddress({
        userName: selectedUser.name || "",
        address: "",
        province: "",
        district: "",
        subdistrict: "", 
        postalCode: "",
        phone: selectedUser.phone || "",
        transport: "",
      });
    }
  }, []);

  const calculateVolume = (wide: number, long: number, high: number) =>
    (wide * long * high) / 1000000;

  useEffect(() => {
    const total = trackingData.reduce(
        (sum, tracking) =>
            sum +
            ((tracking.wide * tracking.long * tracking.high) / 1000000) *
            tracking.number,
        0
    );
    setTotalAmount(total);
}, [trackingData]);

  

  const calculateSum = (key: keyof TrackingData) => {
    return trackingData.reduce(
      (sum, item) => sum + ((item[key] as number) || 0),
      0
    );
  };

  // Handle address change
  const handleAddressChange = (field: string, value: string) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  // Handle saving payment
  const handleSavePayments = async () => {
    try {
      const addressData = {
        recipientName: address.userName,
        address: address.address,
        province: address.province,
        district: address.district,
        subdistrict: address.subdistrict,
        postalCode: address.postalCode,
        phone: address.phone,
        transportType,
        shippingPayment,
        selectedCarrier,
        senderOption,
        senderDetails:
          senderOption === "-99"
            ? {
                name: senderName,
                address: senderAddress,
                phone: senderPhone,
              }
            : null,
        receiptRequired,
        taxInfo: receiptRequired
          ? {
              name: taxInfo?.name,
              address: taxInfo?.address,
              phone: taxInfo?.phone,
              taxId: taxInfo?.taxId,
              customerType: taxInfo?.customerType,
              document: taxInfo?.document,
            }
          : null,
      };

      const totals = calculateSelectedTotals();
      const total = totals.serviceFee + totals.weightPrice + totals.volumePrice;
      const grandTotal = total + transportFee + serviceFee;

      const paymentData = {
        agreementAccepted: true,
        balance,
        importFee: total,
        serviceFee,
        transportFee,
        paymentType: "ตัดเงินในระบบ",
        total: grandTotal,
        notes,
        status: "wait",
      };

      const trackingsData = trackingData.map((track) => ({
        tracking_id: track.tracking_id,
        lot_id: track.lot_id,
        lot_type: track.lot_type,
        lot_order: track.lot_order,
      }));

      const createPaymentData = {
        ...addressData,
        ...paymentData,
        trackings: trackingsData,
        user_id: selectedUser?.user_id, // Use selectedUser instead of userData
        createdAt: new Date().toISOString(),
        taxInfo: taxInfo
          ? {
              _id: taxInfo._id,
              name: taxInfo.name,
              address: taxInfo.address,
              phone: taxInfo.phone,
              taxId: taxInfo.taxId,
              customerType: taxInfo.customerType,
              document: taxInfo.document,
            }
          : null,
      };

      // Create payment and get the payment ID
      const paymentResponse = await axios.post(
        "http://localhost:5000/createpayment",
        createPaymentData
      );
      const pay_id = paymentResponse.data.pay_id;  // Assuming the API returns the payment ID

      // Get next balance ID
      const nextBalanceIdResponse = await axios.get('http://localhost:5000/balances/next-id');
      const newBalanceId = nextBalanceIdResponse.data.nextId;

      const newBalanceAmount = balance - grandTotal;
      await axios.post("http://localhost:5000/balances", {
        balance_id: newBalanceId,
        user_id: selectedUser?.user_id,
        balance_type: "payment",
        balance_descri: `รายการชำระค่านำเข้า ${pay_id}`,
        balance_amount: grandTotal,
        balance_total: newBalanceAmount,
        balance_date: new Date()
          .toLocaleString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
          .replace(',', '')
      });

      alert("Payment has been successfully processed!");
      router.push("/admin/status");
    } catch (error: any) {
      console.error("Failed to process payment:", error);
      alert(
        error.response?.data?.error ||
          "Failed to process payment. Please try again."
      );
    }
  };

  const [transportFee, setTransportFee] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [currentSenderOption, setCurrentSenderOption] = useState("0");

  const TRANSPORT_LABELS = {
    "1": "รับสินค้าเอง (รับสินค้าเองได้ทุกวัน 09.00-21.00 น.)",
    "2": "บริษัทจัดส่ง 690 บาท (เฉพาะเขตกรุงเทพ)",
    "-99": "ขนส่งเอกชน (แจ้งก่อน 12.00 น.)",
  };

  const handleTransportTypeChange = (
    value: string,
    carrier?: string,
    shippingPayment?: string
  ) => {
    setTransportType(value);

    // Set carrier based on transport type
    if (value === "1" || value === "2") {
      setSelectedCarrier(
        TRANSPORT_LABELS[value as keyof typeof TRANSPORT_LABELS]
      );
    } else {
      setSelectedCarrier(carrier || "");
    }

    setShippingPayment(shippingPayment || "");

    // Reset fees first
    setServiceFee(0);
    setTransportFee(0);

    // Calculate new fees
    let newServiceFee = 0;
    let newTransportFee = 0;

    // Add sender option fee if it's already set to -99
    if (senderOption === "-99") {
      newServiceFee += 10;
    }

    // Calculate transport-related fees
    if (value === "2") {
      newTransportFee = 690;
    } else if (value === "-99") {
      newServiceFee += 20;
      if (shippingPayment === "0") {
        newTransportFee = 250;
      }
    }

    setServiceFee(newServiceFee);
    setTransportFee(newTransportFee);
  };
  // const handleSenderOptionChange = (value: string) => {
  //     if (value === "-99") {
  //         setServiceFee(prev => prev + 10);
  //     } else {
  //         // If changing from -99 to another option, remove the 10 baht fee
  //         if (senderOption === "-99") {
  //             setServiceFee(prev => prev - 10);
  //         }
  //     }
  // };
  const handleSenderOptionChange = (
    value: string,
    details?: { name: string; address: string; phone: string }
  ) => {
    setSenderOption(value);
    if (details) {
      setSenderName(details.name);
      setSenderAddress(details.address);
      setSenderPhone(details.phone);
      setSenderDetails(details);
    } else {
      setSenderName("");
      setSenderAddress("");
      setSenderPhone("");
      setSenderDetails(null);
    }

    // Reset and recalculate fees
    let newServiceFee = 0;
    let newTransportFee = transportFee; // Keep existing transport fee

    // Add sender option fee
    if (value === "-99") {
      newServiceFee += 10;
    }

    // Add existing transport service fee if applicable
    if (transportType === "-99") {
      newServiceFee += 20;
    }

    setServiceFee(newServiceFee);
  };

  const calculateSelectedTotals = () => {
    return trackingData.reduce(
      (acc, row) => {
        const weightPrice =
          row.type_cal === "weightPrice" ? row.cal_price * row.number : 0;
        const volumePrice =
          row.type_cal === "volumePrice" ? row.cal_price * row.number : 0;
        const serviceFee =
          row.check_product_price +
          row.new_wrap +
          row.transport +
          row.price_crate +
          row.other;

        return {
          serviceFee: acc.serviceFee + serviceFee,
          weightPrice: acc.weightPrice + weightPrice,
          volumePrice: acc.volumePrice + volumePrice,
        };
      },
      { serviceFee: 0, weightPrice: 0, volumePrice: 0 }
    );
  };

  const totals = calculateSelectedTotals();
  const total = totals.serviceFee + totals.weightPrice + totals.volumePrice;
  const grandTotal = total + transportFee + serviceFee;

  useEffect(() => {
    axios
      .get("http://localhost:5000/balances")
      .then((response) => {
        const fetchedBalances = response.data;
        if (fetchedBalances.length > 0) {
          setBalance(fetchedBalances[fetchedBalances.length - 1].balance_total);
        }
      })
      .catch((error) => console.error("Error fetching balance:", error));
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user) {
        const userId = (session.user as { user_id?: string }).user_id;
        if (userId) {
          setUserName(userId);
        }
      }
    };
    fetchSession();
  }, []);

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const handleReceiptOptionChange = (isRequired: boolean) => {
    setReceiptRequired(isRequired);
    if (!isRequired) {
      setTaxInfo(null);
    }
  };

  const handleTaxInfoChange = (newTaxInfo: TaxInfo | null) => {
    setTaxInfo(newTaxInfo);
  };

  return (
    <main style={{ padding: "24px 16px", background: "rgb(240, 242, 245)" }}>
      {/* Breadcrumb for navigation */}
      <Breadcrumb
        items={[
          {
            title: <a href="/admin/status">เช็คสถานะสินค้าและแจ้งนำออก</a>,
          },
          {
            title: "ชำระเงินค่าขนส่งสินค้า",
          },
        ]}
      />

      {/* Address Form and Payment Summary */}
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col lg={15} xl={14}>
          <AddressForm
           selectedUser={selectedUser}
            address={address}
            handleAddressChange={handleAddressChange}
            onTransportChange={handleTransportTypeChange}
            onSenderOptionChange={handleSenderOptionChange} // This now accepts sender details
            onReceiptOptionChange={handleReceiptOptionChange}
            onTaxInfoChange={handleTaxInfoChange}
            taxInfo={taxInfo}
          />
        </Col>
        <Col lg={11} xl={9}>
          <PaymentSummary
            totalAmount={totalAmount}
            handleSavePayments={handleSavePayments}
            transportFee={transportFee}
            serviceFee={serviceFee}
            selectedCarrier={selectedCarrier}
            total={totals.serviceFee + totals.weightPrice + totals.volumePrice}
            grandTotal={total + transportFee + serviceFee}
            balance={balance}
            userName={userName}
            notes={notes}
            onNotesChange={handleNotesChange}
          />
        </Col>
      </Row>

      <TrackingTable
    trackingData={trackingData}
    calculateSum={calculateSum}
    transportFee={transportFee}
    serviceFee={serviceFee}
/>

      <ColorStatus />
    </main>
  );
};

export default CreatePayment;
