import { useUIState } from "../../../../whitelabel/src/global/utils/hooks/useUIState";
import "./_settingsRoot.styles.scss";

const SettingsRoot: React.FC = () => {
  const { isMobileQuickMenuVisible, setMobileQuickMenuVisible } = useUIState();

  return (
    <div className="settings-root">
      <section className="settings-root__section">
        <header className="settings-root__header">
          <h2 className="settings-root__title">Изглед</h2>
        </header>

        <div className="settings-root__content">
          <label
            className="settings-root__preference"
            htmlFor="mobileQuickMenuVisible"
          >
            <span className="settings-root__preferenceText">
              <strong>Мобилно брзо мени</strong>

              <small>Прикажи брза навигација на дното на мобилен уред.</small>
            </span>

            <input
              id="mobileQuickMenuVisible"
              type="checkbox"
              role="switch"
              checked={isMobileQuickMenuVisible}
              onChange={(event) =>
                setMobileQuickMenuVisible(event.target.checked)
              }
            />
          </label>
        </div>
      </section>
    </div>
  );
};

export default SettingsRoot;
