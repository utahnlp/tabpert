import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Container, Row } from "react-bootstrap";
import View from "./View";
import Header from "./Header";
import Footer from "./Footer";
import AddValue from "./AddValue";
import DeleteValue from "./DeleteValue";

const axios = require("axios");

const bgcolors_dict = {
  main: "#0C79FA",
  A: "#0C79FA",
  B: "#0C79FA",
  C: "#0C79FA",
};

class Main extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.submit = this.submit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleRowChange = this.handleRowChange.bind(this);
    this.handleStrategyChange = this.handleStrategyChange.bind(this);
    this.handleHypothesisChange = this.handleHypothesisChange.bind(this);
    this.addSection = this.addSection.bind(this);
    this.deleteSection = this.deleteSection.bind(this);
    this.editSectionName = this.editSectionName.bind(this);
    this.changeView = this.changeView.bind(this);
    this.state = {
      title: "",
      original: "",
      A: "",
      B: "",
      C: "",
      view: "drag",
      oh: "",
      ah: "",
      bh: "",
      ch: "",
      cats: "",
      id: "",
    };
  }

  componentDidMount() {
    this.getTables();
  }

  handleChange(e, id) {
    var table = id.split("_")[1];
    var key = id.split("_")[2];
    var index = id.split("_")[3];
    const newState = JSON.parse(JSON.stringify(this.state));
    const old_dict = newState[table][key][index];
    const [old_meta] = Object.values(old_dict);
    const new_meta = this.setCharAt(old_meta, 5, "1");
    const new_dict = {};
    new_dict[e.target.value] = new_meta;
    // console.log(new_dict);
    newState[table][key][index] = new_dict;
    this.setState(newState);
  }

  handleHypothesisChange(e, type) {
    // console.log(e);
    // console.log(e.target);
    const new_hyp = document.querySelector('[id="' + e.target.id + '"]').value;
    // console.log(new_hyp);
    // console.log(e.target.outerHTML);
    const old_hypo = e.target.outerHTML.match(/<.*>(.*)<.*>/)[1];
    // console.log(old_hypo);
    const state_name = type.toLowerCase() + "h";
    let newState = this.state;
    const meta = newState[state_name][old_hypo];
    newState[state_name][new_hyp] = meta;
    // console.log(newState[state_name][old_hypo]);
    delete newState[state_name][old_hypo];
    this.setState(newState);
    // console.log(newState);
  }

  addSection(type, key) {
    const newState = JSON.parse(JSON.stringify(this.state));
    newState[type][key] = [{ "add new text": "0000011" }];
    this.setState(newState);
    return Object.keys(newState[type]).length - 1;
  }

  deleteSection(type, key) {
    const newState = JSON.parse(JSON.stringify(this.state));
    delete newState[type][key];
    this.setState(newState);
  }

  editSectionName(type, old_key, new_key) {
    const newState = JSON.parse(JSON.stringify(this.state));
    const old_key_dict = newState[type][old_key];
    const old_keys = Object.keys(newState[type]);
    const replacedState = old_keys.reduce((acc, val) => {
      if (val === old_key) {
        acc[new_key] = old_key_dict;
      } else {
        acc[val] = newState[type][val];
      }
      return acc;
    }, {});
    newState[type] = replacedState;
    this.setState(newState);
  }

  getTables() {
    console.log(this.props);
    const table_id = this.props.match.params.id;
    fetch(`/api/table/?id=${table_id}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          title: data.title,
          original: data.original,
          A: data.A,
          B: data.B,
          C: data.C,
          oh: data.oh,
          ah: data.ah,
          bh: data.bh,
          ch: data.ch,
          id: table_id,
        });
        console.log(this.state);
      });
    fetch(`/api/cats`)
      .then((res) => res.json())
      .then((data) => {
        console.log(this.state);
        this.setState({
          cats: data,
        });
      });
  }

  submit() {
    console.log(this.state);
    var title = this.state.title;
    var A = this.state.A;
    var B = this.state.B;
    var C = this.state.C;
    A["title"] = title;
    B["title"] = title;
    C["title"] = title;
    var id = this.state.id;
    var ah = this.state.ah;
    var bh = this.state.bh;
    var ch = this.state.ch;
    axios
      .post(`/api/save`, {
        title: title,
        A: A,
        B: B,
        C: C,
        id: id,
        ah: ah,
        bh: bh,
        ch: ch,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        //console.log(error);
      });
  }

  // helper function to change character at index of a string to chr
  setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  move(source, destination, droppableSource, droppableDestination) {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    for (var key in removed) removed[key] = this.setCharAt(removed[key], 4, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;
    return result;
  }
  copy(source, destination, droppableSource, droppableDestination) {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    var newDict = {};
    newDict[removed] = "0000100";
    destClone.splice(droppableDestination.index, 0, newDict);
    return destClone;
  }

  remove(source, droppableSource) {
    const sourceClone = Array.from(source);
    sourceClone.splice(droppableSource.index, 1);
    return sourceClone;
  }
  add(destination, droppableDestination) {
    const text = document.getElementById("NEW").value;
    var new_dict = {};
    new_dict[text] = "0000011";
    const destClone = Array.from(destination);
    destClone.splice(droppableDestination.index, 0, new_dict);
    return destClone;
  }

  onDragEnd(result) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    // droppableIds are of the form <table_name>_<key> | trash | add
    const sInd = source.droppableId;
    const dInd = destination.droppableId;
    console.log("sInd " + sInd);
    console.log("dInd " + dInd);
    console.log(JSON.parse(JSON.stringify(this.state)));
    // dropped in original table or the add card space
    if (dInd === "add" || dInd.split("_")[0] === "original") {
      return;
    }
    // if put into trash, delete
    else if (dInd === "trash") {
      const newSource = this.remove(
        this.state[sInd.split("_")[0]][sInd.split("_")[1]],
        source
      );
      const newState = JSON.parse(JSON.stringify(this.state));
      newState[sInd.split("_")[0]][sInd.split("_")[1]] = newSource;
      this.setState(newState);
    }
    // if pulled from add space, add new card
    else if (sInd == "add") {
      const newDestination = this.add(
        this.state[dInd.split("_")[0]][dInd.split("_")[1]],
        destination
      );
      const newState = JSON.parse(JSON.stringify(this.state));
      newState[dInd.split("_")[0]][dInd.split("_")[1]] = newDestination;
      console.log(newState);
      this.setState(newState);
    }
    // if not the same key-category and not the same field name, drop is not allowed
    else if (
      sInd.split("_")[1] !== dInd.split("_")[1] &&
      this.state.cats[sInd.split("_")[1]] !==
        this.state.cats[dInd.split("_")[1]]
    ) {
      return;
    }
    // if pulled from original table, copy
    else if (sInd.split("_")[0] === "original") {
      const newDestination = this.copy(
        this.state[sInd.split("_")[0]][sInd.split("_")[1]],
        this.state[dInd.split("_")[0]][dInd.split("_")[1]],
        source,
        destination
      );
      const newState = JSON.parse(JSON.stringify(this.state));
      newState[dInd.split("_")[0]][dInd.split("_")[1]] = newDestination;
      this.setState(newState);
      console.log(newState);
    }
    // if dropped in the same place, we reorder the items
    else if (sInd === dInd) {
      const items = this.reorder(
        this.state[sInd.split("_")[0]][sInd.split("_")[1]],
        source.index,
        destination.index
      );
      const newState = JSON.parse(JSON.stringify(this.state));
      newState[sInd.split("_")[0]][sInd.split("_")[1]] = items;
      this.setState(newState);
    }
    // if dropped in a different place, move
    else {
      const result = this.move(
        this.state[sInd.split("_")[0]][sInd.split("_")[1]],
        this.state[dInd.split("_")[0]][dInd.split("_")[1]],
        source,
        destination
      );
      const newState = JSON.parse(JSON.stringify(this.state));
      newState[sInd.split("_")[0]][sInd.split("_")[1]] = result[sInd];
      newState[dInd.split("_")[0]][dInd.split("_")[1]] = result[dInd];

      this.setState(newState);
    }
  }

  handleLabelChange(e, type, idx) {
    const new_label = e.target.value;
    const state_name = type.toLowerCase() + "h";
    const hypothesis = document.getElementById(
      "hypothesis_" + type + idx
    ).value;
    const newState = JSON.parse(JSON.stringify(this.state));
    newState[state_name][hypothesis][0] = new_label;
    this.setState(newState);
  }
  handleRowChange(type, key, hypo) {
    var newState = this.state;
    var keys = newState[type.toLowerCase() + "h"][hypo][2];
    if (keys.includes(key)) {
      const idx = keys.indexOf(key);
      if (idx > -1) {
        keys.splice(idx, 1);
      }
    } else {
      keys.push(key);
    }
    newState[type.toLowerCase() + "h"][hypo][2] = keys;
    this.setState(newState);
    console.log(newState);
  }
  handleStrategyChange(type, hypo, strat_index) {
    const newState = this.state;
    var strategies = newState[type.toLowerCase() + "h"][hypo][1];
    const curr_strategy = strategies.charAt(strat_index);
    strategies = this.setCharAt(
      strategies,
      strat_index,
      curr_strategy === "1" ? "0" : "1"
    );
    console.log(strategies);
    newState[type.toLowerCase() + "h"][hypo][1] = strategies;
    this.setState(newState);
    console.log(newState);
  }

  changeView(new_view) {
    this.setState({ view: new_view });
  }
  render() {
    console.log("We have re-rendered:");
    return (
      <Container>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Header
            title={this.state.title}
            changeView={(view) => this.changeView(view)}
          />
          <Row>
            <AddValue />
            <DeleteValue />
          </Row>
          <Row>
            <View
              type={this.state.view}
              original={this.state.original}
              A={this.state.A}
              B={this.state.B}
              C={this.state.C}
              oh={this.state.oh}
              ah={this.state.ah}
              bh={this.state.bh}
              ch={this.state.ch}
              handleChange={this.handleChange}
              handleLabelChange={this.handleLabelChange}
              handleRowChange={this.handleRowChange}
              handleStrategyChange={this.handleStrategyChange}
              handleHypothesisChange={this.handleHypothesisChange}
              addSection={this.addSection}
              deleteSection={this.deleteSection}
              editSectionName={this.editSectionName}
            />
          </Row>
        </DragDropContext>
        <Footer submit={() => this.submit()} />
      </Container>
    );
  }
}

export default Main;
