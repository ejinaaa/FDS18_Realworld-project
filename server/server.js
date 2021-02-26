const express = require("express");
const path = require("path");
const app = express();

app.use('/static', express.static(path.resolve(__dirname, 'dist', 'static')));

app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(process.env.PORT || 9000, () => {
  console.log("Server Running... on process.env.PORT || http://localhost:9000");
});
