import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

type Spec = { group: string; label: string; value: string };
interface Img { url: string; alt: string }
interface Product {
  slug: string; sku: string; name: string; short: string; description: string;
  brand: string; category: string; tags: string;
  priceUsdCents: number; compareAtUsdCents?: number; stockQty: number; status?: string;
  specs?: Spec[]; contents?: string[]; compatibility?: string[];
  warranty?: string; weightGrams?: number;
  featured?: boolean; newArrival?: boolean; bestSeller?: boolean; isDemo?: boolean;
  images: Img[];
}
const ph = (k: string): Img => ({ url: `placeholder:${k}`, alt: k });
const ri = (f: string, alt: string): Img => ({ url: `/products/${f}`, alt });

const categories = [
  { slug: "robotics-kits",         name: "Robotics Kits",         icon: "bot",            featured: true, description: "Robot car kits, robotic arms, rovers and STEM robotics packages.", children: ["Robot Car Kits","Robotic Arm Kits","Beginner Kits","Competition Kits"] },
  { slug: "development-boards",    name: "Development Boards",    icon: "cpu",            featured: true, description: "Arduino, ESP32, Raspberry Pi, micro:bit and compatible boards.", children: ["Arduino","ESP32","Raspberry Pi","Micro:bit","Other Boards"] },
  { slug: "sensors-modules",       name: "Sensors & Modules",     icon: "radar",          featured: true, description: "Distance, motion, temperature, humidity, gas, GPS and GSM modules.", children: ["Distance Sensors","Motion Sensors","Temperature & Humidity","Gas Sensors","GPS & GSM Modules"] },
  { slug: "motors-motion",         name: "Motors & Motion",       icon: "cog",            featured: true, description: "DC, servo and stepper motors, drivers, wheels and chassis.", children: ["DC Motors","Servo Motors","Stepper Motors","Motor Drivers","Wheels & Chassis"] },
  { slug: "iot-wireless",          name: "IoT & Wireless",        icon: "wifi",           featured: true, description: "Wi-Fi, Bluetooth and LoRa modules, gateways and monitoring kits.", children: ["Wi-Fi Modules","Bluetooth Modules","LoRa Modules","IoT Gateways"] },
  { slug: "electronic-components", name: "Electronic Components", icon: "circuit-board",  featured: true, description: "Resistors, capacitors, LEDs, relays, transistors, ICs and connectors.", children: ["Resistors & Capacitors","LEDs & Displays","Relays & Switches","Integrated Circuits","Connectors"] },
  { slug: "tools-prototyping",     name: "Tools & Prototyping",   icon: "wrench",         featured: true, description: "Breadboards, jumper wires, soldering tools, multimeters and power supplies.", children: ["Breadboards","Jumper Wires","Soldering Tools","Test Equipment","Power Supplies"] },
  { slug: "stem-education",        name: "STEM Education",        icon: "graduation-cap", featured: true, description: "Classroom kits, student kits, lab packages and teacher training.", children: ["Classroom Kits","Student Kits","Teacher Resources","Laboratory Packages"] },
];

const brands = ["ACEBOTT","Arduino","Espressif","Raspberry Pi","Synergy Dynamics","Generic"];

const products: Product[] = [
  // ACEBOTT QD001 — real photos
  { slug:"acebott-qd001-esp32-smart-car", sku:"ACE-QD001", name:"ACEBOTT QD001 ESP32 Smart Car Starter Kit",
    short:"4WD ESP32 smart robot car — program in Arduino, Scratch or mobile app.",
    description:"The ACEBOTT QD001 is a complete 4WD robot car kit built around the ESP32. Learners progress from basic motor control to line following, obstacle avoidance and Bluetooth remote control guided by the project manual.\n\nSynergy Dynamics is the authorised Zimbabwe distributor for ACEBOTT products. Local support and spare parts available.",
    brand:"ACEBOTT", category:"robotics-kits", tags:"esp32,robot car,4wd,line tracking,obstacle avoidance,stem,acebott,qd001",
    priceUsdCents:6500, compareAtUsdCents:7200, stockQty:15,
    specs:[
      {group:"Controller",label:"Microcontroller",value:"ESP32 (dual-core, Wi-Fi + BT)"},
      {group:"Drive",label:"Drive system",value:"4 × TT geared DC motors (4WD)"},
      {group:"Sensors",label:"Included",value:"Ultrasonic HC-SR04, IR line tracking, photoresistor"},
      {group:"Power",label:"Battery",value:"2 × 18650 Li-ion (not included)"},
      {group:"Wireless",label:"Connectivity",value:"Wi-Fi 802.11 b/g/n + Bluetooth 4.2"},
    ],
    contents:["Acrylic chassis","ESP32 expansion board","4 × TT geared DC motors","HC-SR04 ultrasonic sensor","IR line-tracking module","Photoresistor module","USB cable","Hardware kit","Assembly manual","Project booklet (10+ experiments)"],
    compatibility:["Arduino IDE","ACEBOTT app (iOS & Android)","Scratch 3.0","MicroPython"],
    warranty:"12 months — Synergy Dynamics Zimbabwe", weightGrams:650,
    featured:true, bestSeller:true, isDemo:false,
    images:[
      ri("qd001-smart-car-01.jpg","ACEBOTT QD001 ESP32 Smart Car — front view"),
      ri("qd001-smart-car-02.jpg","ACEBOTT QD001 — top view"),
      ri("qd001-smart-car-03.jpg","ACEBOTT QD001 — side profile"),
      ri("qd001-smart-car-04.jpg","ACEBOTT QD001 — detail view"),
      ri("qd001-smart-car-05.jpg","ACEBOTT QD001 — components laid out"),
      ri("qd001-smart-car-06.jpg","ACEBOTT QD001 — sensor detail"),
      ri("qd001-smart-car-07.jpg","ACEBOTT QD001 — rear view"),
      ri("qd001-smart-car-08.jpg","ACEBOTT QD001 — kit contents"),
      ri("qd001-smart-car-09.jpg","ACEBOTT QD001 — chassis assembly"),
      ri("qd001-smart-car-10.jpg","ACEBOTT QD001 — in action"),
    ]},
  // ACEBOTT QD007 — real photo
  { slug:"acebott-qd007-robot-arm", sku:"ACE-QD007", name:"ACEBOTT QD007 5-DOF Robot Arm Expansion Pack",
    short:"Add a 5-DOF servo arm and gripper to your QD001 Smart Car.",
    description:"Expand the QD001 into a full pick-and-place robot. The 5-DOF arm adds base rotation, shoulder, elbow, wrist and gripper. Requires QD001 (sold separately or as bundle).",
    brand:"ACEBOTT", category:"robotics-kits", tags:"robot arm,5dof,servo,gripper,expansion,acebott,qd007",
    priceUsdCents:4200, stockQty:10,
    specs:[
      {group:"Arm",label:"Degrees of freedom",value:"5-DOF (base, shoulder, elbow, wrist, gripper)"},
      {group:"Arm",label:"Actuation",value:"5 × SG90 micro-servos"},
      {group:"Reach",label:"Max reach",value:"Approx. 25 cm from base"},
    ],
    contents:["Acrylic arm parts","5 × SG90 servos","Hardware kit","Assembly manual"],
    compatibility:["ACEBOTT QD001 (required)","Arduino IDE","ACEBOTT app"],
    warranty:"12 months — Synergy Dynamics Zimbabwe", weightGrams:280,
    newArrival:true, isDemo:false,
    images:[ri("qd007-robot-arm.jpg","ACEBOTT QD007 5-DOF Robot Arm Expansion Pack")]},
  // ACEBOTT QD001+QD007 bundle — real photos
  { slug:"acebott-qd001-qd007-bundle", sku:"ACE-QD001-QD007", name:"ACEBOTT Smart Car + Robot Arm Bundle (QD001 + QD007)",
    short:"Flagship ACEBOTT kit: 4WD smart car with 5-DOF robotic arm — save $9 vs separate.",
    description:"The complete ACEBOTT experience — QD001 Smart Car plus QD007 Robot Arm. Program the car to drive and navigate, then switch to arm mode for pick-and-place challenges. Ideal for robotics clubs and STEM competitions.",
    brand:"ACEBOTT", category:"robotics-kits", tags:"robot car,robot arm,bundle,4wd,5dof,complete kit,acebott,stem,competition",
    priceUsdCents:9500, compareAtUsdCents:10700, stockQty:8,
    specs:[
      {group:"Car",label:"Controller",value:"ESP32 (dual-core, Wi-Fi + BT)"},
      {group:"Car",label:"Drive",value:"4 × TT geared DC motors (4WD)"},
      {group:"Arm",label:"DOF",value:"5-DOF servo arm with gripper"},
      {group:"Sensors",label:"Included",value:"Ultrasonic, IR line tracking, photoresistor"},
    ],
    contents:["All QD001 components","All QD007 components","Combined assembly manual"],
    compatibility:["Arduino IDE","ACEBOTT app (iOS & Android)","Scratch 3.0"],
    warranty:"12 months — Synergy Dynamics Zimbabwe", weightGrams:930,
    featured:true, isDemo:false,
    images:[
      ri("qd001-qd007-bundle.jpg","ACEBOTT QD001+QD007 Smart Car and Robot Arm — complete bundle"),
      ri("all-in-one-kit.jpg","ACEBOTT QD001+QD007 — all components overview"),
    ]},
  // ACEBOTT QD037 — real photos
  { slug:"acebott-qd037-advanced-robot", sku:"ACE-QD037", name:"ACEBOTT QD037 Advanced Smart Robot Car Kit",
    short:"Advanced ESP32-CAM robot with AI: face tracking, colour detection and app control.",
    description:"The QD037 steps up to AI and machine vision — the ESP32-CAM enables face tracking and colour recognition alongside standard robot features. Suitable for competitions, university projects and advanced STEM clubs.",
    brand:"ACEBOTT", category:"robotics-kits", tags:"advanced robot,esp32-cam,ai,face tracking,colour detection,competition,acebott,qd037",
    priceUsdCents:7900, compareAtUsdCents:8800, stockQty:6,
    specs:[
      {group:"Controller",label:"Main board",value:"ESP32 + ESP32-CAM (OV2640 2MP)"},
      {group:"Drive",label:"Drive",value:"4 × geared DC motors (4WD)"},
      {group:"AI",label:"Vision modes",value:"Face tracking, colour recognition"},
      {group:"Sensors",label:"Included",value:"Ultrasonic, IR, light"},
    ],
    contents:["QD037 chassis","ESP32-CAM module","ESP32 expansion board","4 × motors","Ultrasonic sensor","IR modules","Hardware kit","Assembly manual"],
    compatibility:["Arduino IDE","ESP-IDF","ACEBOTT app"],
    warranty:"12 months — Synergy Dynamics Zimbabwe", weightGrams:720,
    newArrival:true, featured:true, isDemo:false,
    images:[
      ri("qd037-03.jpg","ACEBOTT QD037 Advanced Smart Robot — front view"),
      ri("qd037-07.jpg","ACEBOTT QD037 — camera and sensor detail"),
      ri("qd037-09.jpg","ACEBOTT QD037 — top-down view"),
      ri("qd037-packing.jpg","ACEBOTT QD037 — kit packaging"),
    ]},
  // Development boards
  { slug:"arduino-uno-r4-wifi", sku:"SD-DB-0001", name:"Arduino Uno R4 WiFi",
    short:"The classic learning board upgraded with 32-bit Renesas core and on-board Wi-Fi.",
    description:"The Uno R4 WiFi keeps the familiar Uno shield-compatible form factor while adding a faster 32-bit ARM core and built-in Wi-Fi. Ideal for classrooms and IoT projects.",
    brand:"Arduino", category:"development-boards", tags:"arduino,uno,r4,wifi,microcontroller,beginner",
    priceUsdCents:3450, stockQty:20,
    specs:[{group:"Core",label:"MCU",value:"Renesas RA4M1 (Cortex-M4 @ 48 MHz)"},{group:"Wireless",label:"Co-processor",value:"ESP32-S3 (Wi-Fi + BT)"},{group:"I/O",label:"Digital pins",value:"14 (6 PWM)"},{group:"I/O",label:"Analog inputs",value:"6 (14-bit ADC)"}],
    contents:["Arduino Uno R4 WiFi board","Getting-started guide"], compatibility:["Uno-format shields","Arduino IDE 2.x","PlatformIO"],
    warranty:"12 months", weightGrams:25, featured:true, bestSeller:true, isDemo:true, images:[ph("cpu")]},
  { slug:"arduino-uno-r3", sku:"SD-DB-0002", name:"Arduino Uno R3",
    short:"The original — most-used microcontroller board in education worldwide.",
    description:"The Arduino Uno R3 is the gold standard for learning electronics and embedded programming.",
    brand:"Arduino", category:"development-boards", tags:"arduino,uno,r3,microcontroller,beginner",
    priceUsdCents:2200, stockQty:35,
    specs:[{group:"Core",label:"MCU",value:"ATmega328P @ 16 MHz"},{group:"I/O",label:"Digital pins",value:"14 (6 PWM)"}],
    contents:["Arduino Uno R3 board","USB A-to-B cable"], compatibility:["Uno-format shields","Arduino IDE"],
    warranty:"12 months", weightGrams:25, bestSeller:true, isDemo:true, images:[ph("cpu")]},
  { slug:"esp32-devkit-v1", sku:"SD-DB-0003", name:"ESP32 DevKit V1 (30-pin)",
    short:"Dual-core Wi-Fi + Bluetooth — the workhorse of IoT prototyping.",
    description:"Dual-core processing, Wi-Fi and Bluetooth in a breadboard-friendly module. The go-to for IoT dashboards, home automation and robot controllers.",
    brand:"Espressif", category:"development-boards", tags:"esp32,wifi,bluetooth,iot,devkit",
    priceUsdCents:950, stockQty:60,
    specs:[{group:"Core",label:"Chip",value:"ESP32-WROOM-32"},{group:"Core",label:"Cores",value:"2 × Xtensa LX6 @ 240 MHz"},{group:"Wireless",label:"Wi-Fi",value:"802.11 b/g/n"},{group:"Wireless",label:"Bluetooth",value:"4.2 BR/EDR + BLE"}],
    contents:["ESP32 DevKit V1 board"], compatibility:["Arduino IDE","ESP-IDF","MicroPython"],
    weightGrams:10, bestSeller:true, isDemo:true, images:[ph("cpu")]},
  { slug:"raspberry-pi-5-4gb", sku:"SD-DB-0004", name:"Raspberry Pi 5 (4 GB)",
    short:"Latest Raspberry Pi — quad-core ARM, PCIe and GPIO for robotics and edge AI.",
    description:"Desktop-class performance for robotics controllers, vision systems and lab servers. PCIe, USB 3.0 and full 40-pin GPIO.",
    brand:"Raspberry Pi", category:"development-boards", tags:"raspberry pi,sbc,linux,edge ai,pi 5",
    priceUsdCents:7000, stockQty:10,
    specs:[{group:"Core",label:"CPU",value:"BCM2712 quad-core Cortex-A76 @ 2.4 GHz"},{group:"Memory",label:"RAM",value:"4 GB LPDDR4X"}],
    contents:["Raspberry Pi 5 board"], compatibility:["Raspberry Pi OS","Ubuntu 24.04 LTS"],
    weightGrams:46, featured:true, newArrival:true, isDemo:true, images:[ph("cpu")]},
  { slug:"microbit-v2-go-bundle", sku:"SD-DB-0005", name:"BBC micro:bit V2 Go Bundle",
    short:"Pocket-sized coding computer for classrooms — battery pack and USB cable included.",
    description:"Built-in sensors, LEDs, speaker and radio. The easiest entry to physical computing for ages 8+.",
    brand:"Generic", category:"development-boards", tags:"microbit,education,classroom,coding",
    priceUsdCents:2600, stockQty:30,
    contents:["BBC micro:bit V2 board","Battery holder (2 × AAA)","USB cable"], compatibility:["MakeCode","MicroPython","Scratch"],
    weightGrams:50, isDemo:true, images:[ph("cpu")]},
  { slug:"esp8266-nodemcu-v3", sku:"SD-DB-0006", name:"ESP8266 NodeMCU V3",
    short:"Compact Wi-Fi board — low-cost classic for quick IoT sensor nodes.",
    description:"A favourite for Wi-Fi sensor nodes and MQTT clients. Breadboard-compatible with built-in USB-to-serial.",
    brand:"Espressif", category:"development-boards", tags:"esp8266,nodemcu,wifi,iot,mqtt",
    priceUsdCents:750, stockQty:45, isDemo:true, images:[ph("cpu")]},
  // Sensors
  { slug:"hc-sr04-ultrasonic", sku:"SD-SN-0001", name:"HC-SR04 Ultrasonic Distance Sensor",
    short:"Standard 2–400 cm ultrasonic ranging module for obstacle detection and level sensing.",
    description:"Measures distance via ultrasonic pulses. A staple for obstacle-avoiding robots, tank level sensors and proximity alarms.",
    brand:"Generic", category:"sensors-modules", tags:"ultrasonic,distance,hc-sr04,obstacle avoidance",
    priceUsdCents:250, stockQty:150,
    specs:[{group:"Sensing",label:"Range",value:"2–400 cm (±3 mm)"},{group:"Electrical",label:"Voltage",value:"5 V DC"}],
    compatibility:["Arduino","ESP32","Raspberry Pi"],
    bestSeller:true, isDemo:true, images:[ph("radar")]},
  { slug:"dht22-sensor", sku:"SD-SN-0002", name:"DHT22 Temperature & Humidity Module",
    short:"Calibrated digital sensor — better accuracy and wider range than the DHT11.",
    description:"Ideal for weather stations, greenhouse monitoring and HVAC. Pre-mounted on breakout with pull-up resistor.",
    brand:"Generic", category:"sensors-modules", tags:"dht22,temperature,humidity,climate,agriculture",
    priceUsdCents:480, stockQty:45,
    specs:[{group:"Sensing",label:"Temperature",value:"-40 to +80 °C (±0.5 °C)"},{group:"Sensing",label:"Humidity",value:"0–100 % RH (±2–5 %)"}],
    compatibility:["Arduino","ESP32","Raspberry Pi"], isDemo:true, images:[ph("radar")]},
  { slug:"pir-motion-sensor", sku:"SD-SN-0003", name:"PIR Motion Sensor (HC-SR501)",
    short:"Passive infrared motion detector with adjustable sensitivity and delay.",
    description:"Detects human presence for security systems and automatic lighting. Adjustable sensitivity and time-delay.",
    brand:"Generic", category:"sensors-modules", tags:"pir,motion,security,automation",
    priceUsdCents:220, stockQty:80, isDemo:true, images:[ph("radar")]},
  { slug:"neo-6m-gps-module", sku:"SD-SN-0004", name:"NEO-6M GPS Module with Antenna",
    short:"GPS receiver for tracking, navigation and geofencing projects.",
    description:"Dependable GPS for vehicle trackers, drones and data loggers. Includes ceramic patch antenna and UART interface.",
    brand:"Generic", category:"sensors-modules", tags:"gps,neo-6m,tracking,navigation,drone",
    priceUsdCents:1150, stockQty:12, newArrival:true, isDemo:true, images:[ph("radar")]},
  { slug:"sim800l-gsm-module", sku:"SD-SN-0005", name:"SIM800L GSM/GPRS Module",
    short:"Quad-band GSM for SMS alerts and 2G data — works on all Zimbabwean networks.",
    description:"Add SMS alerts and remote control using Econet, NetOne or Telecel. Ideal for remote monitoring and alarm systems.",
    brand:"Generic", category:"sensors-modules", tags:"gsm,sim800l,sms,remote,zimbabwe,econet",
    priceUsdCents:950, stockQty:25, isDemo:true, images:[ph("radar")]},
  { slug:"mq-2-gas-sensor", sku:"SD-SN-0006", name:"MQ-2 Gas & Smoke Sensor",
    short:"Detects LPG, smoke and combustible gases for fire-alarm projects.",
    description:"Gas-leak alarms and fire-safety prototypes. Analogue and digital output.",
    brand:"Generic", category:"sensors-modules", tags:"gas,smoke,mq2,safety,fire alarm",
    priceUsdCents:320, stockQty:35, isDemo:true, images:[ph("radar")]},
  { slug:"capacitive-soil-moisture", sku:"SD-SN-0007", name:"Capacitive Soil Moisture Sensor V2",
    short:"Corrosion-resistant capacitive soil moisture for smart agriculture IoT.",
    description:"Accurate long-term moisture readings for smart irrigation, greenhouse monitoring and agriculture IoT.",
    brand:"Generic", category:"sensors-modules", tags:"soil moisture,agriculture,irrigation,smart farm",
    priceUsdCents:380, stockQty:40, newArrival:true, isDemo:true, images:[ph("radar")]},
  // Motors & Motion
  { slug:"sg90-micro-servo", sku:"SD-MM-0001", name:"SG90 Micro Servo Motor (9g)",
    short:"The classic 9g hobby servo for robot arms, grippers and pan-tilt rigs.",
    description:"Small, light and universal — the SG90 powers countless robotics builds including the ACEBOTT QD007 arm.",
    brand:"Generic", category:"motors-motion", tags:"servo,sg90,9g,motion,robot arm",
    priceUsdCents:280, stockQty:100, bestSeller:true, isDemo:true, images:[ph("cog")]},
  { slug:"mg996r-servo", sku:"SD-MM-0002", name:"MG996R Metal Gear Servo (11 kg·cm)",
    short:"High-torque metal gear servo for heavier robotic arms and steering applications.",
    description:"Metal gear construction for durability under load. 11 kg·cm torque for larger robot arm joints and steering gear.",
    brand:"Generic", category:"motors-motion", tags:"servo,mg996r,metal gear,high torque,robot arm",
    priceUsdCents:650, stockQty:30, isDemo:true, images:[ph("cog")]},
  { slug:"nema17-stepper-motor", sku:"SD-MM-0003", name:"NEMA 17 Stepper Motor (1.8°/step)",
    short:"Precision stepper for CNC, 3D printers and exact-positioning projects.",
    description:"Standard NEMA 17 frame bipolar stepper for accurate, repeatable motion in CNC machines, 3D printers and robotic actuators.",
    brand:"Generic", category:"motors-motion", tags:"stepper,nema17,cnc,3d printer,precision",
    priceUsdCents:1450, stockQty:15, isDemo:true, images:[ph("cog")]},
  { slug:"l298n-motor-driver", sku:"SD-MM-0004", name:"L298N Dual Motor Driver Module",
    short:"Drive two DC motors or one stepper from your microcontroller.",
    description:"Classic dual H-bridge driver with on-board 5 V regulator. Handles motors up to 2 A per channel.",
    brand:"Generic", category:"motors-motion", tags:"motor driver,l298n,h-bridge,dc motor",
    priceUsdCents:380, stockQty:55, bestSeller:true, isDemo:true, images:[ph("cog")]},
  { slug:"tt-gear-motor-wheel-set", sku:"SD-MM-0005", name:"TT Gear Motor + Wheel Set (pair)",
    short:"Two geared DC motors with rubber-tyre wheels for robot car builds.",
    description:"Standard yellow TT gear motors with wheels — the building blocks of most robot car kits including the ACEBOTT QD001.",
    brand:"Generic", category:"motors-motion", tags:"tt motor,gear motor,wheels,chassis,robot car",
    priceUsdCents:520, stockQty:40, isDemo:true, images:[ph("cog")]},
  { slug:"a4988-stepper-driver", sku:"SD-MM-0006", name:"A4988 Stepper Motor Driver Module",
    short:"Microstepping driver for NEMA 14/17 steppers — compatible with RAMPS and CNC boards.",
    description:"Up to 1/16 microstepping, adjustable current limiting, and thermal shutdown. The standard stepper driver for 3D printers and CNC machines.",
    brand:"Generic", category:"motors-motion", tags:"stepper driver,a4988,cnc,3d printer,microstepping",
    priceUsdCents:280, stockQty:30, isDemo:true, images:[ph("cog")]},
  // IoT & Wireless
  { slug:"lora-sx1278-module-pair", sku:"SD-IW-0001", name:"LoRa SX1278 Module Pair (433 MHz)",
    short:"Long-range, low-power radio links for farms and remote monitoring — up to 3 km.",
    description:"A pair of LoRa modules for kilometre-scale telemetry. Ideal for smart-agriculture sensor networks and remote monitoring in areas without cellular coverage.",
    brand:"Generic", category:"iot-wireless", tags:"lora,sx1278,433mhz,long range,agriculture,remote",
    priceUsdCents:1680, stockQty:14, newArrival:true, isDemo:true, images:[ph("wifi")]},
  { slug:"hc-05-bluetooth-module", sku:"SD-IW-0002", name:"HC-05 Bluetooth Serial Module",
    short:"Serial Bluetooth link for phone-controlled projects — pair with any Android device.",
    description:"Add wireless serial control to robots and gadgets. The HC-05 is the easiest way to control an Arduino project from a smartphone.",
    brand:"Generic", category:"iot-wireless", tags:"bluetooth,hc-05,serial,wireless,android",
    priceUsdCents:420, stockQty:35, isDemo:true, images:[ph("wifi")]},
  { slug:"smart-farm-monitoring-kit", sku:"SD-IW-0003", name:"Smart Farm Monitoring Starter Kit",
    short:"Soil moisture, climate and tank-level sensing bundle with ESP32 gateway.",
    description:"A curated bundle for smart-agriculture pilots — soil moisture probes, DHT22 climate sensor and an ESP32 gateway with example dashboard code.",
    brand:"Synergy Dynamics", category:"iot-wireless", tags:"agriculture,soil moisture,monitoring,farm,iot kit,zimbabwe",
    priceUsdCents:9800, stockQty:5, featured:true, newArrival:true, isDemo:true, images:[ph("wifi")]},
  // Electronic Components
  { slug:"resistor-kit-600pc", sku:"SD-EC-0001", name:"Resistor Kit (600 pcs, 1/4W, 1%)",
    short:"Assorted metal-film resistors from 10 Ω to 1 MΩ — labelled box.",
    description:"600-piece assortment covering the most common resistor values for prototyping and repair. 1% metal-film, clearly labelled compartments.",
    brand:"Generic", category:"electronic-components", tags:"resistor,kit,assortment,passive,1%",
    priceUsdCents:750, stockQty:26, isDemo:true, images:[ph("circuit-board")]},
  { slug:"capacitor-kit-assorted", sku:"SD-EC-0002", name:"Capacitor Kit — Electrolytic & Ceramic (400 pcs)",
    short:"Assorted electrolytic and ceramic capacitors for prototyping and filtering.",
    description:"400-piece kit combining ceramic disc (pF range) and electrolytic (µF range) capacitors. Covers power supply decoupling and signal filtering needs.",
    brand:"Generic", category:"electronic-components", tags:"capacitor,ceramic,electrolytic,kit,passive",
    priceUsdCents:680, stockQty:20, isDemo:true, images:[ph("circuit-board")]},
  { slug:"5v-relay-module-4ch", sku:"SD-EC-0003", name:"4-Channel 5V Relay Module",
    short:"Switch mains-rated loads safely from a microcontroller — opto-isolated.",
    description:"Opto-isolated four-channel relay board for home automation and control panels. Safe isolation between low-voltage control and mains loads.",
    brand:"Generic", category:"electronic-components", tags:"relay,automation,switching,mains,opto",
    priceUsdCents:580, stockQty:20, isDemo:true, images:[ph("circuit-board")]},
  { slug:"led-assortment-500pc", sku:"SD-EC-0004", name:"LED Assortment (500 pcs, 5 colours, 5 mm)",
    short:"5 mm LEDs in red, green, blue, yellow and white — classroom quantity.",
    description:"500-piece classroom-sized LED assortment for circuits, project displays and indicator lights.",
    brand:"Generic", category:"electronic-components", tags:"led,assortment,5mm,indicator",
    priceUsdCents:680, stockQty:17, isDemo:true, images:[ph("circuit-board")]},
  { slug:"breadboard-jumper-starter-kit", sku:"SD-EC-0005", name:"Prototyping Starter Kit (Breadboard + Jumpers + Resistors)",
    short:"Everything to start prototyping: 830-point breadboard, 120 jumpers, resistor assortment.",
    description:"The classic prototyping starter bundle — one full-size breadboard, 120 DuPont jumper wires (M-M, M-F, F-F) and a 100-value resistor assortment.",
    brand:"Generic", category:"electronic-components", tags:"breadboard,jumpers,resistors,starter kit,prototyping",
    priceUsdCents:1200, stockQty:25, bestSeller:true, isDemo:true, images:[ph("circuit-board")]},
  // Tools & Prototyping
  { slug:"solderless-breadboard-830", sku:"SD-TP-0001", name:"Solderless Breadboard (830 tie-points)",
    short:"Full-size breadboard with power rails for tool-free prototyping.",
    description:"Standard 830-tie-point breadboard with two power rails. The foundation of every electronics workbench.",
    brand:"Generic", category:"tools-prototyping", tags:"breadboard,prototyping,830",
    priceUsdCents:320, stockQty:70, bestSeller:true, isDemo:true, images:[ph("wrench")]},
  { slug:"jumper-wire-set-120", sku:"SD-TP-0002", name:"Jumper Wire Set (120 pcs — M-M, M-F, F-F)",
    short:"Assorted DuPont jumper wires in three connector styles.",
    description:"120 DuPont jumper wires in male-male, male-female and female-female configurations. Essential for breadboarding and module wiring.",
    brand:"Generic", category:"tools-prototyping", tags:"jumper,wires,dupont,prototyping",
    priceUsdCents:380, stockQty:65, isDemo:true, images:[ph("wrench")]},
  { slug:"soldering-station-60w", sku:"SD-TP-0003", name:"Temperature-Controlled Soldering Station (60 W)",
    short:"Adjustable soldering station for lab and workshop benches.",
    description:"60 W station with digital temperature control (200–480 °C), spare tips and solder holder. Dependable daily driver for students and technicians.",
    brand:"Generic", category:"tools-prototyping", tags:"soldering,station,tools,workshop,lab",
    priceUsdCents:3900, stockQty:9, isDemo:true, images:[ph("wrench")]},
  { slug:"digital-multimeter-dm850", sku:"SD-TP-0004", name:"Digital Multimeter — Auto-Ranging",
    short:"Auto-ranging multimeter with continuity, capacitance and hFE test.",
    description:"A solid general-purpose multimeter for students and technicians. Measures voltage, current, resistance, continuity, capacitance and transistor hFE.",
    brand:"Generic", category:"tools-prototyping", tags:"multimeter,test equipment,auto-ranging",
    priceUsdCents:2450, stockQty:11, isDemo:true, images:[ph("wrench")]},
  { slug:"bench-power-supply-30v-5a", sku:"SD-TP-0005", name:"Bench Power Supply 30V / 5A (Variable)",
    short:"Variable bench PSU with voltage and current display — essential lab equipment.",
    description:"Adjustable output 0–30 V / 0–5 A with digital voltage and current readout, short-circuit protection and fine adjustment. The centrepiece of any electronics lab.",
    brand:"Generic", category:"tools-prototyping", tags:"power supply,bench psu,variable,lab,30v 5a",
    priceUsdCents:5800, stockQty:4, isDemo:true, images:[ph("wrench")]},
  // STEM Education
  { slug:"student-electronics-lab-kit", sku:"SD-SE-0001", name:"Student Electronics Lab Kit",
    short:"Personal electronics lab: breadboard, components and guided experiments for one learner.",
    description:"Everything one student needs for a full term of hands-on electronics — breadboard, jumpers, resistors, LEDs, sensors and a guided experiment workbook mapped to school curriculum.",
    brand:"Synergy Dynamics", category:"stem-education", tags:"student,lab kit,classroom,education,curriculum",
    priceUsdCents:4800, stockQty:25, featured:true, isDemo:true, images:[ph("graduation-cap")]},
  { slug:"school-robotics-class-pack", sku:"SD-SE-0002", name:"School Robotics Class Pack (10 stations)",
    short:"Ten complete robot build stations for a full classroom robotics rollout.",
    description:"Everything needed to run a robotics class for up to 30 learners across 10 stations, with spare parts and a teacher reference set. Institutional buyers can request a formal quotation.",
    brand:"Synergy Dynamics", category:"stem-education", tags:"school,classroom,class pack,robotics,institutional",
    priceUsdCents:68000, stockQty:3, featured:true, isDemo:true, images:[ph("graduation-cap")]},
  { slug:"teacher-training-workshop", sku:"SD-SE-0003", name:"Robotics Teacher Training Workshop",
    short:"Hands-on robotics teaching workshop for up to 12 educators — per cohort.",
    description:"A facilitated workshop preparing educators to run robotics and electronics lessons with confidence. Final pricing and scheduling confirmed by quotation.",
    brand:"Synergy Dynamics", category:"stem-education", tags:"teacher,training,workshop,professional development,education",
    priceUsdCents:25000, stockQty:10, status:"preorder", isDemo:true, images:[ph("graduation-cap")]},
];

async function main() {
  console.log(`Seeding ${products.length} products into Synergy Dynamics catalogue...`);

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
      data: { slug: c.slug, name: c.name, description: c.description, iconKey: c.icon, sortOrder: i, isFeatured: c.featured },
    });
    categoryIds.set(c.slug, created.id);
    for (const [j, childName] of c.children.entries()) {
      const childSlug = `${c.slug}-${childName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
      await db.category.create({ data: { slug: childSlug, name: childName, iconKey: c.icon, sortOrder: j, parentId: created.id } });
    }
  }

  const brandIds = new Map<string, string>();
  for (const name of brands) {
    const created = await db.brand.create({ data: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, isDemo: false } });
    brandIds.set(name, created.id);
  }

  for (const prod of products) {
    const categoryId = categoryIds.get(prod.category);
    const brandId = brandIds.get(prod.brand);
    if (!categoryId || !brandId) throw new Error(`Bad refs for ${prod.slug}`);
    await db.product.create({
      data: {
        slug: prod.slug, sku: prod.sku, name: prod.name,
        shortDescription: prod.short, description: prod.description, tags: prod.tags,
        specsJson: JSON.stringify(prod.specs ?? []),
        packageContentsJson: JSON.stringify(prod.contents ?? []),
        compatibilityJson: JSON.stringify(prod.compatibility ?? []),
        priceUsdCents: prod.priceUsdCents, compareAtUsdCents: prod.compareAtUsdCents,
        stockQty: prod.stockQty, status: prod.status ?? "active",
        warranty: prod.warranty, weightGrams: prod.weightGrams,
        isFeatured: prod.featured ?? false, isNewArrival: prod.newArrival ?? false,
        isBestSeller: prod.bestSeller ?? false, isDemo: prod.isDemo ?? false,
        brandId, categoryId,
        images: { create: prod.images.map((img, idx) => ({ url: img.url, alt: img.alt, sortOrder: idx })) },
      },
    });
    console.log(`  ✓ ${prod.name}`);
  }

  await db.setting.createMany({
    data: [
      { key: "zwg_per_usd",     value: "2650" },
      { key: "zwg_enabled",     value: "true" },
      { key: "announcements",   value: JSON.stringify(["Nationwide delivery across Zimbabwe","Store collection — Park City Village Mall, Harare","Institutional and bulk orders welcome — request a quotation","ACEBOTT authorised distributor — local warranty and support"]) },
      { key: "store_hours",     value: "Mon–Fri 8:00–17:00, Sat 9:00–13:00" },
    ],
  });

  console.log(`\nSeeded ${categories.length} categories, ${brands.length} brands, ${products.length} products.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
