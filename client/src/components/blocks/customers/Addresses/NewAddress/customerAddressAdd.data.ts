import type { BreadcrumbsTypes } from "../../../../../whitelabel/src/molecules/Breadcrumbs/m-breadcrumbs.types";

export const customerAddressAdd = {
  breadcrumbs: {
    returnLink: {
      label: "Додади нова Адреса",
      style: "link",
      icon: { name: "chevron-left" },
      href: "../",
    },
  } satisfies BreadcrumbsTypes,

  filedsData: [
    {
      name: "street",
      type: "text",
      label: "Street",
      placeholder: "Partizanska 1",
      rules: { required: "Street is required" },
    },
    {
      name: "city",
      type: "text",
      label: "City",
      placeholder: "Skopje",
      rules: { required: "City is required" },
    },
    {
      name: "village",
      type: "text",
      label: "Village (optional)",
      placeholder: "—",
      rules: {},
    },
    {
      name: "postalCode",
      type: "text",
      label: "Postal code",
      placeholder: "1000",
      rules: { required: "Postal code is required" },
    },
    {
      name: "country",
      type: "text",
      label: "Country",
      placeholder: "MK",
      rules: { required: "Country is required" },
    },
    {
      name: "formattedAddress",
      type: "text",
      label: "Formatted address",
      placeholder: "Partizanska 1, 1000 Skopje, MK",
      rules: { required: "Formatted address is required" },
    },
    {
      name: "latitude",
      type: "string",
      label: "Latitude",
      placeholder: "41.9981",
      rules: { required: "Latitude is required" },
    },
    {
      name: "longitude",
      type: "string",
      label: "Longitude",
      placeholder: "21.4254",
      rules: { required: "Longitude is required" },
    },
  ],
};
