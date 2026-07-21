import "dotenv/config";
import app from "./app";
import { startMqttSubscriber } from "./src/dal/mqttDal";

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await startMqttSubscriber();
  } catch (error: any) {
    console.error(
      `[mqtt] failed to connect (is the broker running?): ${error.message}`
    );
    console.error(
      "[mqtt] run: cd mqtt-broker && npm start  (then restart this app for mqtt mode)"
    );
  }

  app.listen(PORT, () => {
    console.log(`Backend app is running on port ${PORT}`);
  });
};

start();
