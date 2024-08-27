require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const db = require("./db");
const cluster = require("cluster");
const os = require("os");

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died. Starting a new worker...`);
    cluster.fork();
  });
} else {
  // Worker processes - existing server logic

  const app = express();
  const server = http.createServer(app);
  const io = socketIo(server, {
    cors: {
      origin: process.env.ORIGIN, // Ensure this matches your frontend URL
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  // Middleware
  app.use(express.json());

  // Define routes
  app.get("/api/customers", async (req, res) => {
    try {
      const [rows, fields] = await db.query("SELECT * FROM customers");
      console.log(rows);
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/customers/search", async (req, res) => {
    const { first_name } = req.query;
    if (!first_name) {
      return res
        .status(400)
        .json({ error: "Name query parameter is required" });
    }
    try {
      const [rows, fields] = await db.query(
        "SELECT * FROM customers WHERE first_name LIKE ?",
        [`%${first_name}%`]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/customers", async (req, res) => {
    const { first_name, last_name, address, city, state, points } = req.body;
    try {
      const [result] = await db.query(
        "INSERT INTO customers (first_name, last_name, address, city, state, points) VALUES (?, ?, ?, ?, ?, ?)",
        [first_name, last_name, address, city, state, points]
      );
      const newCustomer = {
        id: result.insertId,
        first_name,
        last_name,
        address,
        city,
        state,
        points,
      };
      io.emit("customerCreated", newCustomer);
      res.status(201).json(newCustomer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/customers/:customer_id", async (req, res) => {
    const { customer_id } = req.params;

    try {
      const [result] = await db.query(
        "DELETE FROM customers WHERE customer_id = ?",
        [customer_id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }

      io.emit("customerDeleted", { customer_id });

      res.status(200).json({ message: "Customer deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Socket.io connection
  io.on("connection", async (socket) => {
    console.log("A user connected");
    try {
      const [rows, fields] = await db.query("SELECT * FROM customers");
      socket.emit("initialData", rows);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
    socket.on("selectedCustomerId", async (customerId) => {
      try {
        const [rows, fields] = await db.query(
          "SELECT * FROM customers WHERE customer_id = ?",
          [customerId]
        );
        if (rows.length > 0) {
          socket.emit("customerData", rows[0]); // Send the first result
        } else {
          socket.emit("customerData", { error: "Customer not found" });
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    });

    socket.on("searchName", async (searchName) => {
      try {
        const [rows, fields] = await db.query(
          "SELECT * FROM customers WHERE first_name LIKE ?",
          [`%${searchName}%`]
        );
        if (rows.length > 0) {
          socket.emit("searchData", rows);
        } else {
          socket.emit("searchData", []);
        }
      } catch (error) {
        console.error("Error Search customer data:", error);
      }
    });

    socket.on("addCustomer", async (data) => {
      const { first_name, last_name, phone, address, state, city, points } =
        data;
      try {
        const [result] = await db.query(
          "INSERT INTO customers (first_name, last_name, phone, address, city, state, points) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [first_name, last_name, phone, address, city, state, points]
        );
        const newCustomer = {
          customer_id: result.insertId,
          first_name,
          last_name,
          phone,
          address,
          city,
          state,
          points,
        };
        socket.emit("createdCustomer", newCustomer);
      } catch (error) {
        console.error("Error adding customer", error);
      }
    });

    socket.on("deleteId", async (deleteId) => {
      try {
        const [result] = await db.query(
          "DELETE FROM customers WHERE customer_id = ?",
          [deleteId]
        );
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Customer not found" });
        }
        const updatedCustomer = await db.query("SELECT * FROM customers");
        socket.emit("updatedCustomer", updatedCustomer);
      } catch (error) {
        console.error("Error in deleting customer_id");
      }
    });

    socket.on("updatedDetails", async (updatedDetails) => {
      const {
        customer_id,
        first_name,
        last_name,
        phone,
        address,
        city,
        state,
        points,
      } = updatedDetails;
      try {
        const [result] = await db.query(
          "UPDATE customers SET first_name = ?, last_name = ?, phone = ?, address = ?, city = ?, state = ?, points = ? WHERE customer_id = ?",
          [
            first_name,
            last_name,
            phone,
            address,
            city,
            state,
            points,
            customer_id,
          ]
        );

        if (result.affectedRows === 0) {
          socket.emit("error", { error: "Customer not found" });
          return;
        }

        // Emit the updated customer list to all connected clients
        const [allCustomers] = await db.query("SELECT * FROM customers");
        socket.emit("updatedCustomerList", allCustomers);
      } catch (error) {
        console.error("Error updating customer", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // Start the server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () =>
    console.log(`Worker ${process.pid} running on port ${PORT}`)
  );
}
