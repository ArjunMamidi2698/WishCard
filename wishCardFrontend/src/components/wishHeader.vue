<template>
    <div class="wish-header-main d-inline-flex">
        <div class="wish-header">
            <span class="heading-1">WISH CARD</span>
            <caption>spread your wishes.....</caption>
        </div>
        <v-btn v-if="$route.name !== 'Login' && $route.name !== 'UserHome'" dark color="#33a2be" class="login-btn" @click="$router.push('/login')">Login</v-btn>
        <v-btn v-if="$route.name === 'UserHome'" dark color="#33a2be" class="login-btn" @click="$router.push('/login')">Logout</v-btn>
    </div>
</template>
<script>
export default {
    name: 'WishHeader',
    created() {

    },
}
</script>
<style lang="scss">
.wish-header-main {
    .wish-header{
        display: grid;
        padding: 1rem 2rem;
        .heading-1{
            font-size: 5rem;
            font-weight: bold;
        }
        caption{
            position: relative;
            left: 10rem;
            font-size: 16px;
            font-style: italic;
        }
    }
    .login-btn{
        align-self: center;
        position: absolute;
        right: 2rem;
    }
}
</style>