const express = require("express");
const { initializeDatabase } = require("./db/db.connect.js");
const Hotel = require("./models/hotel.model.js");

const app = express();

app.use(express.json());

initializeDatabase();

//CORS configuration
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.post("/hotels", async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    const savedHotel = await hotel.save();

    res.status(201).json({
      message: "Hotel created successfully",
      data: savedHotel,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

app.get("/hotels", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/hotels/:hotelName", async (req, res) => {
  try {
    const hotel = await Hotel.findOne({
      name: req.params.hotelName,
    });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json(hotel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/hotel/delete/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);

    if (!hotel) {
      return res.status(404).json({ error: "Hotel not found" });
    }

    res.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
