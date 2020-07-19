<template>
    <div class="wish-view">
        <canvas id="canvas"></canvas>
        <v-card dark color="#fff0f000" class="wish-content" v-if="!wishNotFound">
            <h1>{{message}}</h1>
            <h1>{{name}}</h1>
        </v-card>
        <div v-else class="wish-content">
            <h4>Wish Not Found</h4>
            <h4>May be invalid link is provided or link got expired..</h4>
        </div>
        <v-btn x-large class="home-btn" @click="goToHome()">Give a Try</v-btn>
    </div>
</template>
<script>
import firework from '@/assets/js/fireworks.js'
export default {
    name: 'GuestHome',
    created(){
        this.wishId = this.$route.params.id;
        this.checkWishAvailability(this.wishId);
    },
    data() {
        return {
            message: 'Happy Birthday',
            name: 'Arjun',
            wishId: '',
            wishNotFound: false,
        }
    },
    methods: {
        checkWishAvailability(){
            if(this.wishId.trim().length == 0){
                this.wishNotFound = true;
                setTimeout(() => {
                    this.goToHome();
                }, 6000);
            } else {
                this.wishNotFound = false;
                firework.show();
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
            font-size: 10rem;
            color: white;
        }
        h4{
            color: white;
            font-size: 5rem;
            font-style: italic;
        }
    }
    .home-btn{
        z-index: 1;
        position: relative;
        top:14rem;
    }
}
</style>