import Masonry from "react-masonry-css";
import PropTypes from "prop-types";

const breakpointColumnsObj = {
  default: 4,
  2000: 5,
  1100: 4,
  700: 3,
  500: 2,
  300: 1,
};
export default function MansonryLayout({ children }) {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {children}
    </Masonry>
  );
}

MansonryLayout.propTypes = {
  children: PropTypes.node || PropTypes.any,
};
