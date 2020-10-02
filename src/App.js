import React from 'react';
import './App.css';
import Checkout from "./components/CheckoutPage/Checkout";
import Manager from "./components/ManagerPage/Manager";
import Login from "./components/LoginPage/Login";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {checkSession} from "./actions/item";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {currentUser: null, sessionChecked: false}
    }

    componentDidMount() {
        checkSession(this);
    }

    render() {
        if (!this.state || !this.state.sessionChecked) {
            return null;
        }
        const currentUser = this.state.currentUser;

        return (
            <BrowserRouter>
                <React.Fragment>
                    {!currentUser ? <Switch>
                            <Route exact path="/" render={({history}) => (
                                <Checkout history={history} app={this}/>
                            )}/>
                            <Route exact path="/login" render={({history}) => (
                                <Login history={history} app={this}/>
                            )}/>
                            <Route exact path="/manager" render={({history}) => {
                                alert("You are not logged in as manager! Redirecting back to main page");
                                history.push("/");
                                return <Checkout history={history} app={this}/>;
                            }}/>
                            <Route render={({history}) => {
                                alert("Invalid page! Redirecting back to main page.");
                                history.push('/');
                                return <Checkout history={history} app={this}/>;
                            }}/>
                        </Switch> :
                        <Switch>
                            <Route exact path={["/", "/login", "/manager"]} render={({history}) => (
                                <Manager history={history} app={this}/>
                            )}/>

                            <Route render={({history}) => {
                                alert("Invalid page! Redirecting back to main page.");
                                history.push('/');
                                return <Manager history={history} app={this}/>;
                            }}/>
                        </Switch>}
                </React.Fragment>
            </BrowserRouter>
        );
    }
}

export default App;
