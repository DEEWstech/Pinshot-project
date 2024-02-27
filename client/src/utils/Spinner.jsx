import  PropTypes from "prop-types";
import { HashLoader } from "react-spinners";

export default function Spinner({ text }) {
  return (
    <div className="d-flex flex-column gap-2 justify-content-center align-items-center min-vh-100">
      <HashLoader />
      <p className="fw-medium"></p>
      {text}
    </div>
  );
}
Spinner.propTypes = {
  text: PropTypes.string,
};
