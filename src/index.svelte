<svelte:options tag="svelte-custom-element" />

<script>
  import AppStyles from './app-styles.svelte'

</script>
<AppStyles />
<div class="wrapper">
    <div class="bg-white rounded shadow border p-6 w-64">
        <h5 class="text-3xl font-bold mb-4 mt-0">My Title</h5>
        <p class="text-gray-700 text-sm">Content goes here</p>
      </div>
</div>



<style>
  .wrapper {
    padding: 50px;
  }

</style>
