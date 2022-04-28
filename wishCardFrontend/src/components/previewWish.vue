<template>
    <div id="preview-wish-page">
        <wishView :inPreviewCard="true" :wishMessage="wishMessage" :person="name" :backgroundAnimation="backgroundAnimation"></wishView>
    </div>
</template>
<script>
import wishView from '@/components/wishView.vue';
import { EventBus } from '@/assets/js/eventBus';

export default {
    name: 'previewWish',
    props: {
        wishMessage: String,
        name: String,
        backgroundAnimation: String,
    },
    components:{
        wishView
    },
    mounted() {
        EventBus.$on('previewPageName', (data) => {
            console.log(data);
            this.name = data;
        });
        EventBus.$on('previewPageWishMessage', (data) => {
            console.log(data);
            this.wishMessage = data;
        });
        EventBus.$on('previewPageBackgroundAnimation', (data) => {
            this.backgroundAnimation = data;
        });
    },
}
</script>