import { writable } from 'svelte/store';

export const ticketStore = writable([]);
ticketStore.reset = () => { ticketStore.set([]) }

export const orderStore = writable({});
orderStore.reset = () => { orderStore.set({}) }

export const draftOrderStore = writable({});
draftOrderStore.reset = () => { draftOrderStore.set({}) }

export const pricedOrderStore = writable({});
pricedOrderStore.reset = () => { pricedOrderStore.set({}) }

export const cartStore = writable([]);
cartStore.reset = () => { cartStore.set([]) }

export const subTotalStore = writable(0.00);
subTotalStore.reset = () => { subTotalStore.set(0.00) }

export const draftPaymentStore = writable({});
draftPaymentStore.reset = () => { draftPaymentStore.set({}) }

export const eventIdStore = writable('');
eventIdStore.reset = () => { eventIdStore.set('') }

export const stripeKeyStore = writable('');
stripeKeyStore.reset = () => { stripeKeyStore.set('') }

export const apiUrlStore = writable('');
apiUrlStore.reset = () => { apiUrlStore.set('') }

export const eventStore = writable();
eventStore.reset = () => { eventStore.set({}) }

export const hasExpirationStore = writable(false);
hasExpirationStore.reset = () => { hasExpirationStore.set(false) }

export const orderHasExpiredStore = writable(false);
orderHasExpiredStore.reset = () => { orderHasExpiredStore.set(false) }

export const deliveryOutSideRadiusStore = writable(false);
deliveryOutSideRadiusStore.reset = () => { deliveryOutSideRadiusStore.set(false) }

export const userTokenStore = writable(false);
userTokenStore.reset = () => { userTokenStore.set(false) }

export const correlationIdStore = writable();
correlationIdStore.reset = () => { correlationIdStore.set({}) }

export const basketLoadingStore = writable();
basketLoadingStore.reset = () => { basketLoadingStore.set(false) }

export const pageLoadingStore = writable();
pageLoadingStore.reset = () => { pageLoadingStore.set(null) }

export const subscribablesStore = writable([]);
subscribablesStore.reset = () => { subscribablesStore.set([]) }