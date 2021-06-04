import CustomElement from './index.svelte'

export default { title: 'CustomElement' }

export const CustomElementStoryWithProps = () => ({
    Component: CustomElement,
    props: {
        // stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
        // api: 'https://api.shop.highstreet.ly/api/v1/',
        // event: '3e990000-412a-ee9b-e228-08d8faab4e5b'
        stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
        api: 'https://api.shop.sonashop.xyz/api/v1/',
        event: '63d70000-44c1-e28e-41cf-08d8f82e1a5c'

        // stripe: 'pk_test_KLsvb9WFdUIEjkyEv0UyefHQ',
        // api: 'https://api.shop.highstreetly.live/api/v1/',
        // event: '20970000-75ac-8e55-2c6e-08d9202cde70'
        
    },
})
