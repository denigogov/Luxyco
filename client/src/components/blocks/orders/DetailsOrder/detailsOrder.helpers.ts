import type { ReactNode } from "react";

export function buildOrderBreadcrumbsProps(args: {
  base: any;
  returnToPrevRoute: (e: any) => void;
  order: any;
  onDropdownClick: (name: string, data?: any) => void;
  modalChildren: ReactNode;
  setModalClose: (closeFn: () => void) => void;
  allowDeleteOrder: boolean;
  notAllowedPemision: boolean;
}) {
  const {
    base,
    returnToPrevRoute,
    order,
    onDropdownClick,
    modalChildren,
    setModalClose,
    allowDeleteOrder,
    notAllowedPemision,
  } = args;
  const isFinished = order?.status?.id === 5;

  const buttons = base?.dropdown?.items?.buttons?.map((btn: any) => ({
    ...btn,
    tooltip: isFinished
      ? "нарачка е веќе завршена и не може да се ажурира"
      : "",
    onClick: isFinished
      ? undefined
      : () => onDropdownClick(btn?.name ?? "", order),
    disabled: isFinished,
  }));

  const modals = base?.dropdown?.items?.modals?.map((modalData: any) => ({
    ...modalData,
    children: modalChildren,
    onClose: (close: () => void) => setModalClose(close),
    openButton: allowDeleteOrder ? modalData.openButton : {},
  }));

  const dropdown = notAllowedPemision
    ? {}
    : {
        ...(base.dropdown ?? {}),
        items: {
          ...(base.dropdown?.items ?? {}),
          buttons,
          modals,
        },
      };

  return {
    ...base,
    returnLink: {
      ...(base.returnLink ?? {}),
      onClick: returnToPrevRoute,
    },
    dropdown,
  };
}
