import PersonalInfo from './PersonalInfo.svelte'
import {
    deserializer
} from '../core/api/serialization'
export default { title: 'PersonalInfo' }

let pricedOrderJson = {
    "meta": {
      "copyright": "Copyright (C) 2021 Sonaticket ltd.",
      "Backend-Version": "Version v2.0.337",
      "total-resources": 1
    },
    "links": {
      "self": "/api/v1/priced-orders?filter[order-id]=c84098e8-d747-4189-bbb8-ed8325bbd60d&include=priced-order-lines",
      "first": "/api/v1/priced-orders?filter[order-id]=c84098e8-d747-4189-bbb8-ed8325bbd60d&include=priced-order-lines",
      "last": "/api/v1/priced-orders?filter[order-id]=c84098e8-d747-4189-bbb8-ed8325bbd60d&include=priced-order-lines"
    },
    "data": [
      {
        "type": "priced-orders",
        "id": "3fdb2416-6e4b-45a0-b1b0-b91832a4b319",
        "attributes": {
          "order-id": "c84098e8-d747-4189-bbb8-ed8325bbd60d",
          "total": 1070.00,
          "order-version": 7,
          "is-free-of-charge": false,
          "is-local-delivery": false,
          "is-national-delivery": false,
          "make-subscription": false,
          "reservation-expiration-date": "2021-08-19T10:46:56.243501",
          "owner-id": "00000000-0000-0000-0000-000000000000",
          "payment-platform-fees": 20.00,
          "platform-fees": 50.00,
          "order-is-priced": true,
          "human-readable-id": "321D8",
          "delivery-fee": 0.00,
          "metadata": {},
          "is-click-and-collect": false
        },
        "relationships": {
          "priced-order-lines": {
            "links": {
              "self": "/api/v1/priced-orders/3fdb2416-6e4b-45a0-b1b0-b91832a4b319/relationships/priced-order-lines",
              "related": "/api/v1/priced-orders/3fdb2416-6e4b-45a0-b1b0-b91832a4b319/priced-order-lines"
            },
            "data": [
              {
                "type": "priced-order-line",
                "id": "44bf6760-40df-4b01-9ef5-37a78ecae35e"
              }
            ]
          }
        },
        "links": {
          "self": "/api/v1/priced-orders/3fdb2416-6e4b-45a0-b1b0-b91832a4b319"
        }
      }
    ],
    "included": [
      {
        "type": "priced-order-line",
        "id": "44bf6760-40df-4b01-9ef5-37a78ecae35e",
        "attributes": {
          "position": 0,
          "description": "Chips",
          "unit-price": 1000.00,
          "quantity": 1,
          "line-total": 1000.00,
          "name": "Chips",
          "priced-order-id": "3fdb2416-6e4b-45a0-b1b0-b91832a4b319",
          "ticket-type": "744c0000-3bfb-ea3b-047e-08d95e605386"
        },
        "relationships": {
          "product-extras": {
            "links": {
              "self": "/api/v1/priced-orders/44bf6760-40df-4b01-9ef5-37a78ecae35e/relationships/product-extras",
              "related": "/api/v1/priced-orders/44bf6760-40df-4b01-9ef5-37a78ecae35e/product-extras"
            }
          },
          "priced-order": {
            "links": {
              "self": "/api/v1/priced-orders/44bf6760-40df-4b01-9ef5-37a78ecae35e/relationships/priced-order",
              "related": "/api/v1/priced-orders/44bf6760-40df-4b01-9ef5-37a78ecae35e/priced-order"
            }
          }
        },
        "links": {
          "self": "/api/v1/priced-orders/44bf6760-40df-4b01-9ef5-37a78ecae35e"
        }
      }
    ]
  }

let doJson = {
    "meta": {
        "copyright": "Copyright (C) 2021 Sonaticket ltd.",
        "Backend-Version": "Version v2.0.337"
    },
    "links": {
        "self": "/api/v1/draft-orders/c1584c9d-2f78-4323-973f-f78c04ab91e0?include=draft-order-items.ticket.product-extras"
    },
    "data": {
        "type": "draft-orders",
        "id": "c1584c9d-2f78-4323-973f-f78c04ab91e0",
        "attributes": {
            "order-id": "c1584c9d-2f78-4323-973f-f78c04ab91e0",
            "event-instance-id": "744c0000-3bfb-ea3b-f8df-08d95e601284",
            "reservation-expiration-date": "2021-08-19T09:54:50.452919",
            "state": "ReservationCompleted",
            "order-version": 6,
            "owner-id": null,
            "owner-email": null,
            "owner-phone": null,
            "owner-name": null,
            "delivery-line1": null,
            "delivery-postcode": null,
            "user-token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IkNBMTM1RDY3OTJFMEQ4ODc5ODdDRDY2RDVCQzNDMTkxMDI0NDE4REMiLCJ4NXQiOiJ5aE5kWjVMZzJJZVlmTlp0VzhQQmtRSkVHTnciLCJ0eXAiOiJKV1QifQ.eyJvcmRlci1pZCI6IjY2OGI1YjhiLTk3MDMtNDJiZC05MmNlLTQ4NTQyMTBhNTcxNiIsIm5iZiI6MTYyOTM2NjkwNCwiZXhwIjoxNjI5MzcwNTA0LCJpYXQiOjE2MjkzNjY5MDQsImlzcyI6Imh0dHBzOi8vaWRzLmhpZ2hzdHJlZXRseS5saXZlIiwiYXVkIjoic29uYXRyaWJlLnRpY2tldHJlc2VydmF0aW9ucy5hcGkifQ.Ks1tl4KnDjWL521hlfHsyf3O_os73OAGgJN7SdOsyPMuBSU9OuxcD22m8ZARTAKE6ebHpXz7_m-mIEUWsfNdq2uYWcTPkX670szKbuRrq5N77vyYbyrIK2k2YTtc8_DQ6FUJ23e2X7LL3ot7A_okSX_8IIpz5Jseh6MqX7lGn5ZBqq4VtkHPK86UNRW5AsMOZQjRO42p2h26dXK5T_UdX-GRWRKPHG8HJNG0HPVqaMg0fNwYdbX7BKCZpGPhdAO1dNxPNMg92xd-D3YLjVe2o03Dv2wtc73N29cPV04BBH9OHuDgPz-i9TzGK3AsgY9n-Y0dwmQX83OTlzHvkalF9A",
            "human-readable-id": "Q8IH5",
            "is-click-and-collect": false,
            "is-local-delivery": false,
            "make-subscription": false,
            "is-national-delivery": false,
            "metadata": {}
        },
        "relationships": {
            "draft-order-items": {
                "links": {
                    "self": "/api/v1/draft-orders/c1584c9d-2f78-4323-973f-f78c04ab91e0/relationships/draft-order-items",
                    "related": "/api/v1/draft-orders/c1584c9d-2f78-4323-973f-f78c04ab91e0/draft-order-items"
                },
                "data": [
                    {
                        "type": "draft-order-items",
                        "id": "83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe"
                    }
                ]
            }
        },
        "links": {
            "self": "/api/v1/draft-orders/c1584c9d-2f78-4323-973f-f78c04ab91e0"
        }
    },
    "included": [
        {
            "type": "draft-order-items",
            "id": "83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe",
            "attributes": {
                "draft-order-id": "c1584c9d-2f78-4323-973f-f78c04ab91e0",
                "ticket-type": "744c0000-3bfb-ea3b-334d-08d95e603bd2",
                "requested-tickets": 1,
                "reserved-tickets": 1
            },
            "relationships": {
                "draft-order": {
                    "links": {
                        "self": "/api/v1/draft-order-items/83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe/relationships/draft-order",
                        "related": "/api/v1/draft-order-items/83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe/draft-order"
                    }
                },
                "ticket": {
                    "links": {
                        "self": "/api/v1/draft-order-items/83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe/relationships/ticket",
                        "related": "/api/v1/draft-order-items/83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe/ticket"
                    },
                    "data": {
                        "type": "ticket-details",
                        "id": "436ac9f2-1ae8-4011-a978-b14dd3eb0fdd"
                    }
                }
            },
            "links": {
                "self": "/api/v1/draft-order-items/83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe"
            }
        },
        {
            "type": "ticket-details",
            "id": "436ac9f2-1ae8-4011-a978-b14dd3eb0fdd",
            "attributes": {
                "draft-order-item-id": "83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe",
                "event-instance-id": "744c0000-3bfb-ea3b-f8df-08d95e601284",
                "name": "Eggs Florentine",
                "display-name": "Eggs Florentine",
                "price": 1000.00,
                "quantity": 1
            },
            "relationships": {
                "draft-order-item": {
                    "links": {
                        "self": "/api/v1/ticket-details/436ac9f2-1ae8-4011-a978-b14dd3eb0fdd/relationships/draft-order-item",
                        "related": "/api/v1/ticket-details/436ac9f2-1ae8-4011-a978-b14dd3eb0fdd/draft-order-item"
                    }
                },
                "product-extras": {
                    "links": {
                        "self": "/api/v1/ticket-details/436ac9f2-1ae8-4011-a978-b14dd3eb0fdd/relationships/product-extras",
                        "related": "/api/v1/ticket-details/436ac9f2-1ae8-4011-a978-b14dd3eb0fdd/product-extras"
                    },
                    "data": []
                }
            },
            "links": {
                "self": "/api/v1/ticket-details/436ac9f2-1ae8-4011-a978-b14dd3eb0fdd"
            }
        }
    ]
}

let draft = deserializer.deserialize(doJson)
let priced = deserializer.deserialize(pricedOrderJson)

export const PersonalInfoStoryWithProps = () => ({
    Component: PersonalInfo,

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
        draftOrder: draft,
        pricedOrder: priced,
        evt: {
            "meta": {
                "copyright": "Copyright (C) 2021 Sonaticket ltd.",
                "Backend-Version": "Version v2.0.337"
            },
            "links": {
                "self": "/api/v1/event-instances/744c0000-3bfb-ea3b-f8df-08d95e601284"
            },
            "data": {
                "type": "event-instances",
                "id": "744c0000-3bfb-ea3b-f8df-08d95e601284",
                "attributes": {
                    "opening-times": {
                        "monday": {
                            "open": null,
                            "close": null
                        },
                        "tuesday": {
                            "open": null,
                            "close": null
                        },
                        "wednesday": {
                            "open": null,
                            "close": null
                        },
                        "thursday": {
                            "open": null,
                            "close": null
                        },
                        "friday": {
                            "open": null,
                            "close": null
                        },
                        "saturday": {
                            "open": null,
                            "close": null
                        },
                        "sunday": {
                            "open": null,
                            "close": null
                        }
                    },
                    "owner-id": "9da4482e-b1c8-4070-9beb-e1f2a340af1e",
                    "event-series-id": "ec870000-d847-120f-84e5-08d946a248bf",
                    "name": "Nice shop",
                    "description": null,
                    "location": "10 FIVE OAKS WAY",
                    "short-location": null,
                    "postcode": "BN6 9ZU",
                    "delivery-radius-miles": null,
                    "tagline": null,
                    "main-image-id": null,
                    "hero-image-id": null,
                    "hero2-image-id": null,
                    "logo-image-id": null,
                    "is-published": true,
                    "is-click-and-collect": true,
                    "is-local-delivery": false,
                    "is-national-delivery": false,
                    "show-waiting-list": false,
                    "date-created": null,
                    "category": null,
                    "lat": null,
                    "lng": null,
                    "slug": "nice-shop-10-five-oaks-way",
                    "was-ever-published": false,
                    "featured": false,
                    "orders-confirmed": null,
                    "support-email": "wayne@highstreet.ly",
                    "support-phone": "+447508215459",
                    "notification-email": null,
                    "notification-phone": null,
                    "deleted": false,
                    "event-organiser-id": "1381ccdd-5908-428f-bd87-6f023159c6c2",
                    "national-delivery-flat-fee": 0.00,
                    "national-delivery-flat-fee-free-after": 0.00,
                    "metadata": {},
                    "payment-platform-fee-paid-by": 2,
                    "platform-fee-paid-by": 2
                },
                "relationships": {
                    "event-series": {
                        "links": {
                            "self": "/api/v1/event-instances/744c0000-3bfb-ea3b-f8df-08d95e601284/relationships/event-series",
                            "related": "/api/v1/event-instances/744c0000-3bfb-ea3b-f8df-08d95e601284/event-series"
                        }
                    },
                    "ticket-types": {
                        "links": {
                            "self": "/api/v1/event-instances/744c0000-3bfb-ea3b-f8df-08d95e601284/relationships/ticket-types",
                            "related": "/api/v1/event-instances/744c0000-3bfb-ea3b-f8df-08d95e601284/ticket-types"
                        }
                    },
                    "images": {
                        "links": {
                            "self": "/api/v1/event-instances/744c0000-3bfb-ea3b-f8df-08d95e601284/relationships/images",
                            "related": "/api/v1/event-instances/744c0000-3bfb-ea3b-f8df-08d95e601284/images"
                        }
                    }
                },
                "links": {
                    "self": "/api/v1/event-instances/744c0000-3bfb-ea3b-f8df-08d95e601284"
                }
            }
        },
        // draftOrder: {
        //     "meta": {
        //         "copyright": "Copyright (C) 2021 Sonaticket ltd.",
        //         "Backend-Version": "Version v2.0.337"
        //     },
        //     "links": {
        //         "self": "/api/v1/draft-orders/c1584c9d-2f78-4323-973f-f78c04ab91e0?include=draft-order-items.ticket.product-extras"
        //     },
        //     "data": {
        //         "type": "draft-orders",
        //         "id": "c1584c9d-2f78-4323-973f-f78c04ab91e0",
        //         "attributes": {
        //             "order-id": "c1584c9d-2f78-4323-973f-f78c04ab91e0",
        //             "event-instance-id": "744c0000-3bfb-ea3b-f8df-08d95e601284",
        //             "reservation-expiration-date": "2021-08-19T09:54:50.452919",
        //             "state": "ReservationCompleted",
        //             "order-version": 6,
        //             "owner-id": null,
        //             "owner-email": null,
        //             "owner-phone": null,
        //             "owner-name": null,
        //             "delivery-line1": null,
        //             "delivery-postcode": null,
        //             "user-token": null,
        //             "human-readable-id": "Q8IH5",
        //             "is-click-and-collect": false,
        //             "is-local-delivery": false,
        //             "make-subscription": false,
        //             "is-national-delivery": false,
        //             "metadata": {}
        //         },
        //         "relationships": {
        //             "draft-order-items": {
        //                 "links": {
        //                     "self": "/api/v1/draft-orders/c1584c9d-2f78-4323-973f-f78c04ab91e0/relationships/draft-order-items",
        //                     "related": "/api/v1/draft-orders/c1584c9d-2f78-4323-973f-f78c04ab91e0/draft-order-items"
        //                 },
        //                 "data": [
        //                     {
        //                         "type": "draft-order-items",
        //                         "id": "83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe"
        //                     }
        //                 ]
        //             }
        //         },
        //         "links": {
        //             "self": "/api/v1/draft-orders/c1584c9d-2f78-4323-973f-f78c04ab91e0"
        //         }
        //     },
        //     "included": [
        //         {
        //             "type": "draft-order-items",
        //             "id": "83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe",
        //             "attributes": {
        //                 "draft-order-id": "c1584c9d-2f78-4323-973f-f78c04ab91e0",
        //                 "ticket-type": "744c0000-3bfb-ea3b-334d-08d95e603bd2",
        //                 "requested-tickets": 1,
        //                 "reserved-tickets": 1
        //             },
        //             "relationships": {
        //                 "draft-order": {
        //                     "links": {
        //                         "self": "/api/v1/draft-order-items/83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe/relationships/draft-order",
        //                         "related": "/api/v1/draft-order-items/83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe/draft-order"
        //                     }
        //                 },
        //                 "ticket": {
        //                     "links": {
        //                         "self": "/api/v1/draft-order-items/83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe/relationships/ticket",
        //                         "related": "/api/v1/draft-order-items/83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe/ticket"
        //                     },
        //                     "data": {
        //                         "type": "ticket-details",
        //                         "id": "436ac9f2-1ae8-4011-a978-b14dd3eb0fdd"
        //                     }
        //                 }
        //             },
        //             "links": {
        //                 "self": "/api/v1/draft-order-items/83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe"
        //             }
        //         },
        //         {
        //             "type": "ticket-details",
        //             "id": "436ac9f2-1ae8-4011-a978-b14dd3eb0fdd",
        //             "attributes": {
        //                 "draft-order-item-id": "83aac020-2f9f-4a4a-b8cd-e1bc88c60bbe",
        //                 "event-instance-id": "744c0000-3bfb-ea3b-f8df-08d95e601284",
        //                 "name": "Eggs Florentine",
        //                 "display-name": "Eggs Florentine",
        //                 "price": 1000.00,
        //                 "quantity": 1
        //             },
        //             "relationships": {
        //                 "draft-order-item": {
        //                     "links": {
        //                         "self": "/api/v1/ticket-details/436ac9f2-1ae8-4011-a978-b14dd3eb0fdd/relationships/draft-order-item",
        //                         "related": "/api/v1/ticket-details/436ac9f2-1ae8-4011-a978-b14dd3eb0fdd/draft-order-item"
        //                     }
        //                 },
        //                 "product-extras": {
        //                     "links": {
        //                         "self": "/api/v1/ticket-details/436ac9f2-1ae8-4011-a978-b14dd3eb0fdd/relationships/product-extras",
        //                         "related": "/api/v1/ticket-details/436ac9f2-1ae8-4011-a978-b14dd3eb0fdd/product-extras"
        //                     },
        //                     "data": []
        //                 }
        //             },
        //             "links": {
        //                 "self": "/api/v1/ticket-details/436ac9f2-1ae8-4011-a978-b14dd3eb0fdd"
        //             }
        //         }
        //     ]
        // },
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
