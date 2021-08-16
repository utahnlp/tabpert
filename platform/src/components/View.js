import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import Hypothesis from "./Hypothesis";
import Table from "./Table";

class View extends Component {
  constructor(props) {
    super(props);
    this.tableRows = this.tableRows.bind(this);
    this.showView = this.showView.bind(this);
    this.hypothesesDisplay = this.hypothesesDisplay.bind(this);
    this.getDefaultState = this.getDefaultState.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.state = this.getDefaultState();
  }

  getDefaultState() {
    let a = new Array(9).fill(0);
    let b = new Array(9).fill(0);
    let c = new Array(9).fill(0);

    let a_rows = new Array(Object.keys(this.props.A).length).fill(0);
    let b_rows = new Array(Object.keys(this.props.B).length).fill(0);
    let c_rows = new Array(Object.keys(this.props.C).length).fill(0);

    let state_var = {
      A: a,
      B: b,
      C: c,
      A_keys: a_rows,
      B_keys: b_rows,
      C_keys: c_rows,
    };
    return state_var;
  }

  tableRows(
    pairs,
    type,
    name = "draggable",
    editable = true,
    checkboxes = false,
    hypotheses
  ) {
    return (
      <Table
        pairs={pairs}
        type={type}
        name={name}
        editable={editable}
        checkboxes={checkboxes}
        hypotheses={hypotheses}
        hypo_info={this.props[type.toLowerCase() + "h"]}
        deleteSection={this.props.deleteSection}
        editSectionName={this.props.editSectionName}
        handleChange={this.props.handleChange}
        addSection={this.props.addSection}
        getDefaultState={this.getDefaultState}
        handleRowChange={this.props.handleRowChange}
        handleStateChange={this.handleStateChange}
        showArray={this.state[type + "_keys"]}
      />
    );
  }

  handleStateChange(newState) {
    console.log(newState);
    this.setState(newState);
  }

  hypothesesDisplay(hypo, hypo_info, type, idx) {
    return (
      <Hypothesis
        hypo={hypo}
        hypo_info={hypo_info}
        type={type}
        idx={idx}
        showValue={type == "original" ? false : this.state[type][idx]}
        getDefaultState={() => this.getDefaultState()}
        handleHypothesisChange={(e, type, hypo) =>
          this.props.handleHypothesisChange(e, type, hypo)
        }
        handleLabelChange={(e, type, idx) =>
          this.props.handleLabelChange(e, type, idx)
        }
        handleStrategyChange={this.props.handleStrategyChange}
        info={this.props[type.toLowerCase() + "h"]}
        rows={this.props[type]}
        tableRows={this.tableRows}
        handleStateChange={this.handleStateChange}
      />
    );
  }

  showView(type) {
    const ohy = Object.keys(this.props.oh).map((hypo, idx) => {
      return this.hypothesesDisplay(hypo, this.props.oh[hypo], "original", idx);
    });
    var ah_items = Object.keys(this.props.ah).map((key) => [
      key,
      this.props.ah[key],
    ]);
    ah_items.sort((first, second) => second[1][3] - first[1][3]);
    // console.log(ah_items);
    const ahy = ah_items.map((hypo, idx) => {
      // console.log(hypo);
      return this.hypothesesDisplay(hypo[0], hypo[1], "A", idx);
    });
    var bh_items = Object.keys(this.props.bh).map((key) => [
      key,
      this.props.bh[key],
    ]);
    bh_items.sort((first, second) => second[1][3] - first[1][3]);
    const bhy = bh_items.map((hypo, idx) => {
      return this.hypothesesDisplay(hypo[0], hypo[1], "B", idx);
    });
    var ch_items = Object.keys(this.props.ch).map((key) => [
      key,
      this.props.ch[key],
    ]);
    ch_items.sort((first, second) => second[1][3] - first[1][3]);
    const chy = ch_items.map((hypo, idx) => {
      return this.hypothesesDisplay(hypo[0], hypo[1], "C", idx);
    });
    if (type === "drag") {
      return (
        <>
          <Row>
            <Col md={3} style={{ marginBottom: "15px" }}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Original Table</h5>
              </Row>
              {this.tableRows(
                this.props.original,
                "original",
                "non-draggable",
                false
              )}
            </Col>
            <Col md={3} style={{ marginBottom: "15px" }}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Table A</h5>
              </Row>
              {this.tableRows(this.props.A, "A")}
            </Col>
            <Col md={3} style={{ marginBottom: "15px" }}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Table B</h5>
              </Row>
              {this.tableRows(this.props.B, "B")}
            </Col>
            <Col md={3} style={{ marginBottom: "15px" }}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Table C</h5>
              </Row>
              {this.tableRows(this.props.C, "C")}
            </Col>
          </Row>
          <Row style={{ marginLeft: "10px" }}>
            <Col md={3} style={{ width: "100%", paddingRight: "10px" }}>
              <Row className="justify-content-center mt-3 white-text">
                <h6>Original Hypotheses</h6>
              </Row>
              {ohy}
            </Col>
            <Col md={3} style={{ width: "100%" }}>
              <Row className="justify-content-center mt-3 white-text">
                <h6>Table A Hypotheses</h6>
              </Row>
              {ahy}
            </Col>
            <Col md={3} style={{ width: "100%" }}>
              <Row className="justify-content-center mt-3 white-text">
                <h6>Table B Hypotheses</h6>
              </Row>
              {bhy}
            </Col>
            <Col md={3} style={{ width: "100%" }}>
              <Row className="justify-content-center mt-3 white-text">
                <h6>Table C Hypotheses</h6>
              </Row>
              {chy}
            </Col>
          </Row>
        </>
      );
    } else if (type === "focusA") {
      return (
        <>
          <Row className="mt-3">
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Original Table</h5>
              </Row>
              {this.tableRows(
                this.props.original,
                "original",
                "non-draggable",
                false
              )}
            </Col>
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Table A</h5>
              </Row>
              {this.tableRows(this.props.A, "A")}
            </Col>
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Original Hypotheses</h5>
              </Row>
              {ohy}
            </Col>
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Table A Hypotheses</h5>
              </Row>
              {ahy}
            </Col>
          </Row>
        </>
      );
    } else if (type === "focusB") {
      return (
        <>
          <Row className="mt-3">
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Original Table</h5>
              </Row>
              {this.tableRows(
                this.props.original,
                "original",
                "non-draggable",
                false
              )}
            </Col>
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Table B</h5>
              </Row>
              {this.tableRows(this.props.B, "B")}
            </Col>
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Original Hypotheses</h5>
              </Row>
              {ohy}
            </Col>
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Table B Hypotheses</h5>
              </Row>
              {bhy}
            </Col>
          </Row>
        </>
      );
    } else if (type === "focusC") {
      return (
        <>
          <Row className="mt-3">
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Original Table</h5>
              </Row>
              {this.tableRows(
                this.props.original,
                "original",
                "non-draggable",
                false
              )}
            </Col>
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Table C</h5>
              </Row>
              {this.tableRows(this.props.C, "C")}
            </Col>
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Original Hypotheses</h5>
              </Row>
              {ohy}
            </Col>
            <Col md={3}>
              <Row className="justify-content-center mt-3 white-text">
                <h5>Table C Hypotheses</h5>
              </Row>
              {chy}
            </Col>
          </Row>
        </>
      );
    }
  }

  render() {
    return <>{this.showView(this.props.type)}</>;
  }
}

View.defaultProps = {
  A: {},
  B: {},
  C: {},
  oh: {},
  ah: {},
  bh: {},
  ch: {},
};

export default View;
