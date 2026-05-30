import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import Country from "../src/models/Country";
import State from "../src/models/State";
import City from "../src/models/City";
import HsnCode from "../src/models/HsnCode";
import Plan from "../src/models/Plan";

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const sampleProducts = [
  { code: "85171300", description: "Smartphones and mobile devices", unit: "PCS" },
  { code: "84713010", description: "Laptops and personal computers", unit: "PCS" },
  { code: "84716040", description: "Mechanical keyboards and inputs", unit: "PCS" },
  { code: "85285200", description: "LED Flat Panel Monitors", unit: "PCS" },
  { code: "74081190", description: "Industrial copper wire coils", unit: "KGS" },
  { code: "52051110", description: "Raw cotton yarn bundles", unit: "KGS" },
  { code: "87082990", description: "Automotive engine and chassis parts", unit: "PCS" },
  { code: "90189099", description: "Stainless steel surgical instruments", unit: "PCS" },
  { code: "69072100", description: "Glazed ceramic floor tiles", unit: "SQM" },
  { code: "39011010", description: "Low density polyethylene (LLDPE) resins", unit: "KGS" }
];

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for Master Seeding...");

    // ─── 1. SEED PLANS ───
    console.log("Seeding subscription plans...");
    const plansToCreate = [
      {
        name: "Free Plan",
        description: "Get started with basic trade information",
        price: 0,
        maxListings: 5,
        maxImages: 3,
        maxHsnCodes: 5,
        features: [
          "5 Shipment Records Per Search",
          "Basic Country Filter",
          "No Contact Unlocks"
        ]
      },
      {
        name: "Starter Plan",
        description: "Perfect for individual researchers",
        price: 1499,
        maxListings: 20,
        maxImages: 5,
        maxHsnCodes: 20,
        features: [
          "100 Shipment Records Per Search",
          "Standard Analytics Charts",
          "10 Contact Unlocks/month",
          "Email Digest Alerts"
        ]
      },
      {
        name: "Pro Plan",
        description: "The professional standard for trade intelligence",
        price: 4999,
        maxListings: 100,
        maxImages: 10,
        maxHsnCodes: null,
        features: [
          "Unlimited Shipment Records",
          "Faceted Cascading Filters (HSN, Port, Date)",
          "100 Contact Unlocks/month",
          "Full Dynamic Analytics & Market Trends",
          "Excel & CSV Export Allowed"
        ]
      },
      {
        name: "Enterprise Plan",
        description: "Tailored for large import-export operations",
        price: 14999,
        maxListings: 1000,
        maxImages: 10,
        maxHsnCodes: null,
        features: [
          "Everything in Pro Plan",
          "500 Contact Unlocks/month",
          "Custom API Access Integration",
          "Dedicated Account Manager",
          "Direct Database Export"
        ]
      }
    ];

    const tenYearsLater = new Date();
    tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);

    for (const p of plansToCreate) {
      await Plan.findOneAndUpdate(
        { name: p.name },
        {
          ...p,
          startDate: new Date(),
          endDate: tenYearsLater,
          isActive: true
        },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log("Dynamic subscription plans seeded/updated.");

    // ─── 2. SEED COUNTRIES ───
    console.log("Seeding countries...");
    const countriesToCreate = [
      { name: "India", code: "IND", phoneCode: "+91", currencyCode: "INR", currencySymbol: "₹", isActive: true },
      { name: "United States", code: "USA", phoneCode: "+1", currencyCode: "USD", currencySymbol: "$", isActive: true },
      { name: "Germany", code: "DEU", phoneCode: "+49", currencyCode: "EUR", currencySymbol: "€", isActive: true },
      { name: "United Kingdom", code: "GBR", phoneCode: "+44", currencyCode: "GBP", currencySymbol: "£", isActive: true },
      { name: "China", code: "CHN", phoneCode: "+86", currencyCode: "CNY", currencySymbol: "¥", isActive: true }
    ];

    const seededCountries = [];
    for (const c of countriesToCreate) {
      const country = await Country.findOneAndUpdate(
        { code: c.code },
        c,
        { upsert: true, returnDocument: 'after' }
      );
      seededCountries.push(country);
    }
    console.log(`Seeded/verified ${seededCountries.length} countries.`);

    const indCountry = seededCountries.find(c => c.code === "IND")!;
    const usaCountry = seededCountries.find(c => c.code === "USA")!;
    const deuCountry = seededCountries.find(c => c.code === "DEU")!;
    const gbrCountry = seededCountries.find(c => c.code === "GBR")!;
    const chnCountry = seededCountries.find(c => c.code === "CHN")!;

    // ─── 3. SEED STATES ───
    console.log("Seeding states...");
    const statesToCreate = [
      { name: "Maharashtra", code: "MH", countryId: indCountry._id, isActive: true },
      { name: "Gujarat", code: "GJ", countryId: indCountry._id, isActive: true },
      { name: "Karnataka", code: "KA", countryId: indCountry._id, isActive: true },
      { name: "California", code: "CA", countryId: usaCountry._id, isActive: true },
      { name: "New York", code: "NY", countryId: usaCountry._id, isActive: true }
    ];

    const seededStates = [];
    for (const s of statesToCreate) {
      const state = await State.findOneAndUpdate(
        { code: s.code, countryId: s.countryId },
        s,
        { upsert: true, returnDocument: 'after' }
      );
      seededStates.push(state);
    }
    console.log(`Seeded/verified ${seededStates.length} states.`);

    const mhState = seededStates.find(s => s.code === "MH")!;
    const gjState = seededStates.find(s => s.code === "GJ")!;
    const caState = seededStates.find(s => s.code === "CA")!;
    const nyState = seededStates.find(s => s.code === "NY")!;

    // ─── 4. SEED CITIES (PORTS) ───
    console.log("Seeding cities (ports)...");
    const citiesToCreate = [
      { name: "Mumbai Port (INBOM)", stateId: mhState._id, isActive: true },
      { name: "Nhava Sheva Port (INNSA)", stateId: mhState._id, isActive: true },
      { name: "Mundra Port (INMUN)", stateId: gjState._id, isActive: true },
      { name: "Los Angeles Port (USLAX)", stateId: caState._id, isActive: true },
      { name: "New York Port (USNYC)", stateId: nyState._id, isActive: true },
      { name: "Hamburg Port (DEHAM)", stateId: mhState._id, isActive: true },
      { name: "London Gateway (GBLON)", stateId: mhState._id, isActive: true },
      { name: "Shanghai Port (CNSHA)", stateId: mhState._id, isActive: true }
    ];

    for (const c of citiesToCreate) {
      await City.findOneAndUpdate(
        { name: c.name, stateId: c.stateId },
        c,
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log("Seeded/verified ports and cities.");

    // ─── 5. SEED HSN CODES ───
    console.log("Seeding HSN codes...");
    for (const prod of sampleProducts) {
      await HsnCode.findOneAndUpdate(
        { code: prod.code },
        { ...prod, isActive: true },
        { upsert: true, returnDocument: 'after' }
      );
    }
    console.log("Seeded/verified Harmonized System HSN codes.");

    console.log("Master database seeding complete!");
  } catch (err) {
    console.error("Failed to seed master database:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
