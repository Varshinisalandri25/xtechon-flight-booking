const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

module.exports = async function generateTicket(res, booking) {
  const doc = new PDFDocument({ margin: 50 });

  // Download headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Ticket_${booking.pnr}.pdf`
  );

  doc.pipe(res);

  /* ======================
     HEADER
  ====================== */
  doc
    .fontSize(26)
    .fillColor("#0ea5e9")
    .text("✈ XTechon Airways", { align: "center" });

  doc
    .moveDown(0.3)
    .fontSize(12)
    .fillColor("#555")
    .text("E-Ticket / Boarding Pass", { align: "center" });

  doc.moveDown(1.5);

  /* ======================
     MAIN TICKET BOX
  ====================== */
  const boxTop = doc.y;

  doc
    .roundedRect(40, boxTop, 520, 320, 14)
    .lineWidth(2)
    .stroke("#0ea5e9");

  doc.moveDown(1.2);

  /* ======================
     PASSENGER INFO
  ====================== */
  doc
    .fontSize(15)
    .fillColor("#000")
    .text("Passenger Details", { underline: true });

  doc
    .moveDown(0.5)
    .fontSize(12)
    .fillColor("#000")
    .text(`Name: ${booking.passengerName}`)
    .text(`Email: ${booking.passengerEmail}`)
    .text(`PNR: ${booking.pnr}`, {
      continued: false,
    });

  doc.moveDown(1);

  /* ======================
     FLIGHT INFO
  ====================== */
  doc
    .fontSize(15)
    .fillColor("#000")
    .text("Flight Details", { underline: true });

  // Date & Time (generated safely)
  const bookingDate = new Date(booking.createdAt || Date.now());
  const dateStr = bookingDate.toLocaleDateString("en-IN");
  const timeStr = bookingDate.toLocaleTimeString("en-IN");

  doc
    .moveDown(0.5)
    .fontSize(12)
    .fillColor("#000")
    .text(`Airline: ${booking.Flight.airline}`)
    .text(
      `Route: ${booking.Flight.source}  ✈  ${booking.Flight.destination}`
    )
    .text(`Journey Date: ${dateStr}`)
    .text(`Departure Time: ${timeStr}`)
    .text(`Seat(s): ${booking.seats}`)
    .text(`Amount Paid: ₹${booking.pricePaid}`);

  /* ======================
     QR CODE
  ====================== */
  const qrData = `
PNR: ${booking.pnr}
Passenger: ${booking.passengerName}
From: ${booking.Flight.source}
To: ${booking.Flight.destination}
Date: ${dateStr}
Time: ${timeStr}
Seat(s): ${booking.seats}
`;

  const qrImage = await QRCode.toDataURL(qrData);

  doc.image(qrImage, 430, boxTop + 50, {
    width: 90,
  });

  doc
    .fontSize(10)
    .fillColor("#555")
    .text("Scan at Airport", 430, boxTop + 150, {
      width: 90,
      align: "center",
    });

  /* ======================
     FOOTER
  ====================== */
  doc
    .moveDown(4)
    .fontSize(11)
    .fillColor("#666")
    .text(
      "Have a safe and pleasant journey ✈️\nThank you for choosing XTechon Airways",
      { align: "center" }
    );

  doc.end();
};








