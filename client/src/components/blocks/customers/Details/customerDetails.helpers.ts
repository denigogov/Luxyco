// customers/Details/customerDetails.helpers.ts
import type { ReactNode } from "react";
import type { BoxSectionTypes } from "../../../../whitelabel/src/organisms/BoxSection/o-boxSection.types";
import type { ModalTypes } from "../../../../whitelabel/src/organisms/Modal/modal.types";
import type {
  CustomerAddressTypes,
  CustomerNotes,
  CustomerOrderTypes,
} from "./customerDetails.types";
import { timeFormat } from "../../../../utils/helpers/timeFormat";

/**
 * Orders -> Table rows
 */
export function mapOrdersToRows(customerOrders: CustomerOrderTypes[]) {
  return customerOrders.map((c) => {
    const hasUnmeasuredPieces = c?.measuredPieces !== c?.totalPieces;

    return {
      ...c,
      createdAt: timeFormat(c?.createdAt, { showTime: true }),
      scheduledDate: timeFormat(c?.scheduledDate),
      deliveryType: c?.deliveryType ?? "не дефинирано",
      qrCode: c?.qrCode ?? 0,
      totalPrice: `${(c?.totalPrice ?? 0).toFixed(2)} ден.`,
      totalM2: `${(c?.totalM2 ?? 0).toFixed(2)} m²`,
      status: c?.status ?? "",
      messuredPieces: `${c?.measuredPieces ?? 0}/${c?.totalPieces ?? 0}`,
      rowMarker: hasUnmeasuredPieces
        ? {
            variant: "warning" as const,
            message: "Нарачката содржи неизмерени парчиња",
          }
        : undefined,
    };
  });
}

/**
 * Notes -> BoxSection props
 */
export function buildNotesBoxSectionData(args: {
  onCreateNewNote: () => void;
  notes: CustomerNotes[];
  timeFormat: (v: any) => string;
  onEditNote: (noteId: string, noteObj: CustomerNotes) => void;
  buildDeleteModals: (noteId: string) => ModalTypes[];
}): BoxSectionTypes {
  const { notes, timeFormat, onEditNote, buildDeleteModals, onCreateNewNote } =
    args;

  return {
    noItemsMessage: {
      text: "Корисникот нема забелешки",
      button: {
        label: "Додади Новa",
        icon: {
          name: "file-text",
        },
        style: "tertiary",
        onClick: () => onCreateNewNote(),
      },
    },
    items: notes.map((note) => {
      const createdBy = [note?.users?.firstName, note?.users?.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      const noteId = String(note?.id ?? "");

      return {
        marker: [
          {
            text: timeFormat(note.createdAt),
            style: "primary",
          },
        ],
        title: note?.noteText ?? "",
        content: [
          `Последно уредување: ${timeFormat(note.updatedAt)}`,
          `Креирано од: ${createdBy || "/"}`,
        ].join(" \n "),
        action: {
          modals: buildDeleteModals(noteId),
          buttons: [
            {
              label: "Уреди",
              style: "link",
              role: "edit",
              onClick: () => onEditNote(noteId, note),
            },
          ],
        },
      };
    }),
  };
}

/**
 * Addresses -> BoxSection props
 */
export function buildAddressesBoxSectionData(args: {
  onCreateNewAddress: () => void;
  addresses: CustomerAddressTypes[];
  onEditAddress: (address: CustomerAddressTypes) => void;
  buildDeleteModals: (address: CustomerAddressTypes) => ModalTypes[];
}): BoxSectionTypes {
  const { addresses, onEditAddress, buildDeleteModals, onCreateNewAddress } =
    args;

  const activeSorted = (addresses ?? [])
    .filter((a) => a.isActive)
    .sort((a, b) => Number(b.isDefault) - Number(a.isDefault));

  return {
    noItemsMessage: {
      text: "Корисникот нема додадено адреса",
      button: {
        label: "Додади Новa",
        icon: {
          name: "location",
        },
        style: "tertiary",
        onClick: () => onCreateNewAddress(),
      },
    },
    items: activeSorted.map((a) => {
      const marker = [
        ...(a.isVerifiedByProvider
          ? [{ text: "Верифицирана", style: "success" as const }]
          : []),
        ...(a.isDefault
          ? [{ text: "Активна", style: "primary" as const }]
          : []),
      ];

      const titleParts = [a.street, a.city].filter(Boolean);
      const title = titleParts.join(", ") || a.formattedAddress || "Адреса";

      const content = [
        `${a.postalCode ?? ""} ${a.city ?? ""} ${
          a.village ? "- " + a.village : ""
        }`.trim(),
        a.country,
      ]
        .filter(Boolean)
        .join(" \n ");

      return {
        marker,
        title,
        content,
        action: {
          modals: buildDeleteModals(a),
          buttons: [
            {
              label: "Уреди",
              style: "link",
              role: "edit",
              onClick: () => onEditAddress(a),
            },
          ],
        },
      };
    }),
  };
}

/**
 * Stats -> BoxStatistic props
 * (keeps template mapping in one place)
 */
export function buildCustomerStatistic(args: {
  templateItems: any[];
  stats: any;
  timeFormat: (v: any) => string;
}) {
  const { templateItems, stats, timeFormat } = args;

  return {
    item: templateItems.map((box) => {
      let value = box.heading.subline?.text ?? "";

      switch (box.key) {
        case "totalOrder":
          value = stats?.totalOrders?.toString?.() ?? "0";
          break;

        case "totalPrice":
          value = `${stats?.totalMoney?.toFixed?.(2) ?? 0} ден.`;
          break;

        case "avgOrderPrice":
          value = `${stats?.avgOrderValue?.toFixed?.(2) ?? 0} ден.`;
          break;

        case "lastOrder":
          value = stats?.lastOrderDate ? timeFormat(stats.lastOrderDate) : "/";
          break;
      }

      return {
        ...box,
        heading: {
          ...box.heading,
          subline: {
            ...(box.heading.subline ?? { style: "lead", text: "" }),
            text: value,
          },
        },
      };
    }),
  };
}

/**
 * Breadcrumbs props (you pass handlers & modal node from component)
 */
export function buildBreadcrumbsProps(args: {
  base: any;
  onBack: (e: any) => void;
  data: any;
  onDropdownClick: (name: string, data?: any) => void;
  modalChildren: ReactNode;
  setModalClose: (closeFn: () => void) => void;
  allowDeleteCustomer: boolean;
}) {
  const {
    base,
    onBack,
    data,
    onDropdownClick,
    modalChildren,
    setModalClose,
    allowDeleteCustomer,
  } = args;

  const buttons = base?.dropdown?.items?.buttons?.map((btn: any) => ({
    ...btn,
    onClick: () => onDropdownClick(btn?.name ?? "", data),
  }));

  const modals = base?.dropdown?.items?.modals?.map((modalData: any) => ({
    ...modalData,
    children: modalChildren,
    onClose: (close: () => void) => setModalClose(close),
    openButton: allowDeleteCustomer ? modalData.openButton : {},
  }));

  return {
    ...base,
    returnLink: {
      ...(base.returnLink ?? {}),
      onClick: onBack,
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
