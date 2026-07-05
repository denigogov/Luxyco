import { useCallback, useEffectEvent, useMemo, useRef, useState } from "react";
import {
  useDeleteUser,
  useUserList,
} from "../../../../../features/users/users.queries";
import { useDataFilters } from "../../../../../utils/hooks/useDataFilters";
import ASelect from "../../../../../whitelabel/src/atoms/formComponents/select/A-select";
import TableFooterPagination from "../../../../../whitelabel/src/atoms/pagination/A-TableFooterPagination";
import Table from "../../../../../whitelabel/src/molecules/table/M-table";
import { allUsersData, userPrompDeleteMessages } from "./AllUseres.data";
import { CreateUserTags, mapUserListToRow } from "./allUser.helpers";
import ToggleButton from "../../../../../whitelabel/src/atoms/toggle/ToggleButton";
import ActiveTag from "../../../../../whitelabel/src/molecules/activeTag/ActiveTag";
import Button from "../../../../../whitelabel/src/atoms/button/A-Button";
import { useNavigate } from "react-router";
import type { ModalTypes } from "../../../../../whitelabel/src/organisms/Modal/modal.types";
import ConfirmDialog from "../../../../../whitelabel/src/molecules/confirmDialog/M-ConfirmDialog";
import type { RowTypes } from "../../../../../whitelabel/src/molecules/table/m-table.types";
import { notificationAlert } from "../../../../../utils/hooks/notify";

const AllUsers: React.FC = () => {
  const navigate = useNavigate();
  const { page, limit, active, setFilters, userType } = useDataFilters();
  const modalCloseRef = useRef<null | (() => void)>(null);
  const showIsActive = active !== "false";

  const params = useMemo(
    () => ({
      page: page ?? 1,
      limit,
      active,
      userType,
    }),
    [page, limit, active, userType],
  );

  const deleteUserMutation = useDeleteUser();
  const userCanEdit = true;
  const canUserDelete = true;

  const closeModal = () => {
    modalCloseRef.current?.();
  };

  const handleDeleteUser = useEffectEvent(async (row: RowTypes) => {
    const id = Number(row.id);
    if (!Number.isFinite(id) || id <= 0 || !canUserDelete) return;

    try {
      await deleteUserMutation.mutateAsync(id);
      closeModal();
      notificationAlert.success(userPrompDeleteMessages.deleteOne.success);
    } catch (err) {
      notificationAlert.error(userPrompDeleteMessages.deleteOne.error);
      closeModal();
    }
  });

  const { data, isLoading, isError, isFetching } = useUserList(params);
  const tableListData = data?.data ?? [];

  const rows = useMemo(() => {
    return tableListData.map(mapUserListToRow);
  }, [tableListData]);

  const handleFilterReset = () => {
    setFilters({
      limit: undefined,
      page: undefined,
      active: undefined,
      userType: undefined,
    });
  };

  const filterActiveUsers = () => {
    const next = !showIsActive;

    setFilters({
      active: next ? undefined : "false",
    });
  };

  const filterAccountyType = (
    e: React.ChangeEvent<HTMLSelectElement, Element>,
  ) => {
    const value = e.target.value;
    if (!value) return;

    const reset = value === "all";

    setFilters({
      userType: reset ? undefined : value,
    });
  };

  const clearAllFilterTags = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    handleFilterReset();
  };

  const tags = CreateUserTags({
    setFilters,
    limit,
    page,
    active,
    userType,
  });

  const renderDeleteUserDialog = useCallback(
    (row: RowTypes) => (
      <ConfirmDialog
        {...allUsersData.confirmationDeleteDialog}
        buttons={allUsersData?.confirmationDeleteDialog?.buttons?.map(
          (button) => {
            if (button.role === "cancel") {
              return {
                ...button,
                onClick: closeModal,
              };
            }

            if (button.role === "submit") {
              return {
                ...button,
                onClick: () => handleDeleteUser(row),
              };
            }

            return button;
          },
        )}
      />
    ),
    [closeModal, handleDeleteUser],
  );

  const navigateToCreateUser = () => {
    navigate("add");
  };

  const tableActionButton: ModalTypes[] = [
    {
      openButton: {
        label: showIsActive ? "Деактивирај" : "Активирај",
        style: "link",
      },
      onClose: (close) => (modalCloseRef.current = close),
    },
  ];

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>error</h1>;

  return (
    <div>
      <div className="uk-flex uk-flex-between">
        <div className="uk-flex uk-padding-small" style={{ gap: "20px" }}>
          <Button
            {...allUsersData.createUserBtn}
            onClick={navigateToCreateUser}
          />
          <ASelect
            {...allUsersData.filterByType}
            onChange={(e) => filterAccountyType(e)}
          />
        </div>
        <ToggleButton
          handleToggleOnClick={filterActiveUsers}
          state={showIsActive}
          toggleText={
            showIsActive ? "активни корисници" : "неактивни корисници"
          }
        />
      </div>
      <ActiveTag
        {...allUsersData.tags}
        items={tags}
        onClearAll={clearAllFilterTags}
        className="b-orders-tags"
      />
      <Table
        {...allUsersData.tableData}
        rows={rows}
        loading={isFetching}
        loadingVariant="bar+skeleton"
        loadingRows={limit ?? 10}
        onRowDelete={canUserDelete ? handleDeleteUser : undefined}
        renderActionModalChildren={renderDeleteUserDialog}
        actionButtons={{
          buttons: userCanEdit
            ? [...(allUsersData.tableData?.actionButtons?.buttons ?? [])]
            : [],
          modals: [...(canUserDelete ? tableActionButton : [])],
        }}
      />
      <TableFooterPagination
        {...allUsersData.pagination}
        meta={(data as any)?.meta}
        onPageChange={(p) => setFilters({ page: p })}
        onLimitChange={(l) => setFilters({ limit: l, page: 1 })}
      />
    </div>
  );
};

export default AllUsers;
