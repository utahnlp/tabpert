import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { Row, Col } from "react-bootstrap";
import { getListStyle, getItemStyle } from "./Colours";

function AddValue(props) {
  return (
    <Col md={6}>
      <Droppable droppableId={"add"}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver, "add")}
            {...provided.droppableProps}
          >
            {[1].map((value) => {
              return (
                <Draggable draggableId={"new"}>
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
                        <input
                          style={{
                            marginLeft: "20px",
                            background: "transparent",
                            resize: "none",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            borderColor: "rgba(0, 0, 0, 0)",
                            width: "100%",
                          }}
                          name="draggable"
                          id={"NEW"}
                          defaultValue={
                            "Add a new value here! (write text, then drag and drop)"
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
    </Col>
  );
}

export default AddValue;
