"use client";

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '../../../styles/globals.css';
import ModalAddLot from '../components/lot_detail/ModalAddLot'; // Ensure correct path to ModalAddLot
import ModalManageLot from '../components/lot_detail/ModalManageLot'; // Ensure correct path to ModalManageLot

const LotPage: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showManageModal, setShowManageModal] = useState<boolean>(false);
  const [lots, setLots] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');
  const [selectedLot, setSelectedLot] = useState<any>(null); // Store the selected lot for managing

  // Fetch lots from the API when the component loads
  useEffect(() => {
    fetch('http://localhost:5000/lots')
      .then((response) => response.json())
      .then((data) => setLots(data))
      .catch((error) => console.error('Error fetching lots:', error));
  }, []);

  // Function to open the Add Lot modal
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Function to close the Add Lot modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Function to open the Manage Lot modal
  const handleOpenManageModal = (lot: any) => {
    setSelectedLot(lot); // Set the lot that is being managed
    setShowManageModal(true);
  };

  // Function to close the Manage Lot modal
  const handleCloseManageModal = () => {
    setShowManageModal(false);
    setSelectedLot(null); // Clear the selected lot when closing the modal
  };

  // Handle saving a new lot
  const handleSaveLot = (lotData: { lot_id: string; lot_type: string }) => {
    // Send the new lot to the back-end to be saved in the database
    fetch('http://localhost:5000/lots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lotData),
    })
      .then((response) => response.json())
      .then((newLot) => {
        setLots([...lots, newLot]); // Add the new lot to the table
      })
      .catch((error) => console.error('Error saving new lot:', error));
  };

  // Handle managing a lot (you can add update logic here)
  const handleSaveManagedLot = (lotData: { lot_id: string; lot_type: string }) => {
    // Perform actions for managing/editing the lot, such as sending updates to the back-end
    // Here, you can implement the logic to update the lot in the back-end
    handleCloseManageModal();
  };

  // Filter lots based on search term and filter type
  const filteredLots = lots.filter((lot) => {
    const matchesSearchTerm =
      lot.lot_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lot.lot_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilterType = filterType === '' || lot.lot_type === filterType;

    return matchesSearchTerm && matchesFilterType;
  });

  return (
    <div className="card">
      <div className="d-lg-flex justify-between items-center px-2 py-2 mt-2 mb-2">
        <h3 className="font-weight-bolder text-lg font-semibold">
          ล๊อตสินค้า
        </h3>

        {/* Search and Filter Container */}
        <div className="d-flex align-items-center">
          <div className="anan-input__inner anan-input__inner--normal">
            <input
              type="text"
              placeholder="ค้นหา"
              className="anan-input__input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term state on input change
            />
            <div className="anan-input__suffix">
              <i className="anan-input__clear-btn anan-icon"></i>
            </div>
          </div>

          <select
            className="w-50 ml-1 custom-select custom-select-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)} // Update filter type state on select change
          >
            <option value="">ทั้งหมด</option>
            <option value="รถ">รถ</option>
            <option value="เรือ">เรือ</option>
          </select>
        </div>
      </div>

      <div className="p-4 flex flex-col border-t">
        <div className="flex mb-4">
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleOpenModal} // Open Add Lot modal on click
          >
            เพิ่มล็อตสินค้า
          </button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded">
            พิมพ์
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table table-width-1">
          <thead>
            <tr className="text-center">
              <th>หมายเลขล็อต</th>
              <th>ประเภทการขนส่ง</th>
              <th>เข้าโกดังจีน</th>
              <th>ออกจากจีน</th>
              <th>ถึงไทย</th>
              <th>จำนวน</th>
              <th>หมายเหตุ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredLots.map((lot) => (
              <tr key={lot._id} className="text-center">
                <td>{lot.lot_id}</td>
                <td>{lot.lot_type}</td>
                <td>{lot.in_cn}</td>
                <td>{lot.out_cn}</td>
                <td>{lot.in_th}</td>
                <td>{lot.num_item}</td>
                <td>{lot.note}</td>
                <td>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => handleOpenManageModal(lot)} // Open Manage Lot modal with selected lot
                  >
                    จัดการ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding Lot */}
      <ModalAddLot show={showModal} onClose={handleCloseModal} onSave={handleSaveLot} />

      {/* Modal for Managing Lot */}
      {selectedLot && (
        <ModalManageLot
          show={showManageModal}
          onClose={handleCloseManageModal}
          lotId={selectedLot.lot_id} // Pass lot_id here
        />
      )}
    </div>
  );
};

export default LotPage;
