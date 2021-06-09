<script>
  import { onMount } from 'svelte'
  import {
    eventStore,
    ticketStore,
    groupedTicketStore,
    basketLoadingStore,
  } from '../core/stores'
  import { DraftOrderApi, TicketTypesApi, EventInstanceApi } from '../core/api/'
  import { slugify } from '../core/slugify'
  import ExtraGroup from '../extra-group/ExtraGroup.svelte'
  import SpinnerSvg from '../components/SpinnerSvg.svelte'
  import cartService from '../core/cart'
  import { eventIdStore, stripeKeyStore, apiUrlStore } from '../core/stores'
  import Basket from '../basket/Basket.svelte'

  const draftOrderApi = new DraftOrderApi()
  const ticketTypesApi = new TicketTypesApi()
  const eventInstanceApi = new EventInstanceApi()

  let selectedProduct = null
  let showExtras = false
  let extrasWindow
  let errors = []
  let addingToCart = false

  onMount(async () => {
    $eventIdStore = event
    $stripeKeyStore = stripe
    $apiUrlStore = api

    await ticketTypesApi.getTicketsForEvent()
    await eventInstanceApi.getEvent()

    if ($ticketStore.length > 0) {
      await draftOrderApi.createDraftOrder()
    } else {
      //ticketsAvailable = false
      //showWaitingList = true;
      //showWaitingList = $eventStore.showWaitingList
    }
  })

  function selectExtras(product) {
    selectedProduct = { ...product }
    selectedProduct.requestedQuantity = 1
    showExtras = true
    setTimeout(() => {
      extrasWindow = window.open('#showExtras', '_self')
    }, 1)
  }

  function closeModal() {
    cartService.resetExtras(selectedProduct)
    selectedProduct = null
    showExtras = false
  }

  async function increment(product, num) {
    basketLoadingStore.set(true)
    num = num ? num : 1

    errors = []

    // validate the extras
    product.productExtraGroups.forEach(peg => {
      let min = peg.minSelectable
      let max = peg.maxSelectable

      let selectedInGroup = 0

      peg.productExtras.forEach(pe => {
        selectedInGroup += pe.itemCount
      })

      if (selectedInGroup < min) {
        errors.push(`You must select at least ${min} items for ${peg.name}`)
      }

      if (selectedInGroup > max) {
        errors.push(`You can select a maximum of ${max} items for ${peg.name}`)
      }
    })

    if (errors.length > 0) {
      basketLoadingStore.set(false)
      return false
    }

    showExtras = false
    await cartService.addItem(product, num)

    basketLoadingStore.set(false)
  }

  function preIncrement(product) {
    selectedProduct.requestedQuantity = selectedProduct.requestedQuantity + 1
  }

  function preDecrement(product) {
    selectedProduct.requestedQuantity = selectedProduct.requestedQuantity - 1
  }

  export let stripe
  export let api
  export let event

</script>

<template>
  {#if showExtras}
    <div id="showExtras" class="expop">
      <div class="expop-bg" on:click={() => closeModal()} />
      <div class="expop-wrapper">
        <div class="expop-container">
          <div class="expop-head">
            <h5>{selectedProduct.name}</h5>
            <div on:click={() => closeModal()} class="expop-close">
              <span><i class="fa fa-times-circle" /></span>
            </div>
          </div>
          <div class="expop-content">
            <div class="expop-content-inner">
              {#if selectedProduct.mainImageId}
                <div class="expop-image">
                  <div class="expop-image-inner">
                    <div
                      style="background-image:url(https://res.cloudinary.com/sonatribedevmou/image/upload/w_560/{selectedProduct.mainImageId}.jpg);background-repeat:no-repeat;background-position:center;background-size: cover;height:100%;"
                    />
                  </div>
                </div>
              {/if}
              <p class="mb-6"><small>{selectedProduct.description}</small></p>
              <div class="expop-extras mb-2">
                {#each selectedProduct.productExtraGroups as extraGroup}
                  <ExtraGroup {extraGroup} {selectedProduct} />
                {/each}
              </div>
              <div class="expop-quantity">
                <div>How many?</div>
                <i
                  on:click={() => preDecrement(selectedProduct)}
                  class="fa fa-minus-circle expop-decrement"
                  style="color:#FF9000;cursor:pointer;"
                />
                <input
                  min="0"
                  max="10"
                  class="expop-qty-input"
                  type="number"
                  bind:value={selectedProduct.requestedQuantity}
                />
                <i
                  on:click={() => preIncrement(selectedProduct)}
                  class="fa fa-plus-circle expop-increment"
                  style="color:#FF9000;cursor:pointer;"
                />
              </div>
              <div class="expop-errors">
                {#each errors as error}
                  {error}
                {/each}
              </div>
            </div>
          </div>
          <div class="expop-foot">
            <div class="cancel">
              <button
                class="btn btn-secondary btn-block btn-checkout"
                on:click={() => closeModal()}>Cancel</button
              >
            </div>
            <div class="add">
              <button
                class="btn btn-primary btn-block btn-checkout"
                on:click={() =>
                  increment(selectedProduct, selectedProduct.requestedQuantity)}
                >Add to basket</button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 md:pb-0">
    <div class="col-span-full md:col-span-2">
      {#each $groupedTicketStore as group}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h5 id={slugify(group.key)} class="h grid-group mb-3">
              <span>{group.key}</span>
            </h5>
          </div>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-8"
          style="margin-bottom: 30px;"
        >
          {#each group.values as product}
            <div class="mb-4">
              <div
                on:click={() => selectExtras(product)}
                class="grid-panel p-3 d-flex flex-column"
                style="height:100%;cursor:pointer;"
              >
                <div class="clear flex-grow">
                  <div class="float-right">
                    {#if product.mainImageId}
                      <img
                        src="https://res.cloudinary.com/sonatribedevmou/image/upload/h_70/{product.mainImageId}.jpg"
                        alt="Product"
                        class="grid-image"
                      />
                    {/if}
                  </div>
                  <div class="grid-title mb-1">
                    {product.name}
                  </div>
                  <div class="grid-desc mb-1">{product.description}</div>
                  <div class="grid-price flex-grow">
                    <b>&pound;{product.price.toFixed(2)}</b>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/each}
    </div>

    <Basket on:ticketsReserved />
  </div>
</template>

<style lang="postcss" src="../style.css">
</style>
