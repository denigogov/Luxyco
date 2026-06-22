import type {
  AccountNameType,
  UsersTypes,
} from "../../../../../features/users/users.types";
import { timeFormat } from "../../../../../utils/helpers/timeFormat";
import type { ActiveTagItem } from "../../../../../whitelabel/src/molecules/activeTag/m-activeTag.types";
import type { RowTypes } from "../../../../../whitelabel/src/molecules/table/m-table.types";
import type { CreateUserListTagsArgs } from "./AllUsers.types";

// export function getOrderRowMarker(active?: boolean): RowMarker | undefined {
//   switch (active) {
//     case true: // product active
//       return undefined;

//     case false: // product deactivated
//       return {
//         variant: "danger",
//         message: "неактивен продукт",
//         onlySideMarker: false,
//       };

//     default:
//       return undefined;
//   }
// }

const formatAccountNames = (type: AccountNameType | string) => {
  switch (type) {
    case "SUPER_ADMIN":
      return "Супер Администратор";

    case "ADMIN":
      return "Администратор";

    case "MANAGER":
      return "Менаџер";

    case "RECEPTION":
      return "Рецепција";

    case "MACHINE_OPERATOR":
      return "Оператор";

    case "DRIVER":
      return "Возач";

    default:
      "-";
  }
};

export function mapUserListToRow(o: UsersTypes): RowTypes {
  return {
    id: String(o.id),
    createdAt: timeFormat(o.createdAt, { showTime: true }),
    updatedAt: timeFormat(o.updatedAt, { showTime: true }),
    accountType: formatAccountNames(o?.accountTypes?.name),
    fullName: `${o?.firstName ?? "-"} ${o.lastName ?? "-"}`,
    phoneNumber: o?.phoneNumber ?? "-",
    username: o?.username ?? "-",
    // rowMarker: getOrderRowMarker(o.isActive),
  };
}

export const CreateUserTags = ({
  setFilters,
  limit,
  page,
  userType,
  active,
}: CreateUserListTagsArgs): ActiveTagItem[] => {
  return [
    limit && limit !== 20
      ? {
          key: "Резултати по страница",
          value: String(limit),
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();

            setFilters({
              limit: undefined,
            });
          },
        }
      : null,

    userType
      ? {
          key: "Тип Корисник",
          value: formatAccountNames(userType),
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();

            setFilters({
              accountType: undefined,
            });
          },
        }
      : null,

    page && page > 1
      ? {
          key: "Страница",
          value: String(page),
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();

            setFilters({
              page: undefined,
            });
          },
        }
      : null,
    active
      ? {
          key: "корисници",
          value: String(active) === "true" ? "активни" : "неактивни",
          onRemove: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault();
            setFilters({
              active: undefined,
            });
          },
        }
      : null,
  ].filter(Boolean) as ActiveTagItem[];
};
