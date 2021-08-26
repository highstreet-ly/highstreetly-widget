import {
    correlationIdStore,
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
        console.log(`getEvent correlationid: ${this.correlationId}`)
        try {
            let h = {
                'x-correlation-id': this.correlationId
            }

            if(this.etag){
                h['If-None-Match'] =  this.etag
             }

            const response = await fetch(`${this.apiUrl}event-instances/${this.eventId}`, {
                method: 'GET',
                headers: h
            })

            if (response.status != 304) {
                console.log(`getEvent setting etag ${response.headers.get('etag')}`)
                this.etag = response.headers.get('etag')
                var evt = await deserializer.deserialize(await response.json())
                eventStore.set(evt)
            }else{
                console.log('getEvent server responded 304 - re-using existing model')
            }

            return this.event

        } catch (e) {
            console.log(e)
            throw e
        }
    }
}