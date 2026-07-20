import "dotenv/config";
import app from "./app";

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Third-party backend is running on port ${PORT}`);
});
