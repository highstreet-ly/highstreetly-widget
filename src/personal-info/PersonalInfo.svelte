<script>
  import { fly, fade } from 'svelte/transition'
  import { onMount, createEventDispatcher } from 'svelte'
  import { timer, outOfTime } from '../core/timer'
  import {
    eventIdStore,
    stripeKeyStore,
    apiUrlStore,
    draftOrderStore,
    pricedOrderStore,
    draftPaymentStore,
    eventStore,
    userTokenStore, pageLoadingStore,
  } from '../core/stores';
  import {
    DraftOrderApi,
    TicketTypesApi,
    EventInstanceApi,
    PaymentApi,
    OrderApi,
    PricedOrderApi,
  } from '../core/api/'
  import { Personalinfo } from './Personalinfo'
  import LoaderOverlay from '../components/LoaderOverlay.svelte';

  const draftOrderApi = new DraftOrderApi()
  const ticketTypesApi = new TicketTypesApi()
  const eventInstanceApi = new EventInstanceApi()
  const paymentApi = new PaymentApi()
  const orderApi = new OrderApi()
  const pricedOrderApi = new PricedOrderApi()
  const dispatch = createEventDispatcher()

  const personalinfoService = new Personalinfo()

  let paymentCompleted = false
  let deliveryInvalid = false
  let pleaseWait = false
  let processing = false
  let postcodeInvalid = false
  let postcodeInvalidFormat = false

  let errorElement
  let timerElement
  let minsElement
  let secsElement
  let wasPartiallyFulfilled = false
  let wasPartiallyFulfilledArray = []

  let evt
  let selectedService = 1

  let s

  let draftOrder
  draftOrderStore.subscribe(x => (draftOrder = x))
  let pricedOrder
  pricedOrderStore.subscribe(x => (pricedOrder = x))

  let cart = {
    subtotal: 0.0,
    fee: 0.0,
    total: 0.0,
    items: [],
    deliveryFee: 0.0,
  }

  onMount(async () => {
    pageLoadingStore.set(null);
    $eventIdStore = event
    $stripeKeyStore = stripe
    $apiUrlStore = api

    evt = await eventInstanceApi.getEvent()

    timer(timerElement, minsElement, secsElement, dispatch)

    s = document.querySelector('stripe-elements')

    if (!s) {
      s = document
        .querySelector('svelte-custom-element')
        .shadowRoot.querySelector('stripe-elements')
    }

    s.publishableKey = stripe

    s.addEventListener('source', onStripeSource)
    s.addEventListener('change', onChange)
    await  paymentApi.createDraftPayment()
    await updateCart()
  })

  let updateCart = async () => {
    cart = {
      subtotal: 0.0,
      fee: 0.0,
      total: 0.0,
      items: [],
      deliveryFee: 0.0,
    }

    await draftOrderApi.getDraftOrder(true)
    await pricedOrderApi.getPricedOrder()

    draftOrder.draftOrderItems.forEach(item => {
      if (item.requestedTickets > item.reservedTickets) {
        wasPartiallyFulfilled = true
        wasPartiallyFulfilledArray.push(item)
      }
    })

    console.log(wasPartiallyFulfilledArray)

    cart.items = []
    // Build a cart array with totals calculated
    // TODO: this wants to be replaced with data from the PricedOrder api response
    let cartSubtotal = 0.0

    console.log('priced-order')
    console.log(pricedOrder)
    // let lineTotal = 0.00
    pricedOrder.pricedOrderLines.forEach(dfo => {
      cart.items.push({
        name: dfo.name,
        quantity: dfo.quantity,
        price: dfo.unitPrice,
        total: dfo.lineTotal,
        'product-extras': dfo.productExtras,
      })
      cartSubtotal = cartSubtotal + dfo.lineTotal
    })
    cart.subtotal = cartSubtotal

    let paymentPlatformFee = 0
    let platformFee = 0

    if ($eventStore.paymentPlatformFeePaidBy === 2) {
      paymentPlatformFee = pricedOrder.paymentPlatformFees
    }

    if ($eventStore.platformFeePaidBy === 2) {
      platformFee = pricedOrder.platformFees
    }

    cart.fee = (paymentPlatformFee + platformFee) / 100 // (2 + ((cartSubtotal * 1.4) / 100))

    cart.total = pricedOrder.total
    cart.deliveryFee = pricedOrder.deliveryFee / 100
    cart = cart
    pageLoadingStore.set(null);
  }

  let onChange = ({ target }) => {}

  let onStripeSource = ({ target: { source } }) => {}

  function onUnsupported(){
      alert('not supported')
  }

  let submitPayment = async () => {
    pageLoadingStore.set("Processing payment - please wait");
    if (
      !draftOrder.isNationalDelivery &&
      !draftOrder.isLocalDelivery &&
      !draftOrder.isClickAndCollect
    ) {
      pageLoadingStore.set(null);
      deliveryInvalid = true
      return
    } else {
      deliveryInvalid = false
    }

    await draftOrderApi.assignRegistrant(true)
    await paymentApi.updatePayment(draftOrder.ownerEmail)

    let {
      paymentIntent,
      valid,
      postcodeInvalidResult,
      error,
      postcodeValidFormatResult,
    } = await personalinfoService.submitPayment(draftOrder, s)

    postcodeInvalid = postcodeInvalidResult
    postcodeInvalidFormat = postcodeValidFormatResult

    if (!valid) {
      console.log('not valid returning')
      processing = false
      pageLoadingStore.set(null);
      return
    }

    processing = false

    await paymentApi.confirmPayment(paymentIntent)

    await orderApi.getOrder(true)

    paymentCompleted = true

    dispatch('paymentCompleted')
  }

  let resetForm = async () => {}

  var handleClickAndCollectClick = async () => {
    pageLoadingStore.set("Checking collection availability");
    draftOrder.isNationalDelivery = false
    draftOrder.isLocalDelivery = false
    draftOrder.isClickAndCollect = true

    await draftOrderApi.setDeliveryMethod(true)

    updateCart()
  }

  var handleLocalDeliveryClick = async () => {
    pageLoadingStore.set("Checking delivery availability");
    processing = true
    draftOrder.isNationalDelivery = false
    draftOrder.isLocalDelivery = true
    draftOrder.isClickAndCollect = false

    await draftOrderApi.setDeliveryMethod(true)

    updateCart()
  }

  var handleNationalDeliveryClick = async () => {
    pageLoadingStore.set("Checking delivery availability");
    draftOrder.isNationalDelivery = true
    draftOrder.isLocalDelivery = false
    draftOrder.isClickAndCollect = false

    await draftOrderApi.setDeliveryMethod(true)

    updateCart()
  }

  export let stripe
  export let api
  export let event

</script>

<template>
  {#if !paymentCompleted}
    <form>
      <div
        class="box sonaticket-payment-details"
        style=""
        on:resetForm={resetForm}
        in:fly={{ y: 200, duration: 300, delay: 400 }}
        out:fade
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="sonaticket-flow col-span-full md:col-span-2">
            {#if  wasPartiallyFulfilled}
              <div class="bg-red-100 py-3 px-5 mb-10">
                <h5 class="font-bold">
                  The following items are currently unavailable. Your order has
                  been automatically updated:
                </h5>
                <ul class="mt-2">
                    {#each wasPartiallyFulfilledArray as unfulfilled}
                      <li class="text-lg">
                        <b>{unfulfilled.ticket.name}</b> -
                        {#if unfulfilled.reservedTickets > 0}
                          only {unfulfilled.reservedTickets} available
                        {:else}
                          out of stock
                        {/if}
                      </li>
                    {/each}
                  </ul>
              </div>
            {/if}

            {#if evt}
              <h5 class="h-sm"><span>Delivery Method</span></h5>
              <div class="form-row mt-4 mb-4">
                <div class="form-group">
                  {#if evt.isClickAndCollect}
                    <label class="checkbox-inline mr-3">
                      <input
                        class="mr-1"
                        type="checkbox"
                        bind:checked={draftOrder.isClickAndCollect}
                        value={1}
                        autocomplete="off"
                        on:click={handleClickAndCollectClick}
                      />
                      Click and collect
                    </label>
                  {/if}
                  {#if evt.isLocalDelivery}
                    <label class="checkbox-inline mr-3">
                      <input
                        class="mr-1"
                        type="checkbox"
                        bind:checked={draftOrder.isLocalDelivery}
                        value={2}
                        autocomplete="off"
                        on:click={handleLocalDeliveryClick}
                      />
                      Local Delivery
                    </label>
                  {/if}
                  {#if evt.isNationalDelivery}
                    <label class="checkbox-inline">
                      <input
                        class="mr-1"
                        type="checkbox"
                        bind:checked={draftOrder.isNationalDelivery}
                        value={3}
                        autocomplete="off"
                        on:click={handleNationalDeliveryClick}
                      />
                      National Delivery
                    </label>
                  {/if}
                </div>
                {#if deliveryInvalid}
                  <div
                    role="alert"
                    bind:this={errorElement}
                    style="color:#e25950font-size:13px"
                    class="mt-2"
                  >
                    <span class="message" style="color:red"
                      >Please select a delivery method</span
                    >
                  </div>
                {/if}
              </div>
            {/if}

            <h5 class="h-sm mt-8 mb-4">
              <span
                >Billing {#if selectedService !== 1} / Delivery {/if}</span
              > Details
            </h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label for="payment-name">Name</label>
                <input
                  class="form-control"
                  id="payment-name"
                  type="text"
                  placeholder=""
                  required
                  autocomplete="name"
                  bind:value={draftOrder.ownerName}
                />
              </div>
              <div class="form-group">
                <label for="payment-email">Email</label>
                <div class="input-group">
                  <div class="input-group-append">
                    <div class="input-group-text">
                      @
                    </div>
                  </div>
                  <input
                    id="payment-email"
                    autocomplete="email"
                    class="form-control"
                    type="email"
                    required
                    bind:value={draftOrder.ownerEmail}
                  />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div class="form-group">
                <label for="payment-address1">Address</label>
                <input
                  id="payment-address1"
                  class="form-control"
                  type="text"
                  required
                  bind:value={draftOrder.deliveryLine1}
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label for="payment-postcode">Postcode</label>
                <input
                  id="payment-postcode"
                  class="form-control"
                  type="text"
                  required
                  bind:value={draftOrder.deliveryPostcode}
                />
                {#if postcodeInvalid}
                  <div
                    role="alert"
                    bind:this={errorElement}
                    style="color:#e25950font-size:13px"
                    class="mt-2"
                  >
                    <span class="message" style="color:red"
                      >Your postcode isn't currently supported by this shop</span
                    >
                  </div>
                {/if}

                {#if postcodeInvalidFormat}
                  <div
                    role="alert"
                    bind:this={errorElement}
                    style="color:#e25950font-size:13px"
                    class="mt-2"
                  >
                    <span class="message" style="color:red"
                      >Postcode invalid</span
                    >
                  </div>
                {/if}
              </div>
              <div class="form-group">
                <label for="payment-phone">Phone</label>
                <div class="input-group">
                  <div class="input-group-append">
                    <div class="input-group-text">+44</div>
                  </div>
                  <input
                    id="payment-phone"
                    class="form-control"
                    type="tel"
                    required
                    bind:value={draftOrder.ownerPhone}
                  />
                </div>
              </div>
            </div>

            <h5 class="h-sm mt-8 mb-4"><span>Payment Details</span></h5>


             <stripe-elements class="form-control" /> 
            <stripe-payment-request
            publishable-key={stripe}
            generate="payment-method"
           
            request-payer-name
            request-payer-email
            request-payer-phone
            amount="326"
            label="Double Double"
            country="CA"
            currency="cad">
          <stripe-display-item data-amount="125" data-label="Double Double"> </stripe-display-item>
          <stripe-display-item data-amount="199" data-label="Box of 10 Timbits"> </stripe-display-item>
          <stripe-shipping-option data-id="pick-up" data-label="Pick Up" data-detail="Pick Up at Your Local Timmy's" data-amount="0"> </stripe-shipping-option>
          <stripe-shipping-option data-id="delivery" data-label="Delivery" data-detail="Timbits to Your Door" data-amount="200"> </stripe-shipping-option>
        </stripe-payment-request>
        


            <div class="text-center mt-10">
              <button
                on:click|stopPropagation|preventDefault|once={submitPayment}
                class="btn btn-primary btn-lg btn-block btn-checkout"
              >
                Complete Payment
                <i class="fa fa-angle-right" />
              </button>
              <div class="error mt-3" role="alert" bind:this={errorElement}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  style="fill:red"
                >
                  <path
                    class="base"
                    fill="#000"
                    d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
                  />
                  <path
                    class="glyph"
                    fill="#FFF"
                    d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
                  />
                </svg>
                <span class="message" />
              </div>
            </div>

            <!-- <div class="text-center mt-10">
        <button on:click={goBack} class="btn btn-primary btn-lg btn-block btn-checkout">
          Go Back
          <i class="fa fa-angle-right" />
        </button>

      </div> -->
          </div>
          <div>
            <h5 class="h-sm"><span>Your order</span></h5>
            <div style="background-color:#F2F6F6">
              <div class="p-4">
                <table class="table payment-order-table cart">
                  {#if cart.items.length}
                    {#each cart.items as line}
                      <tr>
                        <td class="mb-1">
                          <div class="name">{line.quantity}x {line.name}</div>
                          {#if line.productExtras && line.productExtras.length}
                            <ul class="extras">
                              {#each line.productExtras as extra}
                                <li>
                                  {#if extra.itemCount}
                                    {extra.name} x {extra.itemCount}
                                  {:else}
                                    {extra.name}
                                  {/if}
                                </li>
                              {/each}
                            </ul>
                          {/if}
                        </td>
                        <td class="text-right">&pound{line.total.toFixed(2)}</td
                        >
                      </tr>
                    {/each}
                  {/if}
                </table>
                <div class="text-right mt-3">
                  <small>Subtotal: &pound{cart.subtotal.toFixed(2)}</small>
                </div>
                <div class="text-right">
                  <small>Service Fee: &pound{cart.fee.toFixed(2)}</small>
                </div>
                <div class="text-right">
                  <small
                    >Delivery Fee: &pound{cart.deliveryFee.toFixed(2)}</small
                  >
                </div>
                <div class="text-right mt-3">
                  <b>Total: &pound{cart.total.toFixed(2)}</b>
                </div>
              </div>
            </div>

            <h5 class="h-sm mt-4"><span>Order expires in:</span></h5>
            <div class="text-center" style="background-color:#F2F6F6">
              <div class="px-2">
                <div>
                  <span
                    id="timer"
                    style="font-weight: bold font-size: 3rem"
                    bind:this={timerElement}
                  />

                  <div class="clock-container" bind:this={timerElement}>
                    <div class="grid grid-cols-2 gap-8">
                      <div class="text-right">
                        <div class="inline-block text-center">
                          <div
                            class="clock-minutes clock-timer"
                            bind:this={minsElement}
                          />
                          <div class="clock-label">Minutes</div>
                        </div>
                      </div>
                      <div class="text-left">
                        <div class="inline-block text-center">
                          <div
                            class="clock-seconds clock-timer"
                            bind:this={secsElement}
                          />
                          <div class="clock-label">Seconds</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  {/if}

  <LoaderOverlay />
</template>

<style lang="postcss" src="../style.css">
</style>
