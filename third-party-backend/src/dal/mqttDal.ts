import mqtt, { MqttClient } from "mqtt";

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";
export const MQTT_TOPIC = process.env.MQTT_TOPIC || "age/results";

let client: MqttClient | null = null;
let connectPromise: Promise<void> | null = null;

const connectMqttClient = (): Promise<void> => {
  if (client?.connected) {
    return Promise.resolve();
  }

  if (connectPromise) {
    return connectPromise;
  }

  connectPromise = new Promise((resolve, reject) => {
    console.log(`[mqtt] connecting to ${MQTT_URL}`);
    client = mqtt.connect(MQTT_URL, {
      reconnectPeriod: 2000,
      connectTimeout: 5_000,
    });

    const timer = setTimeout(() => {
      if (!client?.connected) {
        connectPromise = null;
        reject(new Error(`Timed out connecting to ${MQTT_URL}`));
      }
    }, 5_000);

    client.on("connect", () => {
      clearTimeout(timer);
      console.log("[mqtt] publisher connected");
      resolve();
    });
  });

  return connectPromise;
};

export const startMqttPublisher = (): Promise<void> => connectMqttClient();

export const publishAgeResult = async (payload: {
  jobId: string;
  dob: string;
  age: number;
}): Promise<void> => {
  await connectMqttClient();

  const body = JSON.stringify(payload);

  await new Promise<void>((resolve, reject) => {
    client!.publish(MQTT_TOPIC, body, { qos: 0 }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(`[mqtt] published job ${payload.jobId} → ${MQTT_TOPIC}`);
      resolve();
    });
  });
};
