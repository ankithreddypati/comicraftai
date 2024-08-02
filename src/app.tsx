import { Outlet } from "react-router-dom";
import { Rows } from "@canva/app-ui-kit";
import { Footer } from "./components";
import { Presets } from "./components/presets";
import styles from "styles/components.css";



export const App = () => (
  <div className={styles.scrollContainer}>
    <Rows spacing="3u">
      <Presets/>
      <Outlet />
      <Footer />
    </Rows>
  </div>
);
