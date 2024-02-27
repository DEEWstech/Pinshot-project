import { Outlet } from "react-router-dom";
// import PropTypes from "prop-types";
import { Header } from "@components";
import { useLocation } from "react-router-dom";

export default function Root() {
  const location = useLocation();
  //this function extracts a page from displaying
  const paths = ["/login", "/signup"];
  const matchPaths = paths.map((path) => path);
  return (
    <div>
      <main className="min-vh-100">
      {/* //this function extracts a page from displaying */}
        {!matchPaths.includes(location.pathname) && <Header />}
        <Outlet />
      </main>
    </div>
  );
}
