import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import Razorpay from "razorpay";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("robotutur.db");
const JWT_SECRET = process.env.JWT_SECRET || "robotutur-super-secret-key";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'USER'
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    image TEXT,
    stock INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL NOT NULL,
    status TEXT DEFAULT 'PENDING',
    payment_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Seed Products if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const seedProducts = [
    { name: "Robo-Arm Kit v2", description: "6-DOF programmable robotic arm with servo motors.", price: 4500, category: "Robotics", image: "https://picsum.photos/seed/roboarm/400/400", stock: 15 },
    { name: "IoT Weather Station", description: "Complete sensor suite for monitoring temperature, humidity, and pressure.", price: 2200, category: "IoT", image: "https://picsum.photos/seed/weather/400/400", stock: 25 },
    { name: "Quadcopter Frame Kit", description: "Carbon fiber frame for high-performance drone builds.", price: 3500, category: "Drones", image: "https://picsum.photos/seed/drone/400/400", stock: 10 },
    { name: "ESP32 Dev Module", description: "Powerful Wi-Fi + BT + BLE MCU for IoT projects.", price: 450, category: "Embedded", image: "https://picsum.photos/seed/esp32/400/400", stock: 100 },
    { name: "LiDAR Sensor L1", description: "High-precision laser distance sensor for mapping.", price: 8500, category: "Sensors", image: "https://picsum.photos/seed/lidar/400/400", stock: 5 },
    { name: "Arduino Uno R3", description: "The classic microcontroller for beginners and pros.", price: 650, category: "Embedded", image: "https://picsum.photos/seed/arduino/400/400", stock: 50 },
  ];

  const insertProduct = db.prepare("INSERT INTO products (name, description, price, category, image, stock) VALUES (?, ?, ?, ?, ?, ?)");
  seedProducts.forEach(p => insertProduct.run(p.name, p.description, p.price, p.category, p.image, p.stock));
}

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const result = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, hashedPassword);
      res.status(201).json({ id: result.lastInsertRowid, name, email });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });

  // Product Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  });

  // Admin Product Routes
  app.post("/api/admin/products", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'ADMIN') return res.sendStatus(403);
    const { name, description, price, category, image, stock } = req.body;
    const result = db.prepare("INSERT INTO products (name, description, price, category, image, stock) VALUES (?, ?, ?, ?, ?, ?)").run(name, description, price, category, image, stock);
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  });

  app.put("/api/admin/products/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'ADMIN') return res.sendStatus(403);
    const { name, description, price, category, image, stock } = req.body;
    db.prepare("UPDATE products SET name=?, description=?, price=?, category=?, image=?, stock=? WHERE id=?").run(name, description, price, category, image, stock, req.params.id);
    res.json({ id: req.params.id, ...req.body });
  });

  app.delete("/api/admin/products/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'ADMIN') return res.sendStatus(403);
    db.prepare("DELETE FROM products WHERE id=?").run(req.params.id);
    res.sendStatus(204);
  });

  // Order Routes
  app.post("/api/orders", authenticateToken, async (req: any, res) => {
    const { items, total } = req.body;
    
    // Create Razorpay order
    let razorpayOrder = null;
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      razorpayOrder = await rzp.orders.create({
        amount: total * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
    }

    const result = db.prepare("INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)").run(req.user.id, total, 'PENDING');
    const orderId = result.lastInsertRowid;

    const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    items.forEach((item: any) => {
      insertItem.run(orderId, item.id, item.quantity, item.price);
    });

    res.status(201).json({ 
      orderId, 
      razorpayOrderId: razorpayOrder?.id,
      amount: total,
      currency: "INR"
    });
  });

  app.get("/api/orders/my", authenticateToken, (req: any, res) => {
    const orders = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    res.json(orders);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
