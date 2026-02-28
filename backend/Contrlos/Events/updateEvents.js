import Event from "../../Models/Events/eventsSchema.js";



/**
 * Update Event
 */
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const existingEvent = await Event.findById(id);

        if (!existingEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

        let poster = existingEvent.poster;
        let priceImage = existingEvent.priceImage;
        let sponsorImages = existingEvent.sponsorImages || [];

        // 🔥 Handle uploaded files (same "file" name)
        if (req.files && req.files.length > 0) {
            const imageFiles = req.files.filter(file =>
                file.mimetype.startsWith("image/")
            );

            if (imageFiles.length > 0) {
                poster = imageFiles[0].filename;
            }

            if (imageFiles.length > 1) {
                priceImage = imageFiles[1].filename;
            }

            if (imageFiles.length > 2) {
                sponsorImages = imageFiles
                    .slice(2)
                    .map(file => file.filename);
            }
        }

        const updateData = {
            ...req.body,
            poster,
            priceImage,
            sponsorImages,
        };

        // Convert numeric fields (FormData sends strings)
        [
            "overallIndividualLimit",
            "departmentIndividualLimit",
            "membersPerTeamFromDepartment",
            "teamsPerDepartment",
            "latitude",
            "longitude",
        ].forEach(field => {
            if (updateData[field] !== undefined) {
                updateData[field] = Number(updateData[field]) || 0;
            }
        });

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: updatedEvent,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};