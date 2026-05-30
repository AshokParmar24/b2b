import mongoose from "mongoose";
import dotenv from "dotenv";
import Company from "../src/models/Company";
import ShipmentRecord from "../src/models/ShipmentRecord";
import HsnCode from "../src/models/HsnCode";
import Country from "../src/models/Country";
import City from "../src/models/City";
import dbConnect from "../src/lib/dbConnect";

dotenv.config();

const COMPANIES_TO_CREATE = 50;
const SHIPMENTS_TO_CREATE = 500;

const sampleCompanyNames = [
  "Global Tech Imports", "Alpha Trading Co", "Nexus Logistics", 
  "Zenith Suppliers", "Apex Manufacturing", "Quantum Electronics",
  "Pinnacle Exporters", "Nova Industries", "Prime Traders", "Eco Build Materials"
];

const sampleProducts = [
  "Smartphones", "Laptops", "Mechanical Keyboards", "LED Monitors",
  "Copper Wire", "Cotton Yarn", "Automotive Parts", "Surgical Instruments",
  "Ceramic Tiles", "Plastic Resins"
];

async function seedData() {
  try {
    await dbConnect();
    console.log("Connected to DB...");

    // 1. Check if we have HsnCodes, Countries, Cities
    const hsnCodes = await HsnCode.find().limit(5);
    const countries = await Country.find().limit(5);
    const cities = await City.find().limit(5);

    if (!hsnCodes.length || !countries.length) {
      console.error("Please seed HsnCodes and Countries first before running this script.");
      process.exit(1);
    }

    // 2. Clear existing data
    await Company.deleteMany({});
    await ShipmentRecord.deleteMany({});
    console.log("Cleared existing Trade Companies & Shipments...");

    // 3. Create Companies
    const companies = [];
    for (let i = 0; i < COMPANIES_TO_CREATE; i++) {
      const name = sampleCompanyNames[i % sampleCompanyNames.length] + ` ${i}`;
      const country = countries[Math.floor(Math.random() * countries.length)];
      
      const newCompany = await Company.create({
        name,
        taxId: `TAX-${Math.floor(Math.random() * 1000000)}`,
        countryId: country._id,
        website: `www.${name.replace(/\s+/g, '').toLowerCase()}.com`,
        isBlurred: true,
        contactEmails: [`contact@${name.replace(/\s+/g, '').toLowerCase()}.com`],
        contactPhones: [`+1${Math.floor(Math.random() * 1000000000)}`]
      });
      companies.push(newCompany);
    }
    console.log(`Created ${COMPANIES_TO_CREATE} Companies.`);

    // 4. Create Shipment Records
    const shipments = [];
    for (let i = 0; i < SHIPMENTS_TO_CREATE; i++) {
      const exporter = companies[Math.floor(Math.random() * companies.length)];
      let importer = companies[Math.floor(Math.random() * companies.length)];
      
      // Ensure exporter != importer
      while (exporter._id.toString() === importer._id.toString()) {
        importer = companies[Math.floor(Math.random() * companies.length)];
      }

      const hsn = hsnCodes[Math.floor(Math.random() * hsnCodes.length)];
      const originCity = cities.length > 0 ? cities[Math.floor(Math.random() * cities.length)]._id : null;
      const destCity = cities.length > 0 ? cities[Math.floor(Math.random() * cities.length)]._id : null;

      // Random date within last 2 years
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 700));

      const quantity = Math.floor(Math.random() * 10000) + 100;
      const valueUSD = quantity * (Math.floor(Math.random() * 50) + 5);

      const shipment = {
        exporterId: exporter._id,
        importerId: importer._id,
        hsnCodeId: hsn._id,
        originPortId: originCity,
        destinationPortId: destCity,
        date,
        quantity,
        unitType: "KG",
        valueUSD,
        productDescription: sampleProducts[Math.floor(Math.random() * sampleProducts.length)]
      };

      shipments.push(shipment);
    }

    await ShipmentRecord.insertMany(shipments);
    console.log(`Created ${SHIPMENTS_TO_CREATE} Shipment Records.`);

    console.log("Mock data generation complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedData();
