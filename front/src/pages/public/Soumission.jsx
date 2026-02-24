import { useTranslation } from "react-i18next";

const Soumission = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("pages.soumission.title")}</h1>
      <p>{t("pages.soumission.description")}</p>
    </div>
  );
};

export default Soumission;
