<svelte:options tag="svelte-custom-element" />

<script>
  import { onMount } from 'svelte'

  import PurchaseFlow from './purchase-flow/PurchaseFlow.svelte'
  import { BASE_URL } from './core/constants'
  import { eventIdStore, stripeKeyStore, apiUrlStore } from './core/stores'


  onMount(() => {
    $eventIdStore = event
    $stripeKeyStore = stripe
    $apiUrlStore = api || BASE_URL
    let fontStyleNode = document.createElement('link')
    fontStyleNode.type = 'text/css'
    fontStyleNode.rel = 'stylesheet'
    fontStyleNode.href =
      '//fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&display=swap'
    document.head.appendChild(fontStyleNode)

    let stripeNode = document.createElement('script')
    stripeNode.src = 'https://js.stripe.com/v3/'
    document.head.appendChild(stripeNode)

    let stripeElementNode = document.createElement('script')
    stripeElementNode.src =
      'https://unpkg.com/@power-elements/stripe-elements/stripe-elements.js?module'
    stripeElementNode.type = 'module'
    document.head.appendChild(stripeElementNode)
  })

  export let stripe
  export let api
  export let event

</script>

<template>
    

  <div>
    <PurchaseFlow {api} {event} {stripe} />
  </div>
</template>

<style global lang="postcss" src="style.css">
</style>
