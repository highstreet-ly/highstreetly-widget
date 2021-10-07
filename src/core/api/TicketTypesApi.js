import {
    correlationIdStore,
    apiUrlStore,
    eventIdStore,
    ticketStore,
    cartStore,
    draftOrderStore,
    eventStore
} from '../stores'
import { deserializer } from './serialization'
import groupByArray from '../groupByArray'

export class TicketTypesApi {

    constructor() {
        eventStore.subscribe(e => { this.event = e })
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

            let url

            if (this.event.isStockManaged) {
                url = `${this.apiUrl}product-categories?include=ticket-types.product-extra-groups.product-extras,ticket-types.images&filter=expr:equals(event-instance-id,'${this.eventId}')&filter[ticket-types]=expr:and(greaterThan(available-quantity,'0'),equals(is-published,'true'))&sort=sort-order&sort[ticket-types]=sort-order`

            } else {
                url = `${this.apiUrl}product-categories?include=ticket-types.product-extra-groups.product-extras,ticket-types.images&filter=expr:equals(event-instance-id,'${this.eventId}')&filter[ticket-types]=expr:equals(is-published,'true')&sort=sort-order&sort[ticket-types]=sort-order`
            }

            const response = await fetch(
                url,
                {
                    method: 'GET',
                }
            )

            let result = await deserializer.deserialize(await response.json())

            var correlationId = response.headers.get('x-correlation-id')
            console.log(`setting correlationid: ${correlationId}`)
            correlationIdStore.set(correlationId)

            ticketStore.set(result)

            return result


        } catch (e) {
            console.log(e)
            throw e
        }
    }
}