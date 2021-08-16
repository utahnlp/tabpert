import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { Col } from "react-bootstrap";
import { getListStyle } from "./Colours";

function DeleteValue(props) {
  return (
    <Col md={6}>
      <Droppable droppableId={"trash"} style={{ height: "40px" }}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver, "trash")}
            {...provided.droppableProps}
          >
            <div
              style={{
                marginTop: "15px",
                marginBottom: "15px",
                marginLeft: "20px",
              }}
            >
              Drag and drop a value here to delete it
            </div>
            {() => {
              return <></>;
            }}
          </div>
        )}
      </Droppable>
    </Col>
  );
}

export default DeleteValue;
