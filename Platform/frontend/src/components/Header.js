import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { header_tabs } from "./Colours";

function Header(props) {
  return (
    <Row>
      <Col className="md-4">
        <div className="float-left">
          <Button
            className="mr-1"
            style={{ backgroundColor: header_tabs["main"] }}
            onClick={() => {
              props.changeView("drag");
            }}
          >
            Main View
          </Button>
          <Button
            style={{ backgroundColor: header_tabs["A"] }}
            className="mr-1"
            onClick={() => {
              props.changeView("focusA");
            }}
          >
            Table A
          </Button>
          <Button
            style={{ backgroundColor: header_tabs["B"] }}
            className="mr-1"
            onClick={() => {
              props.changeView("focusB");
            }}
          >
            Table B
          </Button>
          <Button
            style={{ backgroundColor: header_tabs["C"] }}
            className="mr-1"
            onClick={() => {
              props.changeView("focusC");
            }}
          >
            Table C
          </Button>
        </div>
      </Col>
      <Col>
        <div className="justify-content-center white-text">
          <h2>{props.title}</h2>
        </div>
      </Col>
    </Row>
  );
}

export default Header;
