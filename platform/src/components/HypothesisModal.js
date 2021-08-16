import React, { Component } from "react";
import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
class HypothesisModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strategies: this.props.strategies,
    };
  }
  render() {
    const modal_options = [
      "Change table to flip the label",
      "Change hypothesis to flip the label",
      "Add ‘true’ information from the table to confuse the model, or use text from other places in the table",
      "Use the original hypothesis as a prompt to write a new hypothesis",
      "Write a completely new hypothesis",
      "Other",
    ];
    return (
      <Modal
        show={this.props.show}
        onHide={() => this.props.onHide(this.state)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{
          modal: {
            webkitBorderRadius: "10px",
            mozBorderRadius: "10px",
            borderRadius: "10px",
          },
          overlay: { background: "#242526" },
        }}
      >
        <Modal.Header style={{ backgroundColor: "lightblue" }} closeButton>
          <Modal.Title>
            {this.props.hypo + "\n\n"}

            <p style={{ marginBottom: "-10px" }}>
              <i
                style={{
                  fontSize: "15px",
                  alignContent: "right",
                }}
              >
                {"(Table " + this.props.type + " Hypothesis)"}
              </i>
            </p>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col md={6}>
              <Row className="justify-content-center" style={{ width: "100%" }}>
                <center>
                  <h5 style={{ fontWeight: "bold" }}>Select Relevant Rows:</h5>
                </center>
              </Row>
              <Row>{this.props.table}</Row>
            </Col>
            <Col md={6}>
              <div className="float-right" style={{ width: "auto" }}>
                <Row
                  className="justify-content-center"
                  style={{ width: "100%" }}
                >
                  <center>
                    <h5 style={{ fontWeight: "bold" }}>Select Strategies:</h5>
                  </center>
                </Row>
                <Form>
                  {modal_options.map((text, idx) => (
                    <Form.Check
                      type="checkbox"
                      label={text}
                      style={{ fontSize: "17px", marginBottom: "10px" }}
                      defaultChecked={
                        this.props.strategies.charAt(idx) === "1" ? true : false
                      }
                      onChange={(e) => {
                        this.props.handleStrategyChange(
                          this.props.type,
                          this.props.hypo,
                          idx
                        );
                      }}
                    />
                  ))}
                </Form>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.props.onHide(this.state)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default HypothesisModal;
