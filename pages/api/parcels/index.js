// pages/api/parcels/index.js
import dbConnect from '../../../utils/dbConnect';
import Parcel from '../../../models/Parcel';
import morgan from 'morgan';

const logger = morgan('combined');

export default async function handler(req, res) {
    logger(req, res, async (err) => {
        if (err) {
          return res.status(500).json({ message: "Logging Error", error: err.message });
        }
        await dbConnect();

        switch (req.method) {
            case 'GET':
            try {
                const parcels = await Parcel.find({});
                res.status(200).json(parcels);
            }   catch (error) {
                res.status(500).json({ message: "Unable to retrieve parcels", error: error.message });
            }
            break;
            case 'PUT':
                try {
                    const { parcels } = req.body;  // Expecting parcels to be an array of parcel objects
                    if (!Array.isArray(parcels) || parcels.length === 0) {
                    return res.status(400).json({ message: "No parcels provided or incorrect data format." });
                    }
                
                    const updates = parcels.map(parcel => {
                    const { _id, pay } = parcel;
                    if (!_id) {
                        throw new Error("Missing parcel ID");
                    }
                    return Parcel.findByIdAndUpdate(_id, { pay }, { new: true });
                    });
                
                    const updatedParcels = await Promise.all(updates);  // Execute all update promises
                    res.status(200).json(updatedParcels);
                } catch (error) {
                    res.status(500).json({ message: "Error updating parcels", error: error.message });
                }
                break;
            default:
                res.status(405).end(); // Method Not Allowed
                break;
        }
    });
}