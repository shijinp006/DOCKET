import otpStore from "../../utils/otpStore.js";

export const sendOtp = (req, res) => {
  const { registerNumber } = req.body;

  if (!registerNumber) {
    return res.status(400).json({ error: "ID is required" });
  }

  const id = registerNumber.toUpperCase();

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store in memory
  otpStore.set(id, otp);

  console.log(`OTP for ${id}: ${otp}`);

  // Optional: auto remove after 5 minutes
  setTimeout(() => {
    otpStore.delete(id);
  }, 5 * 60 * 1000);

  return res.json({
    message: "OTP sent successfully",
    otp, // Remove in production
  });
};