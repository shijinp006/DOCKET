import otpStore from "../../utils/otpStore.js";

export const verifyOtp = (req, res) => {
  const { registerNumber, otp } = req.body;

  if (!registerNumber || !otp) {
    return res.status(400).json({ error: "Register number and OTP are required" });
  }

  const id = registerNumber.toUpperCase();
  const storedOtp = otpStore.get(id);

  if (!storedOtp) {
    return res.status(400).json({ error: "OTP expired or not found" });
  }

  if (storedOtp === otp) {
    otpStore.delete(id); // Clear used OTP

    return res.json({ message: "OTP verified" });
  } else {
    return res.status(400).json({ error: "Invalid OTP" });
  }
};