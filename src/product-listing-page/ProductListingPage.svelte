<script>
  import {onMount} from 'svelte'
  import Carousel from '../carousel/Carousel.svelte'
  import {
    ticketStore,
    basketLoadingStore,
    pageLoadingStore,
  } from '../core/stores'
  import {
    DraftOrderApi,
    TicketTypesApi,
    EventInstanceApi,
  } from '../core/api/'
  import {slugify} from '../core/slugify'
  import ExtraGroup from '../extra-group/ExtraGroup.svelte'
  import CartService from '../core/cart'
  import {eventIdStore, stripeKeyStore, apiUrlStore} from '../core/stores'
  import Basket from '../basket/Basket.svelte'
  import LoaderOverlay from '../components/LoaderOverlay.svelte'
  import CloseSvg from '../components/CloseSvg.svelte'
  import MinusSvg from '../components/MinusSvg.svelte'
  import PlusSvg from '../components/PlusSvg.svelte'

  const draftOrderApi = new DraftOrderApi()
  const ticketTypesApi = new TicketTypesApi()
  const eventInstanceApi = new EventInstanceApi()
  const cartService = new CartService()

  let selectedProduct = null
  let selectedProductImageIds = []
  let showExtras = false
  let showPlan = false
  let extrasWindow
  let errors = []
  let addingToCart = false

  onMount(async () => {
    pageLoadingStore.set(null)
    $eventIdStore = event
    $stripeKeyStore = stripe
    $apiUrlStore = api

    draftOrderApi.createDraftOrder()

    await eventInstanceApi.getEvent()
    await ticketTypesApi.getTicketsForEvent()
    

    // if ($ticketStore.length > 0) {
    //   await draftOrderApi.createDraftOrder()
    // }
    // else {
    //   //ticketsAvailable = false
    //   //showWaitingList = true
    //   //showWaitingList = $eventStore.showWaitingList
    // }
  })

  function selectExtras(product) {
    selectedProductImageIds = []
    selectedProduct = {...product}
    selectedProductImageIds.push(selectedProduct.mainImageId)

    product.images.forEach((image) => {
      selectedProductImageIds.push(image.externalImageId)
    })

    selectedProduct.requestedQuantity = 1
    showExtras = true
    setTimeout(() => {
      extrasWindow = window.open('#showExtras', '_self')
    }, 1)
  }

  function closeExtrasModal() {
    cartService.resetExtras(selectedProduct)
    selectedProduct = null
    showExtras = false
  }

  function closePlanModal() {
    selectedProduct = null
    showPlan = false
  }

  async function increment(product, num) {
    basketLoadingStore.set(true)
    num = num ? num : 1

    errors = []

    // validate the extras
    product.productExtraGroups.forEach((peg) => {
      let min = peg.minSelectable
      let max = peg.maxSelectable

      let selectedInGroup = 0

      peg.productExtras.forEach((pe) => {
        selectedInGroup += pe.itemCount
      })

      if (min + max != 0) {
        if (selectedInGroup < min) {
          errors.push(
           `You must select at least ${min} items for ${peg.name}`,
          )
        }

        if (selectedInGroup > max) {
          errors.push(
           `You can select a maximum of ${max} items for ${peg.name}`,
          )
        }
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
    selectedProduct.requestedQuantity = (
     selectedProduct.requestedQuantity > 1
      ? selectedProduct.requestedQuantity - 1
      : 1
    )
  }

  function onItemCountKeyPress(evt){
    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
    {
      evt.preventDefault();
      return false;
    }

    return true;
  }

  export let stripe
  export let api
  export let event
</script>

<template>
  <div class="container mx-auto bg-gray-100 p-5">
    {#if showExtras}
      <div id="showExtras" class="expop">
        <div class="expop-bg" on:click={() => closeExtrasModal()}></div>
        <div class="expop-wrapper">
          <div class="expop-container">
            <div class="expop-head">
              <h5>{selectedProduct.name}</h5>
              <div
                  on:click={() => closeExtrasModal()}
                  class="expop-close">
                <span><CloseSvg svgPx="26" svgColor="#000"/></span>
              </div>
            </div>
            <div class="expop-content">
              <div class="expop-content-inner">
                {#if selectedProductImageIds.length > 0}
                  <div class="expop-image ">
                    <div class="expop-image-inner">
                      <Carousel
                          arrows="true"
                          perPage="1"
                          autoplay="3000"
                          dots="false">
                        {#each selectedProductImageIds as selectedProductImageId}
                          <img
                              alt=""
                              src="https://res.cloudinary.com/sonatribedevmou/image/upload/w_600,h_300,c_fill/{selectedProductImageId}.jpg"/>
                        {/each}
                      </Carousel>
                    </div>
                  </div>
                {/if}
                <p class="mb-6">
                  <small
                  >{@html selectedProduct.description}</small>
                </p>
                <div class="expop-extras mb-2">
                  {#each selectedProduct.productExtraGroups as extraGroup}
                    <ExtraGroup
                        {extraGroup}
                        {selectedProduct}/>
                  {/each}
                </div>
                <div class="expop-quantity">
                  <div>How many?</div>
                  <span on:click={() => preDecrement(selectedProduct)} class="inline-block cursor-pointer relative select-none" style="top:-4px">
                    <MinusSvg svgPx="40" svgColor="#f18700" />
                  </span>

                  <input
                      min="0"
                      max="10"
                      step="1"
                      class="expop-qty-input font-bold"
                      type="number"
                      on:keypress={onItemCountKeyPress}
                      bind:value={selectedProduct.requestedQuantity}/>

                  <span on:click={() => preIncrement(selectedProduct)} class="inline-block cursor-pointer relative select-none" style="top:-4px">
                    <PlusSvg svgPx="40" svgColor="#f18700"/>
                  </span>
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
                    on:click={() => closeExtrasModal()}
                >Cancel
                </button>
              </div>
              <div class="add">
                <button class="btn btn-primary btn-block btn-checkout"
                    on:click={() => increment( selectedProduct, selectedProduct.requestedQuantity )}>
                  Add to basket
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}


    <div
        class="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-3 gap-8 pb-10 md:pb-0">
      <div class="col-span-full md:col-span-3 lg:col-span-2">
        {#each $ticketStore as group}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h5 id={slugify(group.name)} class="h grid-group mb-3">
                <span>{group.name}</span>
              </h5>
            </div>
          </div>
          <div
              class="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-8"
              style="margin-bottom: 30px">
            {#each group.ticketTypes as product}
              <div>
                <div
                    on:click={() => selectExtras(product)}
                    class="grid-panel p-3 d-flex flex-column"
                    style="height:100%cursor:pointer">
                  <div class="clear flex-grow">
                    <div class="float-right ml-1">
                      {#if product.mainImageId}
                        <img
                            alt="Product"
                            src="https://res.cloudinary.com/sonatribedevmou/image/upload/c_fill,w_70,h_70/{product.mainImageId}.jpg"
                            class="grid-image"/>
                      {/if}
                    </div>
                    <div class="grid-title mb-1">
                      {product.name}
                    </div>
                    <div class="grid-desc mb-1">
                      {@html product.description}
                    </div>
                    <div class="grid-price flex-grow">
                      <b>&pound{(product.price / 100).toFixed(2)}</b>
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/each}
      </div>

      <div class="col-span-full md:col-span-2 lg:col-span-1">
        <Basket on:ticketsReserved/>
      </div>

      <LoaderOverlay/>
    </div>
  </div>
</template>

<style lang="postcss" src="../style.css">
</style>
