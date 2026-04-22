require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const fs = require("fs");
const readline = require("readline");
const connectDB = require("../src/config/db");
const Customer = require("../src/models/Customer");
const Address = require("../src/models/Address");

async function parseCSV(filePath) {
  const results = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });
  let headers = null;
  for await (const line of rl) {
    if (!line.trim()) continue;
    if (!headers) {
      headers = line.split(",").map((h) => h.trim());
    } else {
      const values = line.split(",").map((v) => v.trim());
      const obj = {};
      headers.forEach((h, i) => (obj[h] = values[i] ?? null));
      results.push(obj);
    }
  }
  return results;
}

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI not set in .env");
    process.exit(1);
  }

  try {
    await connectDB();
  } catch {
    console.error("❌ Cannot connect to MongoDB.");
    console.error("   Start it with: brew services start mongodb-community");
    console.error(`   URI: ${mongoUri}`);
    process.exit(1);
  }

  const dataDir = require("path").resolve(__dirname, "data");
  const customersFile = `${dataDir}/ofd_customers.csv`;
  const addressesFile = `${dataDir}/ofd_addresses.csv`;

  if (!fs.existsSync(customersFile) || !fs.existsSync(addressesFile)) {
    console.error("❌ Missing CSV files in seeds/data/");
    console.error("   Required: ofd_customers.csv, ofd_addresses.csv");
    process.exit(1);
  }

  const customersRaw = await parseCSV(customersFile);
  const addressesRaw = await parseCSV(addressesFile);

  await Customer.deleteMany({});
  await Address.deleteMany({});

  const customers = customersRaw.map((r) => ({
    customer_id: parseInt(r.customer_id),
    name: r.name,
    email: r.email,
    phone: r.phone,
    created_at: new Date(r.created_at),
  }));

  const addresses = addressesRaw.map((r) => ({
    address_id: parseInt(r.address_id),
    customer_id: parseInt(r.customer_id),
    line1: r.line1,
    area: r.area,
    city: r.city,
    pincode: r.pincode,
    created_at: new Date(r.created_at),
  }));

  await Customer.insertMany(customers);
  await Address.insertMany(addresses);

  console.log(`✅ Seeded ${customers.length} customers, ${addresses.length} addresses`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
