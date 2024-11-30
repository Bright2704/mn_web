"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, Eye, Search } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentSenderDetails {
  name: string;
  address: string;
  phone: string;
}

interface Payment {
  pay_id: string;
  selectedCarrier: string;
  createdAt: string;
  approveAt?: string;
  senderOption: string;
  senderDetails: PaymentSenderDetails;
  total: number;
  transportFee_th: number;
  status: "wait" | "del_thai" | "del_mn" | "success" | "failed";
}

interface StatusOption {
  label: string;
  value: string;
}

interface SearchTopic {
  label: string;
  value: keyof Payment;
}

const ExportPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchTopic, setSearchTopic] = useState<keyof Payment>("pay_id");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);

  const statuses: StatusOption[] = [
    { label: "สถานะทั้งหมด", value: "all" },
    { label: "รอตรวจสอบ", value: "wait" },
    { label: "รอจัดส่งในไทย", value: "del_thai" },
    { label: "รอมารับของ", value: "del_mn" },
    { label: "สำเร็จ", value: "success" },
    { label: "ไม่สำเร็จ", value: "failed" },
  ];

  const searchTopics: SearchTopic[] = [
    { label: "หมายเลขรายการ", value: "pay_id" },
    { label: "ประเภทการจัดส่ง", value: "selectedCarrier" },
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPayments();
  }, [payments, selectedStatus, searchTerm, searchTopic]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<Payment[]>(
        "http://localhost:5000/createpayment",
        {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );
      setPayments(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const filterPayments = () => {
    let filtered = [...payments];

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (payment) => payment.status === selectedStatus
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((payment) => {
        const value = String(payment[searchTopic]).toLowerCase();
        return value.includes(searchTerm.toLowerCase());
      });
    }

    setFilteredPayments(filtered);
  };

  const getStatusBadge = (status: Payment["status"]) => {
    const styles: Record<Payment["status"], string> = {
      wait: "bg-yellow-500",
      success: "bg-green-500",
      failed: "bg-red-500",
      del_thai: "bg-blue-500",
      del_mn: "bg-purple-500",
    };

    const labels: Record<Payment["status"], string> = {
      wait: "รอตรวจสอบ",
      success: "สำเร็จ",
      failed: "ไม่สำเร็จ",
      del_thai: "รอจัดส่งในไทย",
      del_mn: "รอมารับของ",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-white text-sm ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          เกิดข้อผิดพลาดในการโหลดข้อมูล: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">รายการส่งออกสินค้า</h1>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2 overflow-x-auto">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedStatus === status.value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex mb-6">
        <div className="flex w-full max-w-md">
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={searchTopic}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSearchTopic(e.target.value as keyof Payment)
            }
            className="px-4 py-2 border-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {searchTopics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">หมายเลขรายการ</th>
              <th className="px-4 py-3 text-left">วันที่สร้าง</th>
              <th className="px-4 py-3 text-left">วันที่อนุมัติ</th>
              <th className="px-4 py-3 text-left">ประเภทการจัดส่ง</th>
              <th className="px-4 py-3 text-left">ผู้ส่ง</th>
              <th className="px-4 py-3 text-right">จำนวน</th>
              <th className="px-4 py-3 text-center">สถานะ</th>
              <th className="px-4 py-3 text-center">ตรวจสอบ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  กำลังโหลด...
                </td>
              </tr>
            ) : filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : (
              filteredPayments.map((payment) => (
                <tr key={payment.pay_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{payment.pay_id}</td>
                  <td className="px-4 py-3">{formatDate(payment.createdAt)}</td>
                  <td className="px-4 py-3">{formatDate(payment.approveAt)}</td>
                  <td className="px-4 py-3">{payment.selectedCarrier}</td>
                  <td className="px-4 py-3">
                    {payment.senderOption === "details"
                      ? payment.senderDetails.name
                      : payment.senderOption}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {(
                      payment.transportFee_th || payment.total
                    ).toLocaleString()}{" "}
                    บาท
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full">
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExportPage;
