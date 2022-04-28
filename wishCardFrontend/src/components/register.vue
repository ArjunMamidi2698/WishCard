<template>
    <div class="register-main">
        <wishHeader/>
        <div class="register">
            <v-container>
                <v-card dark class="register-card">
                    <v-card-title>Register</v-card-title>
                    <v-card-subtitle style="font-style:italic;font-size: 16px;">Save Your wish cards here<v-icon small>mood</v-icon></v-card-subtitle>
                    <v-card-text>
                        <v-text-field solo label="Username" v-model="username"></v-text-field>
                        <v-text-field solo label="Password" type="password" v-model="password"></v-text-field>
                    </v-card-text>
                    <v-card-actions class="d-block">
                        <v-btn color="#33a2be" @click="registerUser()">Register</v-btn>
                        <br><br>
                        <span>Already have account?</span>
                        <v-btn color="#33a2be" @click="$router.push('/login')">Login</v-btn>
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
    name: 'register',
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
        registerUser(){
            const self = this;
            if(self.username.trim() == '' || self.password.trim() == ''){
                EventBus.$emit('showSnackbar',{ color: 'error', message: '* Fields are Mandatory'});
            } else {
                axios.post('/registerUser', {
                    username: self.username,
                    password: self.password,
                }).then((res) => {
                    if(res.status == 200){
                        this.$router.push(`/userHome/${res.data.userId}`);
                        EventBus.$emit('showSnackbar',{ color: 'success', message: 'Registered Successfully'});
                    } else {
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'UserName Taken'});
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
.register{
    align-self: center;
    position: relative;
    // top: 5rem;
    .register-card{
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