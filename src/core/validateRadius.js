import { eventStore, deliveryOutSideRadiusStore, draftOrderStore } from './stores'

let event
eventStore.subscribe((x) => (event = x))

let draftOrder
draftOrderStore.subscribe((x) => (draftOrder = x))

export default async (deliveryPostcode) => {
    return new Promise((resolve, reject) => {

        let sourcePostcode = event.postcode;
        let deliveryRadius = event.deliveryRadiusMiles
        console.log('init google service')

        var service = new google.maps.DistanceMatrixService();
        console.log(service)

        try {
            console.log(`calling google service ${sourcePostcode} ${deliveryPostcode}`)
            service.getDistanceMatrix(
                {
                    origins: [sourcePostcode],
                    destinations: [deliveryPostcode],
                    travelMode: 'DRIVING',
                }, (distanceResponse, status) => {
                    console.log(`back from google sevrice with status ${status}`)
                    let deliveryDistance = distanceResponse.rows[0].elements[0].distance.value / 1609;
                    console.log(`delivery distance ${deliveryDistance}`)

                    let deliveryRadiusValid = deliveryDistance <= deliveryRadius;

                    console.log(`deliveryRadiusValid: ${deliveryRadiusValid}`)

                    deliveryOutSideRadiusStore.set(!deliveryRadiusValid);
                    if (deliveryRadiusValid) {
                        draftOrder.deliveryPostcode = deliveryPostcode;
                    }

                    resolve(deliveryRadiusValid);
                });
        } catch (e) {
            console.log(e)
        }
    });
}