import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
    {
        senderId: String,
        senderRole: {
            type: String,
            enum: ["student", "teacher", "admin"],
        },
        message: String,
    },
    { timestamps: true }
);

const notificationSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,
        },

        message: {
            type: String,
            required: true,
        },

        images: {
            type: String,
            default: null,
            
        },

        senderRole: {
            type: String,
            required: true,
            enum: ["student", "teacher", "admin"],
        },

        recipientType: {
            type: String,
            required: true,
            enum: ["all", "individual", "everyone"],
        },

        recipientId: {
            type: String,
            default: null,
        },

        canReply: {
            type: Boolean,
            default: true, // replaces ALTER TABLE canReply
        },

        replies: [
            {
                senderId: String,
                senderRole: String,
                message: String,
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true, // replaces timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;