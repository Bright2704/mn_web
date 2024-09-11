// pages/api/orders/index.js
import dbConnect from '../../../utils/dbConnect';
import Order from '../../../models/Order';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const orders = await Order.find({}); // Fetch all orders
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}