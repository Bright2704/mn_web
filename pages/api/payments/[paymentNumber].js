import dbConnect from '../../../utils/dbConnect';
import Payment from '../../../models/Payment';

export default async function handler(req, res) {
  const { paymentNumber } = req.query; // Extract paymentNumber from query

  await dbConnect();

  switch (req.method) {
    // Handle GET request to retrieve a payment by paymentNumber
    case 'GET':
      try {
        const payment = await Payment.findOne({ paymentNumber });

        if (!payment) {
          return res.status(404).json({ message: `Payment with number ${paymentNumber} not found` });
        }

        res.status(200).json(payment);
      } catch (error) {
        res.status(500).json({ message: "Unable to retrieve payment", error: error.message });
      }
      break;

    // Handle PUT request to update a payment by paymentNumber
    case 'PUT':
      try {
        const updatedPayment = await Payment.findOneAndUpdate(
          { paymentNumber },
          { $set: req.body }, // Update fields sent in the request body
          { new: true } // Return the updated document
        );

        if (!updatedPayment) {
          return res.status(404).json({ message: `Payment with number ${paymentNumber} not found` });
        }

        res.status(200).json(updatedPayment);
      } catch (error) {
        res.status(500).json({ message: "Unable to update payment", error: error.message });
      }
      break;

    // Handle DELETE request to remove a payment by paymentNumber
    case 'DELETE':
      try {
        const deletedPayment = await Payment.findOneAndDelete({ paymentNumber });

        if (!deletedPayment) {
          return res.status(404).json({ message: `Payment with number ${paymentNumber} not found` });
        }

        res.status(200).json({ message: `Payment ${paymentNumber} successfully deleted` });
      } catch (error) {
        res.status(500).json({ message: "Unable to delete payment", error: error.message });
      }
      break;

    // Handle other methods (e.g., POST)
    default:
      res.status(405).json({ message: `Method ${req.method} not allowed` });
      break;
  }
}
