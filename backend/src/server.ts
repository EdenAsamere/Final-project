import dotenv from "dotenv";
import app from "./app";
dotenv.config(); // Load .env file

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
