/**
 * Generate two Excel product sheets:
 *   1. Google Merchant Center feed (google-merchant-feed.xlsx)
 *   2. Branded sales team catalog  (synergy-dynamics-product-catalog.xlsx)
 *
 * Run:  npx tsx scripts/generate-product-sheets.ts
 */

import ExcelJS from "exceljs";
import { productImageMap } from "../prisma/product-images";

// ─── Site ──────────────────────────────────────────────────────────────────────
const SITE = "https://www.synergyrobotics.co.zw";

// ─── Raw data (mirrored from prisma/seed.ts) ────────────────────────────────
interface P {
  s: string; k: string; n: string; p: number; q: number;
  c: string; b: string; ic: string; f?: boolean; best?: boolean;
}

const categories = [
  { slug: "development-boards",    name: "Development Boards" },
  { slug: "robotics-kits",         name: "Robotics Kits" },
  { slug: "sensors-modules",       name: "Sensors & Modules" },
  { slug: "motors-motion",         name: "Motors & Motion" },
  { slug: "iot-wireless",          name: "IoT & Wireless" },
  { slug: "electronic-components", name: "Electronic Components" },
  { slug: "tools-prototyping",     name: "Tools & Prototyping" },
  { slug: "stem-education",        name: "STEM Education" },
];
const catNameMap = Object.fromEntries(categories.map((c) => [c.slug, c.name]));

const products: P[] = [
  {s:"arduino-uno-r3-with-cable",k:"ARD-UNO-R3",n:"Arduino Uno R3 Board with Cable",p:700,q:50,c:"development-boards",b:"Arduino",ic:"cpu",best:true},
  {s:"arduino-uno-r4-minima",k:"ARD-UNO-R4M",n:"Arduino Uno R4 Minima",p:4000,q:15,c:"development-boards",b:"Arduino",ic:"cpu"},
  {s:"arduino-nano",k:"ARD-NANO",n:"Arduino Nano",p:700,q:50,c:"development-boards",b:"Arduino",ic:"cpu",best:true},
  {s:"arduino-uno-starter-kits",k:"ARD-SK-001",n:"Arduino Uno Starter Kits",p:4000,q:20,c:"stem-education",b:"Arduino",ic:"graduation-cap",f:true},
  {s:"breadboard-830",k:"BB-830",n:"Breadboard 830 Holes",p:300,q:100,c:"tools-prototyping",b:"Generic",ic:"wrench",best:true},
  {s:"breadboard-400",k:"BB-400",n:"Breadboard 400 Holes",p:100,q:150,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"breadboard-170",k:"BB-170",n:"Breadboard 170 Holes",p:50,q:200,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"buck-boost-xl6009",k:"BB-XL6009",n:"Buck-Boost Converter XL6009",p:500,q:30,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"buck-boost-lm2596",k:"BB-LM2596",n:"Buck-Boost Converter LM2596",p:300,q:30,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"bluetooth-module",k:"BT-HC05",n:"Bluetooth Module",p:600,q:40,c:"iot-wireless",b:"Generic",ic:"wifi"},
  {s:"battery-holder-4slot",k:"BH-4S",n:"Battery Holder 3.7V 4-Slot",p:200,q:50,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"battery-holder-2slot",k:"BH-2S",n:"Battery Holder 3.7V 2-Slot",p:150,q:50,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"battery-holder-1slot",k:"BH-1S",n:"Battery Holder 3.7V 1-Slot",p:100,q:50,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"battery-snap",k:"BS-001",n:"Battery Snap",p:50,q:100,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"buzzer-3v",k:"BZ-3V",n:"Buzzer 3V",p:50,q:100,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"buzzer-3-24v",k:"BZ-24V",n:"Buzzer 3-24V",p:100,q:80,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"4wd-chassis-kit",k:"CHK-4WD",n:"4WD Chassis Kit",p:1200,q:20,c:"robotics-kits",b:"Generic",ic:"bot",f:true},
  {s:"2wd-chassis-kit",k:"CHK-2WD",n:"2WD Chassis Kit",p:1000,q:20,c:"robotics-kits",b:"Generic",ic:"bot"},
  {s:"conductivity-sensor",k:"SN-COND",n:"Conductivity Sensor",p:1000,q:10,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"acs712-current-sensor",k:"SN-ACS712",n:"ACS712 Current Sensor",p:300,q:30,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"ceramic-capacitors",k:"CP-CER",n:"Ceramic Capacitors",p:25,q:500,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"yellow-geared-dc-motor",k:"MT-YDC",n:"Yellow Geared DC Motor",p:200,q:80,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"3v-dc-motor",k:"MT-3VDC",n:"3V DC Motor",p:300,q:50,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"door-lock",k:"DL-001",n:"Door Lock",p:500,q:15,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"a2212-drone-motor",k:"MT-A2212",n:"A2212 Drone Motor",p:2000,q:10,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"12v-brushless-water-pump",k:"WP-12V",n:"12V Brushless Water Pump",p:1000,q:10,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"arduino-mega-2560",k:"ARD-MEGA",n:"Arduino Mega 2560",p:2500,q:15,c:"development-boards",b:"Arduino",ic:"cpu",f:true},
  {s:"drone-frame",k:"DRN-FRAME",n:"Drone Frame",p:3000,q:8,c:"robotics-kits",b:"Generic",ic:"bot"},
  {s:"electronics-starter-kit",k:"ESK-001",n:"Electronics Starter Kit",p:1000,q:25,c:"stem-education",b:"Synergy Dynamics",ic:"graduation-cap"},
  {s:"30a-esc-controller",k:"ESC-30A",n:"30A ESC Speed Controller",p:1000,q:15,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"esp32-devkit",k:"ESP-32",n:"ESP32",p:700,q:60,c:"development-boards",b:"Espressif",ic:"cpu",best:true},
  {s:"esp8266-nodemcu",k:"ESP-8266",n:"ESP8266",p:600,q:60,c:"development-boards",b:"Espressif",ic:"cpu"},
  {s:"esp32-camera",k:"ESP-CAM",n:"ESP32 Camera",p:1500,q:20,c:"development-boards",b:"Espressif",ic:"cpu"},
  {s:"arduino-ov7-camera",k:"ARD-OV7",n:"Arduino OV7 Camera",p:600,q:15,c:"sensors-modules",b:"Arduino",ic:"radar"},
  {s:"flame-sensor",k:"SN-FLAME",n:"Flame Sensor",p:500,q:40,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"y2sf01-flow-meter",k:"SN-FLOW",n:"Y2SF01 Flow Meter",p:1000,q:10,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"fingerprint-sensor",k:"SN-FPRINT",n:"Fingerprint Sensor",p:1200,q:10,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"filament",k:"FIL-001",n:"Filament",p:2500,q:10,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"flex-sensor",k:"SN-FLEX",n:"Flex Sensor",p:2500,q:5,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"neo-6m-gps",k:"GPS-NEO6M",n:"NEO-6M GPS Module",p:800,q:20,c:"iot-wireless",b:"Generic",ic:"wifi"},
  {s:"sim808-gsm",k:"GSM-SIM808",n:"SIM808 GSM Module",p:3000,q:8,c:"iot-wireless",b:"Generic",ic:"wifi"},
  {s:"sim800l-gsm",k:"GSM-SIM800L",n:"SIM800L GSM Module",p:800,q:20,c:"iot-wireless",b:"Generic",ic:"wifi"},
  {s:"sim900-gsm",k:"GSM-SIM900",n:"SIM900 GSM Module",p:2000,q:10,c:"iot-wireless",b:"Generic",ic:"wifi"},
  {s:"mq-2-gas-sensor",k:"SN-MQ2",n:"MQ-2 Gas Sensor",p:200,q:50,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"mq-135-gas-sensor",k:"SN-MQ135",n:"MQ-135 Gas Sensor",p:500,q:30,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"dht11-sensor",k:"SN-DHT11",n:"DHT11 Temperature and Humidity Sensor",p:200,q:80,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"dht22-sensor",k:"SN-DHT22",n:"DHT22 Temperature and Humidity Sensor",p:300,q:50,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"diy-ir-robotics-kit",k:"RK-IR",n:"DIY IR Robotics Kit",p:2500,q:10,c:"robotics-kits",b:"Generic",ic:"bot"},
  {s:"ir-remote-kit",k:"IR-KIT",n:"IR Remote Kit",p:500,q:30,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"l293d-driver",k:"MT-L293D",n:"L293D Motor Driver IC",p:200,q:50,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"l298n-driver",k:"MT-L298N",n:"L298N Motor Driver",p:500,q:40,c:"motors-motion",b:"Generic",ic:"cog",best:true},
  {s:"hx711-amplifier",k:"SN-HX711",n:"HX711 Amplifier",p:100,q:40,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"load-cell",k:"SN-LOAD",n:"Load Cell",p:400,q:20,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"ra-02-lora",k:"LORA-RA02",n:"Ra-02 LoRa Module",p:1500,q:15,c:"iot-wireless",b:"Generic",ic:"wifi"},
  {s:"max30100-heart-rate",k:"SN-MAX30100",n:"MAX30100 Heart-Rate Sensor",p:500,q:20,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"max30102-heart-rate",k:"SN-MAX30102",n:"MAX30102 Heart-Rate Sensor",p:800,q:15,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"lcd-1602-i2c",k:"DSP-LCD1602",n:"LCD 1602 with I2C",p:700,q:30,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"lcd-1604",k:"DSP-LCD1604",n:"LCD 1604",p:1000,q:20,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"lcd-2004",k:"DSP-LCD2004",n:"LCD 2004",p:1200,q:20,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"jumper-male-to-female",k:"JW-M2F",n:"Male-to-Female Jumper Wire",p:10,q:500,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"jumper-male-to-male",k:"JW-M2M",n:"Male-to-Male Jumper Wire",p:10,q:500,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"jumper-female-to-female",k:"JW-F2F",n:"Female-to-Female Jumper Wire",p:10,q:500,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"multimeter",k:"TL-MM",n:"Multimeter",p:1000,q:20,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"arduino-shield",k:"ARD-SHIELD",n:"Arduino Shield",p:1000,q:15,c:"development-boards",b:"Arduino",ic:"cpu"},
  {s:"breadboard-power-shield",k:"BB-PWR",n:"Breadboard Power Shield",p:300,q:30,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"laser-transmitter-receiver",k:"SN-LASER",n:"Laser Transmitter and Receiver",p:600,q:20,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"4n35-optocoupler",k:"EC-4N35",n:"4N35 Optocoupler",p:100,q:80,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"kcd01-switch",k:"EC-KCD01",n:"KCD01 On/Off Switch",p:100,q:100,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"piezoelectric-sensor",k:"SN-PIEZO",n:"Piezoelectric Sensor",p:100,q:50,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"pir-motion-sensor",k:"SN-PIR",n:"PIR Motion Sensor",p:300,q:60,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"1045-propellers",k:"MT-PROP",n:"1045 Propellers",p:300,q:30,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"potentiometer",k:"EC-POT",n:"Potentiometer",p:50,q:100,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"raspberry-pi-cooler",k:"RPi-COOL",n:"Raspberry Pi Cooler",p:2500,q:10,c:"tools-prototyping",b:"Raspberry Pi",ic:"wrench"},
  {s:"raspberry-pi-3b",k:"RPi-3B",n:"Raspberry Pi 3B",p:8500,q:5,c:"development-boards",b:"Raspberry Pi",ic:"cpu",f:true},
  {s:"raspberry-pi-4b",k:"RPi-4B",n:"Raspberry Pi 4B",p:20000,q:3,c:"development-boards",b:"Raspberry Pi",ic:"cpu",f:true},
  {s:"npk-soil-sensor",k:"SN-NPK",n:"NPK Soil Sensor",p:10000,q:5,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"raspberry-pi-5",k:"RPi-5",n:"Raspberry Pi 5",p:25000,q:3,c:"development-boards",b:"Raspberry Pi",ic:"cpu",f:true},
  {s:"joystick-module",k:"EC-JOY",n:"Joystick Module",p:500,q:30,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"soil-moisture-sensor",k:"SN-SOIL",n:"Soil-Moisture Sensor",p:300,q:50,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"tof-distance-sensor",k:"SN-TOF",n:"Time-of-Flight Laser Distance Sensor",p:2000,q:10,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"industrial-thermocouple",k:"SN-THERM",n:"Industrial K-Type Thermocouple",p:7000,q:5,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"keypad",k:"EC-KPAD",n:"Keypad",p:300,q:30,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"usb-to-ttl-converter",k:"TL-TTLCONV",n:"USB-to-TTL Converter",p:300,q:30,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"thermistor",k:"SN-THRMSTR",n:"Thermistor",p:15,q:200,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"hc-sr04-ultrasonic",k:"SN-HCSR04",n:"HC-SR04 Ultrasonic Sensor",p:300,q:100,c:"sensors-modules",b:"Generic",ic:"radar",best:true},
  {s:"sg90-servo-motor",k:"MT-SG90",n:"SG90 Servo Motor",p:300,q:100,c:"motors-motion",b:"Generic",ic:"cog",best:true},
  {s:"mg90-servo-motor",k:"MT-MG90",n:"MG90 Servo Motor",p:500,q:50,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"mpu6050-accel",k:"SN-MPU6050",n:"MPU6050 Accelerometer/Gyroscope",p:600,q:30,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"adxl345-accel",k:"SN-ADXL345",n:"ADXL345 Accelerometer",p:600,q:20,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"pulse-sensor",k:"SN-PULSE",n:"Pulse Sensor",p:800,q:15,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"tcs3200-colour-sensor",k:"SN-TCS3200",n:"TCS3200 Colour Sensor",p:1000,q:15,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"resistors",k:"EC-RES",n:"Resistors",p:10,q:1000,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"waterproof-ultrasonic",k:"SN-WUS",n:"Waterproof Ultrasonic Sensor",p:1500,q:10,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"5v-submersible-pump",k:"MT-WP5V",n:"5V Submersible Water Pump",p:500,q:20,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"turbidity-sensor",k:"SN-TURB",n:"Turbidity Sensor",p:1500,q:10,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"gy-85-imu",k:"SN-GY85",n:"GY-85 IMU Sensor",p:1500,q:10,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"arduino-uno-standard-kit",k:"RK-ARDSTD",n:"Arduino Uno Standard Kit",p:4000,q:15,c:"stem-education",b:"Arduino",ic:"graduation-cap"},
  {s:"usbasp-programmer",k:"TL-USBASP",n:"USBASP AVR USBISP Programmer",p:1000,q:15,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"rotary-encoder",k:"SN-ROTENC",n:"Rotary Encoder",p:500,q:30,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"water-pipe-1m",k:"TL-WPIPE",n:"Water Pipe 1 Metre",p:100,q:50,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"soldering-iron",k:"TL-SOLDR",n:"Soldering Iron",p:500,q:20,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"sd-card-module",k:"EC-SDMOD",n:"SD Card Module",p:500,q:30,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"robotic-arm",k:"RK-ARM",n:"Robotic Arm",p:1000,q:10,c:"robotics-kits",b:"Generic",ic:"bot"},
  {s:"relay-1-channel",k:"EC-REL1",n:"1-Channel Relay",p:200,q:80,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"relay-2-channel",k:"EC-REL2",n:"2-Channel Relay",p:500,q:50,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"ph-sensor",k:"SN-PH",n:"pH Sensor",p:2500,q:8,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"stepper-motor-uln2003",k:"MT-STEP",n:"Stepper Motor with ULN2003 Driver",p:500,q:30,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"relay-4-channel",k:"EC-REL4",n:"4-Channel Relay",p:800,q:40,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"solenoid-valve",k:"MT-SOL",n:"Solenoid Valve",p:1000,q:15,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"ina219-current-sensor",k:"SN-INA219",n:"INA219 Current Sensor",p:800,q:20,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"sct013-transformer",k:"SN-SCT013",n:"SCT-013 Split-Core Current Transformer",p:1200,q:10,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"dc-voltage-sensor",k:"SN-DCVOLT",n:"DC Voltage Sensor",p:200,q:40,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"ne555-timer-ic",k:"EC-NE555",n:"NE555 Timer IC",p:100,q:100,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"zmpt101b-voltage-sensor",k:"SN-ZMPT",n:"ZMPT101B Voltage Sensor",p:500,q:20,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"voltage-regulator",k:"EC-VREG",n:"Voltage Regulator",p:100,q:100,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"traffic-light-module",k:"EC-TRAFF",n:"Traffic-Light Module",p:300,q:30,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"heating-element-12v",k:"EC-HEAT",n:"12V Heating Element",p:1200,q:10,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"bme280-pressure-sensor",k:"SN-BME280",n:"BME280 Pressure Sensor",p:500,q:20,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"bmp180-pressure-sensor",k:"SN-BMP180",n:"BMP180 Pressure Sensor",p:300,q:20,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"fpsr-pressure-sensor",k:"SN-FPSR",n:"FPSR Pressure Sensor",p:1000,q:10,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"arduino-standard-kit",k:"ARD-STD-KIT",n:"Arduino Standard Kit",p:5000,q:10,c:"stem-education",b:"Arduino",ic:"graduation-cap",f:true},
  {s:"arduino-basic-kit",k:"ARD-BASIC",n:"Arduino Basic Kit",p:3000,q:15,c:"stem-education",b:"Arduino",ic:"graduation-cap"},
  {s:"arduino-mini-kit",k:"ARD-MINI",n:"Arduino Mini Kit",p:2000,q:20,c:"stem-education",b:"Arduino",ic:"graduation-cap"},
  {s:"2wd-robotics-kit",k:"RK-2WD",n:"2WD Robotics Kit",p:3000,q:10,c:"robotics-kits",b:"Generic",ic:"bot"},
  {s:"4wd-robotics-kit",k:"RK-4WD",n:"4WD Robotics Kit",p:8500,q:5,c:"robotics-kits",b:"Generic",ic:"bot",f:true},
  {s:"kuongshun-esp32-kit",k:"RK-KSHUN",n:"Kuongshun ESP32 Robotics Kit",p:8500,q:5,c:"robotics-kits",b:"Kuongshun",ic:"bot",f:true},
  {s:"proximity-sensor",k:"SN-PROX",n:"Proximity Sensor",p:1500,q:20,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"silicone-heating-pads",k:"EC-SILHEAT",n:"Silicone Heating Pads",p:2000,q:10,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"hb100-microwave-sensor",k:"SN-HB100",n:"HB100 Microwave Motion Sensor",p:2000,q:5,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"veroboard-5x7",k:"PCB-5X7",n:"Veroboard 5x7cm",p:50,q:100,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"veroboard-9x15",k:"PCB-9X15",n:"Veroboard 9x15cm",p:500,q:50,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"pcb-single-10x15",k:"PCB-SS1015",n:"Single-Sided Copper-Clad PCB 10x15cm",p:500,q:30,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"pcb-single-15x20",k:"PCB-SS1520",n:"Single-Sided Copper-Clad PCB 15x20cm",p:1000,q:20,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"ads1115-adc",k:"EC-ADS1115",n:"ADS1115 Analogue-to-Digital Converter",p:500,q:20,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"zener-diode",k:"EC-ZDIODE",n:"Zener Diode",p:50,q:200,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"transistors",k:"EC-TRANS",n:"Transistors",p:50,q:200,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"oled-display",k:"DSP-OLED",n:"OLED Display",p:600,q:30,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"solar-panel",k:"EC-SOLAR",n:"Solar Panel",p:1000,q:15,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"fan-24v-5x5",k:"EC-FAN",n:"24V 5x5 Fan",p:500,q:20,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"raspberry-pi-camera",k:"RPi-CAM",n:"Raspberry Pi Camera",p:1000,q:10,c:"sensors-modules",b:"Raspberry Pi",ic:"radar"},
  {s:"lm35-temperature-sensor",k:"SN-LM35",n:"LM35 Temperature Sensor",p:300,q:40,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"lithium-battery-3v7",k:"BAT-LI37",n:"3.7V Lithium Battery",p:200,q:50,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"led-single",k:"EC-LED",n:"LED",p:20,q:500,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"leds-pack",k:"EC-LEDS",n:"LEDs (Pack)",p:20,q:500,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"servo-motor-generic",k:"MT-SERVO",n:"Servo Motor",p:1000,q:20,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"capacitors",k:"EC-CAP",n:"Capacitors",p:50,q:300,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"rfid-kit",k:"EC-RFID",n:"RFID Kit",p:600,q:20,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"ds18b20-temp-sensor",k:"SN-DS18B20",n:"DS18B20 Temperature Sensor",p:300,q:40,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"temperature-probe",k:"SN-PROBE",n:"Temperature Probe",p:300,q:20,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"sd-card-generic",k:"MEM-SD",n:"SD Card",p:600,q:30,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"sd-card-128gb",k:"MEM-SD128",n:"128GB SD Card",p:1100,q:20,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"sd-card-32gb",k:"MEM-SD32",n:"32GB SD Card",p:900,q:30,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"sd-card-64gb",k:"MEM-SD64",n:"64GB SD Card",p:1000,q:25,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"sd-card-8gb",k:"MEM-SD8",n:"8GB SD Card",p:600,q:30,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"lithium-ion-battery-pack",k:"BAT-LION",n:"Lithium-Ion Battery Pack",p:1000,q:20,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"external-antenna",k:"EC-ANT",n:"External Antenna",p:300,q:30,c:"iot-wireless",b:"Generic",ic:"wifi"},
  {s:"4ch-logic-level-converter",k:"EC-LLC4",n:"4-Channel Logic-Level Converter",p:400,q:30,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"rfid-card",k:"EC-RFIDC",n:"RFID Card",p:100,q:50,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"raspberry-pi-pico",k:"RPi-PICO",n:"Raspberry Pi Pico",p:1000,q:20,c:"development-boards",b:"Raspberry Pi",ic:"cpu"},
  {s:"battery-charger-3v7",k:"BAT-CHG",n:"3.7V Battery Charger",p:500,q:25,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"5v-mini-water-pump",k:"MT-WP5MINI",n:"5V Mini Water Pump",p:500,q:20,c:"motors-motion",b:"Generic",ic:"cog"},
  {s:"mq-6-gas-sensor",k:"SN-MQ6",n:"MQ-6 Gas Sensor",p:400,q:30,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"mq-7-gas-sensor",k:"SN-MQ7",n:"MQ-7 Gas Sensor",p:300,q:30,c:"sensors-modules",b:"Generic",ic:"radar"},
  {s:"led-stack-lights",k:"EC-LSTK",n:"LED Stack Lights",p:2000,q:10,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"usb-adapter",k:"TL-USBADAPT",n:"USB Adapter",p:500,q:30,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"enclosure",k:"TL-ENCL",n:"Enclosure",p:2000,q:10,c:"tools-prototyping",b:"Generic",ic:"wrench"},
  {s:"esp32-d8-holder",k:"EC-D8HOLD",n:"ESP32 D8 Holder",p:1500,q:10,c:"electronic-components",b:"Espressif",ic:"circuit-board"},
  {s:"logic-level-converter",k:"EC-LLC",n:"Logic-Level Converter",p:400,q:30,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"voltage-regulator-713",k:"EC-713VR",n:"713 Voltage Regulator",p:100,q:100,c:"electronic-components",b:"Generic",ic:"circuit-board"},
  {s:"anycubic-s1-3d-printer",k:"3DP-S1",n:"Anycubic S1 3D Printer with 5kg Filament",p:150000,q:2,c:"tools-prototyping",b:"Anycubic",ic:"wrench",f:true},
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function usd(cents: number) { return (cents / 100).toFixed(2); }
function productUrl(p: P) { return `${SITE}/shop/${p.c}/${p.s}`; }
function imageUrl(p: P) { return productImageMap[p.s] ? `${SITE}${productImageMap[p.s]}` : ""; }
function availability(q: number) { return q > 0 ? "in_stock" : "out_of_stock"; }
function googleCategory(cat: string): string {
  const map: Record<string, string> = {
    "development-boards": "Electronics > Electronics Accessories > Computer Components > I/O Cards & Adapters",
    "robotics-kits": "Toys & Games > Toys > Educational Toys > Science & Exploration Sets",
    "sensors-modules": "Electronics > Electronics Accessories > Sensors",
    "motors-motion": "Electronics > Electronics Accessories > Motor Parts & Accessories",
    "iot-wireless": "Electronics > Communications > Communication Accessories",
    "electronic-components": "Electronics > Electronics Accessories > Electronic Components",
    "tools-prototyping": "Hardware > Tools",
    "stem-education": "Toys & Games > Toys > Educational Toys > Science & Exploration Sets",
  };
  return map[cat] ?? "Electronics";
}

// ─── Brand colors ──────────────────────────────────────────────────────────────
const BRAND_DARK   = "1A0F14";
const BRAND_ACCENT = "A2437E";
const BRAND_LIGHT  = "FDF2F8";
const WHITE        = "FFFFFF";
const TEXT_DARK    = "1E1E2E";
const TEXT_MID     = "6B7280";
const BORDER       = "E5E7EB";
const GREEN_BG     = "ECFDF5";
const GREEN_TEXT   = "059669";
const RED_BG       = "FEF2F2";
const RED_TEXT      = "DC2626";

// ─── 1. GOOGLE MERCHANT FEED ──────────────────────────────────────────────────
async function buildGoogleMerchantFeed() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Synergy Dynamics";
  wb.created = new Date();

  const ws = wb.addWorksheet("Products", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  // Google Merchant required + recommended columns
  ws.columns = [
    { header: "id",                  key: "id",          width: 16 },
    { header: "title",               key: "title",       width: 44 },
    { header: "description",         key: "desc",        width: 60 },
    { header: "link",                key: "link",        width: 56 },
    { header: "image_link",          key: "image",       width: 56 },
    { header: "availability",        key: "avail",       width: 14 },
    { header: "price",               key: "price",       width: 14 },
    { header: "brand",               key: "brand",       width: 20 },
    { header: "condition",           key: "condition",   width: 12 },
    { header: "google_product_category", key: "gpc",     width: 52 },
    { header: "product_type",        key: "ptype",       width: 30 },
    { header: "identifier_exists",   key: "idexists",    width: 18 },
    { header: "mpn",                 key: "mpn",         width: 16 },
    { header: "item_group_id",       key: "group",       width: 22 },
    { header: "shipping_weight",     key: "weight",      width: 16 },
    { header: "custom_label_0",      key: "cl0",         width: 18 },
    { header: "custom_label_1",      key: "cl1",         width: 14 },
  ];

  // Header style
  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true, color: { argb: WHITE }, size: 11 };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_DARK } };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 28;

  // Data rows
  for (const p of products) {
    ws.addRow({
      id: p.k,
      title: p.n,
      desc: `${p.n} — available at Synergy Dynamics Zimbabwe. Quality robotics and electronics components. Buy online and collect in Harare or get nationwide delivery.`,
      link: productUrl(p),
      image: imageUrl(p),
      avail: availability(p.q),
      price: `${usd(p.p)} USD`,
      brand: p.b === "Generic" ? "Synergy Dynamics" : p.b,
      condition: "new",
      gpc: googleCategory(p.c),
      ptype: catNameMap[p.c] ?? p.c,
      idexists: "no",
      mpn: p.k,
      group: p.c,
      weight: "",
      cl0: p.f ? "featured" : p.best ? "bestseller" : "standard",
      cl1: catNameMap[p.c] ?? p.c,
    });
  }

  // Alternate row shading
  ws.eachRow((row, idx) => {
    if (idx === 1) return;
    row.alignment = { vertical: "middle", wrapText: true };
    if (idx % 2 === 0) {
      row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "F9FAFB" } };
    }
    row.height = 22;
  });

  // Auto-filter
  ws.autoFilter = { from: "A1", to: `Q${products.length + 1}` };

  const path = "google-merchant-feed.xlsx";
  await wb.xlsx.writeFile(path);
  console.log(`✅ Google Merchant feed: ${path} (${products.length} products)`);
}

// ─── 2. BRANDED SALES TEAM CATALOG ────────────────────────────────────────────
async function buildSalesCatalog() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Synergy Dynamics";
  wb.created = new Date();

  // -- Cover / Info sheet --
  const cover = wb.addWorksheet("Cover", {
    properties: { tabColor: { argb: BRAND_ACCENT } },
  });
  cover.mergeCells("A1:H1");
  const titleCell = cover.getCell("A1");
  titleCell.value = "SYNERGY DYNAMICS";
  titleCell.font = { bold: true, size: 28, color: { argb: WHITE } };
  titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_DARK } };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  cover.getRow(1).height = 60;

  cover.mergeCells("A2:H2");
  const tagCell = cover.getCell("A2");
  tagCell.value = "Zimbabwe's Robotics, Electronics & Intelligent Systems Marketplace";
  tagCell.font = { bold: true, size: 14, color: { argb: BRAND_ACCENT } };
  tagCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_LIGHT } };
  tagCell.alignment = { vertical: "middle", horizontal: "center" };
  cover.getRow(2).height = 36;

  const infoData = [
    ["", ""],
    ["Company", "Synergy Dynamics (Pvt) Ltd"],
    ["Website", "https://www.synergyrobotics.co.zw"],
    ["Location", "Park City Village Mall, Harare, Zimbabwe"],
    ["WhatsApp", "+263 78 XXX XXXX"],
    ["Email", "sales@synergydynamics.co.zw"],
    ["", ""],
    ["Catalog Date", new Date().toLocaleDateString("en-ZW", { day: "numeric", month: "long", year: "numeric" })],
    ["Total Products", `${products.length}`],
    ["Categories", `${categories.length}`],
    ["Currency", "USD (United States Dollar)"],
    ["Delivery", "Nationwide delivery across Zimbabwe"],
    ["Collection", "Park City Village Mall, Harare"],
  ];
  infoData.forEach((row) => {
    const r = cover.addRow(row);
    r.getCell(1).font = { bold: true, size: 11, color: { argb: TEXT_MID } };
    r.getCell(2).font = { size: 11, color: { argb: TEXT_DARK } };
  });
  cover.getColumn(1).width = 20;
  cover.getColumn(2).width = 50;

  // -- Full Catalog sheet --
  const ws = wb.addWorksheet("Full Catalog", {
    properties: { tabColor: { argb: BRAND_ACCENT } },
    views: [{ state: "frozen", ySplit: 2 }],
  });

  // Title row
  ws.mergeCells("A1:L1");
  const catTitle = ws.getCell("A1");
  catTitle.value = "SYNERGY DYNAMICS — FULL PRODUCT CATALOG";
  catTitle.font = { bold: true, size: 16, color: { argb: WHITE } };
  catTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_DARK } };
  catTitle.alignment = { vertical: "middle", horizontal: "center" };
  ws.getRow(1).height = 44;

  // Column headers
  ws.columns = [
    { key: "no",       width: 6 },
    { key: "sku",      width: 16 },
    { key: "name",     width: 44 },
    { key: "category", width: 24 },
    { key: "brand",    width: 18 },
    { key: "price",    width: 14 },
    { key: "stock",    width: 10 },
    { key: "status",   width: 14 },
    { key: "featured", width: 12 },
    { key: "best",     width: 14 },
    { key: "link",     width: 56 },
    { key: "image",    width: 56 },
  ];

  const headerRow = ws.getRow(2);
  headerRow.values = ["#", "SKU", "Product Name", "Category", "Brand", "Price (USD)", "Stock", "Status", "Featured", "Best Seller", "Product Link", "Image URL"];
  headerRow.font = { bold: true, color: { argb: WHITE }, size: 11 };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_ACCENT } };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 30;

  // Add borders to header
  headerRow.eachCell((cell) => {
    cell.border = {
      bottom: { style: "medium", color: { argb: BRAND_DARK } },
    };
  });

  // Data rows
  products.forEach((p, i) => {
    const row = ws.addRow({
      no: i + 1,
      sku: p.k,
      name: p.n,
      category: catNameMap[p.c] ?? p.c,
      brand: p.b,
      price: Number(usd(p.p)),
      stock: p.q,
      status: p.q > 0 ? "In Stock" : "Out of Stock",
      featured: p.f ? "Yes" : "",
      best: p.best ? "Yes" : "",
      link: productUrl(p),
      image: imageUrl(p),
    });

    row.height = 24;
    row.alignment = { vertical: "middle" };

    // Alternate row shading
    if (i % 2 === 1) {
      row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_LIGHT } };
    }

    // Price formatting
    const priceCell = row.getCell("price");
    priceCell.numFmt = '"US$"#,##0.00';
    priceCell.alignment = { horizontal: "right" };

    // Stock cell colouring
    const stockCell = row.getCell("stock");
    stockCell.alignment = { horizontal: "center" };

    // Status cell colouring
    const statusCell = row.getCell("status");
    statusCell.alignment = { horizontal: "center" };
    if (p.q > 0) {
      statusCell.font = { bold: true, color: { argb: GREEN_TEXT } };
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: GREEN_BG } };
    } else {
      statusCell.font = { bold: true, color: { argb: RED_TEXT } };
      statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: RED_BG } };
    }

    // Make link clickable
    const linkCell = row.getCell("link");
    linkCell.value = { text: productUrl(p), hyperlink: productUrl(p) };
    linkCell.font = { color: { argb: BRAND_ACCENT }, underline: true };

    // Featured / Best Seller badges
    const featCell = row.getCell("featured");
    if (p.f) {
      featCell.font = { bold: true, color: { argb: BRAND_ACCENT } };
      featCell.alignment = { horizontal: "center" };
    }
    const bestCell = row.getCell("best");
    if (p.best) {
      bestCell.font = { bold: true, color: { argb: GREEN_TEXT } };
      bestCell.alignment = { horizontal: "center" };
    }

    // Light bottom border
    row.eachCell((cell) => {
      cell.border = { bottom: { style: "thin", color: { argb: BORDER } } };
    });
  });

  // Auto-filter
  ws.autoFilter = { from: "A2", to: `L${products.length + 2}` };

  // -- Category Summary sheet --
  const summary = wb.addWorksheet("Category Summary", {
    properties: { tabColor: { argb: "059669" } },
  });

  summary.mergeCells("A1:E1");
  const sumTitle = summary.getCell("A1");
  sumTitle.value = "CATEGORY SUMMARY";
  sumTitle.font = { bold: true, size: 16, color: { argb: WHITE } };
  sumTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_DARK } };
  sumTitle.alignment = { vertical: "middle", horizontal: "center" };
  summary.getRow(1).height = 40;

  const sumHeader = summary.getRow(2);
  sumHeader.values = ["Category", "Products", "Avg Price (USD)", "Total Stock", "Category Link"];
  sumHeader.font = { bold: true, color: { argb: WHITE }, size: 11 };
  sumHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_ACCENT } };
  sumHeader.alignment = { horizontal: "center" };
  sumHeader.height = 28;

  summary.getColumn(1).width = 26;
  summary.getColumn(2).width = 12;
  summary.getColumn(3).width = 18;
  summary.getColumn(4).width = 14;
  summary.getColumn(5).width = 52;

  for (const cat of categories) {
    const catProducts = products.filter((p) => p.c === cat.slug);
    const avgPrice = catProducts.length
      ? catProducts.reduce((s, p) => s + p.p, 0) / catProducts.length / 100
      : 0;
    const totalStock = catProducts.reduce((s, p) => s + p.q, 0);
    const catLink = `${SITE}/shop/${cat.slug}`;

    const row = summary.addRow([
      cat.name,
      catProducts.length,
      Number(avgPrice.toFixed(2)),
      totalStock,
      { text: catLink, hyperlink: catLink } as any,
    ]);
    row.height = 24;
    row.getCell(3).numFmt = '"US$"#,##0.00';
    row.getCell(5).font = { color: { argb: BRAND_ACCENT }, underline: true };
    row.eachCell((cell) => {
      cell.border = { bottom: { style: "thin", color: { argb: BORDER } } };
      cell.alignment = { vertical: "middle" };
    });
  }

  // -- Price List sheet (compact) --
  const priceList = wb.addWorksheet("Price List", {
    properties: { tabColor: { argb: "3B82F6" } },
    views: [{ state: "frozen", ySplit: 2 }],
  });

  priceList.mergeCells("A1:D1");
  const plTitle = priceList.getCell("A1");
  plTitle.value = "SYNERGY DYNAMICS — PRICE LIST";
  plTitle.font = { bold: true, size: 16, color: { argb: WHITE } };
  plTitle.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_DARK } };
  plTitle.alignment = { vertical: "middle", horizontal: "center" };
  priceList.getRow(1).height = 40;

  const plHeader = priceList.getRow(2);
  plHeader.values = ["Product", "SKU", "Price (USD)", "Buy Link"];
  plHeader.font = { bold: true, color: { argb: WHITE }, size: 11 };
  plHeader.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_ACCENT } };
  plHeader.alignment = { horizontal: "center" };
  plHeader.height = 28;

  priceList.getColumn(1).width = 44;
  priceList.getColumn(2).width = 16;
  priceList.getColumn(3).width = 16;
  priceList.getColumn(4).width = 56;

  const sorted = [...products].sort((a, b) => a.n.localeCompare(b.n));
  sorted.forEach((p, i) => {
    const row = priceList.addRow([
      p.n,
      p.k,
      Number(usd(p.p)),
      { text: productUrl(p), hyperlink: productUrl(p) } as any,
    ]);
    row.height = 22;
    row.getCell(3).numFmt = '"US$"#,##0.00';
    row.getCell(3).alignment = { horizontal: "right" };
    row.getCell(4).font = { color: { argb: BRAND_ACCENT }, underline: true };
    if (i % 2 === 1) {
      row.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_LIGHT } };
    }
    row.eachCell((cell) => {
      cell.border = { bottom: { style: "thin", color: { argb: BORDER } } };
      cell.alignment = { ...cell.alignment, vertical: "middle" };
    });
  });

  priceList.autoFilter = { from: "A2", to: `D${sorted.length + 2}` };

  const path = "synergy-dynamics-product-catalog.xlsx";
  await wb.xlsx.writeFile(path);
  console.log(`✅ Sales catalog: ${path} (${products.length} products, 4 sheets)`);
}

// ─── Run ───────────────────────────────────────────────────────────────────────
async function main() {
  await buildGoogleMerchantFeed();
  await buildSalesCatalog();
  console.log("\nDone! Files created in project root.");
}

main().catch((e) => { console.error(e); process.exit(1); });
