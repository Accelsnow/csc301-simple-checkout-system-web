import React, { Component } from "react";
import {round} from "../utilities";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import "./Admin.css";
import {getGlobal, editGlobal, getAllItems, addItem, removeItem, editItem, logout} from "../../actions/item";

class Admin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			checkout: null,
			edit: -1,
			priceErr: false,
			discountErr: false,
			stockErr: false,
		};
	}

	componentDidMount() {
		getAllItems(this);
		getGlobal(this);
	}

	onEditGlobals = (e) => {
		e.preventDefault();
		const newDiscount = Number(document.getElementById("edit-global-discount").value);
		const newTax = Number(document.getElementById("edit-global-tax").value);
		console.log(newDiscount);
		if (newTax >= 0 && newDiscount >= 0 && newDiscount < 1){
			const data = {discount: newDiscount, tax_rate: newTax};
			editGlobal(this, data);
		} else {
			alert("Please set  0 <= discount < 1 && tax >=0");
		}
	};

	onEditItem = (e,i) => {
		e.preventDefault();
		if (i === this.state.edit) {
			const newPrice = Number(document.getElementById("edit-price".concat(i.toString())).value);
			const newDiscount = Number(document.getElementById("edit-discount".concat(i.toString())).value);
			const newStock = Number(document.getElementById("edit-stock".concat(i.toString())).value);
			if (newPrice > 0 && newStock >= 0 && newDiscount > 0 && newDiscount < 1){
				const data = {price: newPrice, discount: newDiscount, stock: newStock};
				editItem(this, i, data);
				this.forceUpdate();
				this.setState({edit: -1});
			} else {
				alert("Please set price > 0 && 0 < discount < 1 && stock >=0");
			}
		} else {
			this.setState({edit: i});
		}
	};
	onRemoveItem = (e,i) => {
		e.preventDefault();
		removeItem(this, i);
		this.forceUpdate();
	};
	onAddItem = (e) => {
		e.preventDefault();
		if (this.state.discountErr || this.state.priceErr || this.state.stockErr){
			alert("Please fix errors");
		} else {
			const data = {name: this.state.name, price: this.state.price, discount: this.state.discount, stock: this.state.stock};
			addItem(this, data);
			this.forceUpdate();
		}
	};
	onChangeName = (e) => {
		this.setState({name: e.target.value});
	};
	onChangePrice = (e) => {
		if ( Number(e.target.value) && Number(e.target.value) > 0){
			this.setState({price: Number(e.target.value), priceErr: false});
		} else {
			this.setState({priceErr: true});
		}
	};
	onChangeDiscount = (e) => {
		if ( Number(e.target.value) && Math.sign(Number(e.target.value)) !== -1 && Number(e.target.value) < 1){
			this.setState({discount: Number(e.target.value), discountErr: false});
		} else {
			this.setState({discountErr: true});
		}
	};
	onChangeStock = (e) => {
		if ( Number(e.target.value) && Number(e.target.value) > 0 && Number.isInteger(Number(e.target.value))){
			this.setState({stock: Number(e.target.value), stockErr: false});
		} else {
			this.setState({stockErr: true});
		}
	};
	render() {
		const { history } = this.props;
		if (this.state.checkout) {
			return (
				<div className="container_admin">
					<Button
						type="submit"
						variant="contained"
						color="primary"
						className="signOut_button"
						onClick={() => {logout(this)}}
					>
						Sign Out
					</Button>
					<form className="form_admin"  noValidate onSubmit={this.onAddItem}>
						<TextField
							className="admin_input"
							variant="outlined"
							margin="normal"
							required
							id="email"
							label="Enter Item Name"
							name="name"
							autoFocus
							onChange={this.onChangeName}
						/>
						<TextField
							className="admin_input"
							variant="outlined"
							margin="normal"
							required
							type="number"
							InputProps={{
								inputProps: {
									min: 0
								}
							}}
							defaultValue={0}
							id="standard-number"
							label="Enter Item Price"
							name="price"
							autoFocus
							onChange={this.onChangePrice}
							error={this.state.priceErr}
							helperText={this.state.priceErr ? 'Price should > 0' : ''}
						/>
						<TextField
							className="admin_input"
							variant="outlined"
							margin="normal"
							required
							type="number"
							InputProps={{
								inputProps: {
									max: 1, min: 0
								}
							}}
							defaultValue={0}
							id="standard-number"
							label="Enter Item Discount"
							name="discount"
							autoFocus
							onChange={this.onChangeDiscount}
							error={this.state.discountErr}
							helperText={this.state.discountErr ? 'Discount should > 0 and < 1' : ''}
						/>
						<TextField
							className="admin_input"
							variant="outlined"
							margin="normal"
							required
							type="number"
							id="standard-number"
							label="Enter Item Stock"
							name="stock"
							defaultValue={0}
							InputProps={{
								inputProps: {
									min: 0
								}
							}}
							autoFocus
							onChange={this.onChangeStock}
							error={this.state.stockErr}
							helperText={this.state.stockErr ? 'Stock should int > 0' : ''}
						/>
						<Button
							type="submit"
							variant="contained"
							color="primary"
							className="admin_button"
						>
							Add
						</Button>
					</form>
					<TableContainer component={Paper} className="table_admin">
						<Table style={{minWidth: 650}} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell align="center">Id</TableCell>
									<TableCell align="center">Name</TableCell>
									<TableCell align="center">Price&nbsp;($)</TableCell>
									<TableCell align="center">Discount&nbsp;(%)</TableCell>
									<TableCell align="center">Stock</TableCell>
									<TableCell align="center">Edit</TableCell>
									<TableCell align="center">remove</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{this.state.items.map(item => (
									<TableRow key={item.id}>
										<TableCell  align="center">
											{item.id}
										</TableCell>
										<TableCell  align="center">
											{item.name}
										</TableCell>
										<TableCell align="center">
											<TextField
												variant="outlined"
												align="center"
												type="number"
												InputProps={{
													inputProps: {
														min: 0
													}
												}}
												defaultValue={round(item.price)}
												disabled={this.state.edit !== item.id}
												id={"edit-price".concat(item.id.toString())}
											>{round(item.price)}</TextField>
										</TableCell>
										<TableCell align="center">
											<TextField
												variant="outlined"
												align="center"
												type="number"
												InputProps={{
													inputProps: {
														max: 1, min: 0
													}
												}}
												defaultValue={item.discount}
												disabled={this.state.edit !== item.id}
												id={"edit-discount".concat(item.id.toString())}
											>{"-"+item.discount*100+"%"}</TextField>
										</TableCell>
										<TableCell align="center">
											<TextField
												variant="outlined"
												align="center"
												type="number"
												InputProps={{
													inputProps: {
														min: 0
													}
												}}
												defaultValue={item.stock}
												disabled={this.state.edit !== item.id}
												id={"edit-stock".concat(item.id.toString())}
											>{item.stock}</TextField>
										</TableCell>
										<TableCell align="center">
											{
												item.id === this.state.edit ?
													<Button variant="contained"
													        onClick={(e) => {this.onEditItem(e, item.id)}}
													        className={"admin-apply-but"}>Apply</Button> :
													<Button variant="contained"
													        onClick={(e) => {this.onEditItem(e,item.id)}}
													        className={"admin-edit-but"}>Edit</Button>
											}
										</TableCell>
										<TableCell align="center">
											<Button variant="contained" onClick={(e) => {this.onRemoveItem(e, item.id)}}>Remove</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<TableContainer component={Paper} className="table_admin">
						<Table style={{minWidth: 650}} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell align="center">Tax {this.state.checkout.tax_rate}</TableCell>
									<TableCell align="center">Discount {this.state.checkout.discount}</TableCell>
									<TableCell align="center">Edit</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell align="center">
										<TextField
											variant="outlined"
											align="center"
											type="number"
											InputProps={{
												inputProps: {
													min: 0
												}
											}}
											defaultValue={this.state.checkout.tax_rate}
											id={"edit-global-tax"}
										>{this.state.checkout.tax_rate}</TextField>
									</TableCell>
									<TableCell align="center">
										<TextField
											variant="outlined"
											align="center"
											type="number"
											InputProps={{
												inputProps: {
													max: 1, min: 0
												}
											}}
											defaultValue={this.state.checkout.discount}
											id={"edit-global-discount"}
										>{this.state.checkout.discount}</TextField>
									</TableCell>
									<TableCell align="center">
										{
											<Button variant="contained" onClick={(e) => {this.onEditGlobals(e)}} className={"admin-edit-but"}>Edit</Button>
										}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			);
		} else {
			return <div></div>;
		}

	}
}

export default withRouter(Admin);