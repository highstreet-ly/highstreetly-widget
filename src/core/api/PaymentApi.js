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
        console.log(`correlationid: ${this.correlationId}`);
        try {

            let response = await fetch(`${this.apiUrl}payments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/vnd.api+json',
                    'Authorization': 'Bearer ' + this.userToken,
                    'x-correlation-id': this.correlationId
                },
                body: JSON.stringify({
                    data: {
                        attributes: {
                            email: this.draftOrder.ownerEmail,
                            'order-id': this.draftOrder.orderId,
                            'event-instance-id': this.eventId,
                            'order-version': this.draftOrder.orderVersion,
                        },
                        type: 'payments',
                    },
                }),
            }).catch((error) => {
                console.log(error)
            })

            let dp = await deserializer.deserialize(await response.json())

            draftPaymentStore.set(dp)
            return dp
        } catch (e) {
            console.log(e)
        }
    }
    
    async getPayment(){
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

        let dp  = await deserializer.deserialize(await draftPaymentResponse.json())
        draftPaymentStore.set(dp)
        return dp
    }

    async updatePayment(email) {
        console.log(`correlationid: ${this.correlationId}`);

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
    }

    async confirmPayment(token) {
        console.log(`correlationid: ${this.correlationId}`);

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
    }
}