// AddCustomer.tsx
import React from "react";
import { FormBuilderAccordion } from "../../../organisms/accordionForm/FormBuilderAccordion";
import type { CreateCustomerFullForm } from "./addCustomer.types";
import { b_addCustomerData, test } from "./addCustomer.data";
import M_Heading from "../../../../whitelabel/src/molecules/heading/m-heading";
import InactiveCustomerNotice from "../../../../whitelabel/src/molecules/InactiveCustomerNotice/InactiveCustomerNotice";
import { useAddCustomerPage } from "../../../../utils/hooks/useAddCustomerPage";

interface AddCustomerProps {
  noFormTag?: boolean;
  returnButton?: boolean;
}

const AddCustomer: React.FC<AddCustomerProps> = ({
  noFormTag,
  returnButton,
}) => {
  const {
    createMut,
    inactiveConflict,
    onSubmit,
    activeCustomerVisitDetails,
    deactivateCustomerPermanentDelete,
  } = useAddCustomerPage();

  return (
    <div className="uk-container uk-container-small uk-margin-large-top">
      <div className="uk-card uk-card-default uk-card-body uk-border-rounded uk-box-shadow-small">
        <M_Heading {...test} />

        <FormBuilderAccordion<CreateCustomerFullForm>
          groups={b_addCustomerData}
          gated={true}
          noFormTag={noFormTag}
          onSubmit={onSubmit}
          submitButton={{
            label: createMut.isPending ? "Се Креира..." : "Креирај",
            style: "tertiary",
            loading: createMut.isPending,
          }}
          cancelButton={{
            label: "",
            style: "tertiary",
            onClick: returnButton ? () => {} : () => window.history.back(),
          }}
          className="uk-margin-top"
        />

        {inactiveConflict ? (
          <InactiveCustomerNotice
            {...(inactiveConflict.isActive
              ? activeCustomerVisitDetails!
              : deactivateCustomerPermanentDelete)}
            isActive={inactiveConflict.isActive}
            data={inactiveConflict.customer}
          />
        ) : null}
      </div>
    </div>
  );
};

export default AddCustomer;
