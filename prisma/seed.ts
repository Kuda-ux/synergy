/**
 * Demo seed data for local development and UI review.
 * Every product/brand is flagged `isDemo: true`, and prices, stock and
 * specifications are ILLUSTRATIVE ONLY — they must be replaced with the
 * real Synergy Dynamics catalogue before launch.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

type Spec = { group: string; label: string; value: string };

interface DemoProduct {
  slug: string;
  sku: string;
  name: string;
  short: string;
  description: string;
  brand: string;
  category: string; // category slug
  tags: string;
  priceUsdCents: number;
  compareAtUsdCents?: number;
  stockQty: number;
  status?: string;
  specs?: Spec[];
  contents?: string[];
  compatibility?: string[];
  warranty?: string;
  weightGrams?: number;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  icon: string;
}

const categories = [
  { slug: "development-boards", name: "Development Boards", icon: "cpu", featured: true, description: "Arduino, ESP32, Raspberry Pi, micro:bit and compatible microcontroller boards.", children: ["Arduino", "ESP32", "Raspberry Pi", "Micro:bit", "Other Boards"] },
  { slug: "robotics-kits", name: "Robotics Kits", icon: "bot", featured: true, description: "Robot car kits, robotic arms, rovers and school robotics packages.", children: ["Robot Car Kits", "Robotic Arm Kits", "Rover Kits", "Beginner Kits", "School Robotics Packages"] },
  { slug: "sensors-modules", name: "Sensors & Modules", icon: "radar", featured: true, description: "Distance, motion, temperature, humidity, gas, GPS, GSM and environmental sensors.", children: ["Distance Sensors", "Motion Sensors", "Temperature & Humidity", "Gas Sensors", "GPS & GSM Modules", "Environmental Sensors"] },
  { slug: "motors-motion", name: "Motors & Motion", icon: "cog", featured: true, description: "DC, servo and stepper motors, drivers, wheels, chassis and mechanics.", children: ["DC Motors", "Servo Motors", "Stepper Motors", "Motor Drivers", "Wheels & Chassis"] },
  { slug: "iot-wireless", name: "IoT & Wireless", icon: "wifi", featured: true, description: "Wi-Fi, Bluetooth and LoRa modules, gateways and monitoring kits.", children: ["Wi-Fi Modules", "Bluetooth Modules", "LoRa Modules", "IoT Gateways", "Monitoring Kits"] },
  { slug: "electronic-components", name: "Electronic Components", icon: "circuit-board", featured: true, description: "Resistors, capacitors, LEDs, relays, transistors, ICs, connectors and switches.", children: ["Resistors", "Capacitors", "LEDs", "Relays", "Transistors", "Integrated Circuits", "Connectors & Switches"] },
  { slug: "tools-prototyping", name: "Tools & Prototyping", icon: "wrench", featured: true, description: "Breadboards, jumper wires, soldering tools, multimeters and power supplies.", children: ["Breadboards", "Jumper Wires", "Soldering Tools", "Multimeters", "Power Supplies", "Test Equipment"] },
  { slug: "stem-education", name: "STEM Education", icon: "graduation-cap", featured: true, description: "Classroom kits, student kits, teacher kits, lab packages and training.", children: ["Classroom Kits", "Student Kits", "Teacher Kits", "Laboratory Packages", "Training Programmes"] },
];

const brands = ["Arduino", "Espressif", "Raspberry Pi", "ACEBOTT", "SG Robotics", "Generic"];

const p = (v: DemoProduct): DemoProduct => v;

const products: DemoProduct[] = [
  p({ slug: "arduino-uno-r4-wifi", sku: "SD-DB-0001", name: "Arduino Uno R4 WiFi", short: "The classic learning board, upgraded with a 32-bit Renesas core and on-board Wi-Fi.", description: "The Uno R4 WiFi is the go-to board for classrooms and first projects. It keeps the familiar Uno form factor and shield compatibility while adding a faster 32-bit core, more memory and built-in Wi-Fi for IoT experiments.\n\nDemo listing: specifications summarised from public Arduino documentation; price and stock are illustrative.", brand: "Arduino", category: "development-boards", tags: "arduino,uno,r4,wifi,microcontroller,beginner", priceUsdCents: 3450, stockQty: 24, specs: [{ group: "Core", label: "Microcontroller", value: "Renesas RA4M1 (Arm Cortex-M4)" }, { group: "Core", label: "Wireless", value: "ESP32-S3 co-processor (Wi-Fi)" }, { group: "Electrical", label: "Operating voltage", value: "5 V" }, { group: "I/O", label: "Digital pins", value: "14" }, { group: "I/O", label: "Analog inputs", value: "6" }], contents: ["Arduino Uno R4 WiFi board", "Getting-started leaflet"], compatibility: ["Uno-format shields", "Arduino IDE", "PlatformIO"], warranty: "12-month limited warranty (demo placeholder)", weightGrams: 25, featured: true, bestSeller: true, icon: "cpu" }),
  p({ slug: "esp32-devkit-v1", sku: "SD-DB-0002", name: "ESP32 DevKit V1 (30-pin)", short: "Dual-core Wi-Fi + Bluetooth development board for IoT projects.", description: "The ESP32 DevKit V1 is the workhorse of IoT prototyping: dual-core processor, Wi-Fi and Bluetooth in a breadboard-friendly module.\n\nDemo listing: price and stock are illustrative.", brand: "Espressif", category: "development-boards", tags: "esp32,wifi,bluetooth,iot,devkit", priceUsdCents: 950, stockQty: 60, specs: [{ group: "Core", label: "Chip", value: "ESP32-WROOM-32" }, { group: "Core", label: "Cores", value: "2 × Xtensa LX6 @ 240 MHz" }, { group: "Wireless", label: "Connectivity", value: "Wi-Fi 802.11 b/g/n, Bluetooth 4.2" }, { group: "I/O", label: "GPIO", value: "30 pins" }], contents: ["ESP32 DevKit V1 board"], compatibility: ["Arduino IDE", "ESP-IDF", "MicroPython"], weightGrams: 10, bestSeller: true, icon: "cpu" }),
  p({ slug: "raspberry-pi-5-8gb", sku: "SD-DB-0003", name: "Raspberry Pi 5 (8GB)", short: "Single-board computer for robotics, edge AI and embedded Linux projects.", description: "The Raspberry Pi 5 brings desktop-class performance to embedded projects — ideal for robotics controllers, vision systems and lab servers.\n\nDemo listing: price and stock are illustrative.", brand: "Raspberry Pi", category: "development-boards", tags: "raspberry pi,sbc,linux,edge ai", priceUsdCents: 9500, stockQty: 8, specs: [{ group: "Core", label: "CPU", value: "Broadcom BCM2712, quad-core Cortex-A76 @ 2.4 GHz" }, { group: "Memory", label: "RAM", value: "8 GB LPDDR4X" }, { group: "I/O", label: "Ports", value: "2× USB 3.0, 2× micro-HDMI, GPIO 40-pin" }], contents: ["Raspberry Pi 5 board"], compatibility: ["Raspberry Pi OS", "Ubuntu"], weightGrams: 46, featured: true, newArrival: true, icon: "cpu" }),
  p({ slug: "microbit-v2-go-bundle", sku: "SD-DB-0004", name: "micro:bit V2 Go Bundle", short: "Pocket-sized coding computer designed for the classroom.", description: "The BBC micro:bit V2 Go bundle includes everything a learner needs to start block-based or Python coding with sensors, LEDs and radio built in.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "development-boards", tags: "microbit,education,classroom,coding", priceUsdCents: 2600, stockQty: 30, contents: ["micro:bit V2 board", "Battery pack", "USB cable"], compatibility: ["MakeCode", "MicroPython"], weightGrams: 50, icon: "cpu" }),
  p({ slug: "robotic-arm-car-kit", sku: "SD-RK-0001", name: "Robotic Arm Car Kit", short: "4WD robot car with a 4-DOF gripper arm for motion, sensing and control projects.", description: "A practical robotics platform combining a 4WD chassis with a servo-driven gripper arm. Learners progress from line following to object pick-and-place, covering motors, sensors, power and control logic in one build.\n\nDemo listing: price and stock are illustrative.", brand: "ACEBOTT", category: "robotics-kits", tags: "robot car,robotic arm,gripper,4wd,stem", priceUsdCents: 8900, compareAtUsdCents: 9900, stockQty: 12, specs: [{ group: "Mechanics", label: "Drive", value: "4 × TT geared DC motors" }, { group: "Mechanics", label: "Arm", value: "4-DOF servo arm with gripper" }, { group: "Control", label: "Controller", value: "ESP32-based drive board" }, { group: "Power", label: "Battery", value: "2 × 18650 holder (cells not included)" }], contents: ["Chassis and arm parts", "ESP32 drive board", "4 × TT motors", "Servos", "Line-tracking module", "Ultrasonic sensor", "Screwdriver and fasteners"], compatibility: ["Arduino IDE", "Scratch-style block coding"], warranty: "6-month limited warranty (demo placeholder)", weightGrams: 1200, featured: true, bestSeller: true, icon: "bot" }),
  p({ slug: "stem-rover-platform", sku: "SD-RK-0002", name: "STEM Rover Platform", short: "Six-wheel rover chassis for classroom builds and engineering challenges.", description: "A rugged rover platform with rocker-bogie style suspension for STEM challenges, obstacle courses and sensor payload experiments.\n\nDemo listing: price and stock are illustrative.", brand: "SG Robotics", category: "robotics-kits", tags: "rover,chassis,suspension,stem,challenge", priceUsdCents: 12500, stockQty: 6, contents: ["Rover chassis kit", "6 × geared motors", "Motor driver board", "Battery holder", "Assembly guide"], compatibility: ["Arduino", "ESP32", "Raspberry Pi"], weightGrams: 1800, featured: true, newArrival: true, icon: "bot" }),
  p({ slug: "tinkerbot-starter-kit", sku: "SD-RK-0003", name: "TinkerBot Starter Kit", short: "A friendly entry point to electronics, sensors and creative coding.", description: "TinkerBot introduces younger learners to circuits, sensors and simple robot behaviours with snap-together parts and guided projects.\n\nDemo listing: price and stock are illustrative.", brand: "SG Robotics", category: "robotics-kits", tags: "beginner,starter,kids,stem,robot", priceUsdCents: 5400, stockQty: 18, contents: ["TinkerBot chassis", "Controller board", "2 × motors", "3 × sensors", "Project booklet"], warranty: "6-month limited warranty (demo placeholder)", weightGrams: 800, featured: true, icon: "bot" }),
  p({ slug: "smart-robot-car-v4", sku: "SD-RK-0004", name: "Smart Robot Car Kit V4", short: "2WD camera-ready robot car with line tracking and obstacle avoidance.", description: "A complete robot car kit covering line following, obstacle avoidance and remote control — the classic first robotics build.\n\nDemo listing: price and stock are illustrative.", brand: "ACEBOTT", category: "robotics-kits", tags: "robot car,line tracking,obstacle avoidance", priceUsdCents: 6200, stockQty: 0, contents: ["Chassis", "Controller board", "2 × TT motors", "Ultrasonic sensor", "IR line sensors", "Remote"], icon: "bot" }),
  p({ slug: "school-robotics-class-pack", sku: "SD-RK-0005", name: "School Robotics Class Pack (10 stations)", short: "Ten complete robot build stations for a full classroom rollout.", description: "Everything needed to run a robotics class of up to 30 learners across 10 build stations, with spares and a teacher reference set. Institutional buyers can request a formal quotation with delivery and training options.\n\nDemo listing: price and stock are illustrative.", brand: "SG Robotics", category: "stem-education", tags: "school,classroom,class pack,robotics,institutional", priceUsdCents: 68000, stockQty: 3, contents: ["10 × robot car kits", "Spare motors and sensors", "Teacher guide", "Storage trays"], featured: true, icon: "graduation-cap" }),
  p({ slug: "hc-sr04-ultrasonic-sensor", sku: "SD-SN-0001", name: "HC-SR04 Ultrasonic Distance Sensor", short: "The standard 2 cm – 400 cm ultrasonic ranging module.", description: "The HC-SR04 measures distance using ultrasonic pulses — a staple for obstacle-avoiding robots and level sensing.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "sensors-modules", tags: "ultrasonic,distance,ranging,hc-sr04", priceUsdCents: 250, stockQty: 120, specs: [{ group: "Sensing", label: "Range", value: "2 cm – 400 cm" }, { group: "Electrical", label: "Voltage", value: "5 V" }], compatibility: ["Arduino", "ESP32", "Raspberry Pi (with divider)"], bestSeller: true, icon: "radar" }),
  p({ slug: "dht22-temperature-humidity", sku: "SD-SN-0002", name: "DHT22 Temperature & Humidity Sensor", short: "Calibrated digital temperature and humidity sensor module.", description: "The DHT22 offers better accuracy and range than the DHT11 — ideal for weather stations, greenhouses and incubators.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "sensors-modules", tags: "dht22,temperature,humidity,climate,agriculture", priceUsdCents: 480, stockQty: 45, specs: [{ group: "Sensing", label: "Temperature range", value: "-40 °C to 80 °C" }, { group: "Sensing", label: "Humidity range", value: "0 – 100 % RH" }], icon: "radar" }),
  p({ slug: "pir-motion-sensor-hc-sr501", sku: "SD-SN-0003", name: "PIR Motion Sensor (HC-SR501)", short: "Passive infrared motion detector for security and automation projects.", description: "Adjustable-sensitivity PIR module for presence detection, security triggers and smart lighting.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "sensors-modules", tags: "pir,motion,security,automation", priceUsdCents: 220, stockQty: 80, icon: "radar" }),
  p({ slug: "neo-6m-gps-module", sku: "SD-SN-0004", name: "NEO-6M GPS Module", short: "GPS receiver module with antenna for tracking and navigation.", description: "A dependable GPS module for vehicle trackers, drones and data loggers.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "sensors-modules", tags: "gps,neo-6m,tracking,navigation", priceUsdCents: 1150, stockQty: 4, newArrival: true, icon: "radar" }),
  p({ slug: "sim800l-gsm-module", sku: "SD-SN-0005", name: "SIM800L GSM/GPRS Module", short: "Quad-band GSM module for SMS, calls and 2G data.", description: "Add SMS alerts and remote control to projects using the local GSM network.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "sensors-modules", tags: "gsm,sim800l,sms,remote", priceUsdCents: 850, stockQty: 22, icon: "radar" }),
  p({ slug: "mq-2-gas-sensor", sku: "SD-SN-0006", name: "MQ-2 Gas & Smoke Sensor", short: "Detects LPG, smoke and combustible gases for safety projects.", description: "The MQ-2 is widely used for gas-leak alarms and fire-safety prototypes.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "sensors-modules", tags: "gas,smoke,mq2,safety", priceUsdCents: 320, stockQty: 35, icon: "radar" }),
  p({ slug: "sg90-micro-servo", sku: "SD-MM-0001", name: "SG90 Micro Servo (9g)", short: "The classic 9-gram hobby servo for arms, grippers and pan-tilt rigs.", description: "Small, light and everywhere — the SG90 powers countless robotics builds.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "motors-motion", tags: "servo,sg90,9g,motion", priceUsdCents: 280, stockQty: 90, bestSeller: true, icon: "cog" }),
  p({ slug: "nema17-stepper-motor", sku: "SD-MM-0002", name: "NEMA 17 Stepper Motor", short: "Precision stepper motor for CNC, 3D printer and positioning projects.", description: "The standard NEMA 17 frame stepper for accurate, repeatable motion.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "motors-motion", tags: "stepper,nema17,cnc,3d printer", priceUsdCents: 1450, stockQty: 15, icon: "cog" }),
  p({ slug: "l298n-motor-driver", sku: "SD-MM-0003", name: "L298N Dual Motor Driver Module", short: "Drive two DC motors or one stepper from your microcontroller.", description: "The classic dual H-bridge driver board with on-board 5 V regulator.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "motors-motion", tags: "motor driver,l298n,h-bridge", priceUsdCents: 380, stockQty: 55, icon: "cog" }),
  p({ slug: "tt-gear-motor-wheel-set", sku: "SD-MM-0004", name: "TT Gear Motor + Wheel Set (2 pack)", short: "Two geared DC motors with wheels for robot car builds.", description: "Standard yellow TT gear motors with rubber-tyre wheels — the building blocks of most robot cars.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "motors-motion", tags: "tt motor,gear motor,wheels,chassis", priceUsdCents: 520, stockQty: 40, icon: "cog" }),
  p({ slug: "lora-sx1278-module-pair", sku: "SD-IW-0001", name: "LoRa SX1278 Module Pair (433 MHz)", short: "Long-range, low-power radio links for farms and remote monitoring.", description: "A pair of LoRa modules for kilometre-scale telemetry — ideal for smart-agriculture and remote sensing projects.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "iot-wireless", tags: "lora,sx1278,433mhz,long range,agriculture", priceUsdCents: 1680, stockQty: 14, newArrival: true, icon: "wifi" }),
  p({ slug: "esp8266-nodemcu", sku: "SD-IW-0002", name: "ESP8266 NodeMCU V3", short: "Compact Wi-Fi development board for quick IoT nodes.", description: "The NodeMCU remains a favourite for low-cost Wi-Fi sensor nodes.\n\nDemo listing: price and stock are illustrative.", brand: "Espressif", category: "iot-wireless", tags: "esp8266,nodemcu,wifi,iot", priceUsdCents: 650, stockQty: 48, icon: "wifi" }),
  p({ slug: "hc-05-bluetooth-module", sku: "SD-IW-0003", name: "HC-05 Bluetooth Module", short: "Serial Bluetooth link for phone-controlled projects.", description: "Add wireless serial control to robots and gadgets with the HC-05.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "iot-wireless", tags: "bluetooth,hc-05,serial,wireless", priceUsdCents: 420, stockQty: 33, icon: "wifi" }),
  p({ slug: "smart-farm-monitoring-kit", sku: "SD-IW-0004", name: "Smart Farm Monitoring Starter Kit", short: "Soil moisture, climate and tank-level sensing starter bundle.", description: "A curated bundle for smart-agriculture pilots: soil moisture probes, climate sensing and an ESP32 gateway with example dashboards.\n\nDemo listing: price and stock are illustrative.", brand: "SG Robotics", category: "iot-wireless", tags: "agriculture,soil moisture,monitoring,farm,iot kit", priceUsdCents: 9800, stockQty: 5, featured: true, newArrival: true, icon: "wifi" }),
  p({ slug: "resistor-kit-600pc", sku: "SD-EC-0001", name: "Resistor Kit (600 pcs, 1/4W)", short: "Assorted 1% metal-film resistors from 10 Ω to 1 MΩ.", description: "A labelled assortment covering the most common values for prototyping and repairs.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "electronic-components", tags: "resistor,kit,assortment,passive", priceUsdCents: 750, stockQty: 26, icon: "circuit-board" }),
  p({ slug: "5v-relay-module-4ch", sku: "SD-EC-0002", name: "4-Channel 5V Relay Module", short: "Switch mains-rated loads safely from a microcontroller.", description: "Opto-isolated four-channel relay board for automation and control panels.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "electronic-components", tags: "relay,automation,switching", priceUsdCents: 580, stockQty: 20, icon: "circuit-board" }),
  p({ slug: "led-assortment-500pc", sku: "SD-EC-0003", name: "LED Assortment (500 pcs, 5 colours)", short: "5 mm LEDs in red, green, blue, yellow and white.", description: "A classroom-sized LED assortment for circuits and displays.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "electronic-components", tags: "led,assortment,5mm", priceUsdCents: 680, stockQty: 17, icon: "circuit-board" }),
  p({ slug: "solderless-breadboard-830", sku: "SD-TP-0001", name: "Solderless Breadboard (830 points)", short: "Full-size breadboard for prototyping without soldering.", description: "The standard 830-point breadboard with power rails.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "tools-prototyping", tags: "breadboard,prototyping", priceUsdCents: 320, stockQty: 70, bestSeller: true, icon: "wrench" }),
  p({ slug: "jumper-wire-set-120", sku: "SD-TP-0002", name: "Jumper Wire Set (120 pcs, M-M/M-F/F-F)", short: "Mixed jumper wires for breadboard and module wiring.", description: "120 assorted DuPont jumper wires in three connector styles.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "tools-prototyping", tags: "jumper,wires,dupont", priceUsdCents: 380, stockQty: 65, icon: "wrench" }),
  p({ slug: "soldering-station-60w", sku: "SD-TP-0003", name: "Temperature-Controlled Soldering Station (60W)", short: "Adjustable soldering station for lab and workshop benches.", description: "A dependable 60 W station with temperature control and spare tips.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "tools-prototyping", tags: "soldering,station,tools", priceUsdCents: 3900, stockQty: 9, icon: "wrench" }),
  p({ slug: "digital-multimeter-dm850", sku: "SD-TP-0004", name: "Digital Multimeter DM-850", short: "Auto-ranging multimeter with continuity, capacitance and hFE.", description: "A solid general-purpose multimeter for students and technicians.\n\nDemo listing: price and stock are illustrative.", brand: "Generic", category: "tools-prototyping", tags: "multimeter,test equipment", priceUsdCents: 2450, stockQty: 11, icon: "wrench" }),
  p({ slug: "student-electronics-lab-kit", sku: "SD-SE-0001", name: "Student Electronics Lab Kit", short: "A personal electronics lab: breadboard, components and guided experiments.", description: "Everything one learner needs for a term of hands-on electronics: breadboard, components, sensors and a guided experiment workbook mapped to classroom outcomes.\n\nDemo listing: price and stock are illustrative.", brand: "SG Robotics", category: "stem-education", tags: "student,lab kit,classroom,education", priceUsdCents: 4800, stockQty: 25, featured: true, icon: "graduation-cap" }),
  p({ slug: "teacher-training-workshop", sku: "SD-SE-0002", name: "Teacher Training Workshop (per cohort)", short: "Hands-on robotics teaching workshop for up to 12 educators.", description: "A facilitated workshop preparing educators to run robotics and electronics lessons with confidence. Scheduling and final pricing are confirmed by quotation.\n\nDemo listing: price shown is illustrative — request a quotation.", brand: "SG Robotics", category: "stem-education", tags: "teacher,training,workshop,professional development", priceUsdCents: 25000, stockQty: 10, status: "preorder", icon: "graduation-cap" }),
];

async function main() {
  console.log("Seeding demo data (all records flagged isDemo)...");

  // Reset in dependency order (dev convenience; guarded from production).
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to run the demo seed in production.");
  }
  await db.orderStatusEvent.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.quotationItem.deleteMany();
  await db.quotationRequest.deleteMany();
  await db.productImage.deleteMany();
  await db.product.deleteMany();
  await db.brand.deleteMany();
  await db.category.deleteMany();
  await db.setting.deleteMany();

  const categoryIds = new Map<string, string>();
  for (const [i, c] of categories.entries()) {
    const created = await db.category.create({
      data: {
        slug: c.slug,
        name: c.name,
        description: c.description,
        iconKey: c.icon,
        sortOrder: i,
        isFeatured: c.featured,
      },
    });
    categoryIds.set(c.slug, created.id);
    for (const [j, childName] of c.children.entries()) {
      const childSlug = `${c.slug}-${childName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
      await db.category.create({
        data: {
          slug: childSlug,
          name: childName,
          iconKey: c.icon,
          sortOrder: j,
          parentId: created.id,
        },
      });
    }
  }

  const brandIds = new Map<string, string>();
  for (const name of brands) {
    const created = await db.brand.create({
      data: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, isDemo: true },
    });
    brandIds.set(name, created.id);
  }

  for (const prod of products) {
    const categoryId = categoryIds.get(prod.category);
    const brandId = brandIds.get(prod.brand);
    if (!categoryId || !brandId) throw new Error(`Bad refs for ${prod.slug}`);
    await db.product.create({
      data: {
        slug: prod.slug,
        sku: prod.sku,
        name: prod.name,
        shortDescription: prod.short,
        description: prod.description,
        tags: prod.tags,
        specsJson: JSON.stringify(prod.specs ?? []),
        packageContentsJson: JSON.stringify(prod.contents ?? []),
        compatibilityJson: JSON.stringify(prod.compatibility ?? []),
        priceUsdCents: prod.priceUsdCents,
        compareAtUsdCents: prod.compareAtUsdCents,
        stockQty: prod.stockQty,
        status: prod.status ?? "active",
        warranty: prod.warranty,
        weightGrams: prod.weightGrams,
        isFeatured: prod.featured ?? false,
        isNewArrival: prod.newArrival ?? false,
        isBestSeller: prod.bestSeller ?? false,
        isDemo: true,
        brandId,
        categoryId,
        images: {
          create: [
            { url: `placeholder:${prod.icon}`, alt: `${prod.name} — demo product image placeholder`, sortOrder: 0 },
            { url: `placeholder:${prod.icon}-alt`, alt: `${prod.name} — alternate demo view placeholder`, sortOrder: 1 },
          ],
        },
      },
    });
  }

  await db.setting.createMany({
    data: [
      // DEMO exchange rate — must be set by an administrator before ZWG display goes live.
      { key: "zwg_per_usd", value: "2650" }, // ZWG cents per 1 USD (demo value)
      { key: "zwg_enabled", value: "true" },
      {
        key: "announcements",
        value: JSON.stringify([
          "Nationwide delivery available across Zimbabwe",
          "Store collection at Park City Village Mall, Harare",
          "Institutional and bulk orders welcome — request a quotation",
          "Technical support available on WhatsApp",
        ]),
      },
      { key: "store_hours", value: "Store hours to be confirmed" },
    ],
  });

  console.log(`Seeded ${categories.length} categories, ${brands.length} brands, ${products.length} demo products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
