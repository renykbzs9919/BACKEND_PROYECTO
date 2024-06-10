import Role from "../models/Role.js";
import User from "../models/User.js";
import { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD,ADMIN_PHONE_NUMBER } from "../config.js";

export const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count > 0) return;

    const values = await Promise.all([
      new Role({ name: "user" }).save(),
      new Role({ name: "vendedor" }).save(),
      new Role({ name: "admin" }).save(),
    ]);
  } catch (error) {
    console.error(error);
  }
};

export const createAdmin = async () => {
  const userFound = await User.findOne({ email: ADMIN_EMAIL });

  if (userFound) return;

  const adminRole = await Role.findOne({ name: "admin" });

  const newUser = await User.create({
    username: ADMIN_USERNAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    phoneNumber: ADMIN_PHONE_NUMBER,
    roles: [adminRole._id],
  });
};

createRoles();
createAdmin();
