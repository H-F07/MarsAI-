import { useTranslation } from "react-i18next";

export default function Agenda() {
  const { t } = useTranslation();

  return (
    <div style={{ padding: "20px" }}>
      <h1>{t("pages.agenda.title")}</h1>
      <p>{t("pages.agenda.description")}</p>
    </div>
  );
}
