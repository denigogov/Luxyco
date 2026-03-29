import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import SidebarSummary from "../../../../whitelabel/src/organisms/SidebarSummary/SidebarSummary";
import { useCustomersOrderList } from "../../../../features/customers/customers.queries";
import {
  type Customer,
  type CustomersListParams,
} from "../../../../features/customers/customers.types";
import { useDebouncer } from "../../../../utils/helpers/debouncer";
import AddCustomer from "../../customers/AddCustomer/AddCustomer";
import Autocomplate from "../../../../whitelabel/src/atoms/аutocomplete/Autocomplete";
import { createOrderData } from "./CreateOrder.data";
import SelectCard from "../../../../whitelabel/src/molecules/selectCard/SelectCard";
import { phoneNumberFormat } from "../../../../utils/helpers/phoneNumberFormat";

const customerContentMapper = (
  customer: Pick<
    Customer,
    "firstName" | "lastName" | "phoneNumber" | "customerAddresses"
  >,
) => ({
  title: `${customer.firstName} ${customer.lastName}`,
  subtitle: customer.phoneNumber,
  footer:
    customer.customerAddresses.find((a) => a.isDefault)?.formattedAddress ??
    customer.customerAddresses[0]?.formattedAddress,
});

const CreateOrder = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  const isManuallyCleared = useRef(false);

  const customerId = searchParams.get("customerId");
  const customerIdNum = Number(customerId);
  const validPreselectedCustomer =
    Number.isFinite(customerIdNum) && customerIdNum > 0;

  const debouncedSearch = useDebouncer<string>(searchInput);
  const shouldSearch =
    !isManuallyCleared.current &&
    ((validPreselectedCustomer && !selectedCustomer) ||
      (debouncedSearch.trim().length >= 2 && !selectedCustomer));

  const querySearch: CustomersListParams = {
    id: validPreselectedCustomer ? String(customerId) : undefined,
    search: debouncedSearch.trim(),
    limit: 8,
  };

  const { data, isLoading, isFetching } = useCustomersOrderList(
    shouldSearch ? querySearch : {},
  );

  const results = data?.data ?? [];
  const isSearching = isLoading || isFetching;
  const showNotFound = !isSearching && shouldSearch && results.length === 0;

  const handleSearchChange = (value: string) => {
    setSearchInput(value);

    if (!value) {
      isManuallyCleared.current = true;
      setSelectedCustomer(null);
      setSelectedAddressId(null);
      setShowDropdown(false);
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("customerId");
      setSearchParams(newParams);
      return;
    }

    isManuallyCleared.current = false;
    setShowDropdown(value.trim().length >= 2);
  };

  useEffect(() => {
    if (
      !isManuallyCleared.current &&
      validPreselectedCustomer &&
      !selectedCustomer &&
      data?.data?.length &&
      data.data[0].id === customerIdNum
    ) {
      const customer = data.data[0];

      setSelectedCustomer(customer);
      setSearchInput(`${customer.firstName} ${customer.lastName}`);

      const defaultAddr = customer.customerAddresses.find((a) => a.isDefault);
      setSelectedAddressId(
        defaultAddr?.id ?? customer.customerAddresses[0]?.id ?? null,
      );
    }
  }, [data, validPreselectedCustomer, selectedCustomer, customerIdNum]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setSearchInput(`${customer.firstName} ${customer.lastName}`);
    setShowDropdown(false);

    setSearchParams({ customerId: String(customer.id) });

    const defaultAddr = customer.customerAddresses.find((a) => a.isDefault);
    setSelectedAddressId(
      defaultAddr?.id ?? customer.customerAddresses[0]?.id ?? null,
    );
  };

  console.log(selectedCustomer);

  return (
    <div>
      {!selectedCustomer && (
        <Autocomplate
          searchInput={searchInput}
          onSearchChange={handleSearchChange}
          results={results}
          isSearching={isSearching}
          showDropdown={showDropdown}
          onShowDropdown={setShowDropdown}
          onSelectItem={handleSelectCustomer}
          showNotFound={showNotFound}
          notFoundMessage="Корисникот не е пронајден"
          contentMapper={customerContentMapper}
          notFoundActionModal={{
            ...createOrderData.createCustomerModal,
            children: <AddCustomer />,
          }}
        />
      )}

      {selectedCustomer && (
        <div className="uk-card-default uk-padding-small">
          <span onClick={() => handleSearchChange("")} uk-icon="close"></span>

          <div className="b-customerDetails__name">
            <div className="uk-text-large uk-text-bold uk-margin-remove">
              {`${selectedCustomer?.firstName ?? ""} ${selectedCustomer?.lastName ?? ""}`}
            </div>

            <div className="uk-margin-remove">
              {phoneNumberFormat(selectedCustomer?.phoneNumber ?? "")}
            </div>
          </div>
        </div>
      )}

      <div className="uk-margin-small-top uk-text-muted">
        {selectedCustomer?.customerNotes?.map((note, i: number) => (
          <p key={i}>{note.noteText}</p>
        ))}
        {!selectedCustomer?.customerNotes.lenght && (
          <p>Не се пронајдени забелешки</p>
        )}
      </div>
      <SelectCard
        addresses={selectedCustomer?.customerAddresses ?? []}
        selectedId={selectedAddressId}
        onChange={(id) => setSelectedAddressId(id)}
      />
      <SidebarSummary
        customerName={
          selectedCustomer
            ? `${selectedCustomer.firstName} ${selectedCustomer.lastName}`
            : undefined
        }
        deliveryAddress={
          selectedCustomer?.customerAddresses.find(
            (a) => a.id === selectedAddressId,
          )?.formattedAddress ??
          selectedCustomer?.customerAddresses[0]?.formattedAddress
        }
        customerPhone={selectedCustomer?.phoneNumber}
      />
    </div>
  );
};

export default CreateOrder;
