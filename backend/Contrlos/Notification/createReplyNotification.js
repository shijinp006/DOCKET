import mongoose from "mongoose";
import Notification from "../../Models/Notification/notificationSchema.js";

/**
 * Add Reply to Notification
 */
export const addReplyToNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, senderId, senderRole } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    if (!message || !senderId || !senderRole) {
      return res.status(400).json({
        success: false,
        message: "message, senderId and senderRole are required",
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (!notification.canReply) {
      return res.status(403).json({
        success: false,
        message: "Replies are disabled for this notification",
      });
    }

    const newReply = {
      senderId,
      senderRole,
      message,
    };

    notification.replies.push(newReply);
    await notification.save();

    const addedReply = notification.replies[notification.replies.length - 1];

    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      data: addedReply,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};