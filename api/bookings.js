module.exports = async function handler(req, res) {
  const { default: bookingsHandler } = await import("../frontend/api/bookings.js");

  return bookingsHandler(req, res);
};
