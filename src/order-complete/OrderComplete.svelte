<script>
  import { onMount } from 'svelte'
  import { OrderApi } from '../core/api/'
  import {
    eventIdStore,
    stripeKeyStore,
    apiUrlStore,
    orderStore,
    pageLoadingStore,
  } from '../core/stores';

  const orderApi = new OrderApi()
  let order

  onMount(async () => {
    pageLoadingStore.set(null);
    $eventIdStore = event
    $stripeKeyStore = stripe
    $apiUrlStore = api || BASE_URL

    orderStore.subscribe(x => {
      console.log('order recieved')
      order = x
    })
  })

  export let stripe
  export let api
  export let event

</script>

<template>
  <h1>Thanks!</h1>
  {#if order}
    <div>Order #: {order.humanReadableId}</div>
    <div>Email: {order.ownerEmail}</div>

    {#if order.tickets}
      <ul>
        {#each order.tickets as ticket}
          <li>
              {ticket.id} - {ticket.ticketDetails.displayName}
              <ul>
                  {#each ticket.ticketDetails.productExtras as extra}
                  <li>
                    {extra.name} = {extra.description} - {extra.itemCount} - {extra.price}
                      {(console.log(extra), '')}
                  </li>
                  {/each}
              </ul>
              {(console.log(ticket), '')}
            </li>
        {/each}
      </ul>
    {/if}
  {/if}
</template>
