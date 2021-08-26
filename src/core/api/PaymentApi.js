import {
    correlationIdStore,
    apiUrlStore,
    eventIdStore,
    ticketStore,
    cartStore,
    draftOrderStore,
    userTokenStore,
    pricedOrderStore,
    hasExpirationStore,
    draftPaymentStore,
} from '../stores'

import { DraftOrderApi } from './DraftOrderApi'
import { outOfTime } from '../timer'
import { deserializer, paymentSerializer } from './serialization'

export class PaymentApi {

    constructor() {
        apiUrlStore.subscribe((x) => (this.apiUrl = x))
        correlationIdStore.subscribe((x) => (this.correlationId = x))
        eventIdStore.subscribe((x) => (this.eventId = x))
        ticketStore.subscribe((x) => (this.tickets = x))
        cartStore.subscribe((x) => (this.cart = x))
        draftOrderStore.subscribe((x) => (this.draftOrder = x))
        userTokenStore.subscribe((x) => (this.userToken = x))
        pricedOrderStore.subscribe((x) => (this.pricedOrder = x))
        hasExpirationStore.subscribe((x) => (this.hasExpiration = x))
        draftPaymentStore.subscribe((x) => (this.draftPayment = x))
        this.draftOrderApi = new DraftOrderApi()
    }

    async createDraftPayment() {
        console.log(`createDraftPayment correlationid: ${this.correlationId} ${this.apiUrl}`);
        try {

            let b = JSON.stringify({
                data: {
                    attributes: {
                        email: this.draftOrder.ownerEmail,
                        'order-id': this.draftOrder.orderId,
                        'event-instance-id': this.eventId,
                        'order-version': this.draftOrder.orderVersion,
                    },
                    type: 'payments',
                },
            })

            console.log(`payload: ${b}`)

            let h = {
                'Content-Type': 'application/vnd.api+json',
                'Authorization': 'Bearer ' + this.userToken,
                'x-correlation-id': this.correlationId
            }

            console.log(`headers: ${h}`)

            console.log(`apiUrl: ${this.apiUrl}`)

            let response = await fetch(`${this.apiUrl}payments`, {
                method: 'POST',
                headers: h,
                body: b,
            }).catch((error) => {
                console.log(error)
                throw error
            })

            console.log('createDraftPayment back from api')

            let dp = await deserializer.deserialize(await response.json())

            console.log('deserialized response')

            draftPaymentStore.set(dp)

            console.log('returning')
            return dp
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    async getPayment() {
        console.log(`getPayment correlationid: ${this.correlationId}`);
        try {
            let draftPaymentResponse = await await fetch(
                `${this.apiUrl}payments/${this.draftPayment.id}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Bearer ' + this.userToken,
                        'x-correlation-id': this.correlationId
                    }
                }
            )

            if(draftPaymentResponse.status == 304){
                return this.draftPayment
            }

            let dp = await deserializer.deserialize(await draftPaymentResponse.json())
            draftPaymentStore.set(dp)
            return this.draftPayment
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    async updatePayment(email) {
        console.log(`updatePayment correlationid: ${this.correlationId}`);

        try {
            // refresh the draft order from the API
            // TODO: might not be needed
            //await this.draftOrderApi.getDraftOrder()

            let dp = await this.getPayment()

            clearTimeout(outOfTime)

            dp.email = email

            let response = await fetch(`${this.apiUrl}payments/${dp.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    'Authorization': 'Bearer ' + this.userToken,
                    'x-correlation-id': this.correlationId
                },
                body: JSON.stringify(await paymentSerializer.serialize(dp)),
            })

            dp = await this.getPayment()
            draftPaymentStore.set(dp)
            return dp
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    async confirmPayment(token) {
        console.log(`confirmPayment correlationid: ${this.correlationId}`);

        try {
            // refresh the draft order from the API
            // TODO: might not be needed
            //await this.draftOrderApi.getDraftOrder()

            let dp = await this.getPayment()

            clearTimeout(outOfTime)

            dp.token = token.id
            // dp.email = this.draftOrder.ownerEmail

            draftPaymentStore.set(dp)

            let response = await fetch(`${this.apiUrl}payments/${dp.id}`, {
                method: 'PATCH',

                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    'Authorization': 'Bearer ' + this.userToken,
                    'x-correlation-id': this.correlationId
                },
                body: JSON.stringify(await paymentSerializer.serialize(dp)),
            })

            dp = await this.getPayment()
            draftPaymentStore.set(dp)
            return dp
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}