import {
    correlationIdStore,
    apiUrlStore,
    eventIdStore,
    ticketStore,
    cartStore,
    draftOrderStore,
    userTokenStore,
    pricedOrderStore,
    hasExpirationStore
} from '../stores'
import { deserializer } from './serialization'

let sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class PricedOrderApi {

    constructor() {
        apiUrlStore.subscribe((x) => (this.apiUrl = x))
        correlationIdStore.subscribe((x) => (this.correlationId = x))
        eventIdStore.subscribe((x) => (this.eventId = x))
        ticketStore.subscribe((x) => (this.tickets = x))
        cartStore.subscribe((x) => (this.cart = x))
        draftOrderStore.subscribe((x) => {
            this.draftOrder = x
        })
        userTokenStore.subscribe((x) => (this.userToken = x))
        pricedOrderStore.subscribe((x) => (this.pricedOrder = x))
        hasExpirationStore.subscribe((x) => (this.hasExpiration = x))
    }

    async getPricedOrder() {
        try {
            console.log(`correlationid: ${this.correlationId}`)

            let pricedOrderResponse = await fetch(
                `${this.apiUrl}priced-orders?filter[order-id]=${this.draftOrder.orderId}&include=priced-order-lines`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Bearer ' + this.userToken,
                        'x-correlation-id': this.correlationId
                    },
                }
            ).catch((error) => {
                // Your error is here!
                console.log(error)
            })

            if(!pricedOrderResponse){
                throw new Error()
            }

            let pricedOrderAwaited = await deserializer.deserialize(await pricedOrderResponse.json())
            let pricedOrderFromApi = pricedOrderAwaited[0]

            if (!pricedOrderFromApi) {
                await sleep(1000)
                return await this.getPricedOrder()
            }

            if (this.pricedOrder.orderVersion == pricedOrderFromApi.orderVersion) {
                return false
            }

            hasExpirationStore.set(true)
            pricedOrderStore.set(pricedOrderFromApi)

            return this.pricedOrder
        } catch (error) {
            console.log(error)
        }
    }
}