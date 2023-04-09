import User from "../models/User.js";

const update = async (req, res, next) => {
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
           user.save().then(
            () => {
           
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
    }
  
export default update