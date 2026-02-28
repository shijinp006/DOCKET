import User from "../../Models/User/UserSchema.js";

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(req.body, "body");

        const updateData = {};
        // Only update if value exists
        if (req.body.name) updateData.name = req.body.name;
        if (req.body.mobile) updateData.mobile = req.body.mobile;
        if (req.body.department) updateData.department = req.body.department;
        if (req.body.gender) updateData.gender = req.body.gender;

        // If new profile image uploaded

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            data: updatedUser,
        });

    } catch (error) {
        console.error("Update user error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

export const updateProfileImage = async (req, res) => {
    try {
        const { id } = req.params;



        // Check if file exists
        if (!req.files) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        // Update the user profile image
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: { profilePicture: req.files[0].filename } }, // Save just filename
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.json({
            success: true,
            message: "Profile image updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Update profile image error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};