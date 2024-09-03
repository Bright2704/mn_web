"use client";

import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../../styles/globals.css';

const LotPage: React.FC = () => {
  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">รายการฝากเงิน</h3>
      </div>
      
      <div className="p-4 flex flex-col border-t">
        <div className="flex mb-4">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            เพิ่มล็อตสินค้า
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            พิมพ์
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table table-width-1">
          <thead>
            <tr className="text-center">
              <th>No.</th>
              <th>ผู้ทำรายการ</th>
              <th>วันที่ทำรายการ</th>
              <th>วันที่อนุมัติ</th>
              <th>จำนวน</th>
              <th>ธนาคาร</th>
              <th>หลักฐาน</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LotPage;
