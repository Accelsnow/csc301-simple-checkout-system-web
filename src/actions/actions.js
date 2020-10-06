import {round} from "../components/utilities";
import {create_item} from "../components/CheckoutPage/Checkout";

const axios = require('axios');
axios.defaults.withCredentials = true;
/* specify domain addr */
const domain = "http://checkout-env.eba-icztdryu.ca-central-1.elasticbeanstalk.com/";

/* GET all items */
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

/* EDIT one item's price, discount, or stock given itemID */
export const editItem = (page, itemID, data) => {
    axios.patch(`${domain}/item/${itemID}`, data).then(res => {
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

/* GET one item and add it to checkout paage cart by 1 given itemID if stock > 0 */
export const addToCart = (page, itemId) => {
    axios.get(`${domain}/item/${itemId}`).then(res => {
        if (res.data.item) {
            page.setState({targetItem: res.data.item});
            const itemToAdd = page.state.targetItem;
            if (itemToAdd && itemToAdd.stock > 0) {
                const cartCopy = page.state.cart;
                const itemCopy = cartCopy.find(i => i.id === itemToAdd.id);
                if (!itemCopy) {
                    cartCopy.push(create_item(itemToAdd));
                    page.setState({cart: cartCopy});
                } else {
                    if (itemCopy.quantity < itemCopy.stock) {
                        cartCopy[cartCopy.indexOf(itemCopy)].quantity++;
                        const updatedTotal = itemCopy.price * (1 - itemCopy.discount) * (itemCopy.quantity);
                        cartCopy[cartCopy.indexOf(itemCopy)].total = round(updatedTotal);
                        page.setState({cart: cartCopy});
                    }
                }
                let total = page.state.total;
                total += itemToAdd.price * (1 - itemToAdd.discount);
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

/* POST updated item info after checkout and update checkout page total if valid else adjust cart quantity */
export const checkOut = (page, cart, i) => {
    axios.post(`${domain}/item/purchase`, {id: cart[i].id, amount: cart[i].quantity}).then(res => {
        if (res.data.item) {
            let total= page.state.total;
            total -= cart[i].total;
            page.setState({total: total});
        }
    }).catch(err => {
        alert(`${cart[i].name} not bought due to change in stock, it will remain in your cart with latest updated stock information`);
        axios.get(`${domain}/item/${cart[i].id}`).then(res => {
            if (res.data.item) {
                const itemRemote = res.data.item;
                let total = page.state.total;
                cart[i].price = itemRemote.price;
                cart[i].discount = itemRemote.discount;
                cart[i].stock = itemRemote.stock;
                if (cart[i].quantity > itemRemote.stock) {
                    cart[i].quantity = itemRemote.stock;
                }
                total -= cart[i].total;
                cart[i].total = Number(round(cart[i].price * (1 - cart[i].discount) * cart[i].quantity));
                total += cart[i].total;
                let cartCopy = page.state.cart;
                if (cart[i].stock !== 0) {
                    cartCopy.push(cart[i]);
                }
                page.setState({total: total, cart: cartCopy});
            } else {
                alert("NO SUCH ITEM");
            }
        }).catch(err => {
            alert(err.response.data.error);
        })
    })
};

/* POST one new item given info */
export const addItem = (page, data) => {
    axios.post(`${domain}/item`, data).then(res => {
        if (res.data.item) {
            getAllItems(page);
        } else {
            alert("ADDITION FAILED");
        }
    }).catch(err => {
        alert(err.response.data.error);
    })
};

/* DELETE one item given itemId */
export const removeItem = (page, itemId) => {
    axios.delete(`${domain}/item/${itemId}`).then(res => {
        if (res.data.success) {
            getAllItems(page);
        } else {
            alert("REMOVE FAILED");
        }
    }).catch(err => {
        alert(err.response.data.error);
    })
};

/* POST login info */
export const login = (page, data) => {
    axios.post(`${domain}/login`, data, {withCredentials: true}).then(res => {
        if (res.data.manager) {
            page.props.app.setState({currentUser: res.data.manager}, () => {
                page.props.history.push("/manager");
            });
        } else {
            alert("Wrong username or password");
        }
    }).catch(err => {
        alert(err.response.data.error);
    });
};

/* Log out */
export const logout = (page) => {
    axios.get(`${domain}/logout`).then(res => {
        if (res.data.success) {
            page.props.history.push("/");
            page.props.app.setState({currentUser: null});
        }
    })
};

/* GET current user and check session */
export const checkSession = (props) => {
    axios.get(`${domain}/session`, {withCredentials: true}).then(res => {
        props.setState({currentUser: res.data.current_user, sessionChecked: true});
    }).catch(err => {
        alert(err.response.data.error);
    });
};

/* POST global tax and discount info to update them */
export const editGlobal = (page, data) => {
    axios.patch(`${domain}/checkout/${1}`, data).then(res => {
        if (res.data.checkout) {
            getGlobal(page);
        } else {
            alert("EDITION FAILED");
        }
    }).catch(err => {
        alert(err.response.data.error);
    })
};

/* GET global tax and discount info */
export const getGlobal = (page) => {
    axios.get(`${domain}/checkout/${1}`).then(res => {
        if (res.data.checkout) {
            page.setState({checkout: res.data.checkout});
        } else {
            alert("FETCH FAILED");
        }
    }).catch(err => {
        alert(err.response.data.error);
    })
};