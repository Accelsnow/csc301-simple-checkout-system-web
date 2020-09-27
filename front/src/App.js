import React from 'react';
import './App.css';
import Checkout from "./components/CheckoutPage/Checkout";
import Login from "./components/LoginPage/Login";
import Admin from "./components/AdminPage/Admin";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

function App() {
  return (
      <Router>
          <Switch>
              <Route exact path="/">
                  <Checkout />
              </Route>
              <Route exact path="/login">
                  <Login />
              </Route>
              <Route exact path="/admin">
                  <Admin />
              </Route>
          </Switch>
      </Router>
  );
}

export default App;
