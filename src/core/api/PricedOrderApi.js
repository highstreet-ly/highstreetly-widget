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
        // await poll(async () => {
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
        )

        let pricedOrderAwaited = await deserializer.deserialize(await pricedOrderResponse.json())
        let pricedOrderFromApi = pricedOrderAwaited[0]

        if (this.pricedOrder.orderVersion == pricedOrderFromApi.orderVersion) {
            return false
        }

        hasExpirationStore.set(true)
        pricedOrderStore.set(pricedOrderFromApi)
        // return true
        //}, 20000, 1000)

        return this.pricedOrder
    }
}