<script>
  let selectedItems = []
  let radios = 1
  let decrement = function (extra) {
    selectedProduct.productExtraGroups.forEach(peg => {
      peg.productExtras.forEach(pe => {
        if (pe.extraId == extra['extra-id']) {
          if (!pe.itemCount) pe.itemCount = 0
          pe.itemCount -= 1
          selectedItems[pe.extraId] = pe.itemCount
          if (pe.itemCount === 0) {
            pe.selected = false
          }
        }
      })
    })
  }

  let increment = function (extra) {
    selectedProduct.productExtraGroups.forEach(peg => {
      peg.productExtras.forEach(pe => {
        if (pe.extraId == extra['extra-id']) {
          if (!pe.itemCount) pe.itemCount = 0
          pe.itemCount += 1
          pe.selected = true
          selectedItems[pe.extraId] = pe.itemCount
        }
      })
    })
  }

  let toggleExtra = async (extra, single) => {
    if (single) {
      extraGroup.productExtras.forEach(ex => {
        ex.itemCount = 0
      })
    }
    if (!extra.selected) {
      extra.itemCount += 1
    } else {
      extra.itemCount -= 1
    }
  }

  let isRadio = function (extraGroup) {
    console.log(extraGroup)
    return extraGroup.minSelectable == 1 && extraGroup.maxSelectable == 1
  }

  export let extraGroup
  export let selectedProduct

</script>

<p class="font-semibold uppercase mb-0">{extraGroup.name}</p>
<p class="text-sm text-muted mb-3">
  <small>
    {#if extraGroup.productExtras && extraGroup.productExtras.length > 1}
      {#if extraGroup.minSelectable > 1 || (extraGroup.minSelectable === 1 && (!extraGroup.maxSelectable || extraGroup.maxSelectable === 1))}
        Minimum: {extraGroup.minSelectable} -
      {/if}
      {#if extraGroup.maxSelectable}
        Maximum: {extraGroup.maxSelectable}
      {/if}
    {/if}
  </small>
</p>
<ul class="list-unstyled mb-10">
  {#each extraGroup.productExtras as extra}
    <li class="mb-1">
      <span class="extra">
        <label class="checkbox">
          <span class="name font-semibold pr-1">{extra.name}</span>
          {#if extra.price > 0}
            <span class="float-right font-semibold"
              >+£{extra.price.toFixed(2)}</span
            >
          {/if}
          <small class="description text-muted">{extra.description}</small>

          {#if isRadio(extraGroup)}
            <span class="radio">
              <input
                type="radio"
                value={extra}
                bind:group={radios}
                on:click={() => toggleExtra(extra, true)}
              />
              <span class="checkmark" />
            </span>
          {:else}
            <input
              type="checkbox"
              bind:checked={extra.selected}
              on:click={() => toggleExtra(extra)}
            />
            <span class="checkmark" />
            <!--<i
                on:click={() => decrement(extra)}
                class="fa fa-minus-circle"
                style="color:#F2511B;cursor:pointer;" />
              <b>{selectedItems[extra['extra-id']] || 0}</b>
              <i
                on:click={() => increment(extra)}
                class="fa fa-plus-circle"
                style="color:#F2511B;cursor:pointer;" />-->
          {/if}
        </label>
      </span>
    </li>
  {/each}
</ul>

<style>
  @import 'tailwindcss/base';
  @import 'tailwindcss/components';
  @import 'tailwindcss/utilities';

</style>
