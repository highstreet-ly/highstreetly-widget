<script>
  import { onMount } from 'svelte'
  import { global as globalBus } from '../core/EventBus'

  let tooManyRequested = false
  let leftInStock
  let tooManyRequestedDisplayName

  /*
  //addingProductToCart
  //addedProductToCart
  //this.dispatch('tooManyRequested', { tooManyRequested: true, displayName: displayName, leftInStock: product.product.availableQuantity })
  */
  onMount(async () => {
    globalBus.on('addingProductToCart', () => {
      tooManyRequested = false
      tooManyRequestedDisplayName = ''
      leftInStock = 0
    })

    globalBus.on('addedProductToCart', () => {
      console.log('addedProductToCart')
    })

    globalBus.on('tooManyRequested', evt => {
      tooManyRequested = true
      tooManyRequestedDisplayName = evt.target.displayName
      leftInStock = evt.target.leftInStock
    })
  })

</script>

<template>
  {#if tooManyRequested}
    <br />
    <div class="grid grid-cols-1">
      <div>
        <h5 class="grid-group h mb-3">
          <span>Message:</span>
          <i class="fa fa-shopping-cart float-right" style="font-size: 24px" />
        </h5>
      </div>
    </div>

    <div class="bg-white relative">
      <table class="table cart">
        <tr>
          <td>
            <span class="message" style="color:red"
              >There are only {leftInStock} items left for {tooManyRequestedDisplayName},
              order quick to ensure they're yours!</span
            >
          </td>
        </tr>
      </table>
    </div>
  {/if}
</template>
