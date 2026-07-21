import "dotenv/config";
import app from "./app";
import { startMqttPublisher } from "./src/dal/mqttDal";

const PORT = process.env.PORT || 4001;

const start = async () => {
  try {
    await startMqttPublisher();
  } catch (error: any) {
    console.error(
      `[mqtt] failed to connect (is the broker running?): ${error.message}`
    );
    console.error(
      "[mqtt] run: cd mqtt-broker && npm start  (then restart this app for mqtt mode)"
    );
  }

  app.listen(PORT, () => {
    console.log(`Third-party backend is running on port ${PORT}`);
  });
};

start();
