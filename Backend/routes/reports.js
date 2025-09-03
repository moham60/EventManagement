const express = require("express");
const router = express.Router();
const Event = require("../Models/Event");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");

// 📊 CSV Export
router.get("/csv", async (req, res) => {
  try {
    const events = await Event.find();

    const fields = ["title", "date", "price", "totalseats", "bookedSeats"];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(events);

    res.header("Content-Type", "text/csv");
    res.attachment("events_report.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📊 Excel Export
router.get("/excel", async (req, res) => {
  try {
    const events = await Event.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Events Report");

    worksheet.columns = [
      { header: "Title", key: "title", width: 30 },
      { header: "Date", key: "date", width: 20 },
      { header: "Price", key: "price", width: 15 },
      { header: "Total Seats", key: "totalseats", width: 15 },
      { header: "Booked Seats", key: "bookedSeats", width: 15 },
    ];

    events.forEach((e) => {
      worksheet.addRow({
        title: e.title,
        date: e.date,
        price: e.price,
        totalseats: e.totalseats,
        bookedSeats: e.bookedSeats,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=events_report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
