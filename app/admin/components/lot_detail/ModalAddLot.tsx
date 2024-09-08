import React, { useState, useEffect } from 'react';

interface ModalAddLotProps {
  show: boolean;
  onClose: () => void;
  onSave: (lotData: { lot_id: string; lot_type: string }) => void;
}

const ModalAddLot: React.FC<ModalAddLotProps> = ({ show, onClose, onSave }) => {
  const [lotType, setLotType] = useState<string>('1'); // Default to 'รถ'
  const [lotId, setLotId] = useState<string>(''); // For auto-generated lot_id

  // Fetch the latest lot_id from the server and generate the next one
  useEffect(() => {
    if (show) {
      fetch('http://localhost:5000/lots/latest') // Endpoint to get the latest lot_id
        .then((response) => response.json())
        .then((data) => {
          const lastLotId = data?.lot_id || 'LOT-00000'; // Default if no data
          const nextLotId = generateNextLotId(lastLotId);
          setLotId(nextLotId);
        })
        .catch((error) => console.error('Error fetching latest lot_id:', error));
    }
  }, [show]);

  const generateNextLotId = (lastId: string) => {
    const num = parseInt(lastId.split('-')[1], 10) + 1;
    return `LOT-${num.toString().padStart(5, '0')}`;
  };

  const handleSave = () => {
    // Map lotType from 1/2 to "รถ" or "เรือ"
    const lotTypeValue = lotType === '1' ? 'รถ' : 'เรือ';
    
    // Create new lot object with selected type and auto-generated lot_id
    onSave({ lot_id: lotId, lot_type: lotTypeValue });
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-screen overflow-y-auto">
        <header className="modal-header">
          <h5 className="modal-title">เพิ่มล็อตสินค้า</h5>
          <button type="button" className="close" onClick={onClose}>
            &times;
          </button>
        </header>
        <div className="modal-body">
          <label htmlFor="Type">ประเภทขนส่ง <span className="text-danger">*</span></label>
          <div className="demo-inline-spacing mt-n1">
            <div className="custom-control custom-radio">
              <input
                type="radio"
                name="transport-type"
                className="custom-control-input"
                value="1"
                id="transport-car"
                checked={lotType === '1'}
                onChange={() => setLotType('1')}
              />
              <label className="custom-control-label" htmlFor="transport-car"> รถ </label>
            </div>
            <div className="custom-control custom-radio">
              <input
                type="radio"
                name="transport-type"
                className="custom-control-input"
                value="2"
                id="transport-ship"
                checked={lotType === '2'}
                onChange={() => setLotType('2')}
              />
              <label className="custom-control-label" htmlFor="transport-ship"> เรือ </label>
            </div>
          </div>
        </div>
        <footer className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            ยกเลิก
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            บันทึก
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ModalAddLot;
