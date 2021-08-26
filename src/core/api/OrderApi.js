import {
    correlationIdStore,
    apiUrlStore,
    draftOrderStore,
    eventIdStore,
    userTokenStore,
    ticketStore,
    eventStore,
    orderStore
} from '../stores'
import { deserializer } from './serialization'

export class OrderApi {

    constructor() {
        apiUrlStore.subscribe((x) => (this.apiUrl = x))
        correlationIdStore.subscribe((x) => (this.correlationId = x))
        eventIdStore.subscribe((x) => (this.eventId = x))
        ticketStore.subscribe((x) => (this.tickets = x))
        eventStore.subscribe((x) => (this.event = x))
        userTokenStore.subscribe((x) => (this.userToken = x))
        orderStore.subscribe((x) => (this.order = x))
        draftOrderStore.subscribe((x) => {
            this.draftOrder = x
        })
    }

    async getOrder(waitForTickets = false, idx = 0) {
        console.log(`getOrder correlationid: ${this.correlationId}`)

        try {
            let orderResponse = await fetch(
                `${this.apiUrl}orders/${this.draftOrder.orderId}?include=tickets,tickets.ticket-details,tickets.ticket-details.product-extras,tickets.ticket-type-configuration`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Bearer ' + this.userToken,
                        'x-correlation-id': this.correlationId
                    },
                }
            )

            let orderAwaited

            if (orderResponse.status == 304) {
                orderAwaited = this.order
            } else {
                orderAwaited = await deserializer.deserialize(await orderResponse.json())
                orderStore.set(orderAwaited)
            }

            if (waitForTickets && this.order) {
                while (!this.order.tickets || this.order.tickets.length < 1) {

                    if (idx > 0) {
                        // dont ddos
                        console.log(`dont ddos ${idx}`)
                        await this.sleep(1000)
                    }
                    idx = idx + 1

                    await this.getOrder(waitForTickets, idx)
                }
            }

            return this.order
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}