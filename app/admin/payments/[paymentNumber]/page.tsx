"use client";

import { useParams } from 'next/navigation';  // Use only useParams for dynamic route parameters
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface TrackingData {
    tracking_id: string;
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
    other: number;
    image_item_paths: string[];
    lot_type: string;
  }

const PaymentDetailsPage: React.FC = () => {
    const { paymentNumber } = useParams(); // Extract dynamic route parameter
    const [paymentData, setPaymentData] = useState<any>(null);
    const [trackingDetails, setTrackingDetails] = useState<any[]>([]); // To store detailed tracking info
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRows, setSelectedRows] = useState<number[]>([]); // For row selection

        // Function to handle row selection
    const handleSelectRow = (index: number) => {
        setSelectedRows((prevSelected) =>
        prevSelected.includes(index)
            ? prevSelected.filter((i) => i !== index)
            : [...prevSelected, index]
        );
    };
    useEffect(() => {
        if (paymentNumber) {
            console.log("useEffect triggered with paymentNumber:", paymentNumber); 
            const fetchPaymentDetails = async () => {
                try {
                    const response = await axios.get(`/api/payments/${paymentNumber}`);  // Fetch payment details by paymentNumber
                    setPaymentData(response.data);
                    const trackingPromises = response.data.tracking.map((track: any) =>
                        axios.get(`http://localhost:5001/tracking/${track.trackingID}`) // Adjusted for your external tracking endpoint
                            );
                    // Wait for all tracking details to be fetched
                    const trackingResponses = await Promise.all(trackingPromises);
                    const detailedTrackingData = trackingResponses.map((res) => res.data);
                    setTrackingDetails(detailedTrackingData); // Store detailed tracking data

                    setLoading(false);
                    } catch (error) {
                    setError('Error fetching payment or tracking details');
                    setLoading(false);
                }
            };

        fetchPaymentDetails();
        }
    }, [paymentNumber]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
  
    const { tracking: trackingData } = paymentData || [];
  
    const calculateVolume = (width: number, length: number, height: number) => {
      return width * length * height / 1000; // Adjust this calculation based on your logic
    };

    return (
        <div>
            <h1 className='text-2xl'> Payment: {paymentNumber}</h1>
            <table className="table table-width-1" style={{ fontSize: 14 }}>
                <thead>
                    <tr className="text-center">
                        <th>รหัสพัสดุ</th>
                        <th>รูปภาพ</th>
                        <th>รหัสลูกค้า</th>
                        <th>จำนวน</th>
                        <th>ประเภท</th>
                        <th>ราคา</th>
                    </tr>
                </thead>

                <tbody>
                {trackingDetails && trackingDetails.length > 0 ? (
                    trackingDetails.map((tracking, index) => (
                    <tr key={index} className="text-center">
                        {/* <td>
                        <input
                            type="checkbox"
                            checked={selectedRows.includes(index)}
                            onChange={() => handleSelectRow(index)}
                        />
                        </td> */}
                        <td>{tracking.tracking_id}</td> {/* Update based on your tracking schema */}
                        <td>
                        <div className="image-gallery" style={{ display: 'flex', gap: '5px' }}>
                            {tracking.image_item_paths && tracking.image_item_paths.length > 0 ? (
                            tracking.image_item_paths.map((imagePath: string, i: number) => (
                                <div
                                key={i}
                                className="image-wrapper"
                                style={{ width: '50px', height: '50px', cursor: 'pointer' }}
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
                        <td>{tracking.user_id}</td> {/* Ensure the correct user data */}
                        <td>{calculateVolume(tracking.wide, tracking.long, tracking.high)}</td> {/* Make sure 'quantity' exists */}
                        <td>{tracking.type_item}</td> {/* Adjust based on schema */}
                        <td>{(calculateVolume(tracking.wide, tracking.long, tracking.high) * tracking.number ).toFixed(2)} ฿</td> {/* Assuming price is directly available */}
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan={7}>No tracking data available for this payment.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default PaymentDetailsPage;
