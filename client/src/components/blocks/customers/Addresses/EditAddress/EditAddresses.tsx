import React, { useEffect, useMemo, useState } from "react";
import "./test.scss";
import { useLocation } from "react-router";

interface EditAddressesProps {}

type AddressFromState = {
  id?: number;
  street?: string | null;
  city?: string | null;
  village?: string | null;
  postalCode?: string | null;
  country?: string | null;
  formattedAddress?: string | null;
  isDefault?: boolean;
  isActive?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  isVerifiedByProvider?: boolean;
};

type AddressFormState = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  apartment: string;
  note: string;
};

const steps = [
  { id: 1, label: "Основни податоци" },
  { id: 2, label: "Локација" },
  { id: 3, label: "Детали" },
] as const;

const EditAddresses: React.FC<EditAddressesProps> = () => {
  const location = useLocation();
  const customerFromState = location.state as AddressFromState | undefined;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const initialForm = useMemo<AddressFormState>(() => {
    return {
      street: customerFromState?.street ?? "",
      city: customerFromState?.city ?? "",
      postalCode: customerFromState?.postalCode ?? "",
      country: customerFromState?.country ?? "",
      apartment: "", // not provided by your state object
      note: "", // not provided by your state object
    };
  }, [customerFromState]);

  const [form, setForm] = useState<AddressFormState>(initialForm);

  // If state changes (e.g., user edits another address), re-fill the form once.
  useEffect(() => {
    setForm(initialForm);
  }, [initialForm]);

  const handleChange =
    (field: keyof AddressFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const nextStep = () => setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
  const prevStep = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted address:", form);
    alert("Dummy submit – check console.log for data");
  };

  return (
    <div>
      <h3 className="uk-margin-small-bottom">Уреди адреса</h3>

      {/* If user opened page directly (no location.state), show a small warning */}
      {!customerFromState && (
        <div className="uk-alert-warning uk-margin-small-bottom" data-uk-alert>
          <p>Нема податоци за адресата (state). Отворено е директно од URL.</p>
        </div>
      )}

      {/* Stepper */}
      <div className="modal-steps uk-margin-small-bottom">
        {steps.map((s, index) => {
          const isActive = s.id === step;
          const isCompleted = s.id < step;

          return (
            <div key={s.id} className="modal-steps__item">
              {/* line to previous */}
              {index > 0 && (
                <div
                  className={[
                    "modal-steps__line",
                    isCompleted ? "modal-steps__line--completed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              )}

              <div
                className={[
                  "modal-steps__circle",
                  isActive ? "modal-steps__circle--active" : "",
                  isCompleted ? "modal-steps__circle--completed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isCompleted ? "✓" : s.id}
              </div>

              <div
                className={[
                  "modal-steps__label uk-text-meta",
                  isActive ? "modal-steps__label--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>

      <form className="uk-form-stacked" onSubmit={handleSubmit}>
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div className="uk-margin-small">
              <label className="uk-form-label" htmlFor="street">
                Улица и број
              </label>
              <div className="uk-form-controls">
                <input
                  id="street"
                  className="uk-input"
                  type="text"
                  value={form.street}
                  onChange={handleChange("street")}
                />
              </div>
            </div>

            <div className="uk-margin-small">
              <label className="uk-form-label" htmlFor="city">
                Град
              </label>
              <div className="uk-form-controls">
                <input
                  id="city"
                  className="uk-input"
                  type="text"
                  value={form.city}
                  onChange={handleChange("city")}
                />
              </div>
            </div>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div className="uk-margin-small">
              <label className="uk-form-label" htmlFor="postalCode">
                Поштенски број
              </label>
              <div className="uk-form-controls">
                <input
                  id="postalCode"
                  className="uk-input"
                  type="text"
                  value={form.postalCode}
                  onChange={handleChange("postalCode")}
                />
              </div>
            </div>

            <div className="uk-margin-small">
              <label className="uk-form-label" htmlFor="country">
                Држава
              </label>
              <div className="uk-form-controls">
                <input
                  id="country"
                  className="uk-input"
                  type="text"
                  value={form.country}
                  onChange={handleChange("country")}
                />
              </div>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <div className="uk-margin-small">
              <label className="uk-form-label" htmlFor="apartment">
                Влез / стан
              </label>
              <div className="uk-form-controls">
                <input
                  id="apartment"
                  className="uk-input"
                  type="text"
                  value={form.apartment}
                  onChange={handleChange("apartment")}
                />
              </div>
            </div>

            <div className="uk-margin-small">
              <label className="uk-form-label" htmlFor="note">
                Забелешка за достава
              </label>
              <div className="uk-form-controls">
                <textarea
                  id="note"
                  className="uk-textarea"
                  rows={3}
                  value={form.note}
                  onChange={handleChange("note")}
                />
              </div>
            </div>
          </>
        )}

        {/* Navigation buttons */}
        <div className="uk-margin-top uk-flex uk-flex-between uk-flex-middle">
          <div>
            {step > 1 && (
              <button
                type="button"
                className="uk-button uk-button-default"
                onClick={prevStep}
              >
                Назад
              </button>
            )}
          </div>

          <div className="uk-flex uk-flex-middle uk-flex-right uk-grid-small">
            {step < 3 && (
              <button
                type="button"
                className="uk-button uk-button-primary"
                onClick={nextStep}
              >
                Понатаму
              </button>
            )}

            {step === 3 && (
              <button type="submit" className="uk-button uk-button-primary">
                Зачувај промени
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditAddresses;
