import React, {Component} from "react";
import "./Login.css"
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import {withRouter} from "react-router-dom";
import {login} from "../../actions/item";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            pass: ""
        };
    }

    onChangeEmail = (e) => {
        e.preventDefault();
        this.setState({username: e.target.value});
    };
    onChangePass = (e) => {
        e.preventDefault();
        this.setState({pass: e.target.value});
    };
    onSubmit = (e) => {
        e.preventDefault();
        const data = {username: this.state.username, password: this.state.pass};
        login(this, data);
    };

    render() {
        return (
            <Container component="main" maxWidth="xs" className="container">
                <div className="paper">
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className="form1" noValidate onSubmit={this.onSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Username"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={this.onChangeEmail}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={this.onChangePass}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className="submit"
                        >
                            Sign In
                        </Button>
                    </form>
                </div>
            </Container>
        );
    }
}

export default withRouter(Login);