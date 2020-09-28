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
import "./Checkout.css";
import { withRouter} from "react-router-dom";
import { checkOut, addToCart, getAllItems, getGlobal} from "../../actions/item";


 export function create_item(item) {
	return ({id: item.id, name: item.name, discount: item.discount, price: item.price, stock: item.stock, quantity: 1, total: round(item.price*(1-item.discount))});
}

class Checkout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			cart: [],
			checkout: null,
			netTotal: 0
		};
	}

	componentDidMount() {
		getAllItems(this);
		getGlobal(this);
	}

	onBlurQuantity = (e, item) => {
		const cartCopy = this.state.cart;
		const itemCopy = cartCopy.find(i => i.id === item.id);
		if (Number(e.target.value) === 0){
			cartCopy.splice(cartCopy.indexOf(itemCopy),1);
			this.setState({cart: cartCopy});
		}
	};
	onChangeQuantity = (e, item) => {
		const cartCopy = this.state.cart;
		const itemCopy = cartCopy.find(i => i.id === item.id);
		if (Number(e.target.value) >= 0 && Number(e.target.value) <= itemCopy.stock){
			cartCopy[cartCopy.indexOf(itemCopy)].quantity = Number(e.target.value);
			const updatedTotal = itemCopy.price*(1-itemCopy.discount)*Number(e.target.value);
			cartCopy[cartCopy.indexOf(itemCopy)].total = round(updatedTotal);
			this.setState({cart: cartCopy});
		}
	};
	onChangeSearch = (e) => {
		e.preventDefault();
		this.setState({search: e.target.value});
	};
	onChangeName = (e) => {
		e.preventDefault();
		this.setState({name: e.target.value});
	};
	onAddItem = (e) => {
		e.preventDefault();
		getAllItems(this);
		addToCart(this, this.state.search);
	};
	onCheckout = (e) => {
		e.preventDefault();
		let i;
		for (i=0; i < this.state.cart.length; i++){
			let data = {id: this.state.cart[i].id, amount: this.state.cart[i].quantity};
			checkOut(this,data);
		}
		getGlobal(this);
	};
	render() {
		const {history} = this.props;
		return (
			<div className="container_checkout">
				<Button
					type="submit"
					variant="contained"
					color="primary"
					className="login_button"
					onClick={() => {history.push("/login")}}
				>
					Manager Portal
				</Button>
				<form className="form_checkout" noValidate onSubmit={this.onAddItem}>
					<TextField
						className="search_input"
						variant="outlined"
						margin="normal"
						required
						id="email"
						label="Enter Item Name or ID"
						name="name|id"
						autoFocus
						onChange={this.onChangeSearch}
					/>
					<Button
						type="submit"
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
							{this.state.cart.map(item => (
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
												inputProps: {
													max: item.stock, min: 0
												}
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
				<form className="form_checkout" noValidate onSubmit={this.onCheckout}>
					<TextField
						className="customer_name"
						variant="outlined"
						margin="normal"
						required
						id="name"
						label="Enter Customer Name"
						name="name"
						autoFocus
						onChange={this.onChangeName}
					/>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						className="customer_button"
					>
						View Receipt
					</Button>
				</form>
			</div>
		);
	}
}

export default withRouter(Checkout);