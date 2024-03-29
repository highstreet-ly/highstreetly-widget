<script>
  /*import {library} from '@fortawesome/fontawesome-svg-core';
  import {
    faShoppingCart
  } from '@fortawesome/free-solid-svg-icons';
  import {
    FontAwesomeIcon,
    FontAwesomeLayers,
    FontAwesomeLayersText,
  } from 'fontawesome-svelte';*/
  import {
    cartStore,
    subTotalStore,
    basketLoadingStore,
    pageLoadingStore,
    draftOrderStore,
  } from '../core/stores'
  import { DraftOrderApi } from '../core/api/'
  import SpinnerSvg from '../components/SpinnerSvg.svelte'
  import CartService from '../core/cart'
  import StockWarning from '../stock-warning/StockWarning.svelte'
  import { createEventDispatcher } from 'svelte'
  import MinusSvg from '../components/MinusSvg.svelte';
  import PlusSvg from '../components/PlusSvg.svelte';

  const dispatch = createEventDispatcher()
  let draftOrderJson
  let doSubUnsub = draftOrderStore.subscribe(
    x => (draftOrderJson = JSON.stringify(x)),
  )

  let cartJson
  let cart
  let cartSubUnsub = cartStore.subscribe(x => {
    cartJson = JSON.stringify(x)
    cart = x
  })
  const draftOrderApi = new DraftOrderApi()

  const cartService = new CartService()


  async function proceedToPayment() {
    pageLoadingStore.set('preparing your order')

    let totalRequested = 0

    $cartStore.forEach(async ticket => {
      if (ticket.requestedQuantity) {
        totalRequested += ticket.requestedQuantity
      }
    })

    if (totalRequested > 0) {
      await draftOrderApi.commitOrder()
      dispatch('ticketsReserved')
    }
  }

  async function cartIncrement(product) {
    await cartService.addItem(product)
  }

  async function cartDecrement(product) {
    if (product.requestedQuantity > 1) {
      await cartService.removeItem(product)
    }
  }

   function remove(product){
    if (product.requestedQuantity >= 1) {
       cartService.removeItem(product, true)
    }
  }

</script>

<template>
  <div>
    <div class="sidebar">
      <div class="grid grid-cols-1">
        <div>
          <h5 class="grid-group h mb-3">
            <span>Your Order</span>
            <!--<FontAwesomeIcon
                size="lg"
                class="float-right"
                icon={faShoppingCart} />-->
          </h5>
        </div>
      </div>

      <div class="bg-white relative">
        {#if $basketLoadingStore}
          <div style="margin-top:-30px;">
            <SpinnerSvg
              spinnerColor="#F18700"
              spinnerPx="30"
              spinnerClass="rotatey"
            />
          </div>
        {/if}
        <div class="p-4">
          {#if $cartStore.length > 0}
            <table class="table cart">
              {#each $cartStore as line}
                {#if line.requestedQuantity > 0}
                  <tr>
                    <td>
                      <div class="mb-1">
                        <div class="name">{line.name}</div>
                        {#if line.productExtras.length}
                          <ul class="extras">
                            {#each line.productExtras as extra}
                              <li>
                                {#if extra.itemCount && extra.itemCount > 1}
                                  {extra.name} x {extra.itemCount}
                                {:else}
                                  {extra.name}
                                {/if}
                              </li>
                            {/each}
                          </ul>
                        {/if}
                      </div>
                      <div class="actions">
                        <ul class="list-unstyled list-inline">
                          <li class="list-inline-item">
                            <span on:click={() => cartDecrement(line)} class="inline-block cursor-pointer relative select-none" style="top:-2px;">
                              <MinusSvg svgPx="15" svgColor="#f18700"/>
                            </span>

                            <b>{line.requestedQuantity}</b>

                            <span on:click={() => cartIncrement(line)} class="inline-block cursor-pointer relative select-none" style="top:-2px;">
                              <PlusSvg svgPx="15" svgColor="#f18700"/>
                            </span>
                          </li>
                          <li class="list-inline-item">
                            <small
                              on:click={() => remove(line)}
                              class="text-muted"
                              style="cursor:pointer">Remove</small
                            >
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td class="text-right price"
                      >&pound;{(line.total/100).toFixed(2)}</td
                    >
                  </tr>
                {/if}
              {/each}
            </table>
            <div class="text-right mt-3">
              <small>Subtotal: </small>
              <b>&pound;{($subTotalStore/100).toFixed(2)}</b>
            </div>
          {:else}
            <div class="text-center py-6">
              <small>Your basket is empty</small>
            </div>
          {/if}
        </div>
        {#if $cartStore.length > 0}
          <button
            on:click={proceedToPayment}
            class="btn btn-primary btn-lg btn-block btn-checkout uppercase"
          >
            Proceed to payment
            <i class="fa fa-angle-right" />
          </button>
        {:else}
          <button
            class="btn btn-secondary btn-lg btn-block btn-checkout uppercase"
            disabled
            title="Please add more items to your basket"
          >
            Add items to checkout
          </button>
        {/if}
      </div>

      <StockWarning />
    </div>
  </div>
  <!-- <json-viewer>
    {cartJson}
  </json-viewer> -->
</template>

<style lang="postcss" src="../style.css">
</style>
