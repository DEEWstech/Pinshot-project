import InfiniteScroll from "react-infinite-scroll-component";
import propTypes from "prop-types";
import { ClipLoader } from "react-spinners";

export default function ReactInfiniteScroll({
  dataLength,
  fetchData,
  hasMore,
  children,
}) {
  return (
    <InfiniteScroll
      dataLength={dataLength} //This is important field to render the next data
      next={fetchData}
      hasMore={hasMore}
      loader={
        <div className="d-flex flex-column justify-content-center align-items-center">
          <ClipLoader />
          <p>Fetching pins</p>
        </div>
      }
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {children}
    </InfiniteScroll>
  );
}

ReactInfiniteScroll.propTypes = {
  children: propTypes.node.isRequired,
  dataLength: propTypes.number,
  fetchData: propTypes.func,
  hasMore: propTypes.bool,
};
