import OrderComplete from './OrderComplete.svelte'
export default { title: 'OrderComplete' }


export const OrderCompleteStoryWithProps = () => ({
    Component: OrderComplete,
    props: {
        // stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
        // api: 'https://api.shop.highstreet.ly/api/v1/',
        // event: '3e990000-412a-ee9b-e228-08d8faab4e5b'
        // stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
        // api: 'https://api.shop.sonashop.xyz/api/v1/',
        // event: '628f0000-be38-06be-45aa-08d92cd503e8'
        evt: { name: 'test', supportPhone: '+1-415-555-5555', supportEmail: 'test@a.com' },
        stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
        api: 'https://api.shop.highstreetly.live/api/v1/',
        event: '744c0000-3bfb-ea3b-f8df-08d95e601284',
        order: { "eventInstanceId": "744c0000-3bfb-ea3b-f8df-08d95e601284", "ownerId": "02d49faa-fd36-4ec7-b95b-dedff9e5783f", "ownerEmail": "wayne@highstreet.ly", "totalAmount": 1070, "status": "Paid", "registrantUserId": "02d49faa-fd36-4ec7-b95b-dedff9e5783f", "createdOn": "2021-08-19T08:42:20.946818", "confirmedOn": "2021-08-19T08:42:51.234231", "humanReadableId": "2MT8Z", "isClickAndCollect": true, "isLocalDelivery": false, "makeSubscription": false, "isNationalDelivery": false, "ownerPhone": "+447508215459", "ownerName": "Wayne Douglas", "deliveryLine1": "10 FIVE OAKS WAY", "deliveryPostcode": "BN6 9ZU", "refundedDateTime": "0001-01-01T00:00:00", "refundedReason": null, "customerDispatchAdvisory": null, "pricedDateTime": "2021-08-19T08:42:37.847519", "paidDateTime": "2021-08-19T08:42:51.234231", "processingDateTime": "0001-01-01T00:00:00", "processingCompleteDateTime": "0001-01-01T00:00:00", "expiredDateTime": "0001-01-01T00:00:00", "metadata": {}, "paymentId": "809c0000-8e45-6a39-634a-08d962ed4a65", "id": "1e98ce04-d5eb-45db-94dd-d004151f2a16", "tickets": [{ "position": 0, "ticketTypeConfigurationId": "744c0000-3bfb-ea3b-334d-08d95e603bd2", "orderId": "1e98ce04-d5eb-45db-94dd-d004151f2a16", "id": "b99b0000-4fff-be4a-a1db-08d962ed54c1", "ticketTypeConfiguration": { "stringId": "744c0000-3bfb-ea3b-334d-08d95e603bd2", "eventInstanceId": "744c0000-3bfb-ea3b-f8df-08d95e601284", "name": "Eggs Florentine", "eventSlug": null, "description": "<p>It's probably quite nice</p>", "price": 1000, "freeTier": true, "quantity": 10000, "addQuantity": 0, "ticketsAvailabilityVersion": 453, "availableQuantity": 9970, "mainImageId": "event-images/ywe2zdktxal7fp49psx2", "tags": "Brunch", "group": null, "isPublished": true, "metadata": { "stripePriceId": "price_0JO0f3yZYG29K4iAhlOAtkr5", "stripeProductId": "prod_K24o1chSEcIZcc" }, "id": "744c0000-3bfb-ea3b-334d-08d95e603bd2" }, "ticketDetails": { "orderTicketId": "b99b0000-4fff-be4a-a1db-08d962ed54c1", "eventInstanceId": "744c0000-3bfb-ea3b-f8df-08d95e601284", "name": "Eggs Florentine", "displayName": "Eggs Florentine", "price": 1000, "quantity": 1, "id": "b99b0000-4fff-be4a-a200-08d962ed54c1", "productExtras": [] } }], "links": { "self": "/api/v1/orders/1e98ce04-d5eb-45db-94dd-d004151f2a16?include=tickets,tickets.ticket-details,tickets.ticket-details.product-extras,tickets.ticket-type-configuration" } }
    },
})