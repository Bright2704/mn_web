import { connectMongoDB } from "@/lib/mongodb"
import User from '@/models/user'

async function generateUserId() {
    try {
        await connectMongoDB();

        const latestUser = await User.findOne({}, { userId: 1 })
            .sort({ userId: -1 })
            .lean()
            .exec();

        let nextNumber = 1;

        if (latestUser && latestUser.userId) {
            const match = latestUser.userId.match(/user(\d+)/);
            if (match) {
                nextNumber = parseInt(match[1], 10) + 1;
            }
        }

        const paddedNumber = nextNumber.toString().padStart(4, '0');
        return `user${paddedNumber}`;
    } catch (error) {
        console.error("Error generating userId:", error);
        throw new Error("Failed to generate userId");
    }
}

export default generateUserId;