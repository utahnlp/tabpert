import React, { Component } from "react";
import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
import { IconButton, TextareaAutosize } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import "../App.css";

class KeyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strategies: this.props.strategies,
    };
  }
  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={() => this.props.onHide(this.state)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        style={{
          webkitBorderRadius: "10px",
          mozBorderRadius: "10px",
          borderRadius: "10px",
          // width: "40%",
          align: "center",
        }}
        centered
        dialogClassName="custom-modal-style"
      >
        <Modal.Header style={{ backgroundColor: "lightblue" }} closeButton>
          <Modal.Title> Edit Key</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <div style={{ width: "100%" }}>
              <center>
                <TextareaAutosize
                  style={{
                    marginLeft: "20px",
                    marginRight: "20px",
                    background: "transparent",
                    resize: "none",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                  }}
                  id={this.props.type + "_" + this.props.section_name}
                  defaultValue={this.props.section_name}
                  //   onChange={(e) =>
                  //     this.props.handleChange(e, "item_" + type + "_" + key)
                  //   }
                />
                <Button
                  onClick={() => {
                    this.props.onEdit(
                      document.getElementById(
                        this.props.type + "_" + this.props.section_name
                      ).value
                    );
                    this.props.onHide();
                  }}
                >
                  Submit
                </Button>
              </center>
            </div>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              this.props.onDelete(this.props.type, this.props.section_name);
              this.props.onHide();
            }}
            className="mr-auto"
          >
            <DeleteIcon style={{ marginRight: "7px" }} />
            Delete
          </Button>

          <Button
            onClick={() => {
              this.props.onHide();
            }}
          >
            <CloseIcon style={{ marginRight: "7px" }} />
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
export default KeyModal;
