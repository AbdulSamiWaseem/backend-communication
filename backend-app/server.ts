import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend app is running on port ${PORT}`);
  console.log(
    `DEFAULT_COMMUNICATION_MODE=${process.env.DEFAULT_COMMUNICATION_MODE || "callback"}`
  );
  console.log(
    `THIRD_PARTY_URL=${process.env.THIRD_PARTY_URL || "http://localhost:4001"}`
  );
});
