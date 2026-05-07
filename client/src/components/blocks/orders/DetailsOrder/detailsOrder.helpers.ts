import type { ReactNode } from "react";
import type { NavigateFunction } from "react-router";

export function buildOrderBreadcrumbsProps(args: {
  base: any;
  returnToPrevRoute: (e: any) => void;
  order: any;
  onDropdownClick: (name: string, data?: any) => void;
  modalChildren: ReactNode;
  setModalClose: (closeFn: () => void) => void;
  allowDeleteOrder: boolean;
}) {
  const {
    base,
    returnToPrevRoute,
    order,
    onDropdownClick,
    modalChildren,
    setModalClose,
    allowDeleteOrder,
  } = args;

  const buttons = base?.dropdown?.items?.buttons?.map((btn: any) => ({
    ...btn,
    onClick: () => onDropdownClick(btn?.name ?? "", order),
  }));

  const modals = base?.dropdown?.items?.modals?.map((modalData: any) => ({
    ...modalData,
    children: modalChildren,
    onClose: (close: () => void) => setModalClose(close),
    openButton: allowDeleteOrder ? modalData.openButton : {},
  }));

  return {
    ...base,
    returnLink: {
      ...(base.returnLink ?? {}),
      onClick: returnToPrevRoute,
    },
    dropdown: {
      ...(base.dropdown ?? {}),
      items: {
        ...(base.dropdown?.items ?? {}),
        buttons,
        modals,
      },
    },
  };
}
