import { cartStore, subTotalStore } from './stores';
import { DraftOrderApi } from './api/'

let cartstore
let cartSubUnsub = cartStore.subscribe((x) => (cartstore = x))
let subtotalstore
let subTotalSubUnsub = subTotalStore.subscribe((x) => (subtotalstore = x))
const draftOrderApi = new DraftOrderApi()

async function addItem(product, addQty) {
    addQty = (addQty ? addQty : 1)
    let displayName = '';
    let itemTotal = 0;
    let extras = product.productExtraGroups.flatMap(eg => eg.productExtras).filter(e => {
        return e.selected || e.itemCount && e.itemCount > 0;
    });

    if (!product.alreadyAdded) {
        if (extras && extras.length > 0) {
            displayName = `${product.name} ${extras.map(e => {
                let parsedName = e.name;
                if (e.itemCount > 1) {
                    parsedName = `${parsedName} x ${e.itemCount}`
                }
                return parsedName;
            }).join(', ')}`;
            itemTotal = product.price + extras.map(x => {
                if (x.itemCount) {
                    return x.price * x.itemCount;
                }

                return x.price;
            }).reduce((a, b) => a + b);
        } else {
            displayName = `${product.name}`;
            itemTotal = product.price;
        }
    } else {
        displayName = product.displayName;
        itemTotal = product.price;
    }

    let items = cartstore;

    let existingItem = items.filter(x => {
        return x.displayName === displayName && x.displayName.length == displayName.length;
    });

    if (!existingItem.length > 0) {

        let newItem = {
            ticketType: product.id,
            displayName: displayName,
            name: product.name,
            requestedQuantity: addQty,
            price: itemTotal,
            total: itemTotal * addQty,
            product: product,
            productExtras: JSON.parse(JSON.stringify(extras)),
            productExtraGroups: JSON.parse(JSON.stringify(product.productExtraGroups)),
            alreadyAdded: true,
            mainImageId: product.mainImageId
        };

        items.push(newItem)
        cartStore.set(items)


    } else {
        existingItem = existingItem[0];
        existingItem.requestedQuantity = existingItem.requestedQuantity + addQty;
        existingItem.total = itemTotal * existingItem.requestedQuantity;
        cartStore.update(items => items = items);
    }

    subTotalStore.update(subTotalStore => subTotalStore + (itemTotal * addQty));

    resetExtras(product);
}

async function removeItem(product, all) {
    let existingItem = cartstore.filter(x => x.displayName === product.displayName)[0];
    if (all) {
        existingItem.requestedQuantity = 0;
    } else {
        existingItem.requestedQuantity = existingItem.requestedQuantity - 1;
    }
    existingItem.total = existingItem.total - existingItem.price;
    subTotalStore.update(subTotalStore => subTotalStore - product.price);


    let newItems = [];
    cartstore.forEach(product => {
        if (product.requestedQuantity > 0) {
            newItems.push(product);
        }
    });

    cartStore.update(items => items = newItems);
}

function resetExtras(product) {
    product.productExtraGroups.flatMap(eg => eg.productExtras).forEach(element => {
        element.selected = false;
        element.itemCount = 0;
    });
}


export default {
    cart: {
        items: cartstore,
        subtotal: subtotalstore
    },
    addItem,
    removeItem,
    resetExtras
};