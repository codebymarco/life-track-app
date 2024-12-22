import { Routes } from "react-router-dom";
import MainNavbar from "../components/MainNavbar";

interface LayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <MainNavbar />
      <main>
        <Routes>{children}</Routes>
      </main>{" "}
    </div>
  );
};

export default MainLayout;
