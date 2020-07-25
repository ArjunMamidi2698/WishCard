<template>
    <div class="login-main">
        <wishHeader/>
        <div class="login">
            <v-container>
                <v-card dark class="login-card">
                    <v-card-title>Login</v-card-title>
                    <v-card-subtitle style="font-style:italic;font-size: 16px;">Your wish cards are waiting inside<v-icon medium>mood</v-icon></v-card-subtitle>
                    <v-card-text>
                        <v-text-field solo label="Username" v-model="username"></v-text-field>
                        <v-text-field solo type="password" label="Password" v-model="password"></v-text-field>
                    </v-card-text>
                    <v-card-actions class="d-block">
                        <div>
                            <v-btn color="#33a2be" @click="loginAsUser()">Login</v-btn>
                            <span class="mx-2">OR</span>
                            <v-btn color="#33a2be" @click="loginAsGuest()">Guest Login</v-btn>
                        </div>
                        <br>
                        <span>Don't have account?</span>
                        <v-btn color="#33a2be" @click="$router.push('/register')">Register</v-btn>
                    </v-card-actions>
                </v-card>
            </v-container>
        </div>
    </div>
</template>
<script>
import { EventBus } from '@/assets/js/eventBus';
import wishHeader from '@/components/wishHeader.vue'
import axios from 'axios';

export default {
    name: 'login',
    components: {
        wishHeader,
    },
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        loginAsGuest(){
            this.$router.push('/guestHome/19S15O14N21U');
        },
        loginAsUser(){
            const self = this;
            if(self.username.trim() == '' || self.password.trim() == ''){
                EventBus.$emit('showSnackbar',{ color: 'error', message: '* Fields are Mandatory'});
            } else {
                axios.post('/loginUser', {
                    username: self.username,
                    password: self.password,
                }).then((res) => {
                    if(res.status == 200){
                        this.$router.push(`/userHome/${res.data.userId}`);
                        EventBus.$emit('showSnackbar',{ color: 'success', message: 'Logged In Successfully'});
                    } else {
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'Invalid Credentials'});
                    }
                }).catch((err) => {
                    EventBus.$emit('showSnackbar',{ color: 'error', message: 'Something went wrong'});
                });
            }
        }
    },
}
</script>
<style lang="scss">
.login{
    align-self: center;
    position: relative;
    // top: 5rem;
    .login-card{
        margin: auto;
        background: linear-gradient(45deg, #6a808a, #6a809a, #6a810a, #6a810b);
        width: 500px;
        height: auto;
        padding-bottom: 2rem;
        .v-card__title{
            justify-content: center;
            font-size: 2rem;
            padding: 2rem;
        }
        .v-card__text{
            .v-text-field{
                width: 60%;
                margin: auto;
            }
        }
    }
}
</style>