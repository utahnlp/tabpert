import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Container, Row, Form, Button } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { getListStyle, getItemStyle } from "./Colours";
import { IconButton, TextareaAutosize } from "@material-ui/core";
import KeyModal from "./KeyModal";

import { bgcolors_dict } from "./Colours";

function Table(props) {
  const pairs = props.pairs;
  const type = props.type;
  const name = props.name;
  const editable = props.editable;
  const checkboxes = props.checkboxes;
  const hypo = props.hypotheses;

  return (
    <>
      {" "}
      <Container>
        {Object.keys(pairs).map((key, key_idx) => {
          var checkbox = key;
          // console.log(this.props);
          // console.log(type, hypo);
          if (checkboxes === true) {
            checkbox = (
              <Form>
                <Form.Check
                  custom
                  type={"checkbox"}
                  defaultChecked={
                    props.hypo_info[hypo][2].includes(key) ? true : false
                  }
                  id={type + "_check_" + key}
                  label={key}
                  className="checkbox label"
                  onChange={() => {
                    props.handleRowChange(type, key, hypo);
                  }}
                />
              </Form>
            );
          }

          return (
            <Container style={{ marginBottom: "20px" }}>
              <Droppable droppableId={type + "_" + key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver, type)}
                    {...provided.droppableProps}
                  >
                    {!checkboxes && (
                      <div
                        style={{
                          display: "inline-block",
                          whiteSpace: "nowrap",
                          width: "100%",
                        }}
                      >
                        {" "}
                        <center>
                          <strong>{checkbox}</strong>{" "}
                          <IconButton
                            size="small"
                            style={{ marginLeft: "auto" }}
                            onClick={() => {
                              var newState = props.getDefaultState();
                              newState[type + "_keys"][key_idx] = 1;
                              props.handleStateChange(newState);
                            }}
                          >
                            {type !== "original" && (
                              <EditIcon
                                className="float-right"
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  opacity: "0.5",
                                }}
                              />
                            )}
                          </IconButton>
                          {type !== "original" && (
                            <KeyModal
                              show={props.showArray[key_idx]}
                              onHide={() =>
                                props.handleStateChange(props.getDefaultState())
                              }
                              onDelete={(type, key) => {
                                props.deleteSection(type, key);
                              }}
                              onEdit={(new_key) => {
                                props.editSectionName(type, key, new_key);
                              }}
                              section_name={key}
                              type={type}
                            />
                          )}
                        </center>
                      </div>
                    )}
                    {checkboxes && (
                      <div
                        style={{
                          backgroundColor: bgcolors_dict[type],
                          marginLeft: "20px",
                        }}
                      >
                        <strong>{checkbox}</strong>
                      </div>
                    )}
                    {pairs[key].map((value, id) => {
                      // console.log("value is ^^^^^");
                      // console.log(value);
                      return (
                        <Draggable
                          draggableId={type + "_" + key + "_" + id}
                          index={id}
                          className="draggable"
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <Row>
                                <TextareaAutosize
                                  style={{
                                    marginLeft: "20px",
                                    background: "transparent",
                                    resize: "none",
                                    backgroundColor: "rgba(0, 0, 0, 0)",
                                    borderColor: "rgba(0, 0, 0, 0)",
                                  }}
                                  name={name}
                                  id={"item_" + type + "_" + key + "_" + id}
                                  value={
                                    type === "original"
                                      ? value
                                      : Object.keys(value)[0]
                                  }
                                  onChange={(e) =>
                                    props.handleChange(
                                      e,
                                      "item_" + type + "_" + key + "_" + id
                                    )
                                  }
                                />
                              </Row>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  </div>
                )}
              </Droppable>
            </Container>
          );
        })}
      </Container>
      {type !== "original" && !checkboxes && (
        <Container>
          {" "}
          <Row>
            <div className="float-right" style={{ width: "100%" }}>
              <Button
                onClick={() => {
                  var lastIdx = props.addSection(type, "New Section Name");
                  var newState = props.getDefaultState();
                  newState[type + "_keys"][lastIdx] = 1;
                  props.handleStateChange(newState);
                }}
                className="text-white ml-auto float-right"
                style={{
                  alignContent: "right",
                  fontSize: "15px",
                  marginRight: "-16px",
                  marginTop: "-15px",
                }}
              >
                Add section
                <AddIcon />
              </Button>
            </div>
          </Row>
        </Container>
      )}
    </>
  );
}

export default Table;
