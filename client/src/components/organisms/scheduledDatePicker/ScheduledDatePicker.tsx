import { useState } from "react";
import "./scheduledDatePicker.styles.scss";

const MK_DAYS = [
  "Недела",
  "Понеделник",
  "Вторник",
  "Среда",
  "Четврток",
  "Петок",
  "Сабота",
];
const MK_MONTHS = [
  "Јануари",
  "Февруари",
  "Март",
  "Април",
  "Мај",
  "Јуни",
  "Јули",
  "Август",
  "Септември",
  "Октомври",
  "Ноември",
  "Декември",
];

const SHORTCUTS = [
  { label: "Денес", days: 0 },
  { label: "Утре", days: 1 },
  { label: "+2 дена", days: 2 },
  { label: "+3 дена", days: 3 },
  { label: "+1 недела", days: 7 },
];

const formatDate = (date: Date): string =>
  `${MK_DAYS[date.getDay()]}, ${date.getDate()} ${MK_MONTHS[date.getMonth()]} ${date.getFullYear()}`;

const addDays = (days: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

const toISODate = (date: Date): string => date.toISOString().split("T")[0];

type Props = {
  value: string;
  onChange: (isoDate: string) => void;
};

const ScheduledDatePicker: React.FC<Props> = ({ value, onChange }) => {
  const [activeShortcut, setActiveShortcut] = useState<number | null>(0);
  const [showCustom, setShowCustom] = useState(false);

  const handleShortcut = (days: number, index: number) => {
    setShowCustom(false);
    setActiveShortcut(index);
    onChange(toISODate(addDays(days)));
  };

  const handleCustomToggle = () => {
    const next = !showCustom;
    setShowCustom(next);
    if (next) {
      setActiveShortcut(null);
      onChange("");
    }
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  return (
    <div className="b-datePicker">
      <div className="b-datePicker__label">Закажи датум</div>

      <div className="b-datePicker__shortcuts">
        {SHORTCUTS.map((s, i) => (
          <button
            key={s.days}
            type="button"
            className={`b-datePicker__btn ${activeShortcut === i ? "is-active" : ""}`}
            onClick={() => handleShortcut(s.days, i)}
          >
            {s.label}
          </button>
        ))}
        <button
          type="button"
          className={`b-datePicker__btn ${showCustom ? "is-active" : ""}`}
          onClick={handleCustomToggle}
        >
          Друг датум
        </button>
      </div>

      {showCustom && (
        <input
          className="b-datePicker__input"
          type="date"
          value={value}
          min={toISODate(addDays(1))}
          onChange={handleCustomChange}
          placeholder="избери датум"
        />
      )}

      {selectedDate && (
        <div className="b-datePicker__result">
          <span uk-icon="clock" className="uk-icon" />
          <p> Закажано за: {formatDate(selectedDate)}</p>
        </div>
      )}
    </div>
  );
};

export default ScheduledDatePicker;
