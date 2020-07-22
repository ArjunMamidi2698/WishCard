<template>
    <div class="wish-footer-main">
        <div class="wish-footer">
            <span class="text-center">
                Copyright <v-icon small>copyright</v-icon> 2020 ARJUN_MAMIDI. All rights reserved
            </span>
        </div>
    </div>
</template>
<script>
import { EventBus } from '@/assets/js/eventBus';
import axios from 'axios';

export default {
    name: 'WishFooter',
}
</script>
<style lang="scss">
.wish-footer-main {
    position: absolute;
    bottom: 0;
    align-self: center;
    .wish-footer{
        padding: 1rem;
        span{
            font-size: 14px;
        }
    }
}
</style>