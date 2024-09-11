// pages/api/payment/index.js
import dbConnect from '../../../utils/dbConnect';
import Payment from '../../../models/Payment';

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const payments = await Payment.find({});
        res.status(200).json(payments);
      } catch (error) {
        res.status(500).json({ message: "Unable to retrieve payments", error: error.message });
      }
      break;
    case 'POST':
      try {
        // Assuming multiple payments can be posted at once
        const payments = await Payment.insertMany(req.body); // If expecting an array directly
        res.status(201).json(payments);
      } catch (error) {
        res.status(400).json({ message: "Error creating payments", error: error.message });
      }
      break;
    default:
      res.status(405).end(); // Method Not Allowed
      break;
  }
}