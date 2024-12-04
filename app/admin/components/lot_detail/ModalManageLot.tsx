import React, { useState, useEffect } from "react";
import LotDetails from "./LotDetails";
import AddTrackingID from "./AddTrackingID";
import TrackingDataTable from "./TrackingDataTable";
import { LotData, TrackingData } from "./types";

interface ModalManageLotProps {
  show: boolean;
  onClose: () => void;
  lotId: string;
}

const ModalManageLot: React.FC<ModalManageLotProps> = ({
  show,
  onClose,
  lotId,
}) => {
  const [lotData, setLotData] = useState<LotData>({
    lot_id: "",
    note: "",
    lot_type: "1",
    num_item: 0,
  });
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/lots/${lotId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch lot data");
      }
      const data = await response.json();
      setLotData(data);
      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error fetching lot data"
      );
      console.error("Error fetching lot data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackingData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5001/tracking/lot/${lotId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tracking data");
      }
      const data = await response.json();

      // Handle empty tracking data
      if (Array.isArray(data) && data.length === 0) {
        console.log("No tracking data available for this lot.");
        setTrackingData([]); // Set trackingData to an empty array
      } else {
        setTrackingData(data); // Set the tracking data from the response
      }

      setError(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error fetching tracking data"
      );
      console.error("Error fetching tracking data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && lotId) {
      refreshData();
      fetchTrackingData();
    }
  }, [show, lotId]);

  const handleClose = () => {
    if (isDataUpdated) {
      onClose();
      refreshData(); // Refresh data to reflect any changes
    } else {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-h-screen overflow-y-auto relative">
        <header className="modal-header sticky top-0 z-10 bg-white p-4 border-b flex justify-between items-center">
          <h5 className="modal-title text-xl font-semibold">จัดการล็อตสินค้า</h5>
          <button
            type="button"
            className="close text-2xl font-bold hover:text-gray-700"
            onClick={handleClose}
          >
            &times;
          </button>
        </header>

        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500 text-center">{error}</div>
        ) : (
          <>
            <LotDetails
              lotData={lotData}
              setLotData={setLotData}
              refreshData={refreshData}
              setIsDataUpdated={setIsDataUpdated}
            />

            <AddTrackingID
              lotData={lotData}
              refreshData={refreshData}
              fetchTrackingData={fetchTrackingData}
            />

            {trackingData.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No tracking data available for this lot.
              </div>
            ) : (
              <TrackingDataTable
                lotData={lotData}
                trackingData={trackingData}
                fetchTrackingData={fetchTrackingData}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ModalManageLot;
