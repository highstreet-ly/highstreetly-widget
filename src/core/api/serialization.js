import { Deserializer, Serializer } from 'jsonapi-serializer'

const deserializer = new Deserializer({
    keyForAttribute: 'camelCase'
});

const paymentSerializer = new Serializer('payments', {
    attributes: [
        'email',
        'orderId',
        'eventInstanceId',
        'orderVersion'
    ]
})

// these are embeded jsonb docs so no ref attr
const productExtraSerializer = new Serializer('product-extras', {
    keyForAttribute: 'kebab-case',
    attributes: [
        'description',
        'itemCount',
        'name',
        'price',
        'selected',
        'orderTicketDetails',
        'referenceProductExtraId'
    ],
    typeForAttribute: function (type) {
        if (type === 'orderTicketDetails') { return 'ticket-details'; }
        return undefined;
    },
    orderTicketDetails:{
        ref: 'id',
    }
})

const ticketDetailsSerializer = new Serializer('ticket-details', {
    keyForAttribute: 'kebab-case',
    attributes: [
        'description',
        'price',
        'name',
        'quantity',
        'eventInstanceId',
        'displayName',
        'productExtras',
        'draftOrder',
        'draftOrderItem',
    ],
    typeForAttribute: function (type) {
        if (type === 'draftOrder') { return 'draft-orders'; }
        if (type === 'draftOrderItem') { return 'draft-order-items'; }
        return undefined;
    },
    draftOrder:{
        ref: 'id',
    },
    draftOrderItem:{
        ref: 'id',
    }
})

const draftOrderItemSerializer = new Serializer('draft-order-items', {
    attributes: [
        'ticketType',
        'requestedTickets',
        'draftOrderId',
        'ticket'
    ],

    keyForAttribute: 'kebab-case',
})

const draftOrderSerializer = new Serializer('draft-orders', {
    attributes: [
        'deliveryLine1',
        'deliveryPostcode',
        'draftOrderItems',
        'eventInstanceId',
        'humanReadableId',
        'isClickAndCollect',
        'isLocalDelivery',
        'isNationalDelivery',
        'orderId',
        'orderVersion',
        'ownerEmail',
        'ownerId',
        'ownerName',
        'ownerPhone',
        'reservationExpirationDate',
        'state',
        'stateValue',
        'userToken'
    ],
    keyForAttribute: 'kebab-case',
    typeForAttribute: function (type) {
        if (type === 'draftOrderItems') { return 'draft-order-items'; }
        return undefined;
    },
    draftOrderItems: {
        ref: 'id',
        attributes: [
            'ticketType',
            'requestedTickets',
            'draftOrderId',
            'ticket'
        ]
    }
});

const pricedOrderSerializer = new Serializer('priced-orders', {
    attributes: [
        'orderId',
        'orderVersion',
        'total',
        'isFreeOfCharge',
        'isLocalDelivery',
        'isNationalDelivery',
        'reservationExpirationDate',
        'ownerId',
        'paymentPlatformFees',
        'platformFees',
        'orderIsPriced',
        'humanReadableId',
        'deliveryFees',
        'metaData',
        'pricedOrderLines'
    ],
    keyForAttribute: 'kebab-case',
    typeForAttribute: function (type) {
        if (type === 'pricedOrderLines') { return 'priced-order-lines'; }
        return undefined;
    },
    draftOrderItems: {
        ref: 'id',
        attributes: [
            'position',
            'description',
            'unitPrice',
            'quantity',
            'lineTotal',
            'productExtras',
            'name',
        ]
    }
});

export {
    deserializer,
    paymentSerializer,
    draftOrderSerializer,
    pricedOrderSerializer,
    draftOrderItemSerializer,
    productExtraSerializer,
    ticketDetailsSerializer
}
