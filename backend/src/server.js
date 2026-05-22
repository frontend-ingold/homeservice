import cors from "cors";
import express from "express";
import { services } from "./data/services.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/services", (req, res) => {
  res.json({ services });
});

app.post("/api/bookings", (req, res) => {
  const { name, phone, email, serviceId, address, date, notes } = req.body;

  if (!name || !phone || !serviceId || !address) {
    return res.status(400).json({
      message: "name, phone, serviceId, and address are required"
    });
  }

  const service = services.find((item) => item.id === Number(serviceId));

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  res.status(201).json({
    message: "Booking request received",
    booking: {
      id: Date.now(),
      name,
      phone,
      email: email || "",
      address,
      date: date || "Flexible",
      notes: notes || "",
      service
    }
  });
});

app.listen(port, () => {
  console.log(`Backend API running on http://localhost:${port}`);
});
