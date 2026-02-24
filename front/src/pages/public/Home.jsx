import { useTranslation } from "react-i18next";
import "./Home.css";

function Home() {
  const { t } = useTranslation();

  return (
    <>
      <h1 className="text-2xl">{t("pages.home.title")}</h1>
      <p>{t("pages.home.subtitle")}</p>
    </>
  );
}

export default Home;
