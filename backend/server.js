const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use("/api/projects", require("./routes/projects"));
app.use("/api/employees", require("./routes/employees"));
app.use("/api/inspection-report", require("./routes/inspectionReport"));
app.use("/api/tickets", require("./routes/tickets"));
app.use("/api/managers", require("./routes/managers"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
