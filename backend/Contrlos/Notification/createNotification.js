import Notification from "../../Models/Notification/notificationSchema.js";

/**
 * Create Notification
 */
export const createNotification = async (req, res) => {
  try {
    const {
      subject,
      message,
      image,
      senderRole,
      recipientType,
      recipientId,
      canReply,
    } = req.body;

    // Basic validation
    if (!subject || !message || !senderRole || !recipientType) {
      return res.status(400).json({
        success: false,
        message: "subject, message, senderRole and recipientType are required",
      });
    }

    const notification = await Notification.create({
      subject,
      message,
      image: image || null,
      senderRole,
      recipientType,
      recipientId: recipientType === "individual" ? recipientId : null,
      canReply: canReply !== undefined ? canReply : true,
      replies: [], // default empty
    });

    res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};