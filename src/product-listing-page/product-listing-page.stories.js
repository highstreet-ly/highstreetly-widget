import ProductListingPage from './ProductListingPage.svelte'

export default { title: 'ProductListingPage' }

export const ProductListingPageStory = () => ({
  Component: ProductListingPage,
  props: {
    stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
    api: 'https://api.shop.highstreet.ly/api/v1/',
    event: '3e990000-412a-ee9b-e228-08d8faab4e5b'
  },
})
