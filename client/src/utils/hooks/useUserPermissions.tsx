import type { Permission } from "../brands/permisionKeys";
import { hasRoleAccessToPath } from "../routes/roleAccess";
import { useAuth } from "./useAuth";

const useUserPermissions = () => {
  const { user } = useAuth();
  const role = user?.role ?? null;

  const allowedPermitions = (permitionType: Permission) => {
    return hasRoleAccessToPath(permitionType, role);
  };

  return {
    allowedPermitions,
  };
};

export default useUserPermissions;
