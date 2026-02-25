import Event from "../../Models/Events/eventsSchema.js";



/**
 * Update Event
 */
export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            {
                ...req.body,
                sponsorImages: req.body.sponsorImages || [],
            },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found",
            });
        }

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