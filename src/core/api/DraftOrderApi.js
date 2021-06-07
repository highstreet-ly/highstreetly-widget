import {
    draftOrderStore,
    draftPaymentStore,
    correlationIdStore,
    apiUrlStore,
    userTokenStore,
    eventIdStore,
    stripeKeyStore,
    cartStore,
    pricedOrderStore
} from '../stores'

import {
    deserializer,
    draftOrderSerializer,
    draftOrderItemSerializer,
    productExtraSerializer,
    ticketDetailsSerializer
} from './serialization'

import { PricedOrderApi } from './PricedOrderApi'

export class DraftOrderApi {

    constructor() {
        apiUrlStore.subscribe((x) => (this.apiUrl = x))
        draftOrderStore.subscribe((x) => (this.draftOrder = x))
        correlationIdStore.subscribe((x) => (this.correlationId = x))
        draftPaymentStore.subscribe((x) => (this.draftPayment = x))
        userTokenStore.subscribe((x) => (this.userToken = x))
        eventIdStore.subscribe((x) => (this.eventId = x))
        stripeKeyStore.subscribe((x) => (this.stripeKey = x))
        cartStore.subscribe((x) => (this.cart = x))
        pricedOrderStore.subscribe((x) => (this.pricedOrder = x))
        this.pricedOrderApi = new PricedOrderApi()
    }

    async getDraftOrder(waitForVersionIncrement = false, waitForState = false, state, idx = 0) {

        waitForVersionIncrement = false
        console.log(`correlationid: ${this.correlationId}`)

        let response = await fetch(`${this.apiUrl}draft-orders/${this.draftOrder.id}?include=draft-order-items.ticket.product-extras`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/vnd.api+json',
                'Authorization': 'Bearer ' + this.userToken,
                'x-correlation-id': this.correlationId
            }
        })

        let drord = await deserializer.deserialize(await response.json())
        console.log(`draft-order-version ${drord.orderVersion}`)

        if (waitForVersionIncrement && this.draftOrder) {
            while (this.draftOrder.orderVersion == drord.orderVersion) {
                console.log(` this.draftOrder.version: ${drord.orderVersion}`)
                if (idx > 0) {
                    // dont ddos
                    console.log(`dont ddos ${idx}`)
                    await this.sleep(1000)
                }
                idx = idx + 1
                await this.getDraftOrder(waitForVersionIncrement, waitForState = false, state, idx)


            }
        }
        console.log(`start this.draftOrder.state: ${this.draftOrder.state}`)
        console.log(`start state: ${state}`)

        draftOrderStore.set(drord);

        if (waitForState && this.draftOrder) {
            while (this.draftOrder.state != state) {
                console.log(` this.draftOrder.state: ${this.draftOrder.state}`)
                console.log(` state: ${state}`)
                if (idx > 0) {
                    // dont ddos
                    console.log(`dont ddos ${idx}`)
                    await this.sleep(1000)
                }
                idx = idx + 1

                await this.getDraftOrder(waitForVersionIncrement, waitForState, state, idx)
            }
        }


    }

    async createDraftOrder() {
        console.log(`correlationid: ${this.correlationId}`)
        let response = await fetch(`${this.apiUrl}draft-orders`, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/vnd.api+json',
                'x-correlation-id': this.correlationId
            },
            body: JSON.stringify({
                data: {
                    attributes: {
                        'event-instance-id': this.eventId,
                    },
                    type: 'draft-orders',
                },
            }),
        });

        let json = await response.json();
        let drord = await deserializer.deserialize(json);

        console.log(`draft-order-version ${drord.orderVersion}`)

        userTokenStore.set(drord.userToken)

        draftOrderStore.set(drord);
    }

    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    async updateBasketItem(t) {
        if (
            t.requestedQuantity &&
            t.requestedQuantity > 0
        ) {
            let doi = t.apiItem;
            doi.requestedTickets = t.requestedQuantity;
            let doiJsonObject = draftOrderItemSerializer.serialize(doi)
            let doiJson = JSON.stringify(doiJsonObject)

            await fetch(
                `${this.apiUrl}draft-order-items/${doi.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Bearer ' + this.userToken,
                        'x-correlation-id': this.correlationId,
                        'Command-Type': 'AddTicketsToBasket'
                    },
                    body: doiJson
                }
            );

            await this.getDraftOrder()

            return doi;
        }
    }

    async addBasketItem(t) {
        if (
            t.requestedQuantity &&
            t.requestedQuantity > 0
        ) {
            let doiid = this.uuidv4()
            // save the draft order item!
            let doi = {
                id: doiid,
                ticketType: t.ticketType,
                draftOrderId: this.draftOrder.id,
                requestedTickets: t.requestedQuantity,
            }

            let doiJsonObject = draftOrderItemSerializer.serialize(doi)
            let doiJson = JSON.stringify(doiJsonObject)

            await fetch(
                `${this.apiUrl}draft-order-items`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Bearer ' + this.userToken,
                        'x-correlation-id': this.correlationId
                    },
                    body: doiJson
                }
            );

            // save the ticket details
            let ticketDetails = {
                id: this.uuidv4(),
                description: t.description,
                name: t.name,
                price: t.price,
                quantity: t.requestedQuantity,
                eventInstanceId: this.eventId,
                // productExtras: t.productExtras,
                displayName: t.displayName,
                draftOrder: this.draftOrder,
                draftOrderItem: doi
            }
            let tdJsonObject = ticketDetailsSerializer.serialize(ticketDetails)
            let tdJson = JSON.stringify(tdJsonObject)

            await fetch(
                `${this.apiUrl}r/ticket-details`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Bearer ' + this.userToken,
                        'x-correlation-id': this.correlationId
                    },
                    body: tdJson
                }
            );

            // save the product extra
            for (let i = 0; i < t.productExtras.length; i++) {
                let extra = t.productExtras[i]
                extra.referenceProductExtraId = extra.id
                extra.id = this.uuidv4()
                extra.orderTicketDetails = ticketDetails
                let peJsonObject = productExtraSerializer.serialize(extra)
                let peJson = JSON.stringify(peJsonObject)

                await fetch(
                    `${this.apiUrl}r/product-extras`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/vnd.api+json',
                            'Authorization': 'Bearer ' + this.userToken,
                            'x-correlation-id': this.correlationId
                        },
                        body: peJson
                    }
                );
            }

            await fetch(
                `${this.apiUrl}draft-order-items/${doi.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Bearer ' + this.userToken,
                        'x-correlation-id': this.correlationId,
                        'Command-Type': 'AddTicketsToBasket'
                    },
                    body: doiJson
                }
            );

            await this.getDraftOrder()

            return doi;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    async updateDraftOrder(command, waitForPricedOrder = false, waitForState = false, state) {

        //fetch the po so we have the order version pre-update
        await this.pricedOrderApi.getPricedOrder()

        let doJsonObject = draftOrderSerializer.serialize(this.draftOrder)
        let doJson = JSON.stringify(doJsonObject)
        let headers = {
            'Content-Type': 'application/vnd.api+json',
            'Authorization': 'Bearer ' + this.userToken,
            'x-correlation-id': this.correlationId,
        };

        if (command) {
            headers['Command-Type'] = command
        }

        await fetch(
            `${this.apiUrl}draft-orders/${this.draftOrder.orderId}`,
            {
                method: 'PATCH',
                headers: headers,
                body: doJson
            }
        );

        let currentPricedOrderVersion = this.pricedOrder.orderVersion

        console.log(`currentPricedOrderVersion: ${currentPricedOrderVersion}`)

        await this.pricedOrderApi.getPricedOrder()

        console.log(` this.pricedOrder.version: ${this.pricedOrder.orderVersion}`)

        let idx = 0

        if (waitForPricedOrder) {
            console.log(`priced order:`)
            console.log(`priced order: ${this.pricedOrder.pricedOrderLines.length}`)
            console.log(` ${this.pricedOrder}`)
            while (!this.pricedOrder.pricedOrderLines || this.pricedOrder.pricedOrderLines.length < 1) {
                if (idx > 0) {
                    // dont ddos
                    console.log(`dont ddos ${idx}`)
                    await this.sleep(1000)
                }
                await this.pricedOrderApi.getPricedOrder()
                console.log(` this.pricedOrder.version: ${this.pricedOrder.orderVersion}`)
                idx = idx + 1
            }
        }

        await this.getDraftOrder(false, waitForState, state)

        this.draftOrder.reservationExpirationDate = this.pricedOrder.reservationExpirationDate

        console.log(`draft-order-version ${this.draftOrder.orderVersion}`)
    }
}