<svelte:options tag="svelte-custom-element" />

<script>
  import { createEventDispatcher, onDestroy, onMount } from 'svelte'
  // import AppStyles from './app-styles.svelte'
  onMount(() => {})

</script>

<nav class="bg-blue-900 shadow-lg">
  <div class="container mx-auto">
    <div class="sm:flex">
      <a href="#" class="text-white text-3xl font-bold p-3">APP LOGO</a>

      <!-- Menus -->
      <div class="ml-55 mt-4">
        <ul class="text-white sm:self-center text-xl">
          <li class="sm:inline-block">
            <a href="#" class="p-3 hover:text-red-900">About</a>
          </li>
          <li class="sm:inline-block">
            <a href="#" class="p-3 hover:text-red-900">Services</a>
          </li>
          <li class="sm:inline-block">
            <a href="#" class="p-3 hover:text-red-900">Blog</a>
          </li>
          <li class="sm:inline-block">
            <a href="#" class="p-3 hover:text-red-900">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>
test
<div class="bg-white rounded shadow border p-6 w-64">
  <h5 class="text-3xl font-bold mb-4 mt-0">My Title</h5>
  <p class="text-gray-700 text-sm">Content goes here</p>
</div>

<!-- <AppStyles /> -->
<style>
  @import 'tailwindcss/base';
  @import './custom-base-styles.css';
  @import 'tailwindcss/components';
  @import './custom-components.css';
  @import 'tailwindcss/utilities';
  @import './custom-utilities.css';

  a {
    font-family: 'Open Sans', sans-serif;
  }

</style>
