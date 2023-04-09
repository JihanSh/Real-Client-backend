import User from "../models/User.js";

const register = async (req, res, next) => {
  const newUser=new User(req.body) 

if (!req.body.phonenumber || !req.body.password || !req.body.username) {
  return res.status(400).json({ error: "Missing required fields" });
}
   
  try {
    await User.create(newUser).then(
      (user) => {
        res.status(200).json({ message: "User successfully created", user });
      }
    );  if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }    
 
  } catch (err) {
    console.log("error", err);
    res.status(500).json({
      message: "User not successfully created",newUser,
      error: err.message,
    });
 }};

    




export default register;

