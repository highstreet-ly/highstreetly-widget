import {
    correlationIdStore,
    groupedTicketStore,
    apiUrlStore,
    eventIdStore,
    ticketStore,
    eventStore
} from '../stores'
import { deserializer, draftOrderSerializer } from './serialization'

export class EventInstanceApi {

    constructor() {
        apiUrlStore.subscribe((x) => (this.apiUrl = x))
        correlationIdStore.subscribe((x) => (this.correlationId = x))
        eventIdStore.subscribe((x) => (this.eventId = x))
        ticketStore.subscribe((x) => (this.tickets = x))
        eventStore.subscribe((x) => (this.event = x))
    }

    async getEvent() {
        console.log(`correlationid: ${this.correlationId}`);
        const response = await fetch(`${this.apiUrl}event-instances/${this.eventId}`, {
          method: 'GET',
          headers: {
            'x-correlation-id': this.correlationId
          }
        });
      
        var evt = await deserializer.deserialize(await response.json())
      
        eventStore.set(evt);
        return evt;
    }
}