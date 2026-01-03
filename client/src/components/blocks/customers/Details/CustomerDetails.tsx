import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import { useCustomer } from "../../../../features/customers/customers.queries";
import Table from "../../../../whitelabel/src/molecules/table/M-table";
import { customerDetailsData } from "./customerDetails.data";
import { timeFormat } from "../../../../utils/helpers/timeFormat";
import { useMemo, useState } from "react";
import Tabs, {
  type TabsProps,
} from "../../../../whitelabel/src/organisms/Tabs/Tabs";
import "./customersDetails.styles.scss";
import Breadcrumbs from "../../../../whitelabel/src/molecules/Breadcrumbs/M-Breadcrumbs";
import { m_breadcrumbsData } from "../../../../whitelabel/src/molecules/Breadcrumbs/m-breadcrumbs.data";
import BoxStatistic from "../../../../whitelabel/src/organisms/BoxStatistic/O-BoxStatistic";
import "./customersDetails.styles.scss";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";
import BoxSection from "../../../../whitelabel/src/organisms/BoxSection/O-BoxSection";
import { o_boxStatisticData } from "../../../../whitelabel/src/organisms/BoxStatistic/o-boxStatistic.data";
import type { BoxSectionTypes } from "../../../../whitelabel/src/organisms/BoxSection/o-boxSection.types";
import { phoneNumberFormat } from "../../../../utils/helpers/phoneNumberFormat";

const CustomerDetails: React.FC = () => {
  const [isMobile, _] = useState(window.innerWidth < 960);
  const { customerId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const onBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (window.history.length > 1) navigate(-1);
    else navigate("/customers");
  };

  const customerFromState = state?.customer;

  const { data, isLoading, error } = useCustomer(
    customerFromState?.id || customerId
  );

  const customerOrders = data?.orders ?? [];
  const customerAddresses = data?.customerAddresses ?? [];
  const customerNotes = data?.customerNote ?? [];

  const notesBoxSectionData = useMemo<BoxSectionTypes>(() => {
    return {
      noItemsMessage: "Корисникот нема забелешки",
      items: customerNotes.map((note) => {
        const createdBy = [note?.users?.firstName, note?.users?.lastName]
          .filter(Boolean)
          .join(" ")
          .trim();

        return {
          marker: [
            {
              text: timeFormat(note.createdAt),
              style: "primary",
            },
          ],

          title: note.noteText ?? "",
          content: [
            `Последно уредување: ${timeFormat(note.updatedAt)}`,
            `Креирано од: ${createdBy || "/"}`,
          ].join(" \n "),
          action: [
            {
              label: "Уреди",
              style: "link",
              role: "edit",
              onClick: () =>
                navigate(`/customers/${customerId}/notes/${note?.id}/edit`),
            },
            {
              label: "Избриши",
              style: "link",
              role: "delete",
              onClick: () => alert(`delete address ${note?.id}`),
            },
          ],
        };
      }),
    };
  }, [customerNotes]);

  const boxSectionData = useMemo<BoxSectionTypes>(() => {
    const addresses = (customerAddresses ?? []).filter((a) => a.isActive);

    return {
      noItemsMessage: "Корисникот нема додадено адреса",
      items: addresses.map((a) => {
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
          `${a.postalCode ?? ""} ${a.city ?? ""}`.trim(),
          a.country,
        ]
          .filter(Boolean)
          .join(" \n ");

        return {
          marker,
          title,
          content,
          action: [
            {
              label: "Уреди",
              style: "link",
              role: "edit",
              onClick: () =>
                navigate(`/customers/${customerId}/addresses/${a.id}/edit`, {
                  state: a,
                }),
            },
            {
              label: "Избриши",
              style: "link",
              role: "delete",
              onClick: () => alert(`delete address ${a.id}`),
            },
          ],
        };
      }),
    };
  }, [customerAddresses]);

  const rows = useMemo(() => {
    return customerOrders.map((c) => {
      const hasUnmeasuredPieces = c?.measuredPieces !== c?.totalPieces;

      return {
        ...c,
        createdAt: timeFormat(c?.createdAt),
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
  }, [customerOrders]);

  // header dropdown options buttons
  const handleDropdownClick = (name: string, stateData = {}) => {
    switch (name) {
      case "editCustomer":
        navigate(`/customers/${customerId}/edit`);
        return;

      case "newAddress":
        navigate(`/customers/${customerId}/addresses/new`, {
          state: stateData,
        });
        return;

      case "newNote":
        navigate(`/customers/${customerId}/notes/add`, {
          state: stateData,
        });
        return;

      case "deactivateCustomer":
        alert(`delete user ${data?.firstName ?? ""}`);
        return;

      default:
        console.warn("Unknown dropdown role:", name);
        return;
    }
  };
  const breadcrumbsProps = useMemo(() => {
    return {
      ...m_breadcrumbsData,
      returnLink: {
        ...m_breadcrumbsData.returnLink,
        onClick: onBack,
      },
      dropdown: {
        ...m_breadcrumbsData.dropdown,
        items: m_breadcrumbsData.dropdown.items.map((btn) => ({
          ...btn,
          onClick: () => handleDropdownClick(btn?.name ?? ""),
        })),
      },
    };
  }, [customerId, navigate, onBack, data?.firstName]);

  const customerStatistic = useMemo(() => {
    return {
      item: o_boxStatisticData.item.map((box) => {
        let value = box.heading.subline?.text ?? "";

        switch (box.key) {
          case "totalOrder":
            value = data?.stats?.totalOrders.toString() ?? "0";
            break;

          case "totalPrice":
            value = `${data?.stats?.totalMoney.toFixed(2) ?? 0} ден.`;
            break;

          case "avgOrderPrice":
            value = `${data?.stats.avgOrderValue.toFixed(2) ?? 0} ден.`;
            break;

          case "lastOrder":
            value = data?.stats?.lastOrderDate
              ? timeFormat(data?.stats?.lastOrderDate)
              : "/";

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
  }, [data, o_boxStatisticData.item]);

  const handleCall = async () => {
    const tel = `tel:${data?.phoneNumber.replace(/\s+/g, "")}`;
    window.location.href = tel;
  };

  const tabsData: TabsProps = {
    tabData: {
      tabID: "Orders",
      items: [
        {
          tabName: "Нарачки",
          active: true,
          component: <Table {...customerDetailsData.orderTable} rows={rows} />,
        },
        {
          tabName: "Адреси",
          component: <BoxSection {...boxSectionData} />,
        },
        {
          tabName: "Забелешки",
          component: <BoxSection {...notesBoxSectionData} />,
        },
      ],
    },
  };

  return (
    <div className="b-customerDetails">
      <Breadcrumbs {...breadcrumbsProps} />

      <div className="uk-card-default  uk-padding-small">
        <div className="uk-flex uk-flex-middle uk-flex-between">
          {/* Left side */}
          <div className="b-customerDetails__name">
            <div className="uk-text-large uk-text-bold uk-margin-remove ">
              {`${data?.firstName ?? ""} ${data?.lastName ?? ""}`}
            </div>
            <div className=" uk-margin-remove">
              {phoneNumberFormat(data?.phoneNumber ?? "")}
            </div>

            <div className="uk-margin-small-top">
              {data?.customerAddresses?.[0]?.street ?? "Без Адреса"} <br />
              {data?.customerAddresses?.[0]?.city ?? ""}
            </div>

            <div className="uk-margin-small-top  uk-text-muted">
              Клиент од: {timeFormat(data?.createdAt ?? "")}
            </div>
          </div>

          {/* Right side */}
          <div
            className="uk-flex uk-flex-middle  uk-grid-small uk-flex-right"
            uk-grid="true"
          >
            {isMobile && (
              <Button
                {...customerDetailsData?.customerHeader?.callButton}
                onClick={handleCall}
              />
            )}

            <Button
              {...customerDetailsData?.customerHeader?.newOrderBtn}
              label={isMobile ? "нарачка" : "Додади нарачка"}
              onClick={() => navigate(`/orders/new?customerId=${customerId}`)}
            />
          </div>
        </div>
      </div>

      <BoxStatistic {...customerStatistic} />
      <Tabs {...tabsData} />

      <Outlet />
    </div>
  );
};

export default CustomerDetails;
