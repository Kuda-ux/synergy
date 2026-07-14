/**
 * Educational guides. Content here is general engineering education written
 * for this site — it makes no claims about Synergy Dynamics stock or pricing.
 * Stored in code for the first slice; moves to the database with the admin CMS phase.
 */
export interface Guide {
  slug: string;
  title: string;
  topic: string;
  excerpt: string;
  minutes: number;
  sections: { heading: string; body: string }[];
}

const guides: Guide[] = [
  {
    slug: "arduino-vs-esp32",
    title: "Arduino vs ESP32: which board should you start with?",
    topic: "Microcontrollers",
    minutes: 6,
    excerpt:
      "Both are excellent first boards, but they suit different projects. Here's how to choose based on connectivity, power and learning curve.",
    sections: [
      { heading: "The short answer", body: "If your project needs Wi-Fi or Bluetooth, start with an ESP32. If you want the gentlest learning curve, the largest tutorial library and rock-solid 5 V compatibility with classic shields and sensors, start with an Arduino Uno." },
      { heading: "Where Arduino shines", body: "The Uno's ecosystem is unmatched for beginners: nearly every sensor tutorial ever written targets it, it tolerates wiring mistakes well, and its 5 V logic matches many classic modules. It is the board most schools teach first for good reason." },
      { heading: "Where ESP32 shines", body: "The ESP32 gives you a dual-core processor, far more memory, and built-in Wi-Fi and Bluetooth for a lower price than most official Arduinos. For IoT dashboards, remote sensors and connected robots it is the obvious choice. Note that it uses 3.3 V logic, so some 5 V sensors need a level shifter or divider." },
      { heading: "Can you use both?", body: "Absolutely — many projects pair them, and the Arduino IDE programs both. A common path is learning fundamentals on an Uno, then moving to ESP32 when your projects need connectivity." },
    ],
  },
  {
    slug: "how-to-choose-a-robotics-kit",
    title: "How to choose a robotics kit",
    topic: "Robotics",
    minutes: 7,
    excerpt:
      "Age, goals and budget all matter. A practical framework for parents, teachers and clubs choosing their first (or next) robotics kit.",
    sections: [
      { heading: "Start with the learner, not the robot", body: "For ages 8–12, look for snap-together or block-coded kits that reward quick wins. Teens and adults get more from kits that involve real wiring, real code and a little frustration — that is where the learning happens." },
      { heading: "Check what's actually in the box", body: "A good kit lists its controller, motors, sensors and battery system clearly. Watch for kits that need batteries, tools or a soldering iron that aren't included. Spare parts availability matters more than glossy packaging." },
      { heading: "Prefer open platforms", body: "Kits built on Arduino, ESP32, micro:bit or Raspberry Pi keep growing after the manual ends: you can add sensors, swap code and reuse parts in the next project. Closed proprietary systems often dead-end once the guided projects are done." },
      { heading: "For classrooms", body: "Prioritise durability, spares and teacher materials over feature count. Ten simple, identical, repairable robots beat three fancy ones in a class of thirty." },
    ],
  },
  {
    slug: "beginner-sensor-guide",
    title: "A beginner's guide to sensors",
    topic: "Sensors",
    minutes: 8,
    excerpt:
      "Distance, motion, temperature, light — sensors are how your projects perceive the world. Meet the six sensors every beginner should know.",
    sections: [
      { heading: "Ultrasonic distance (HC-SR04)", body: "Sends an ultrasonic ping and times the echo, measuring distance from about 2 cm to 4 m. The classic choice for obstacle-avoiding robots and tank-level sensing." },
      { heading: "PIR motion (HC-SR501)", body: "Detects the moving body heat of people and animals. Ideal for security alarms and automatic lighting. It senses motion, not presence — someone sitting still becomes invisible to it." },
      { heading: "Temperature & humidity (DHT11/DHT22)", body: "Digital climate sensors that need only one data pin. The DHT22 costs more but is noticeably more accurate and covers a wider range — worth it for greenhouses and incubators." },
      { heading: "Light (LDR)", body: "A light-dependent resistor is the simplest analogue sensor: resistance falls as light rises. Perfect for teaching voltage dividers and analogRead()." },
      { heading: "Line/IR reflectance", body: "Infrared pairs that detect dark lines on light floors — the heart of every line-following robot competition." },
      { heading: "Soil moisture", body: "Measures how wet soil is, enabling automatic irrigation projects. Prefer capacitive versions over cheap resistive probes, which corrode within weeks." },
    ],
  },
  {
    slug: "introduction-to-iot",
    title: "An introduction to IoT",
    topic: "IoT",
    minutes: 6,
    excerpt:
      "The Internet of Things is just sensors, a connection and a decision. Here's the mental model, plus what a first IoT project looks like.",
    sections: [
      { heading: "The three-part model", body: "Every IoT system does three things: sense (a sensor measures the world), send (a radio moves that measurement — Wi-Fi, GSM or LoRa), and decide (a server, phone or the device itself acts on it). Keep this model in mind and even complex systems become readable." },
      { heading: "Choosing a connection", body: "Wi-Fi (ESP32/ESP8266) is free and fast but short-range. GSM (SIM800L) works anywhere with phone signal at the cost of a SIM and airtime. LoRa reaches kilometres on coin-cell power but sends only small packets — ideal for farms and remote monitoring." },
      { heading: "A great first project", body: "A room-climate monitor: ESP32 + DHT22, posting temperature and humidity to a free dashboard every minute. It teaches sensing, connectivity, power and data visualisation in one afternoon — and every part is reusable." },
    ],
  },
  {
    slug: "stem-project-ideas",
    title: "10 STEM project ideas by difficulty",
    topic: "STEM Education",
    minutes: 5,
    excerpt:
      "From a traffic light in an afternoon to a smart greenhouse over a term — projects that build on each other, with the skills each one teaches.",
    sections: [
      { heading: "Beginner (a lesson or two)", body: "1) LED traffic light — sequencing and delays. 2) Night light with an LDR — analogue input and thresholds. 3) Ultrasonic parking sensor — distance measurement and buzzers." },
      { heading: "Intermediate (a few weeks)", body: "4) Line-following robot — sensors driving motors in a feedback loop. 5) Weather station with display — I2C devices and data formatting. 6) RFID door logger — serial protocols and data storage. 7) Bluetooth-controlled car — wireless control from a phone." },
      { heading: "Advanced (a term project)", body: "8) Smart greenhouse — soil moisture, pumps and scheduling combined. 9) Two-node LoRa farm monitor — long-range telemetry. 10) Robotic arm with recorded routines — kinematics, servo control and UX in one build." },
    ],
  },
  {
    slug: "soldering-basics",
    title: "Soldering basics: your first reliable joints",
    topic: "Tools & Prototyping",
    minutes: 6,
    excerpt:
      "Good soldering is 80% preparation. Temperature, tinning and the three-second rule — everything a beginner needs for shiny, strong joints.",
    sections: [
      { heading: "Setup", body: "Work in a ventilated space, use a stand and a damp sponge or brass wool, and set a temperature-controlled iron to roughly 320–350 °C for leaded solder (higher for lead-free). Always tin a new tip immediately — a thin silver coat of solder protects it and transfers heat." },
      { heading: "The technique", body: "Heat the joint, not the solder: touch the iron to both the pad and the lead for about a second, then feed solder into the joint (not the tip) and remove iron and solder together. The whole joint should take around three seconds. A good joint is shiny and cone-shaped; a dull blob usually means the joint moved or never got hot enough." },
      { heading: "Common fixes", body: "Cold joint (dull, cracked): reheat with a touch of fresh solder. Bridge between pads: drag the hot tip through the gap or use desoldering braid. Solder won't stick: the surface is dirty or oxidised — clean it and add flux." },
    ],
  },
];

export function getGuides(): Guide[] {
  return guides;
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
