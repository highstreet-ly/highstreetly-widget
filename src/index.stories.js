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
        api: 'https://api.shop.highstreetly.xyz:30299/api/v1/',
        event: 'a74f4393-9a27-4fa2-aa85-cf7a1e0ce94e'
        
    },
})
