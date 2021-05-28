import {
    correlationIdStore,
    groupedTicketStore,
    apiUrlStore,
    draftOrderStore,
    eventIdStore,
    userTokenStore,
    ticketStore,
    eventStore
} from '../stores'
import { deserializer, draftOrderSerializer } from './serialization'

export class OrderApi {

    constructor() {
        apiUrlStore.subscribe((x) => (this.apiUrl = x))
        correlationIdStore.subscribe((x) => (this.correlationId = x))
        eventIdStore.subscribe((x) => (this.eventId = x))
        ticketStore.subscribe((x) => (this.tickets = x))
        eventStore.subscribe((x) => (this.event = x))
        userTokenStore.subscribe((x) => (this.userToken = x))
        draftOrderStore.subscribe((x) => {
            this.draftOrder = x
        })
    }

    async getOrder() {
        console.log(`correlationid: ${this.correlationId}`)
        let orderResponse = await fetch(
            `${this.apiUrl}orders/${this.draftOrder.orderId}&include=tickets`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    'Authorization': 'Bearer ' + this.userToken,
                    'x-correlation-id': this.correlationId
                },
            }
        )

        let orderAwaited = await deserializer.deserialize(await orderResponse.json())
        let orderFromApi = orderAwaited[0]

        orderStore.set(orderFromApi)

        return this.order
    }
}