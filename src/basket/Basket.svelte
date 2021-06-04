<script>
  import { cartStore, subTotalStore } from '../core/stores'
  import { DraftOrderApi, TicketTypesApi, EventInstanceApi } from '../core/api/'
  import { createEventDispatcher } from 'svelte'

  const draftOrderApi = new DraftOrderApi()

  const dispatch = createEventDispatcher()

  let addingToCart = false
  let reservingOrder = false

  async function proceedToPayment() {
    let totalRequested = 0

    $cartStore.forEach(async ticket => {
      if (ticket.requestedQuantity) {
        totalRequested += ticket.requestedQuantity
      }
    })

    if (totalRequested > 0) {
      reservingOrder = true
      setTimeout(() => {
        window.open('#reservingOrder', '_self')
      }, 1)

      await draftOrderApi.updateDraftOrder('CommitOrder', false, true, 'ReservationCompleted')

      dispatch('ticketsReserved')
    }
  }

</script>

<div>
  <div class="sidebar">
    <div class="grid grid-cols-1">
      <div>
        <h5 class="grid-group h mb-3">
          <span>Your Order</span>
          <i class="fa fa-shopping-cart float-right" style="font-size: 24px" />
        </h5>
      </div>
    </div>

    <div class="bg-white relative">
      {#if addingToCart}
        <div
          class="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10"
          style="background:rgba(225,225,225,0.4);"
        >
          <div style="margin-top:-30px;">
            <SpinnerSvg spinnerColor={spinnerColorBrand} spinnerPx="30" />
          </div>
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
                          <i
                            on:click={() => cartDecrement(line)}
                            class="fa fa-minus-circle"
                            style="color:#FF9000;cursor:pointer;"
                          />
                          <b>{line.requestedQuantity}</b>
                          <i
                            on:click={() => cartIncrement(line)}
                            class="fa fa-plus-circle"
                            style="color:#FF9000;cursor:pointer;"
                          />
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
                    >&pound;{line.total.toFixed(2)}</td
                  >
                </tr>
              {/if}
            {/each}
          </table>
          <div class="text-right mt-3">
            <small>Subtotal: </small>
            <b>&pound;{$subTotalStore.toFixed(2)}</b>
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
  </div>
</div>

<style lang="postcss" src="../style.css">
</style>