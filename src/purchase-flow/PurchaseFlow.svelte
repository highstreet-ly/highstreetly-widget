<script>
  import { onMount } from 'svelte'

  import ProductListingPage from '../product-listing-page/ProductListingPage.svelte'
  import PersonalInfo from '../personal-info/PersonalInfo.svelte'
  import { BASE_URL } from '../core/constants'
  import { eventIdStore, stripeKeyStore, apiUrlStore } from '../core/stores'

  let selectTicketsVisible = true
  let personalInfoVisible = false
  let paymentCompleted = false

  onMount(() => {
    $eventIdStore = event
    $stripeKeyStore = stripe
    $apiUrlStore = api || BASE_URL
  })

  function proceedToPayment() {
    selectTicketsVisible = false
    personalInfoVisible = true
  }

  export let stripe
  export let api
  export let event
</script>

<template>
  <div id="hsapp">
    <div class="container mx-auto bg-gray-100 p-5">
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
          {stripe} />
        {/if}
      {/if}
    </div>
  </div>
</template>

<style lang="postcss" src="../style.css">
</style>