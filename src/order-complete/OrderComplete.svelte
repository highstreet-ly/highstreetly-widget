<script>
  import {onMount} from 'svelte';
  import {OrderApi} from '../core/api/';
  import {
    eventIdStore,
    eventStore,
    stripeKeyStore,
    apiUrlStore,
    orderStore,
    pageLoadingStore,
  } from '../core/stores';

  const orderApi = new OrderApi();
 

  onMount(async () => {
    pageLoadingStore.set(null);
    $eventIdStore = event;
    $stripeKeyStore = stripe;
    $apiUrlStore = api || BASE_URL;

    orderStore.subscribe(x => {
      console.log('order recieved');
      order = x;
    });
  });

  function buildExtrasString(extras) {
    let arr = [];
    extras.forEach(extra => {
      arr.push(extra.name);
    });
    return arr.join(', ');
  }

  export let order;
  export let stripe;
  export let api;
  export let event;

</script>

<template>
  {#if order}
    <div class="p-10">
      <div class="mb-8">
        <h1 class="text-5xl mb-3 font-bold">Thanks for your order{order.ownerName} !</h1>
        <h2 class="text-xl font-bold">Your order number is <b>#<b>{order.humanReadableId}</b></b></h2>
        <p>A confirmation of your order has been sent to {order.ownerEmail}</p>
      </div>

      {#if order.tickets}

        <div class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div class="md:col-span-2">
              <ul class="list-none">

                {#each order.tickets as ticket}

                  <li class="mb-4 flex w-full">
                    <div class="flex">
                      <span>{ticket.ticketDetails.quantity}x</span>
                    </div>
                    <div class="flex-grow px-5">
                      <div>{ticket.ticketDetails.name}</div>
                      {#if ticket.ticketDetails.productExtras.length}
                        <div class="text-xs text-gray-500">With {buildExtrasString(ticket.ticketDetails.productExtras)}</div>
                      {/if}
                    </div>
                    <div class="flex items-center font-bold">
                      £{(ticket.ticketDetails.price/100).toFixed(2)}
                    </div>
                  </li>

                {/each}

              </ul>
            </div>
            <div>
              <div class="bg-gray-700 text-white p-6 font-bold">
                <h5 class="text-2xl mb-5">Question about your order?</h5>
                <p class="mb-5">Contact {$eventStore.name} directly:</p>
                <p>Tel: <a href="tel:01132221234">{$eventStore.supportPhone}</a></p>
                <p>Email: <a href="mailto:{$eventStore.supportPhone}">{$eventStore.supportEmail}</a></p>
              </div>
            </div>
          </div>
        </div>


      {/if}
    </div>
  {/if}
</template>
