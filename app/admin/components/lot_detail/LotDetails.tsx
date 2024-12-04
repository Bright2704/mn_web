import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { LotData } from "./types";

interface LotDetailsProps {
  lotData: LotData;
  setLotData: (data: LotData) => void;
  refreshData: () => void;
  setIsDataUpdated: (updated: boolean) => void;
}

const LotDetails: React.FC<LotDetailsProps> = ({
  lotData,
  setLotData,
  refreshData,
  setIsDataUpdated,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCardExpanded, setIsCardExpanded] = useState<{
    [key: number]: boolean;
  }>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setLotData({ ...lotData, [id]: value });
  };

  const handleLotTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLotData({ ...lotData, lot_type: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const toggleCard = (cardId: number) => {
    // Toggle the specific card by updating its state
    setIsCardExpanded((prevState) => ({
      ...prevState,
      [cardId]: !prevState[cardId],
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("lot_id", lotData.lot_id);
      formData.append("note", lotData.note);
      formData.append("lot_type", lotData.lot_type);
      formData.append("num_item", String(lotData.num_item));

      if (file) formData.append("lotFile", file);
      if (image) formData.append("lotImage", image);

      const response = await fetch(
        `http://localhost:5001/lots/${lotData.lot_id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update lot");
      }

      // Refresh data and update UI
      setIsDataUpdated(true);
      await refreshData();
      setFile(null);
      setImage(null);

      alert("Lot data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-body p-2">
          <div className="card">
            <div className="header-cardx p-2 flex justify-between items-center">
              <h3 className="mb-0">ล๊อตสินค้า : {lotData.lot_id}</h3>
              <button
                onClick={() => toggleCard(1)}
                className="focus:outline-none"
              >
                {isCardExpanded[1] ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>
            {isCardExpanded[1] && (
              <div className="p-2">
                <div className="row">
                  <div className="col-md-12">
                    <div role="group" className="form-row form-group">
                      <label htmlFor="lot_id" className="col-md col-form-label">
                        หมายเลขรายการ : {lotData.lot_id}
                      </label>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div role="group" className="form-row form-group">
                      <label htmlFor="note" className="col-md-3 col-form-label">
                        หมายเหตุ:
                      </label>
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
                      <label
                        htmlFor="lot_type"
                        className="col-md-3 col-form-label"
                      >
                        ประเภทการขนส่ง:
                      </label>
                      <div className="col">
                        <div className="demo-inline-spacing mt-n1">
                          <div className="custom-control custom-radio">
                            <input
                              type="radio"
                              name="lot_type"
                              className="custom-control-input"
                              value="รถ"
                              id="car-transport"
                              checked={lotData.lot_type === "รถ"}
                              onChange={handleLotTypeChange}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="car-transport"
                            >
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
                              checked={lotData.lot_type === "เรือ"}
                              onChange={handleLotTypeChange}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="ship-transport"
                            >
                              เรือ
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div role="group" className="form-row form-group">
                      <label
                        htmlFor="num_item"
                        className="col-md-3 col-form-label"
                      >
                        จำนวนที่ส่งออก:
                      </label>
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
                      <label
                        htmlFor="file-upload"
                        className="col-md-3 col-form-label"
                      >
                        แนบไฟล์:
                      </label>
                      <div className="col">
                        <input
                          id="file-upload"
                          type="file"
                          onChange={handleFileChange}
                          className="form-control-file"
                        />
                        {lotData.file_path && (
                          <a
                            href={`http://localhost:5001${lotData.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View current file
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div role="group" className="form-row form-group">
                      <label
                        htmlFor="image-upload"
                        className="col-md-3 col-form-label"
                      >
                        แนบรูปภาพ:
                      </label>
                      <div className="col">
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="form-control-file"
                        />
                        {lotData.image_path && (
                          <Image
                            src={`http://localhost:5001${lotData.image_path}`}
                            alt="Lot"
                            className="mt-2"
                            width={200}
                            height={200}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
  );
};

export default LotDetails;
