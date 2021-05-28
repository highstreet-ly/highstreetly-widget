import CustomElement from './index.svelte'

export default { title: 'CustomElement' }

export const CustomElementStoryWithProps = () => ({
  Component: CustomElement,
  props: {
    stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
    api: 'https://api.shop.sonashop.xyz/api/v1/',
    event: '63d70000-44c1-e28e-41cf-08d8f82e1a5c'
  },
})
