import config from "../config";
import { USER_ROLE } from "../modules/user/user.const";
import { User } from "../modules/user/user.model";

const superUser = {
  id: "0001",
  email: "muntasira7@hotmail.com",
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: "in-progress",
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  // This function is used to seed the super admin user into the database.
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExists) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
