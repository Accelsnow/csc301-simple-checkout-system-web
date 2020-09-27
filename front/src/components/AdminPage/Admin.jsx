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

class Admin extends Component {
	state = {
		items: items,
		edit: -1,
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
				<TableContainer component={Paper}>
					<Table style={{minWidth: 650}} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="center">Id</TableCell>
								<TableCell align="center">Name</TableCell>
								<TableCell align="center">Price&nbsp;($)</TableCell>
								<TableCell align="center">Discount&nbsp;(%)</TableCell>
								<TableCell align="center">Stock</TableCell>
								<TableCell align="center">Edit</TableCell>
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