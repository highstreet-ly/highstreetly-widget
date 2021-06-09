<script>
  import { pageLoadingStore } from '../core/stores';
  import SpinnerSvg from '../components/SpinnerSvg.svelte';
</script>

{#if $pageLoadingStore}
  <div class="bg-overlay-dark z-100 fixed top-0 left-0 w-full flex h-full items-center justify-center" style="z-index:99999">
    <div class="inner text-center text-white">
      <h6 class="text-lg uppercase tracking-wide">
        {$pageLoadingStore}
      </h6>
      <div class="mt-5">
        <SpinnerSvg spinnerColor="#fff" spinnerClass="bounce" />
      </div>
      <div class="mt-5 text-xs uppercase tracking-wide">
        Do not refresh the page
      </div>
    </div>
  </div>
{/if}
