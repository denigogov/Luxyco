import { useCreateUser } from "../../../../../features/users/users.queries";
import type { CreateUserQuery } from "../../../../../features/users/users.types";
import { notificationAlert } from "../../../../../utils/hooks/notify";
import { FormBuilder } from "../../../../organisms/CustomizableForm/FormBuilder";
import { createUserData } from "./createUser.data";

const CreateUser: React.FC = () => {
  const createMut = useCreateUser();

  const onSubmit = async (values: CreateUserQuery) => {
    try {
      const formatedValue = {
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        password: values.password,
        phoneNumber: values.phoneNumber,
        accountTypeId: values.accountTypes?.id,
      };

      await createMut.mutateAsync({
        ...formatedValue,
      });
      notificationAlert.success(createUserData.notification.success);
    } catch (error) {
      notificationAlert.error(createUserData.notification.error);
      throw error;
    }
  };
  return (
    <div className="uk-padding-small">
      <FormBuilder<CreateUserQuery>
        fields={createUserData.filedsData}
        onSubmit={onSubmit}
        submitButton={{
          ...createUserData.submitButton,
          loading: createMut.isPending,
          disabled: createMut.isPending,
        }}
        className="uk-margin-small-top"
      />
    </div>
  );
};

export default CreateUser;
