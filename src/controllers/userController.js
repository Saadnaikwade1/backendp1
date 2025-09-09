import db from "../models/db.js";

// Get all users
export const getUsers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error(" Error fetching users:", error.message);
    res.status(500).json({ Error: "Database query failed" });
  }
};

// Get user by id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found!" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(" Error fetching user:", error.message);
    res.status(500).json({ Error: "Database query failed" });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    // 1️ Validate input
    if (!name || !email || !age) {
      return res
        .status(400)
        .json({ error: "All fields (name, email, age) are required" });
    }

    // 2️ Prevent duplicate emailsm
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // 3️ Insert into DB
    const [result] = await db.execute(
      "INSERT INTO users (name, email, age) VALUES (?, ?, ?)",
      [name, email, age]
    );

    // 4️ Send response
    res.status(201).json({
      id: result.insertId,
      name,
      email,
      age,
    });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ Error: "Database query failed" });
  }
};

// update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    //  Check if user exists
    const [exist] = await db.execute("SELECT * FROM users WHERE id=?", [id]);
    if (exist.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Keep old values if no new ones are provided
    const updatedName = name || exist[0].name;
    const updatedEmail = email || exist[0].email;
    const updatedAge = age || exist[0].age;

    //  Update usererror in updating user: Cannot destructure property 'name' of 'req.body' as it is undefined.
    await db.execute("UPDATE users SET name=?, email=?, age=? WHERE id=?", [
      updatedName,
      updatedEmail,
      updatedAge,
      id,
    ]);

    // Send updated data back
    res.json({
      id,
      name: updatedName,
      email: updatedEmail,
      age: updatedAge,
    });
  } catch (error) {
    console.error("error in updating user:", error.message);
    res.status(500).json({ Error: "Database query failed" });
  }
};
