import propTypes from "prop-types";
import {Container } from "react-bootstrap"


export default function PageLayout({ children, extra, ...props }) {
  return (
    <Container fluid className={`mt-5 py-5 px-3 ${extra}`} {...props}>
      {children}
      </Container>
 
  );
}
PageLayout.propTypes = {
  children: propTypes.node.isRequired,
  extra: propTypes.string,
  props: propTypes.object,
};
