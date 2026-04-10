import { phoneNumberFormat } from "../../../utils/helpers/phoneNumberFormat";
import Modal from "../../../whitelabel/src/organisms/Modal/Modal";
import "./customerSelectionPanel.styles.scss";
import type { CustomerSelectionPanelProps } from "./customerSelectionPanel.types";

const CustomerSelectionPanel = ({
  customer,
  selectedAddressId,
  onAddressChange,
  onRemoveCustomer,
  createCustomer,
}: CustomerSelectionPanelProps) => {
  if (!customer) return null;

  return (
    <div className="b-customerPanel">
      <div className="b-customerPanel__header uk-flex uk-flex-between uk-flex-middle">
        <div className="uk-flex uk-flex-middle b-customerPanel__profile">
          <div className="b-customerPanel__avatar">
            {customer.firstName?.[0] ?? "C"}
          </div>

          <div>
            <div className="b-customerPanel__name">
              {customer.firstName} {customer.lastName}
            </div>
            <div className="b-customerPanel__phone">
              {phoneNumberFormat(customer.phoneNumber ?? "")}
            </div>
          </div>
        </div>

        <button
          className="uk-icon-button"
          uk-icon="close"
          onClick={onRemoveCustomer}
          aria-label="Remove customer"
        />
      </div>

      {customer.customerNotes && customer.customerNotes.length > 0 && (
        <div className="b-customerPanel__notes">
          <div className="b-sectionLabel">Забелешки за Клиентот</div>

          <div className="b-notesContainer">
            {customer.customerNotes.map((note, i) => (
              <div key={i} className="b-noteCard">
                <span uk-icon="warning" className="uk-icon" />
                <p>{note.noteText}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {customer.customerAddresses && customer.customerAddresses.length > 0 && (
        <div className="b-customerPanel__addresses">
          <div className="b-sectionLabel">
            <div className="b-addressCard__new ">
              Избери Адреса
              {createCustomer && (
                <Modal
                  {...createCustomer}
                  openButton={{
                    label: "openButton",
                    icon: { name: "plus-circle" },
                    onlyIcon: true,
                    style: "link",
                    tooltip: "додади нова адреса",
                  }}
                >
                  {createCustomer?.children}
                </Modal>
              )}
            </div>
          </div>

          <div className="uk-grid-small uk-child-width-1-2@m" uk-grid="true">
            {customer.customerAddresses.map((address) => {
              const active = selectedAddressId === address.id;
              const isDefaultAddress = address.isDefault;
              const isVerifiedByProvider = address.isVerifiedByProvider;

              return (
                <div key={address.id}>
                  <div
                    className={`b-addressCard ${active ? "is-active" : ""}`}
                    onClick={() => onAddressChange(address.id)}
                  >
                    <div className="b-addressCard__header">
                      <div className="b-addressCard__header-left">
                        <span>{address.addressName || "Адреса"}</span>

                        {isDefaultAddress && (
                          <span className="b-addressCard__badge b-addressCard__badge--default">
                            Основна
                          </span>
                        )}

                        {isVerifiedByProvider && (
                          <span className="b-addressCard__badge b-addressCard__badge--verified">
                            Верифицирена
                          </span>
                        )}
                      </div>

                      {active && <span uk-icon="check" className="uk-icon" />}
                    </div>

                    <div className="b-addressCard__text">
                      {address.formattedAddress}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {customer.customerAddresses &&
        customer.customerAddresses.length === 0 && (
          <div className="b-addressCard__newAddress">
            Клиентот нама адреса
            {createCustomer && (
              <Modal {...createCustomer}>{createCustomer?.children}</Modal>
            )}
          </div>
        )}
    </div>
  );
};

export default CustomerSelectionPanel;
