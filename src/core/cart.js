import { cartStore, subTotalStore, eventStore } from './stores'
import { global as globalBus } from './EventBus';

export default class CartService {
    constructor(dispatch) {
        let cartSubUnsub = cartStore.subscribe((x) => (this.cart = x))
        let subTotalSubUnsub = subTotalStore.subscribe((x) => (this.subtotal = x))
        let eventSubUnsub = eventStore.subscribe((x) => (this.event = x))

        this.cartStore = cartStore
        this.subTotalStore = subTotalStore

        this.globalBus = globalBus
    }

    // async removeItem(product){
    //     this.cartStore = this.cartStore.filter(x=>{
    //         console.log(x)

    //         return true
    //     })
    // }

    async addItem(product, addQty) {
        this.globalBus.emit('addingProductToCart')
        addQty = (addQty ? addQty : 1)

        let displayName = ''
        let itemTotal = 0
        let extras = product.productExtraGroups.flatMap(eg => eg.productExtras).filter(e => {
            return e.selected || e.itemCount && e.itemCount > 0
        })

        if (!product.alreadyAdded) {
            if (extras && extras.length > 0) {
                displayName = `${product.name} ${extras.map(e => {
                    let parsedName = e.name
                    if (e.itemCount > 1) {
                        parsedName = `${parsedName} x ${e.itemCount}`
                    }
                    return parsedName
                }).join(', ')}`
                itemTotal = product.price + extras.map(x => {
                    if (x.itemCount) {
                        return x.price * x.itemCount
                    }

                    return x.price
                }).reduce((a, b) => a + b)
            } else {
                displayName = `${product.name}`
                itemTotal = product.price
            }
        } else {
            displayName = product.displayName
            itemTotal = product.price
        }

        let items = this.cart

        let existingItems = items.filter(x => {
            return x.displayName === displayName && x.displayName.length == displayName.length
        })

        if (existingItems.length < 1) {

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
            }

            items.push(newItem)
            this.cartStore.set(items)
        } else {
            let existingItem = existingItems[0]
            if (this.event.features.some((x) => x.claimValue === 'managed-stock')) { 
                if (product.product.availableQuantity < existingItem.requestedQuantity + addQty) {
                    this.globalBus.emit('tooManyRequested', { tooManyRequested: true, displayName: displayName, leftInStock: product.product.availableQuantity })
                    return
                }
            }

            existingItem.requestedQuantity = existingItem.requestedQuantity + addQty
            existingItem.total = itemTotal * existingItem.requestedQuantity
            this.cartStore.update(items => items = items)
        }

        this.subTotalStore.update(sts => sts + (itemTotal * addQty))

        this.resetExtras(product)

        this.globalBus.emit('addedProductToCart')
    }

    async removeItem(product, all) {
        let existingItem = this.cart.filter(x => x.displayName === product.displayName)[0]
        if (all) {
            existingItem.requestedQuantity = 0
        } else {
            existingItem.requestedQuantity = existingItem.requestedQuantity - 1
        }
        existingItem.total = existingItem.total - existingItem.price
        this.subTotalStore.update(sts => sts - product.price)


        let newItems = []
        this.cart.forEach(product => {
            if (product.requestedQuantity > 0) {
                newItems.push(product)
            }
        })

        this.cartStore.update(items => items = newItems)
    }

    resetExtras(product) {
        product.productExtraGroups.flatMap(eg => eg.productExtras).forEach(element => {
            element.selected = false
            element.itemCount = 0
        })
    }

}



// export default {
//     cart: {
//         items: cartstore,
//         subtotal: subtotalstore
//     },
//     addItem,
//     removeItem,
//     resetExtras
// }