import React, { Component } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import { round} from "../utilities";
import Button from "@material-ui/core/Button";
import "./Checkout.css"


const items = [
	{id: 1, name: "coke", discount: 0.8, price: 3.0, stock: 10, quantity: 1, total: round((1-0.8)*3.0)},
	{id: 2, name: "juice", discount: 0.5, price: 5.0, stock: 5, quantity: 1, total: round((1-0.5)*5.0)},
	{id: 3, name: "apple", discount: 0.3, price: 10.0, stock: 3, quantity: 1, total: round((1-0.3)*10.0)}
];

const toAdd = [
	{id: 4, name: "banana", discount: 0.9, price: 30.0, stock: 100},
	{id: 5, name: "suica", discount: 0.99, price: 50.0, stock: 50},
];

function create_item(item) {
	return ({id: item.id, name: item.name, discount: item.discount, price: item.price, stock: item.stock, quantity: 1, total: round(item.price*(1-item.discount))});
}

class Checkout extends Component {
	state = {
		items: items
	};
	onBlurQuantity = (e, item) => {
		const itemsCopy = this.state.items;
		const itemCopy = itemsCopy.find(i => i.id === item.id);
		if (Number(e.target.value) === 0){
			itemsCopy.splice(itemsCopy.indexOf(itemCopy),1);
			this.setState({items: itemsCopy});
		}
	};
	onChangeQuantity = (e, item) => {
		const itemsCopy = this.state.items;
		const itemCopy = itemsCopy.find(i => i.id === item.id);
		if (Number(e.target.value) >= 0 && Number(e.target.value) <= itemCopy.stock){
			itemsCopy[itemsCopy.indexOf(itemCopy)].quantity = Number(e.target.value);
			const updatedTotal = itemCopy.price*(1-itemCopy.discount)*Number(e.target.value);
			itemsCopy[itemsCopy.indexOf(itemCopy)].total = round(updatedTotal);
			this.setState({items: itemsCopy});
		}
	};
	onChangeSearch = (e) => {
		e.preventDefault();
		this.setState({search: e.target.value});
	};
	onAddItem = (e) => {
		e.preventDefault();
		const itemToAdd = toAdd.find(i => (i.id === Number(this.state.search) || i.name === this.state.search));
		if (itemToAdd){
			const itemsCopy = this.state.items;
			const itemCopy = itemsCopy.find(i => i.id === itemToAdd.id);
			if (!itemCopy){
				itemsCopy.push(create_item(itemToAdd));
				this.setState({items: itemsCopy});
			} else {
				if (itemCopy.quantity < itemCopy.stock){
					itemsCopy[itemsCopy.indexOf(itemCopy)].quantity++;
					const updatedTotal = itemCopy.price*(1-itemCopy.discount)*(itemCopy.quantity+1);
					itemsCopy[itemsCopy.indexOf(itemCopy)].total = round(updatedTotal);
					this.setState({items: itemsCopy});
				}
			}
		} else {
			this.setState({err: "No such "})
		}
	};
	render() {
		return (
			<div className="container">
				<form className="form" noValidate onSubmit={this.onAddItem}>
					<TextField
						className="search_input"
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Enter Item Name or ID"
						name="name|id"
						autoFocus
						onChange={this.onChangeSearch}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className="search_button"
					>
						Add
					</Button>
				</form>
				<TableContainer component={Paper}>
					<Table style={{minWidth: 650}} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="center">Name</TableCell>
								<TableCell align="center">Price&nbsp;($)</TableCell>
								<TableCell align="center">Discount&nbsp;(%)</TableCell>
								<TableCell align="center">Price(discounted)&nbsp;($)</TableCell>
								<TableCell align="center">Quantity</TableCell>
								<TableCell align="center">Stock</TableCell>
								<TableCell align="center">Item Total&nbsp;($)</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{this.state.items.map(item => (
								<TableRow key={item.id}>
									<TableCell  align="center">
										{item.name}
									</TableCell>
									<TableCell align="center">{round(item.price)}</TableCell>
									<TableCell align="center">{"-"+item.discount*100+"%"}</TableCell>
									<TableCell align="center">{round(item.price*(1-item.discount))}</TableCell>
									<TableCell align="center">
										<TextField
											style={{width: "100px"}}
											id="standard-number"
											type="number"
											required={true}
											InputLabelProps={{
												shrink: true,
											}}
											value={item.quantity}
											inputProps={{
												style: { textAlign: "center"}
											}}
											onChange={(e) => {this.onChangeQuantity(e, item)}}
											onBlur={(e) => {this.onBlurQuantity(e, item)}}
										/>
									</TableCell>
									<TableCell align="center">{item.stock}</TableCell>
									<TableCell align="center">{item.total}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</div>
		);
	}
}

export default Checkout;