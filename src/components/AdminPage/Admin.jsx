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
import { Formik } from "formik";
import * as Yup from "yup";
import {getGlobal, editGlobal, getAllItems, addItem, removeItem, editItem, logout} from "../../actions/item";

const AddSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(20, "Too Long!")
		.required("Required"),
	price: Yup.number()
		.positive("Should be non-negative")
		.required("Required"),
	discount: Yup.number()
		.min(0, "Should be in range [0,1]")
		.max(1, "Should be in range [0,1]")
		.required("Required"),
	stock: Yup.number()
		.min(0, "Should be non-negative")
		.required("Required"),
});

const EditSchema = Yup.object().shape({
	discount: Yup.number()
		.min(0, "Should be in range [0,1]")
		.max(1, "Should be in range [0,1]")
		.required("Required"),
	tax_rate: Yup.number()
		.min(0, "Should be in range [0,1]")
		.max(1, "Should be in range [0,1]")
		.required("Required"),
});

class Admin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			checkout: null,
			edit: -1,
		};
	}

	componentDidMount() {
		getAllItems(this);
		getGlobal(this);
	}

	onEditGlobals = (e) => {
		editGlobal(this, e);
	};

	onEditItem = (e,i) => {
		if (i === this.state.edit) {
			const newPrice = document.getElementById("edit-price".concat(i.toString())).value;
			const newDiscount = document.getElementById("edit-discount".concat(i.toString())).value;
			const newStock = document.getElementById("edit-stock".concat(i.toString())).value;
			let data = {price: newPrice, discount: newDiscount, stock: newStock};
			editItem(this, i, data);
		} else {
			this.setState({edit: i});
		}
	};
	onRemoveItem = (e,i) => {
		e.preventDefault();
		removeItem(this, i);
	};

	onAddItem = (e) => {
		addItem(this, e);
	};

	render() {
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
					<h1>Inventory</h1>
					<h3>Add Item</h3>
					<Formik
						initialValues={{ name: "", price: 0, discount: 0, stock: 0 }}
						validationSchema={AddSchema}
						onSubmit={(e) => {this.onAddItem(e)}}
					>
						{({
							  values,
							  errors,
							  touched,
							  handleChange,
							  handleBlur,
							  handleSubmit,
						  }) => (
							<form className = "add_form">
								<TextField
									className = "add_attr"
									label={"name"}
									id="name"
									variant="outlined"
									type="text"
									autoComplete="off"
									value={values.name}
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!(errors.name && touched.name)}
									helperText={touched.name && errors.name}
									style={{marginRight: "1%"}}
								/>
								<TextField
									className = "add_attr"
									label={"price"}
									id="price"
									variant="outlined"
									autoComplete="off"
									type="number"
									value={values.price}
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!(errors.price && touched.price)}
									helperText={touched.price&& errors.price}
									style={{marginRight: "1%"}}
								/>
								<TextField
									className = "add_attr"
									label={"discount"}
									id="discount"
									variant="outlined"
									autoComplete="off"
									type="number"
									value={values.discount}
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!(errors.discount && touched.discount)}
									helperText={touched.discount&& errors.discount}
									style={{marginRight: "1%"}}
								/>
								<TextField
									className = "add_attr"
									label={"stock"}
									id="stock"
									variant="outlined"
									autoComplete="off"
									value={values.stock}
									type="number"
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!(errors.stock && touched.stock)}
									helperText={touched.stock&& errors.stock}
									style={{marginRight: "1%"}}
								/>
								<Button
									variant="contained"
									onClick={handleSubmit}
								>
									Add
								</Button>
							</form>
						)}
					</Formik>
					<h3>Edit Item</h3>
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
									<TableCell align="center">Remove</TableCell>
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
												defaultValue={round(item.discount)}
												disabled={this.state.edit !== item.id}
												id={"edit-discount".concat(item.id.toString())}
											>{"-"+item.discount*100+"%"}</TextField>
										</TableCell>
										<TableCell align="center">
											<TextField
												variant="outlined"
												align="center"
												type="number"
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
					<h3>Edit Tax & Discount</h3>
					<Formik
						initialValues={{ tax_rate: this.state.checkout.tax_rate, discount: this.state.checkout.discount}}
						validationSchema={EditSchema}
						onSubmit={(e) => {this.onEditGlobals(e)}}
					>
						{({
							  values,
							  errors,
							  touched,
							  handleChange,
							  handleBlur,
							  handleSubmit,
						  }) => (
							<form className="form_admin">
								<TextField
									label={"tax_rate"}
									id="tax_rate"
									variant="outlined"
									type="number"
									autoComplete="off"
									value={values.tax_rate}
									onBlur={handleBlur}
									onChange={handleChange}
									error={!!(errors.tax_rate && touched.tax_rate)}
									helperText={touched.tax_rate && errors.tax_rate}
									style={{marginRight: "5%"}}
								/>
								<TextField
									label={"discount"}
									id="discount"
									variant="outlined"
									autoComplete="off"
									value={values.discount}
									onBlur={handleBlur}
									type="number"
									onChange={handleChange}
									error={!!(errors.discount && touched.discount)}
									helperText={touched.discount&& errors.discount}
									style={{marginRight: "5%"}}
								/>
								<Button
									variant="contained"
									onClick={handleSubmit}
								>
									Edit
								</Button>
							</form>
						)}
					</Formik>
				</div>
			);
		} else {
			return <div></div>;
		}

	}
}

export default withRouter(Admin);