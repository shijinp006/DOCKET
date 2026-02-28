import Notification from "../../Models/Notification/notificationSchema.js";

export const createNotification = async (req, res) => {
  try {
    const {
      subject,
      message,
      senderRole,
      recipientType,
      recipientId,
      canReply,
    } = req.body;

    console.log(req.body, "notification body");
    console.log(req.files, "notification files");

    // 🔎 Validation
    if (!subject || !message || !senderRole || !recipientType) {
      return res.status(400).json({
        success: false,
        message: "subject, message, senderRole and recipientType are required",
      });
    }

    let images = null;
    let brochure = null;

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        if (file.mimetype === "application/pdf") {
          brochure = file.filename; // only one brochure allowed
        }
        else if (file.mimetype.startsWith("image/")) {
          images = file.filename; // allow only one image (overwrite previous)
        }
      }
    }

    const notification = await Notification.create({
      subject: subject.trim(),
      message: message.trim(),
      images,          // array of images
      brochure,        // single PDF
      senderRole,
      recipientType,
      recipientId: recipientType === "individual" ? recipientId : null,
      canReply: canReply ?? true,
      replies: [],
    });

    return res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: notification,
    });

  } catch (error) {
    console.error("Create notification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};