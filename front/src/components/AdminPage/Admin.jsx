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

const items = [
	{id: 1, name: "coke", discount: 0.8, price: 3.0, stock: 10,},
	{id: 2, name: "juice", discount: 0.5, price: 5.0, stock: 5},
	{id: 3, name: "apple", discount: 0.3, price: 10.0, stock: 3}
];

const receipes = [
	{timeStamp: 123, net_total: 100, discount: 0, tax_rate: 1.1, total: 110, customer_id: 1},
	{timeStamp: 456, net_total: 200, discount: 0.5, tax_rate: 1.2, total: 120, customer_id: 2}
];


class Admin extends Component {
	state = {
		items: items,
		edit: -1,
		priceErr: false,
		discountErr: false,
		stockErr: false
	};
	onEditItem = (e,i) => {
		e.preventDefault();
		if (i === this.state.edit) {
			const newPrice = Number(document.getElementById("edit-price".concat(i.toString())).value);
			const newDiscount = Number(document.getElementById("edit-discount".concat(i.toString())).value);
			const newStock = Number(document.getElementById("edit-stock".concat(i.toString())).value);
			const itemsCopy = this.state.items;
			const itemCopy = itemsCopy.find(j => j.id === i);
			if (newPrice > 0 && newStock >= 0 && newDiscount > 0 && newDiscount < 1){
				itemsCopy[itemsCopy.indexOf(itemCopy)].price = newPrice;
				itemsCopy[itemsCopy.indexOf(itemCopy)].discount = newDiscount;
				itemsCopy[itemsCopy.indexOf(itemCopy)].stock = newStock;
				this.setState({items: itemsCopy});
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
		const itemsCopy = this.state.items;
		const itemCopy = itemsCopy.find(j => j.id === i);
		itemsCopy.splice(itemsCopy.indexOf(itemCopy),1);
		this.setState({items: itemsCopy});
	};
	onAddItem = (e) => {
		e.preventDefault();
		if (this.state.discountErr || this.state.priceErr || this.state.stockErr){
			alert("Please fix errors");
		} else {
			const itemsCopy = this.state.items;
			let ct = 4;
			itemsCopy.push({id: ct, name: this.state.name, price: this.state.price, discount: this.state.discount, stock: this.state.stock});
			this.setState({items: itemsCopy});
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
		return (
			<div className="container_admin">
				<Button
					type="submit"
					variant="contained"
					color="primary"
					className="signOut_button"
					onClick={() => {history.push("/")}}
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
			</div>
		);
	}
}

export default withRouter(Admin);