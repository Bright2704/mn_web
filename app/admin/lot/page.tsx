"use client";

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../styles/globals.css';
import ModalLotdetail from '../components/lot_detail/ModalLotdetail'; // Ensure the correct path to your ModalLotdetail component

const LotPage: React.FC = () => {
  // State to manage the visibility of the modal
  const [showModal, setShowModal] = useState<boolean>(false);

  // Function to open the modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

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
            onClick={handleOpenModal} // Open modal on click
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
              <th>หมายเลขล็อต</th>
              <th>เข้าโกดังจีน</th>
              <th>ออกจากจีน</th>
              <th>ถึงไทย</th>
              <th>จำนวน</th>
              <th>หมายเหตุ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {/* Table data would go here */}
          </tbody>
        </table>
      </div>

      {/* Modal for Lot Details */}
      <ModalLotdetail show={showModal} onClose={handleCloseModal} />
    </div>
  );
};

export default LotPage;
