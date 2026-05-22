const services = [
  { id: 1, title: "Carpenter", price: "From $49", duration: "Same day" },
  { id: 2, title: "Plumber", price: "From $59", duration: "60 min arrival" },
  { id: 3, title: "Painter", price: "Free estimate", duration: "Next day" },
  { id: 4, title: "Electrician", price: "From $65", duration: "45 min arrival" },
  { id: 5, title: "Home Cleaning", price: "From $129", duration: "2-4 hours" },
  { id: 6, title: "AC Repair", price: "From $89", duration: "Same day" },
  { id: 7, title: "Pest Control", price: "From $149", duration: "90 min service" },
  { id: 8, title: "Gardener", price: "From $55", duration: "Scheduled" },
  { id: 9, title: "Appliance Repair", price: "From $75", duration: "Same day" },
  { id: 10, title: "House Shifting", price: "Quote based", duration: "Booked slot" }
];

export default function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, phone, email, serviceId, address, date, notes } = req.body || {};

  if (!name || !phone || !serviceId || !address) {
    return res.status(400).json({
      message: "name, phone, serviceId, and address are required"
    });
  }

  const service = services.find((item) => item.id === Number(serviceId));

  if (!service) {
    return res.status(404).json({ message: "Service not found" });
  }

  return res.status(201).json({
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
}
