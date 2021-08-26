import {
    draftOrderStore,
    draftPaymentStore,
    correlationIdStore,
    apiUrlStore,
    userTokenStore,
    eventIdStore,
    stripeKeyStore,
    cartStore,
    pricedOrderStore,
    eventStore
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
        eventStore.subscribe((x) => (this.eventInstance = x))

        this.pricedOrderApi = new PricedOrderApi()
    }

    async getDraftOrder() {
        console.log(`getDraftOrder correlationid: ${this.correlationId}`)
        try {
            let h = {
                'Content-Type': 'application/vnd.api+json',
                'Authorization': 'Bearer ' + this.userToken,
                'x-correlation-id': this.correlationId
            }

            if (this.etag) {
                h['If-None-Match'] = this.etag
            }

            let response = await fetch(`${this.apiUrl}draft-orders/${this.draftOrder.id}?include=draft-order-items.ticket.product-extras`, {
                method: 'GET',
                headers: h
            })

            let drord

            if (response.status == 304) {
                console.log('getDraftOrder server responded 304 - re-using existing model')
                drord = this.draftOrder
            } else {
                drord = await deserializer.deserialize(await response.json())
                draftOrderStore.set(drord)
                console.log(`getDraftOrder setting etag ${response.headers.get('etag')}`)
                this.etag = response.headers.get('etag')
            }

            return drord
        } catch (e) {
            console.log(e)
            throw e
        }

    }

    async createDraftOrder() {
        console.log(`createDraftOrder correlationid: ${this.correlationId}`)

        try {

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
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    linkParentChild(parent, child, relationshipName, parentLid, childLid) {
        let result = {
            "op": "update",
            "description": `link ${child.data.type} to ${parent.data.type}`,
            "ref": {
                "type": parent.data.type,
                "relationship": relationshipName
            },
            "data": {
                "type": child.data.type
            }
        }

        if (parentLid) {
            result.ref.lid = parent.data.id
        } else {
            result.ref.id = parent.data.id
        }

        if (childLid) {
            result.data.lid = child.data.id
        } else {
            result.data.id = child.data.id
        }

        return result
    }

    addToOneObject(object, relationships) {
        let rel = {}
        let result = {
            "op": "add",
            "data": {
                "type": object.data.type,
                "attributes": object.data.attributes,
                "lid": object.data.id,
            },
            "description": `create ${object.data.type}`
        }

        if (relationships) {
            relationships.forEach(parent => {
                if (parent) {
                    let relParent = {
                        data: {
                            type: parent.item.data.type
                        }
                    }

                    if (parent.useLid) {
                        relParent.data.lid = parent.item.data.id
                    } else {
                        relParent.data.id = parent.item.data.id
                    }

                    rel[parent.relationshipName] = relParent
                }
            })

            result.data.relationships = rel
        }
        return result
    }

    async setDeliveryMethod(validationFunc) {
        await this._issueCommand('SetDeliveryMethod', validationFunc)
    }

    // todo: validation func
    async assignRegistrant(command) {
        await this._issueCommand('AssignRegistrant', true)
    }

    async _issueCommand(command, validationFunc) {
        console.log(`_issueCommand correlationid: ${this.correlationId}`)

        try {
            let draftOrderJsonObject = draftOrderSerializer.serialize(this.draftOrder)
            let draftOrderJson = JSON.stringify(draftOrderJsonObject)

            await fetch(
                `${this.apiUrl}draft-orders/${draftOrderJsonObject.data.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Bearer ' + this.userToken,
                        'x-correlation-id': this.correlationId,
                        'Command-Type': command
                    },
                    body: draftOrderJson
                }
            );

            let idx = 0

            if (validationFunc) {
                console.log(`priced order: ${this.pricedOrder.pricedOrderLines.length}`)
                console.log(`priced order version ${this.pricedOrder.orderVersion}`)
                
                // while (!this.pricedOrder.pricedOrderLines || this.pricedOrder.pricedOrderLines.length < 1) {
                while (!validationFunc(this.pricedOrder)) {
                    if (idx > 0) {
                        // dont ddos
                        console.log(`dont ddos ${idx}`)
                        console.log(`priced order version ${this.pricedOrder.orderVersion}`)
                        await this.sleep(1000)
                    }
                    await this.pricedOrderApi.getPricedOrder()
                    console.log(` this.pricedOrder.version: ${this.pricedOrder.orderVersion}`)
                    idx = idx + 1
                }
            }

            await this.getDraftOrder()
        } catch (e) {
            console.log(e)
            throw e
        }
    }

    async commitOrder() {
        console.log(`commitOrder correlationid: ${this.correlationId}`)
        try {
            // construct the atomic payload 
            let operations = []

            //serialize the draft-order
            let draftOrderJsonObject = draftOrderSerializer.serialize(this.draftOrder)

            // save the draft order itemz!
            this.cart.forEach(t => {

                let doiid = this.uuidv4()
                let doi = {
                    id: doiid,
                    ticketType: t.ticketType,
                    requestedTickets: t.requestedQuantity,
                    draftOrderId: draftOrderJsonObject.data.id
                }

                let draftOrderItemJsonObject = draftOrderItemSerializer.serialize(doi)

                operations.push(this.addToOneObject(draftOrderItemJsonObject, [{
                    item: draftOrderJsonObject,
                    useLid: false,
                    relationshipName: "draft-order"
                }]))

                let ticketDetails = {
                    id: this.uuidv4(),
                    description: t.description,
                    name: t.name,
                    price: t.price,
                    quantity: t.requestedQuantity,
                    displayName: t.displayName,
                    eventInstanceId: this.eventId
                }

                let ticketDetailsJsonObject = ticketDetailsSerializer.serialize(ticketDetails)
                operations.push(this.addToOneObject(ticketDetailsJsonObject))

                operations.push(this.linkParentChild(draftOrderItemJsonObject, ticketDetailsJsonObject, "ticket", true, true))

                for (let i = 0; i < t.productExtras.length; i++) {
                    let extra = t.productExtras[i]
                    extra.referenceProductExtraId = extra.id
                    extra.id = this.uuidv4()
                    let productExtraJsonObject = productExtraSerializer.serialize(extra)

                    operations.push(this.addToOneObject(productExtraJsonObject, [{
                        item: ticketDetailsJsonObject,
                        useLid: true,
                        relationshipName: "order-ticket-details"
                    }]))
                }
            })

            let payload = {
                "atomic:operations": operations
            }

            let payloadJson = JSON.stringify(payload)

            let operationHeaders = {
                'Content-Type': 'application/vnd.api+json; ext="https://jsonapi.org/ext/atomic"',
                'Authorization': 'Bearer ' + this.userToken,
                'x-correlation-id': this.correlationId,
            };

            await fetch(
                `${this.apiUrl}reservations/operations`,
                {
                    method: 'POST',
                    headers: operationHeaders,
                    body: payloadJson
                }
            );

            let draftOrderJson = JSON.stringify(draftOrderJsonObject)

            await fetch(
                `${this.apiUrl}draft-orders/${draftOrderJsonObject.data.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Bearer ' + this.userToken,
                        'x-correlation-id': this.correlationId,
                        'Command-Type': 'AddTicketsToBasket'
                    },
                    body: draftOrderJson
                }
            );

            await this.getDraftOrder(false, true, 'ReservationCompleted')

            await fetch(
                `${this.apiUrl}draft-orders/${draftOrderJsonObject.data.id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': 'Bearer ' + this.userToken,
                        'x-correlation-id': this.correlationId,
                        'Command-Type': 'CommitOrder'
                    },
                    body: draftOrderJson
                }
            );
        } catch (e) {
            console.log(e)
            throw e
        }
    }
}