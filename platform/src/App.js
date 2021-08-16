import React from "react";
import Main from "./components/Main";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Route path="/:id" component={Main}></Route>
    </BrowserRouter>
  );
}

export default App;
