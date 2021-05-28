<script>
  import { onMount } from 'svelte'
  import { groupedTicketStore } from '../core/stores'
  import { DraftOrderApi, TicketTypesApi, EventInstanceApi } from '../core/api/'
  import { slugify } from '../core/slugify'
  import ExtraGroup from '../extra-group/ExtraGroup.svelte'
  import cartService from '../core/cart'
  import { eventIdStore, stripeKeyStore, apiUrlStore } from '../core/stores'

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
    addingToCart = true
    num = num ? num : 1

    errors = []

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
      addingToCart = false
      return false
    }

    showExtras = false
    await cartService.addItem(product, num)

    addingToCart = false
  }

  export let stripe
  export let api
  export let event

</script>

{#if showExtras}
  <div id="showExtras" class="mbox">
    <div class="mbox-bg" on:click={() => closeModal()} />
    <div class="mbox-container">
      <div class="mbox-inner">
        <div class="mbox-head">
          <h5>{selectedProduct.name}</h5>
          <div on:click={() => closeModal()} class="mbox-close">
            <span><i class="fa fa-times-circle" /></span>
          </div>
        </div>
        <div class="mbox-content">
          <div class="mbox-content-inner">
            {#if selectedProduct.mainImageId}
              <div class="mbox-image">
                <div class="mbox-image-inner">
                  <div
                    style="background-image:url(https://res.cloudinary.com/sonatribedevmou/image/upload/w_560/{selectedProduct.mainImageId}.jpg);background-repeat:no-repeat;background-position:center;background-size: cover;height:100%;"
                  />
                </div>
              </div>
            {/if}
            <p class="mb-6"><small>{selectedProduct.description}</small></p>
            <div class="mbox-extras mb-2">
              {#each selectedProduct.productExtraGroups as extraGroup}
                <ExtraGroup {extraGroup} {selectedProduct} />
              {/each}
            </div>
            <div class="mbox-quantity">
              <div>How many?</div>
              <i
                on:click={() => preDecrement(selectedProduct)}
                class="fa fa-minus-circle mbox-decrement"
                style="color:#FF9000;cursor:pointer;"
              />
              <input
                min="0"
                max="10"
                class="mbox-qty-input"
                type="number"
                bind:value={selectedProduct.requestedQuantity}
              />
              <i
                on:click={() => preIncrement(selectedProduct)}
                class="fa fa-plus-circle mbox-increment"
                style="color:#FF9000;cursor:pointer;"
              />
            </div>
            <div class="mbox-errors">
              {#each errors as error}
                {error}
              {/each}
            </div>
          </div>
        </div>
        <div class="mbox-foot">
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
</div>

<style>
   @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';

  
  @keyframes blob-bottom {

    25%,
    50%,
    75% {
      top: 50%;
      left: 100%;
    }

    100% {
      top: 0;
      left: 50%;
    }
  }

  @keyframes blob-left {
    25% {
      top: 50%;
      left: 0;
    }

    50%,
    100% {
      top: 100%;
      left: 50%;
    }
  }

  @keyframes blob-top {
    50% {
      top: 0;
      left: 50%;
    }

    75%,
    100% {
      top: 50%;
      left: 0;
    }
  }

  @keyframes blob-spinner-mover {

    0%,
    100% {
      top: 0;
      left: 50%;
    }

    25% {
      top: 50%;
      left: 100%;
    }

    50% {
      top: 100%;
      left: 50%;
    }

    75% {
      top: 50%;
      left: 0;
    }
  }

  .stpmodal-content {
    width: 100% !important;
    height: 800px !important;
  }

  .stptabs li.is-active a {
    color: #ffffff !important;
  }

  .stptabs li {
    background-color: transparent !important;
  }

  /*
                clock
                */
  .clock-day:before {
    content: var(--timer-day);
  }

  .clock-hours:before {
    content: var(--timer-hours);
  }

  .clock-minutes:before {
    content: var(--timer-minutes);
  }

  .clock-seconds:before {
    content: var(--timer-seconds);
  }

  .clock-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clock-col {
    text-align: center;
    margin-right: 40px;
    margin-left: 40px;
    min-width: 90px;
    position: relative;
  }

  .clock-col:not(:last-child):before,
  .clock-col:not(:last-child):after {
    content: '';
    background-color: #000;
    height: 5px;
    width: 5px;
    border-radius: 50%;
    display: block;
    position: absolute;
    right: -42px;
  }

  .clock-col:not(:last-child):before {
    top: 35%;
  }

  .clock-col:not(:last-child):after {
    top: 50%;
  }

  .clock-timer {
    color: #000;
  }

  .clock-timer:before {
    color: #000;
    font-size: 4.2rem;
    text-transform: uppercase;
  }

  .clock-label {
    color: #000;
    text-transform: uppercase;
    font-size: 0.7rem;
    margin-top: 10px;
  }

  @media (max-width: 825px) {
    .clock-container {
      flex-direction: column;
      padding-top: 40px;
      padding-bottom: 40px;
    }

    .clock-col+.clock-col {
      margin-top: 20px;
    }

    .clock-col:before,
    .clock-col:after {
      display: none !important;
    }
  }

  .is-black {
    background-color: black !important;
    color: white !important;
  }

  .is-black:hover {
    background-color: black !important;
  }

  .is-black[disabled] {
    background-color: black !important;
    opacity: 1 !important;
  }

  .btn {
    display: inline-block;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    user-select: none;
    background-color: transparent;
    padding: .375rem .75rem;
    font-size: 0.8em;
    line-height: 1.5;
    border-radius: 2px;
    border: 0!important;
    /*@apply*/
  }

  .btn-primary {
    color: #fff;
    background-color: #F18700;
  }

  .btn-primary:hover, .btn-primary:focus {
    background-color: #ffa73d;
  }

  .btn-checkout {
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .btn-secondary {
    border-radius: 2px;
    border: 0!important;
    color: #fff;
    background-color: #6c757d;
  }

  .btn-block {
    display: block;
    width: 100%;
  }

  .btn-lg {
    padding: .5rem 1rem;
    font-size: 1em;
    line-height: 1.5;
  }

  .btn-sm {
    font-size: .8rem;
    text-transform: uppercase;
  }

  .btn-checkout {

  }

  .btn:disabled {
    opacity: .65;
  }

  .text-muted {
    color: #6c757d!important;
  }

  .list-inline, .list-unstyled {
    padding-left: 0;
    list-style: none;
  }

  .list-inline-item {
    display: inline-block;
  }

  .list-inline-item:not(:last-child) {
    margin-right: .5rem;
  }

  .table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
  }

  .mbox {
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    overflow: scroll;
    justify-content: center;
    -webkit-box-align: center;
    align-items: center;
    transition: opacity 0.3s linear;
    z-index: 999;
  }

  .mbox-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
  }

  .mbox-close {
    font-size:26px;
    line-height: 26px;
    color: #6c757d;
    cursor: pointer;
  }

  .mbox-container {
    position: relative;
    max-width: 560px;
    margin: 0 auto;
  }

  .mbox-inner {
    position: absolute;
    top: 16px;
    left: 0;
    background: #fff;
    border-radius: 3px;
    width: 100%;
    transform: scaleX(1);
    opacity: 1;
    z-index: 99;
  }

  .mbox-head {
    padding: 16px;
    display: flex;
    border-bottom: 1px solid #ddd;
  }

  .mbox-head h5 {
    flex-grow: 1;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }

  .mbox-head div:first-child,
  .mbox-head div:last-child {
    width: 24px;
  }

  .mbox-content {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .mbox-content-inner {
    padding: 24px;
  }

  .mbox-image {
    padding-bottom: 24px;
  }

  .mbox-image-inner {
    height: 288px;
  }

  .mbox-quantity {
    text-align: center;
  }

  .mbox-qty-input {
    width: 60px;
    font-size: 30px;
    border: 0;
    padding: 10px;
    text-align: center;
  }

  .mbox-qty-input::-webkit-outer-spin-button,
  .mbox-qty-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .mbox-qty-input[type="number"] {
    -moz-appearance: textfield;
  }

  .mbox-qty-input:focus {
    outline: none;
  }

  .mbox-decrement,
  .mbox-increment {
    font-size: 30px;
  }

  .mbox-foot {
    padding: 24px;
    display: flex;
  }

  .mbox-foot .cancel {
    flex-grow: 1;
  }

  .mbox-foot .add {
    padding-left: 10px;
    flex-grow: 2;
  }

  @media screen and (max-width: 767px) {
    .mbox-container {
      margin: 0 16px 16px;
    }

    .mbox-image-inner {
      height: 180px;
    }
  }

  .sidebar {
    position: -webkit-sticky;
    position: sticky;
    top: 1em;
  }

  @import url("https://fonts.googleapis.com/css?family=Raleway:100,400,700");

  .group-nav {
    padding: 20px 0;
    background-color: #fff;
  }

  .group-nav a {
    display: inline-block;
    margin-right: 30px;
  }

  .mbox-extras ul {
    list-style: none;
    padding-left: 0;
  }

  .mbox-extras ul li {
    margin-bottom: 10px;
  }

  .mbox-extras ul li .description {
    color: #aaa;
    font-size: 11px;
    display: inline-block;
  }

  .mbox-extras ul li .name {
    display: inline-block;
    margin-right: 10px;
  }

  .mbox-errors {
    text-align: center;
    color: red;
    font-weight: bold;
  }

  .is-black {
    background-color: black !important;
    color: white !important;
  }

  .is-black:hover {
    background-color: black !important;
  }

  .is-black[disabled] {
    background-color: black !important;
    opacity: 1 !important;
  }

  .clear:after {
    content: "";
    display: table;
    clear: both;
  }

  .table td, .table th {
    border-top: 0;
  }

  /*wayne test*/

  .error {
    color: red;
    padding: 0 15px;
    font-size: 13px !important;
    font-weight: bold;
    opacity: 0;
    transform: translateY(10px);
    transition-property: opacity, transform;
    transition-duration: 0.35s;
    transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .error.visible {
    opacity: 1;
    transform: none;
  }

  .error .message {
    font-size: inherit;
  }

  .error svg {
    -ms-flex-negative: 0;
    flex-shrink: 0;
    margin-top: -1px;
    margin-right: 10px;
  }

  .error svg {
    margin-top: 0 !important;
  }

  .error svg .base {
    fill: #e25950;
  }

  .error svg .glyph {
    fill: #fff;
  }
  .error .message {
    color: #e25950;
  }

  /* Customize the label (the container) */
  .checkbox {
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 0;
    cursor: pointer;
    font-size: 16px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    border:3px solid #ccc;
  }

  .radio .checkmark {
    border-radius: 20px;
  }

  /* On mouse-over, add a grey background color */
  .checkbox:hover input ~ .checkmark {
    box-sizing: border-box;
    border:3px solid #ddd;
  }

  /* When the checkbox is checked, add a blue background */
  .checkbox input:checked ~ .checkmark {
    background-color: #2196F3;
    border-color: #2196F3;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .checkbox input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .checkbox .checkmark:after {
    left: 8px;
    top: 4px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .grid-panel {
    background-color: #fff;
    transition: box-shadow 0.2s ease-in-out;
  }

  .grid-panel:hover {
    box-shadow: 0 0 25px 0 rgba(0,0,0,0.1);
  }

  .grid-title {
    font-size: 17px;
    font-weight: bold;
  }

  .grid-desc {
    font-size:12px;
    line-height:18px;
    height: 37px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .grid-image {
    max-width:120px;
  }

  .bounce {
    -webkit-animation: bounce 2s;
    animation: bounce 2s;
    -webkit-animation-iteration-count: infinite;
    animation-iteration-count: infinite;
  }

  @-webkit-keyframes bounce {
    0%,
    25%,
    50%,
    75%,
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    40% {
      -webkit-transform: translateY(-20px);
      transform: translateY(-20px);
    }
    60% {
      -webkit-transform: translateY(-12px);
      transform: translateY(-12px);
    }
  }

  @keyframes bounce {
    0%,
    25%,
    50%,
    75%,
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
    40% {
      -webkit-transform: translateY(-20px);
      transform: translateY(-20px);
    }
    60% {
      -webkit-transform: translateY(-12px);
      transform: translateY(-12px);
    }
  }

  .rotatey {
    -webkit-animation: rotateY 1s infinite linear;
    animation: rotateY 1s infinite linear;
  }

  @-webkit-keyframes rotateY {
    to { -webkit-transform: rotateY(360deg); }
  }
  @keyframes rotateY {
    to { transform: rotateY(360deg); }
  }

  .table.cart {
    font-size:14px;
  }

  .table.cart .name, .table.cart .price {
    font-weight: bold;
    font-size: 16px;
  }

  table.cart tr td {
    padding: 0.5rem 0.25rem;
    border-bottom: 1px solid #ddd;
  }


  table.cart tr td .extras {
    list-style: none;
    padding-left:0;
    color: #aaa;
    font-size: 11px;
    margin-bottom:0;
  }

  table.cart tr td .actions ul {
    margin-bottom: 0;
  }

  table.cart tr td .extras li:before {
    content: "+ ";
  }

  table.cart tr td:first-child {
    padding-left:0;
  }

  table.cart tr td:first-child b {
    display:inline-block;
    margin:0 3px;
  }

  table.cart tr td:last-child {
    padding-right:0;
  }

  .fa-minus-circle, .fa-plus-circle {
    -webkit-user-select: none; /* Chrome/Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE10+ */

    /* Rules below not implemented in browsers yet */
    -o-user-select: none;
    user-select: none;
  }

  .overlay {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    transition: opacity 500ms;
    visibility: hidden;
    opacity: 0;
    z-index: 999;
  }
  .overlay:target {
    visibility: visible;
    opacity: 1;
  }

  .form-control {
    display: block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .input-group {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    width: 100%;
  }

  .input-group-append, .input-group-prepend {
    display: flex;
  }

  .input-group-text {
    display: flex;
    align-items: center;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    text-align: center;
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: 0;
  }

  .input-group>.custom-file, .input-group>.custom-select, .input-group>.form-control, .input-group>.form-control-plaintext {
    position: relative;
    flex: 1 1 0%;
    min-width: 0;
    margin-bottom: 0;
  }

  label {
    display: inline-block;
    margin-bottom: .5rem;
    font-size: 1rem;
  }
  #hsapp {
    font-family: 'Lato', sans-serif !important;
  }

  .h {
    @apply text-base leading-4 font-extrabold border-orange border-b-4 border-solid pb-2 mb-2 uppercase;
  }


</style>
