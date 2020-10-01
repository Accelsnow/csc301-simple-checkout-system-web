import {round} from "../components/utilities";
import {create_item} from "../components/CheckoutPage/Checkout";

const axios = require('axios');
axios.defaults.withCredentials = true;

const domain = "http://checkout-env.eba-icztdryu.ca-central-1.elasticbeanstalk.com";

export const getAllItems = (page) => {
	axios.get(`${domain}/items`).then(res => {
		if (res.data.items) {
			page.setState({items: res.data.items})
		} else {
			alert("NO ITEMS DATA");
		}
	}).catch(err => {
		alert(err.response.data.error);
	})
};

export const editItem = (page, itemID, data) => {
	axios.patch( `${domain}/item/${itemID}`, data).then(res => {
		if (res.data.item) {
			page.setState({edit: -1});
			getAllItems(page);
		} else {
			alert("EDITION FAILED");
		}
	}).catch(err => {
		alert(err.response.data.error);
	})
};

export const addToCart = (page, itemId) => {
	axios.get(`${domain}/item/${itemId}`).then(res => {
		if (res.data.item){
			page.setState({targetItem: res.data.item});
			const itemToAdd = page.state.targetItem;
			if (itemToAdd && itemToAdd.stock > 0){
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
				let total = page.state.total;
				total += itemToAdd.price * (1-itemToAdd.discount);
				page.setState({total: total});
			} else {
				alert("The Item is Out of Stock");
			}
		} else {
			alert("NO SUCH ITEM");
		}
	}).catch(err => {
		alert(err.response.data.error);
	})
};

export const checkOut = (page, data, i) => {
	axios.post(`${domain}/item/purchase`, data).then(res => {
		if (res.data.item){
			getGlobal(page);
			const validItem = res.data.item;
			let toTal = page.state.netTotal;
			toTal += validItem.price * (1-validItem.discount) * data.amount * (1+page.state.checkout.tax_rate) * (1-page.state.checkout.discount);
			page.setState({netTotal: toTal});
		}
	}).catch(err => {
		alert(err.response.data.error);
		axios.get(`${domain}/item/${data.id}`).then(res => {
			if (res.data.item){
				const itemRemote = res.data.item;
				let total = page.state.total;
				if (itemRemote){
					const cartCopy = page.state.cart;
					if (itemRemote.stock === 0) {
						total -= cartCopy[i].total;
						page.setState({total: total});
						cartCopy.splice(i,1);
					} else {
						cartCopy[i].price = itemRemote.price;
						cartCopy[i].discount = itemRemote.discount;
						cartCopy[i].stock = itemRemote.stock;
						if (cartCopy[i].quantity > itemRemote.stock){
							cartCopy[i].quantity = itemRemote.stock;
						}
						total -= cartCopy[i].total;
						cartCopy[i].total = Number(round(cartCopy[i].price*(1-cartCopy[i].discount)*cartCopy[i].quantity));
						total += cartCopy[i].total;
						page.setState({total: total});
					}
					page.setState({cart: cartCopy});
				}
			} else {
				alert("NO SUCH ITEM");
			}
		}).catch(err => {
			alert(err.response.data.error);
		})
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
		alert(err.response.data.error);
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
		alert(err.response.data.error);
	})
};

export const login = (page, data) => {
	axios.post(`${domain}/login`, data, {withCredentials: true}).then(res => {
		if (res.data.manager){
			page.setState({currUser: res.data.manager});
			page.props.history.push("/admin");
			checkSession(page);
		} else {
			alert("Wrong username or password");
		}
	}).catch(err => {
		alert(err.response.data.error);
	});
};

export const logout = (page) => {
	axios.get(`${domain}/logout`).then(res => {
		if (res.data.success){
			page.setState({currUser: undefined});
			page.props.history.push("/");
		}
	})
};

export const checkSession = (page) => {
	axios.get(`${domain}/session`, {withCredentials: true}).then(res => {
		console.log("session ok", res.data);
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
		alert(err.response.data.error);
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
		alert(err.response.data.error);
	})
};