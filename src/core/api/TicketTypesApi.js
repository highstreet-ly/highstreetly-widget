import {
    correlationIdStore,
    groupedTicketStore,
    apiUrlStore,
    eventIdStore,
    ticketStore,
    cartStore,
    draftOrderStore
} from '../stores'
import { deserializer } from './serialization'
import groupByArray from '../groupByArray'

export class TicketTypesApi {

    constructor() {
        apiUrlStore.subscribe((x) => (this.apiUrl = x))
        correlationIdStore.subscribe((x) => (this.correlationId = x))
        eventIdStore.subscribe((x) => (this.eventId = x))
        ticketStore.subscribe((x) => (this.tickets = x))
        cartStore.subscribe((x) => (this.cart = x))
        draftOrderStore.subscribe((x) => (this.draftOrder = x))
    }


    async getTicketsForEvent() {
        console.log(`correlationid: ${this.correlationId}`)
        try {

            const response = await fetch(
                `${this.apiUrl}ticket-types?include=product-extra-groups,product-extra-groups.product-extras,images&filter=expr:and(equals(event-instance-id,'${this.eventId}'),greaterThan(available-quantity,'0'),equals(is-published,'true'))`,
                {
                    method: 'GET',
                }
            )

            let result = await deserializer.deserialize(await response.json())

            var correlationId = response.headers.get('x-correlation-id')
            console.log(`setting correlationid: ${correlationId}`)
            correlationIdStore.set(correlationId)

            ticketStore.set(result)
            groupedTicketStore.set(groupByArray(result, 'tags'))

        } catch (e) {
            console.log(e)
            throw e
        }
    }
}