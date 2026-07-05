import { useLocation, useNavigate, useParams } from "react-router";
import type { UpdateUserForm } from "../../../../../features/users/users.types";
import { FormBuilder } from "../../../../organisms/CustomizableForm/FormBuilder";
import { useEffect, useMemo, useRef } from "react";
import { notificationAlert } from "../../../../../utils/hooks/notify";
import { useUserUpdate } from "../../../../../features/users/users.queries";
import { updateUserData, userEditMessages } from "./updateUser.data";

const UpdateUser: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const userID = Number(id);
  const warnedRef = useRef(false);

  const isValidDeliveryTypeID = Number.isFinite(userID) && userID > 0;
  const userDataState = location.state;

  const updateMutation = useUserUpdate(userID);

  useEffect(() => {
    if (!userDataState && !warnedRef.current) {
      warnedRef.current = true;
      notificationAlert.warning(userEditMessages.invalidLinkMessage);
      navigate(`../user`, { replace: true });
    }
  }, [userDataState, navigate]);

  const getAccountTypeIdFromLabel = (label?: string): string => {
    const accountTypeField = updateUserData.filedsData.find(
      (field) => field.name === "accountTypes.id",
    );
    const option = accountTypeField?.options?.find(
      (option) => option.label === label,
    );
    return option?.value != null ? String(option.value) : "";
  };

  const initialForm = useMemo<Partial<UpdateUserForm>>(() => {
    const [firstName = "", ...lastNameParts] =
      userDataState?.fullName?.split(" ") ?? [];

    return {
      firstName,
      lastName: lastNameParts.join(" "),
      username: userDataState?.username ?? "",
      phoneNumber: userDataState?.phoneNumber ?? "",

      accountTypes: {
        id: getAccountTypeIdFromLabel(userDataState?.accountType),
        name: userDataState?.accountType ?? "",
      },

      password: "",
      confirmPassword: "",
    };
  }, [userDataState]);

  const fields = useMemo(() => {
    return updateUserData.filedsData.map((f) => {
      if (f.name === "accountTypes.id") {
        return {
          ...f,
          defaultValue: initialForm.accountTypes?.id ?? "",
        };
      }

      return {
        ...f,
        defaultValue: initialForm[f.name as keyof UpdateUserForm] ?? "",
      };
    });
  }, [initialForm]);

  const onSubmit = async (values: UpdateUserForm) => {
    if (!isValidDeliveryTypeID) return;

    const payload: {
      firstName?: string;
      lastName?: string;
      username?: string;
      phoneNumber?: string;
      accountTypeId?: number;
      password?: string;
    } = {};

    if (values.firstName !== initialForm.firstName) {
      payload.firstName = values.firstName;
    }

    if (values.lastName !== initialForm.lastName) {
      payload.lastName = values.lastName;
    }

    if (values.username !== initialForm.username) {
      payload.username = values.username;
    }

    if (values.phoneNumber !== initialForm.phoneNumber) {
      payload.phoneNumber = values.phoneNumber;
    }

    if (values.accountTypes?.id !== initialForm.accountTypes?.id) {
      payload.accountTypeId = Number(values.accountTypes?.id);
    }

    if (values.password && values.password.trim()) {
      payload.password = values.password;
    }

    console.log("PATCH payload", payload);

    try {
      await updateMutation.mutateAsync(payload);

      notificationAlert.success(userEditMessages.success);
    } catch (error) {
      notificationAlert.error(userEditMessages.error);
      throw error;
    }
  };
  return (
    <div className="uk-padding-small">
      <FormBuilder<UpdateUserForm>
        fields={fields}
        onSubmit={onSubmit}
        submitButton={{
          ...updateUserData.submitButton,
          loading: updateMutation.isPending,
          disabled: updateMutation.isPending,
        }}
        className="uk-margin-small-top"
      />
    </div>
  );
};

export default UpdateUser;
