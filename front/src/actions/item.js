import {round} from "../components/utilities";
import {create_item} from "../components/CheckoutPage/Checkout";

const axios = require('axios');
axios.defaults.withCredentials = true;

const domain = "http://localhost:8000";

export const getAllItems = (page) => {
	axios.get(`${domain}/items`).then(res => {
		if (res.data.items) {
			page.setState({items: res.data.items})
		} else {
			console.log("NO ITEMS DATA");
		}
	}).catch(err => {
		console.log(err);
	})
};

export const editItem = (page, itemID, data) => {
	axios.patch( `${domain}/item/${itemID}`, data).then(res => {
		if (res.data.item) {
			getAllItems(page);
		} else {
			alert("EDITION FAILED");
		}
	}).catch(err => {
		alert("Invalid Item Edition");
	})
};

export const addToCart = (page, itemId) => {
	axios.get(`${domain}/item/${itemId}`).then(res => {
		if (res.data.item){
			page.setState({targetItem: res.data.item});
			const itemToAdd = page.state.targetItem;
			if (itemToAdd){
				const cartCopy = page.state.cart;
				const itemCopy = cartCopy.find(i => i.id === itemToAdd.id);
				if (!itemCopy){
					cartCopy.push(create_item(itemToAdd));
					page.setState({cart: cartCopy});
				} else {
					if (itemCopy.quantity < itemCopy.stock){
						cartCopy[cartCopy.indexOf(itemCopy)].quantity++;
						const updatedTotal = itemCopy.price*(1-itemCopy.discount)*(itemCopy.quantity);
						cartCopy[cartCopy.indexOf(itemCopy)].total = round(updatedTotal);
						page.setState({cart: cartCopy});
					}
				}
			} else {
				alert("NO SUCH ELEMENT1");
			}
		} else {
			alert("NO SUCH ITEM");
		}
	}).catch(err => {
		alert(err);
	})
};

// export const updateCartItem = (page, itemId, i) => {
// 	axios.get(`${domain}/item/${itemId}`).then(res => {
// 		if (res.data.item){
// 			page.setState({targetItem: res.data.item});
// 			const itemRemote = page.state.targetItem;
// 			if (itemRemote && itemRemote.quantity > 0){
// 				const cartCopy = this.state.cart;
// 				cartCopy[i].price = itemRemote.price;
// 				cartCopy[i].discount = itemRemote.discount;
// 				cartCopy[i].stock = itemRemote.stock;
// 				if (cartCopy[i].quantity > itemRemote.quantity){
// 					cartCopy[i].quantity = itemRemote.quantity;
// 					alert("Some items decreased in stock before your check out");
// 				}
// 				cartCopy[i].total = round(cartCopy[i].price*(1-cartCopy[i].discount)*cartCopy[i].quantity);
// 				page.state.newCart.push(cartCopy[i]);
// 			}
// 		} else {
// 			alert("NO SUCH ITEM");
// 		}
// 	}).catch(err => {
// 		alert(err);
// 	})
// };

export const checkOut = (page, data) => {
	axios.post(`${domain}/item/purchase`, data).then(res => {
		if (res.data.item){
			const validItem = res.data.item;
			let netToTal = page.state.netTotal;
			netToTal += validItem.price * (1-validItem.discount) * data.amount;
			page.setState({netTotal: netToTal});
		}
	}).catch(err => {
		alert(err);
	})
};

export const addItem = (page, data) => {
	axios.post(`${domain}/item`, data).then(res => {
		if (res.data.item){
			getAllItems(page);
		} else {
			alert("ADDITION FAILED");
		}
	}).catch(err => {
		alert("Invalid Item Addition");
	})
};

export const removeItem = (page, itemId) => {
	axios.delete(`${domain}/item/${itemId}`).then(res => {
		if (res.data.success){
			getAllItems(page);
		} else {
			alert("REMOVE FAILED");
		}
	}).catch(err => {
		alert("Invalid Item Removal");
	})
};

export const login = (page, data) => {
	axios.post(`${domain}/login`, data).then(res => {
		console.log(55, res.data);
		if (res.data.manager){
			page.setState({currUser: res.data.manager});
			page.props.history.push("/admin");
			checkSession(page);
		} else {
			console.log("LOGIN FAILED");
		}
	}).catch(err => {
		console.log(err);
	});
};

export const logout = (page) => {
	axios.get(`${domain}/logout`).then(res => {
		console.log(66, res.data);
		if (res.data.success){
			page.setState({currUser: undefined});
			page.props.history.push("/");
		}
	})
};

export const checkSession = (page) => {
	axios.get(`${domain}/session`).then(res => {
		console.log(44, res.data);
	});
};

export const editGlobal = (page, data) => {
	axios.patch( `${domain}/checkout/${1}`, data).then(res => {
		if (res.data.checkout) {
			getGlobal(page);
		} else {
			alert("EDITION FAILED");
		}
	}).catch(err => {
		alert("Invalid Global Edition");
	})
};

export const getGlobal = (page) => {
	axios.get( `${domain}/checkout/${1}`).then(res => {
		if (res.data.checkout) {
			page.setState({checkout: res.data.checkout});
		} else {
			alert("FETCH FAILED");
		}
	}).catch(err => {
		alert("Invalid Global Fetch");
	})
};