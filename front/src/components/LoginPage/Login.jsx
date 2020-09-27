import React, { Component } from "react";
import "./Login.css"
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withRouter } from "react-router-dom";

class Login extends Component {
	state = {
		email: "",
		pass: ""
	};
	onChangeEmail = (e) => {
		e.preventDefault();
		this.setState({email: e.target.value});
	};
	onChangePass = (e) => {
		e.preventDefault();
		this.setState({pass: e.target.value});
	};
	onSubmit = (e) => {
		e.preventDefault();
		if (this.state.email !== "admin" || this.state.pass !== "admin"){
			alert("wrong email or password");
		} else {
			this.props.history.push("/admin");
		}
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