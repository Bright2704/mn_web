import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ModalManageLotProps {
  show: boolean;
  onClose: () => void;
  lotId: string;
}

interface LotData {
  lot_id: string;
  note: string;
  lot_type: string;
  num_item: string;
  file_path?: string;
  image_path?: string;
}

const ModalManageLot: React.FC<ModalManageLotProps> = ({ show, onClose, lotId }) => {
  const [lotData, setLotData] = useState<LotData>({
    lot_id: '',
    note: '',
    lot_type: '1',
    num_item: '',
  });
  const [isCardExpanded, setIsCardExpanded] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const refreshData = () => {
    fetch(`http://localhost:5000/lots/${lotId}`)
      .then((response) => response.json())
      .then((data) => {
        setLotData(data);
      })
      .catch((error) => console.error('Error fetching lot data:', error));
  };

  useEffect(() => {
    if (show && lotId) {
      refreshData();
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
    const formData = new FormData();
    formData.append('lot_id', lotData.lot_id);
    formData.append('note', lotData.note);
    formData.append('lot_type', lotData.lot_type);
    formData.append('num_item', lotData.num_item);
    if (file) formData.append('lotFile', file);
    if (image) formData.append('lotImage', image);
  
    try {
      const response = await fetch(`http://localhost:5000/lots/${lotId}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update lot');
      }
  
      const updatedLot = await response.json();
      console.log('Lot updated successfully:', updatedLot);
      setIsDataUpdated(true);
      refreshData(); // Refresh data after successful update
      // Reset file and image states
      setFile(null);
      setImage(null);
    } catch (error) {
      console.error('Error updating lot:', error);
    }
  };

  const handleClose = () => {
    if (isDataUpdated) {
      onClose();
      window.location.reload(); // Refresh the page
    } else {
      onClose();
      window.location.reload();
    }
  };

  const toggleCard = () => {
    setIsCardExpanded(!isCardExpanded);
  };


  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-4/5 max-h-screen overflow-y-auto relative">
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
              <button onClick={toggleCard} className="focus:outline-none">
                {isCardExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            {isCardExpanded && (
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
      
    </div>
  </div>
);
};

export default ModalManageLot;