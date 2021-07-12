import React from "react";
import { Row, Col } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import { IconButton, TextareaAutosize } from "@material-ui/core";
import HypothesisModal from "./HypothesisModal";
import { hypotheses_dark_colour, hypotheses_light_colour } from "./Colours";

function Hypothesis(props) {
  var stylecolor =
    idx % 2
      ? { backgroundColor: hypotheses_light_colour }
      : { backgroundColor: hypotheses_dark_colour };

  var type = props.type;
  var idx = props.idx;
  var hypo_info = props.hypo_info;
  var hypo = props.hypo;

  var showModal = <></>;
  // console.log(type, hypo_info, type, idx);
  if (type !== "original") {
    // console.log("~~~~~~~~~~~~~~~");
    // console.log(props.info[hypo]);
    // console.log(hypo);
    // console.log("show modal is ");
    // console.log(type == "original" ? false : this.state[type][idx]);
    showModal = (
      <>
        <IconButton
          size="small"
          style={{ marginRight: "-15px" }}
          onClick={() => {
            if (type == "original") return;
            var newState = props.getDefaultState();
            newState[type][idx] = 1;
            props.handleStateChange(newState);
            // console.log("^^^^^^^^^we changed the state!");
            // console.log(newState[type][idx]);
          }}
        >
          <AddIcon />
        </IconButton>
        <HypothesisModal
          show={props.showValue}
          onHide={() => props.handleStateChange(props.getDefaultState())}
          hypo={hypo}
          idx={idx}
          type={type}
          table={props.tableRows(
            props.rows,
            type,
            "non-draggable",
            false,
            true,
            hypo
          )}
          strategies={props.info[hypo][1]}
          rows={props.info[hypo][2]}
          handleStrategyChange={props.handleStrategyChange}
        />
      </>
    );
  }
  return (
    <Row className="align-items-center ml-2" style={stylecolor}>
      <div className="input-icon-wrap">
        <Col
          className="align-items-center"
          style={{ height: "100%", width: "30px", marginLeft: "7px" }}
        >
          <Row style={{ paddingTop: "20px" }}>
            {type == "original" && (
              <select
                defaultValue={hypo_info}
                className="disabled-dropdown-arrow text-align-center pl-2"
                id={"label_" + type + idx}
                style={{
                  border: "0px",
                  backgroundColor: "white",
                  width: "40px",
                }}
              >
                <option value={hypo_info} className="text-align-center pl-2">
                  {hypo_info}
                </option>
              </select>
            )}
            {type !== "original" && (
              <select
                style={{ border: "0px", backgroundColor: "white" }}
                defaultValue={props.info[hypo][0]}
                id={"label_" + type + idx}
                onChange={(e) => props.handleLabelChange(e, type, idx)}
              >
                <option value="E">E</option>
                <option value="N">N</option>
                <option value="C">C</option>
              </select>
            )}
          </Row>
          <Row style={{ paddingTop: "7px" }}>{showModal}</Row>
        </Col>
        <Col>
          <TextareaAutosize
            className="input-with-icon"
            id={"hypothesis_" + type + idx}
            type="textarea"
            defaultValue={hypo}
            style={{
              resize: "none",
              backgroundColor: "rgba(0, 0, 0, 0)",
              borderColor: "rgba(0, 0, 0, 0)",
            }}
            onChange={(e) => props.handleHypothesisChange(e, type, hypo)}
            contentEditable
          />
        </Col>
      </div>
    </Row>
  );
}

export default Hypothesis;
