import React, {Component} from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import {round} from "../utilities";
import Button from "@material-ui/core/Button";
import Modal from '@material-ui/core/Modal';
import "./Checkout.css";
import {withRouter} from "react-router-dom";
import {addToCart, checkOut, getAllItems, getGlobal} from "../../actions/actions";

/* helper function creating item instance in cart*/
export function create_item(item) {
    return ({
        id: item.id,
        name: item.name,
        discount: item.discount,
        price: item.price,
        stock: item.stock,
        quantity: 1,
        total: round(item.price * (1 - item.discount))
    });
}

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [], /* record all items in inventory */
            cart: [], /* record all items in cart */
            checkout: null, /* record global tax and discount */
            netTotal: 0, /* record net total */
            total: 0, /* record total*/
            modalOpen: false /* indicator for receipt modal */
        };
    }

    /* preload all items and global tax and discount */
    componentDidMount() {
        getAllItems(this);
        getGlobal(this);
    }

    /* if item quantity changes to 0 on Blur, delete from cart */
    onBlurQuantity = (e, item) => {
        const cartCopy = this.state.cart;
        const itemCopy = cartCopy.find(i => i.id === item.id);
        if (Number(e.target.value) === 0) {
            cartCopy.splice(cartCopy.indexOf(itemCopy), 1);
            this.setState({cart: cartCopy});
        }
    };

    /* if item's quantity is invalid delete from cart */
    onChangeQuantity = (e, item) => {
        const cartCopy = this.state.cart;
        const itemCopy = cartCopy.find(i => i.id === item.id);
        if (Number(e.target.value) > 0 && Number(e.target.value) <= itemCopy.stock) {
            let total = this.state.total;
            total -= itemCopy.total;
            cartCopy[cartCopy.indexOf(itemCopy)].quantity = Number(e.target.value);
            const updatedTotal = itemCopy.price * (1 - itemCopy.discount) * Number(e.target.value);
            cartCopy[cartCopy.indexOf(itemCopy)].total = round(updatedTotal);
            total += Number(round(updatedTotal));
            this.setState({cart: cartCopy, total: total});
        } else {
            cartCopy.splice(cartCopy.indexOf(itemCopy), 1);
            this.setState({cart: cartCopy, total: 0});
        }
    };

    /* handle change of search input for item */
    onChangeSearch = (e) => {
        e.preventDefault();
        this.setState({search: e.target.value});
    };

    /* call addToCart API */
    onAddItem = (e) => {
        e.preventDefault();
        getAllItems(this);
        addToCart(this, this.state.search);
    };

    /* call checkout API to open checkout modal*/
    onCheckout = (e) => {
        e.preventDefault();
        getGlobal(this);
        this.setState({modalOpen: true});
    };

    /* call confirm API to actually checkout all items in cart and quit session*/
    onConfirm = (e) => {
        e.preventDefault();
        let cartCopy = this.state.cart;
        this.setState({cart: []}, () => {
            let i;
            for (i = 0; i < cartCopy.length; i++) {
                checkOut(this, cartCopy, i);
            }
        });
        this.setState({
            modalOpen: false,
            netTotal: 0,
        });
    };

    /* handle receipt modal close */
    onModalClose = (e) => {
        e.preventDefault();
        this.setState({modalOpen: false});
    };

    render() {
        const {history} = this.props;
        if (this.state.checkout) {
            return (
                <div className="container_checkout">
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="login_button"
                        onClick={() => {
                            history.push("/login")
                        }}
                    >
                        Manager Portal
                    </Button>
                    <h1>Cart</h1>
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
                                        <TableCell align="center">
                                            {item.name}
                                        </TableCell>
                                        <TableCell align="center">{round(item.price)}</TableCell>
                                        <TableCell align="center">{"-" + item.discount * 100 + "%"}</TableCell>
                                        <TableCell align="center">{round(item.price * (1 - item.discount))}</TableCell>
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
                                                    style: {textAlign: "center"}
                                                }}
                                                onChange={(e) => {
                                                    this.onChangeQuantity(e, item)
                                                }}
                                                onBlur={(e) => {
                                                    this.onBlurQuantity(e, item)
                                                }}
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
                            label="Total"
                            name="name"
                            autoFocus
                            disabled={true}
                            value={round(this.state.total)}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className="customer_button"
                        >
                            Checkout
                        </Button>
                        <Modal
                            open={this.state.modalOpen}
                            onClose={this.onModalClose}
                        >
                            <form className="receipt">
                                <h2>Receipt</h2>
                                <h4>Net Total: {round(this.state.total)}</h4>
                                <h4>Tax Rate: {round(this.state.checkout.tax_rate * 100) + "%"}</h4>
                                <h4>Discount: {"-" + round(this.state.checkout.discount * 100) + "%"}</h4>
                                <h4>Total: {round(this.state.total * (1 + this.state.checkout.tax_rate) * (1 - this.state.checkout.discount))}</h4>
                                <Button onClick={this.onConfirm}><h4>Confirm</h4></Button>
                                <h5>{"made at:" + new Date().toLocaleTimeString()}</h5>
                            </form>
                        </Modal>
                    </form>
                </div>
            );
        } else {
            return (<div></div>);
        }

    }
}

export default withRouter(Checkout);