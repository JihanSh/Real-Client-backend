import User from "../models/User.js";
import bcrypt from "bcryptjs"; 
// register
export const register = async (req, res, next) => {
  const newUser = new User(req.body);

  if (
    !req.body.username ||
    !req.body.password ||
    !req.body.address ||
    !req.body.phonenumber
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  // hash the password

  bcrypt.hash(req.body.password, 10).then(async (hash) => {
    await User.create({
      username:req.body.username,
      password: hash,
      address: req.body.address,
      phonenumber: req.body.phonenumber

    })
      .then((user) =>
        res.status(200).json({
          message: "User successfully created",
          user,
        })
      )
      .catch((error) =>
        res.status(400).json({
          message: "User not successful created",
          error: error.message,
        })
      );
  });
};
// login
export const login = async (req, res, next) => {
  // Check if username and password is provided
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      message: "Username or Password not present",
    });
  }else
  try {
    const user = await User.findOne({ username:req.body.username});
      // comparing given password with hashed password
      bcrypt.compare(req.body.password, user.password).then(function (result) {
        result
          ? res.status(200).json({
              message: "Login successful",
              user,
            })
          : res.status(400).json({ message: "Login not succesful" });
      });
    
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
}

// update role to admin
export const update = async (req, res, next) => {
  const { role, id } = req.body;
  // Verifying if role and id is presnt
  if (role && id) {
    // Verifying if the value of role is admin
    if (role === "admin") {
      await User.findById(id);
    } else {
      res.status(400).json({
        message: "Role is not admin",
      });
    }
  } else {
    res.status(400).json({ message: "Role or Id not present" });
  }
  // Finds the user with the id
  User.findById(id)
    .then((user) => {
      // Third - Verifies the user is not an admin
      if (user.role !== "admin") {
        user.role = role;
        user.save().then(() => {
          res.status("201").json({ message: "Update successful", user });
        });
      } else {
        res.status(400).json({ message: "User is already an Admin" });
      }
    })
    .catch((error) => {
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message });
    });
};


// delete a user
export const deleteUser = async (req, res, next) => {
  const { id } = req.body;
  await User.findById(id)
    .then((user) => user.deleteOne())
    .then((user) =>
      res.status(201).json({ message: "User successfully deleted", user })
    )
    .catch((error) =>
      res
        .status(400)
        .json({ message: "An error occurred", error: error.message })
    );
};


// hash the password
