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

        stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
        api: 'https://api.shop.highstreetly.live/api/v1/',
        event: '744c0000-3bfb-ea3b-f8df-08d95e601284',
        order: {
            "meta": {
                "copyright": "Copyright (C) 2021 Sonaticket ltd.",
                "Backend-Version": "Version v2.0.337"
            },
            "links": {
                "self": "/api/v1/orders/1e98ce04-d5eb-45db-94dd-d004151f2a16?include=tickets,tickets.ticket-details,tickets.ticket-details.product-extras,tickets.ticket-type-configuration"
            },
            "data": {
                "type": "orders",
                "id": "1e98ce04-d5eb-45db-94dd-d004151f2a16",
                "attributes": {
                    "event-instance-id": "744c0000-3bfb-ea3b-f8df-08d95e601284",
                    "owner-id": "02d49faa-fd36-4ec7-b95b-dedff9e5783f",
                    "owner-email": "wayne@highstreet.ly",
                    "total-amount": 1070.00,
                    "status": "Paid",
                    "registrant-user-id": "02d49faa-fd36-4ec7-b95b-dedff9e5783f",
                    "created-on": "2021-08-19T08:42:20.946818",
                    "confirmed-on": "2021-08-19T08:42:51.234231",
                    "human-readable-id": "2MT8Z",
                    "is-click-and-collect": true,
                    "is-local-delivery": false,
                    "make-subscription": false,
                    "is-national-delivery": false,
                    "owner-phone": "+447508215459",
                    "owner-name": ", Wayne Douglas",
                    "delivery-line1": "10 FIVE OAKS WAY",
                    "delivery-postcode": "BN6 9ZU",
                    "refunded-date-time": "0001-01-01T00:00:00",
                    "refunded-reason": null,
                    "customer-dispatch-advisory": null,
                    "priced-date-time": "2021-08-19T08:42:37.847519",
                    "paid-date-time": "2021-08-19T08:42:51.234231",
                    "processing-date-time": "0001-01-01T00:00:00",
                    "processing-complete-date-time": "0001-01-01T00:00:00",
                    "expired-date-time": "0001-01-01T00:00:00",
                    "metadata": {},
                    "payment-id": "809c0000-8e45-6a39-634a-08d962ed4a65"
                },
                "relationships": {
                    "tickets": {
                        "links": {
                            "self": "/api/v1/orders/1e98ce04-d5eb-45db-94dd-d004151f2a16/relationships/tickets",
                            "related": "/api/v1/orders/1e98ce04-d5eb-45db-94dd-d004151f2a16/tickets"
                        },
                        "data": [
                            {
                                "type": "order-tickets",
                                "id": "b99b0000-4fff-be4a-a1db-08d962ed54c1"
                            }
                        ]
                    }
                },
                "links": {
                    "self": "/api/v1/orders/1e98ce04-d5eb-45db-94dd-d004151f2a16"
                }
            },
            "included": [
                {
                    "type": "order-tickets",
                    "id": "b99b0000-4fff-be4a-a1db-08d962ed54c1",
                    "attributes": {
                        "position": 0,
                        "ticket-type-configuration-id": "744c0000-3bfb-ea3b-334d-08d95e603bd2",
                        "order-id": "1e98ce04-d5eb-45db-94dd-d004151f2a16"
                    },
                    "relationships": {
                        "ticket-type-configuration": {
                            "links": {
                                "self": "/api/v1/order-tickets/b99b0000-4fff-be4a-a1db-08d962ed54c1/relationships/ticket-type-configuration",
                                "related": "/api/v1/order-tickets/b99b0000-4fff-be4a-a1db-08d962ed54c1/ticket-type-configuration"
                            },
                            "data": {
                                "type": "ticket-type-configurations",
                                "id": "744c0000-3bfb-ea3b-334d-08d95e603bd2"
                            }
                        },
                        "ticket-details": {
                            "links": {
                                "self": "/api/v1/order-tickets/b99b0000-4fff-be4a-a1db-08d962ed54c1/relationships/ticket-details",
                                "related": "/api/v1/order-tickets/b99b0000-4fff-be4a-a1db-08d962ed54c1/ticket-details"
                            },
                            "data": {
                                "type": "ticket-details",
                                "id": "b99b0000-4fff-be4a-a200-08d962ed54c1"
                            }
                        },
                        "order": {
                            "links": {
                                "self": "/api/v1/order-tickets/b99b0000-4fff-be4a-a1db-08d962ed54c1/relationships/order",
                                "related": "/api/v1/order-tickets/b99b0000-4fff-be4a-a1db-08d962ed54c1/order"
                            }
                        }
                    },
                    "links": {
                        "self": "/api/v1/order-tickets/b99b0000-4fff-be4a-a1db-08d962ed54c1"
                    }
                },
                {
                    "type": "ticket-details",
                    "id": "b99b0000-4fff-be4a-a200-08d962ed54c1",
                    "attributes": {
                        "order-ticket-id": "b99b0000-4fff-be4a-a1db-08d962ed54c1",
                        "event-instance-id": "744c0000-3bfb-ea3b-f8df-08d95e601284",
                        "name": "Eggs Florentine",
                        "display-name": "Eggs Florentine",
                        "price": 1000.00,
                        "quantity": 1
                    },
                    "relationships": {
                        "order-ticket": {
                            "links": {
                                "self": "/api/v1/ticket-details/b99b0000-4fff-be4a-a200-08d962ed54c1/relationships/order-ticket",
                                "related": "/api/v1/ticket-details/b99b0000-4fff-be4a-a200-08d962ed54c1/order-ticket"
                            }
                        },
                        "product-extras": {
                            "links": {
                                "self": "/api/v1/ticket-details/b99b0000-4fff-be4a-a200-08d962ed54c1/relationships/product-extras",
                                "related": "/api/v1/ticket-details/b99b0000-4fff-be4a-a200-08d962ed54c1/product-extras"
                            },
                            "data": []
                        }
                    },
                    "links": {
                        "self": "/api/v1/ticket-details/b99b0000-4fff-be4a-a200-08d962ed54c1"
                    }
                },
                {
                    "type": "ticket-type-configurations",
                    "id": "744c0000-3bfb-ea3b-334d-08d95e603bd2",
                    "attributes": {
                        "string-id": "744c0000-3bfb-ea3b-334d-08d95e603bd2",
                        "event-instance-id": "744c0000-3bfb-ea3b-f8df-08d95e601284",
                        "name": "Eggs Florentine",
                        "event-slug": null,
                        "description": "<p>It's probably quite nice</p>",
                        "price": 1000.00,
                        "free-tier": true,
                        "quantity": 10000,
                        "add-quantity": 0,
                        "tickets-availability-version": 453,
                        "available-quantity": 9970,
                        "main-image-id": "event-images/ywe2zdktxal7fp49psx2",
                        "tags": "Brunch",
                        "group": null,
                        "is-published": true,
                        "metadata": {
                            "stripe-price-id": "price_0JO0f3yZYG29K4iAhlOAtkr5",
                            "stripe-product-id": "prod_K24o1chSEcIZcc"
                        }
                    },
                    "relationships": {
                        "images": {
                            "links": {
                                "self": "/api/v1/ticket-type-configurations/744c0000-3bfb-ea3b-334d-08d95e603bd2/relationships/images",
                                "related": "/api/v1/ticket-type-configurations/744c0000-3bfb-ea3b-334d-08d95e603bd2/images"
                            }
                        },
                        "product-extra-groups": {
                            "links": {
                                "self": "/api/v1/ticket-type-configurations/744c0000-3bfb-ea3b-334d-08d95e603bd2/relationships/product-extra-groups",
                                "related": "/api/v1/ticket-type-configurations/744c0000-3bfb-ea3b-334d-08d95e603bd2/product-extra-groups"
                            }
                        }
                    },
                    "links": {
                        "self": "/api/v1/ticket-type-configurations/744c0000-3bfb-ea3b-334d-08d95e603bd2"
                    }
                }
            ]
        }
    },
})
