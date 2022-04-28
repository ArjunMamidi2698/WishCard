<template>
    <div class="wish-view" id="wish-view-page">
        <canvas id="canvas"></canvas>
        <v-card dark color="#fff0f000" class="wish-content" v-if="!wishNotFound">
            <h1><Roller :text="message" :transition="1" :wordWrap="1" :charList="['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']"></Roller></h1>
            <h1><Roller :text="name" :transition="2" :wordWrap="1" :charList="['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']"></Roller></h1>
        </v-card>
        <div v-else class="wish-content">
            <h4>Wish Not Found</h4>
            <h4>May be invalid link is provided or link got expired..</h4>
        </div>
        <v-btn x-large class="home-btn" @click="goToHome()" v-if="!inPreviewCard">Give a Try</v-btn>
    </div>
</template>
<script>
import firework from '@/assets/js/fireworks.js';
import axios from 'axios';
import Roller from "vue-roller";

export default {
    name: 'GuestHome',
    components: {
        Roller,
    },
    props: {
        inPreviewCard: Boolean,
        wishMessage: String,
        person: String,
        backgroundAnimation: String,
    },
    data() {
        return {
            message: '',
            name: '',
            wishId: '',
            wishNotFound: false,
        }
    },
    created(){
        if(!this.inPreviewCard){
            this.wishId = this.$route.params.id;
            this.checkWishAvailability();
        } else {
            firework.show();
        }
    },
    mounted() {
        if(this.inPreviewCard){
            this.message = this.wishMessage;
            this.name = this.person;
        }
    },
    methods: {
        checkWishAvailability(){
            const self = this;
            if(this.wishId.trim().length == 0){
                this.wishNotFound = true;
                setTimeout(() => {
                    this.goToHome();
                }, 6000);
            } else {
                axios.post('/wishMessage', {
                    wishId: self.wishId,
                }).then((res) => {
                    if(res.status == 200){
                        this.wishNotFound = false;
                        firework.show();
                        self.message = res.data.data[0].wishMessage;
                        self.name = res.data.data[0].name;
                    } else {
                        this.wishNotFound = true;
                        setTimeout(() => {
                            this.goToHome();
                        }, 6000);
                    }
                }).catch((err) => {
                    console.log(err);
                });
                
            }
        },
        goToHome(){
            this.$router.push('/login');
            location.reload();
        }
    },
}
</script>
<style lang="scss">
.wish-view{
    background: black;
    height: 100%;
    .wish-content{
        z-index: 1;
        h1{
            font-size: 8rem;
            color: white;
            text-align: -webkit-center;
            text-align: -moz-center;
            text-transform: capitalize;
            font-variant: all-small-caps;
            font-family: auto;
        }
        h4{
            color: white;
            font-size: 5rem;
            font-style: italic;
        }
    }
    .home-btn{
        z-index: 1;
        // position: absolute;
        // bottom:3rem;
    }
    .roller .rollerBlock {
        color: white;
        z-index: 1;
    }
}
</style>