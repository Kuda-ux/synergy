import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { productImageMap } from "./product-images";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

interface P { s:string; k:string; n:string; p:number; q:number; c:string; b:string; ic:string; f?:boolean; best?:boolean }

const categories = [
  { slug:"development-boards",    name:"Development Boards",    icon:"cpu",            desc:"Microcontroller and single-board computer development platforms." },
  { slug:"robotics-kits",         name:"Robotics Kits",         icon:"bot",            desc:"Robot chassis kits, robotics kits and robotic arms." },
  { slug:"sensors-modules",       name:"Sensors & Modules",     icon:"radar",          desc:"Environmental, motion, gas, flow, biometric and measurement sensors." },
  { slug:"motors-motion",         name:"Motors & Motion",       icon:"cog",            desc:"DC motors, servos, steppers, ESCs, propellers and water pumps." },
  { slug:"iot-wireless",          name:"IoT & Wireless",        icon:"wifi",           desc:"Bluetooth, GSM, GPS and LoRa wireless communication modules." },
  { slug:"electronic-components", name:"Electronic Components", icon:"circuit-board",  desc:"Passive components, displays, ICs, relays, batteries and power." },
  { slug:"tools-prototyping",     name:"Tools & Prototyping",   icon:"wrench",         desc:"Breadboards, jumper wires, PCBs, soldering tools and storage." },
  { slug:"stem-education",        name:"STEM Education",        icon:"graduation-cap", desc:"Starter kits and educational packages for learning electronics." },
];

const brands = ["Arduino","Espressif","Raspberry Pi","Kuongshun","Anycubic","Synergy Dynamics","Generic"];

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
];

// Additional products pushed to the same array
products.push(
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
  {s:"water-pipe-1m",k:"TL-WPIPE",n:"Water Pipe 1 Metre",p:100,q:50,c:"tools-prototyping",b:"Generic",ic:"wrench"}
);

products.push(
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
  {s:"anycubic-s1-3d-printer",k:"3DP-S1",n:"Anycubic S1 3D Printer with 5kg Filament",p:150000,q:2,c:"tools-prototyping",b:"Anycubic",ic:"wrench",f:true}
);

async function main() {
  console.log(`Seeding ${products.length} products...`);

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

  const catIds = new Map<string, string>();
  for (const [i, c] of categories.entries()) {
    const created = await db.category.create({
      data: { slug: c.slug, name: c.name, description: c.desc, iconKey: c.icon, sortOrder: i, isFeatured: true },
    });
    catIds.set(c.slug, created.id);
  }

  const brandIds = new Map<string, string>();
  for (const name of brands) {
    const created = await db.brand.create({
      data: { slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"), name, isDemo: false },
    });
    brandIds.set(name, created.id);
  }

  for (const prod of products) {
    const categoryId = catIds.get(prod.c);
    const brandId = brandIds.get(prod.b);
    if (!categoryId) throw new Error(`Unknown category: ${prod.c}`);
    if (!brandId) throw new Error(`Unknown brand: ${prod.b}`);
    await db.product.create({
      data: {
        slug: prod.s, sku: prod.k, name: prod.n,
        shortDescription: `${prod.n} — available at Synergy Dynamics Zimbabwe.`,
        description: prod.n,
        tags: [prod.c, prod.b.toLowerCase(), prod.n.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()].join(","),
        specsJson: "[]", packageContentsJson: "[]", compatibilityJson: "[]",
        priceUsdCents: prod.p, stockQty: prod.q, status: "active",
        isFeatured: prod.f ?? false, isNewArrival: false, isBestSeller: prod.best ?? false,
        isDemo: false,
        brandId, categoryId,
        images: { create: [{ url: productImageMap[prod.s] ?? `placeholder:${prod.ic}`, alt: prod.n, sortOrder: 0 }] },
      },
    });
    console.log(`  + ${prod.n}`);
  }

  await db.setting.createMany({
    data: [
      { key: "zwg_per_usd",   value: "2650" },
      { key: "zwg_enabled",   value: "true" },
      { key: "announcements", value: JSON.stringify(["Nationwide delivery across Zimbabwe","Collection at Park City Village Mall, Harare","Institutional and bulk orders welcome — request a quotation","WhatsApp support available"]) },
      { key: "store_hours",   value: "Mon–Fri 8:00–17:00, Sat 9:00–13:00" },
    ],
  });

  console.log(`\nDone — ${categories.length} categories, ${brands.length} brands, ${products.length} products.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
