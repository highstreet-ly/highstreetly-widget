import CustomElement from './index.svelte'

export default { title: 'CustomElement' }

export const CustomElementStoryWithProps = () => ({
    Component: CustomElement,
    props: {
        // stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
        // api: 'https://api.shop.highstreet.ly/api/v1/',
        // event: '3e990000-412a-ee9b-e228-08d8faab4e5b'
        // stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
        // api: 'https://api.shop.sonashop.xyz/api/v1/',
        // event: '628f0000-be38-06be-45aa-08d92cd503e8'

        stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
        api: 'https://api.shop.highstreetly.live/api/v1/',
        event: '744c0000-3bfb-ea3b-f8df-08d95e601284'
        
    },
})
