import User from "../Models/Auth.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";

const jwtSecret="123456";
// register
export const register = async (req, res, next) => {
  
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    if (!req.body || !req.body.username || !req.body.password || !req.body.address || !req.body.phonenumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (req.body.password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long" });
    }

    // hash the password
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      username: req.body.username,
      password: hash,
      address: req.body.address,
      phonenumber: req.body.phonenumber,
    });

    const maxAge = 3 * 60 * 60;
    const token = jwt.sign(
      { id: user._id, username:req.body.username, role: user.role },
      jwtSecret,
      {
        expiresIn: maxAge, // 3hrs in sec
      }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000, // 3hrs in ms
    });
    res.status(201).json({
      message: "User successfully created",
      user: user._id,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "User not successful created", error: error.message });
  }
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
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id,username:req.body.username, role: user.role },
            jwtSecret,
            {
              expiresIn: maxAge, // 3hrs in sec
            }
          );
          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000, // 3hrs in ms
          });
          res.status(201).json({
            message: "User successfully Logged in",
            user: user._id,
            token: token,
            
          });
        } else {
          res.status(400).json({ message: "Login not succesful" });
        }
      });
    
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
}

// // update the user

// export const updateUser = (req, res) => {
//   const 
// }

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
