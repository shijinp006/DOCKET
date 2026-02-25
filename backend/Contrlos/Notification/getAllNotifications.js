import Notification from "../../Models/Notification/notificationSchema.js";

/**
 * Get All Notifications
 * Optional query params:
 * ?recipientType=all
 * ?recipientId=xxxxx
 */
export const getAllNotifications = async (req, res) => {
  try {
    const { recipientType, recipientId } = req.query;

    const filter = {};

    if (recipientType) {
      filter.recipientType = recipientType;
    }

    if (recipientId) {
      filter.recipientId = recipientId;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .lean(); // better performance for read-only

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};