import mqtt, { MqttClient } from "mqtt";
import { resolveCallback } from "./ageDal";

const MQTT_URL = process.env.MQTT_URL || "mqtt://localhost:1883";
export const MQTT_TOPIC = process.env.MQTT_TOPIC || "age/results";

let client: MqttClient | null = null;
let subscriberReady = false;

const subscribeToAgeResults = (mqttClient: MqttClient): Promise<void> =>
  new Promise((resolve, reject) => {
    console.log(`[mqtt] connected, subscribing to ${MQTT_TOPIC}`);
    mqttClient.subscribe(MQTT_TOPIC, { qos: 0 }, (err) => {
      if (err) {
        console.error("[mqtt] subscribe failed:", err.message);
        reject(err);
        return;
      }
      console.log(`[mqtt] subscribed to ${MQTT_TOPIC}`);
      resolve();
    });
  });

const handleAgeResultMessage = (topic: string, payload: Buffer) => {
  if (topic !== MQTT_TOPIC) return;

  try {
    const data = JSON.parse(payload.toString());
    const { jobId, dob, age } = data;

    if (
      typeof jobId !== "string" ||
      typeof dob !== "string" ||
      typeof age !== "number"
    ) {
      console.error("[mqtt] invalid payload:", payload.toString());
      return;
    }

    const ok = resolveCallback({ jobId, dob, age });
    if (ok) {
      console.log(`[mqtt] resolved pending job ${jobId}`);
    } else {
      console.warn(`[mqtt] no pending request for job ${jobId}`);
    }
  } catch (error: any) {
    console.error("[mqtt] failed to handle message:", error.message);
  }
};

const connectMqttClient = (): Promise<MqttClient> =>
  new Promise((resolve, reject) => {
    if (client?.connected) {
      resolve(client);
      return;
    }

    console.log(`[mqtt] connecting to ${MQTT_URL}`);
    client = mqtt.connect(MQTT_URL, {
      reconnectPeriod: 2000,
      connectTimeout: 5_000,
    });

    const timer = setTimeout(() => {
      if (!client?.connected) {
        reject(new Error(`Timed out connecting to ${MQTT_URL}`));
      }
    }, 5_000);

    client.once("connect", () => {
      clearTimeout(timer);
      resolve(client!);
    });
  });

export const startMqttSubscriber = async (): Promise<void> => {
  const mqttClient = await connectMqttClient();

  if (!subscriberReady) {
    mqttClient.on("connect", () => {
      void subscribeToAgeResults(mqttClient).catch((err) => {
        console.error("[mqtt] resubscribe failed:", err.message);
      });
    });
    mqttClient.on("message", handleAgeResultMessage);
    subscriberReady = true;
  }

  await subscribeToAgeResults(mqttClient);
};
