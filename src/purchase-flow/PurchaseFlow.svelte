<script>
  import {onMount} from 'svelte';

  import ProductListingPage from '../product-listing-page/ProductListingPage.svelte';
  import OrderComplete from '../order-complete/OrderComplete.svelte';
  import PersonalInfo from '../personal-info/PersonalInfo.svelte';
  import {BASE_URL} from '../core/constants';
  import {eventIdStore, stripeKeyStore, apiUrlStore} from '../core/stores';

  let selectTicketsVisible = true;
  let personalInfoVisible = false;
  let paymentCompleted = false;

  onMount(() => {
    $eventIdStore = event;
    $stripeKeyStore = stripe;
    $apiUrlStore = api || BASE_URL;
  });

  function proceedToPayment() {
    selectTicketsVisible = false;
    personalInfoVisible = true;
  }

  let paymentCompletedHandler = async () => {
    paymentCompleted = true;
  };
  export let stripe;
  export let api;
  export let event;

</script>

<template>
  <div id="hsapp">

    {#if selectTicketsVisible}
      <ProductListingPage
          {api}
          {event}
          {stripe}
          on:ticketsReserved={proceedToPayment}
      />
    {/if}
    {#if personalInfoVisible}
      {#if !paymentCompleted}
        <PersonalInfo
            {api}
            {event}
            {stripe}
            on:paymentCompleted={paymentCompletedHandler}
        />
      {/if}
    {/if}
    {#if paymentCompleted}
      <OrderComplete {api} {event} {stripe}/>
    {/if}
  </div>
</template>

<style lang="postcss" src="../style.css">
</style>
