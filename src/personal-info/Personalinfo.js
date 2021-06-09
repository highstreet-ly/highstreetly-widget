import {
    PaymentApi
} from '../core/api'

import {
    draftPaymentStore,
} from '../core/stores'

import validateRadius from '../core/validateRadius'

export class Personalinfo {
    constructor() {
        this.paymentApi = new PaymentApi()
        draftPaymentStore.subscribe((x) => (this.draftPayment = x))
    }

    async submitPayment(draftOrder, stripeElement) {

        let errorMessage = ""

        draftOrder.deliveryPostcode = draftOrder.deliveryPostcode.replace(/^(.*)(\d)/, "$1 $2")

        if (draftOrder.isLocalDelivery) {
            let postcodeValidFormatResult = this.validPostcode(draftOrder.deliveryPostcode)

            if (!postcodeValidFormatResult) {
                return { valid: false, postcodeValidFormatResult: true }
            }

            try {
                console.log('validating radius')

                let postcodeValid = await validateRadius(draftOrder.deliveryPostcode)

                if (!postcodeValid) {
                    return { valid: false, postcodeInvalidResult: true }
                }

            } catch (e) {
                console.log(e)
            }
        }

       // let payment = await this.paymentApi.createDraftPayment()

        //this.disableInputs();

        const { paymentIntent, error } = await stripeElement.stripe.confirmCardPayment(this.draftPayment.paymentIntentSecret, {
            payment_method: {
                card: stripeElement.element,
                billing_details: {
                    address: {
                        line1: draftOrder.deliveryLine1,
                        postal_code: draftOrder.deliveryPostcode
                    },
                    email: draftOrder.ownerEmail,
                    phone: draftOrder.ownerPhone,
                    name: draftOrder.ownerName
                }
            },
        })

        if (error) {
            //this.error.classList.add("visible");
            switch (error.decline_code) {
                case 'lost_card':
                case 'stolen_card':
                    // deal with it
                    break;
                case 'expired_card ':
                    errorMessage = `${error.message}: Your card has expired`;
                    break;
                case 'incorrect_cvc':
                case 'incorrect_number':
                    errorMessage += `${error.message}: Please check your card details`;
                    break;
                case 'processing_error ':
                    errorMessage += `${error.message}: There was an error processing your card`;
                    break;
                default:
                    errorMessage += `${error.message}`;
            }
            return { valid: false, error: errorMessage };
        }

        return { paymentIntent, valid: true };
    }

    validPostcode(postcode) {
        postcode = postcode.replace(/\s/g, "");
        var regex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
        return regex.test(postcode);
    }

    // disableInputs() {
    //     Array.prototype.forEach.call(
    //         this.form.querySelectorAll(
    //             "input[type='text'], input[type='email'], input[type='tel']"
    //         ),
    //         input => {
    //             input.setAttribute("disabled", "true");
    //         }
    //     );
    // }
}