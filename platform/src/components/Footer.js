import React from "react";
import { Row, Button } from "react-bootstrap";

function Footer(props) {
  return (
    <Row
      className="justify-content-right mt-3"
      style={{ justifyContent: "flex-end" }}
    >
      {" "}
      <Button size="lg" className="align-right" onClick={() => props.submit()}>
        Submit
      </Button>
    </Row>
  );
}
export default Footer;
