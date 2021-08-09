import {
    correlationIdStore,
    groupedTicketStore,
    apiUrlStore,
    eventIdStore,
    ticketStore,
    userTokenStore,
    cartStore,
    draftOrderStore,
    subscribablesStore
} from '../stores'
import { deserializer } from './serialization'

export class SubscribableApi {

    constructor() {
        apiUrlStore.subscribe((x) => (this.apiUrl = x))
        correlationIdStore.subscribe((x) => (this.correlationId = x))
        eventIdStore.subscribe((x) => (this.eventId = x))
        ticketStore.subscribe((x) => (this.tickets = x))
        cartStore.subscribe((x) => (this.cart = x))
        draftOrderStore.subscribe((x) => (this.draftOrder = x))
        userTokenStore.subscribe((x) => (this.userToken = x))
    }


    async getSubscribableForEvent() {
        console.log(`correlationid: ${this.correlationId}`)
        try {

            const response = await fetch(
                `${this.apiUrl}plans?include=ticket-types,ticket-types.product-extra-groups&filter=expr:equals(event-instance-id,'${this.eventId}')`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Bearer ' + this.userToken,
                        'x-correlation-id': this.correlationId
                    },
                }
            )

            let result = await deserializer.deserialize(await response.json())

            subscribablesStore.set(result);
            return result;

        } catch (e) {
            console.log(e)
            throw e
        }
    }
}