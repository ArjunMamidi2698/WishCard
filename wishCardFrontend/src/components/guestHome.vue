<template>
    <div class="guest-home-main">
        <wishHeader/>
        <div class="guest-home">
            <v-container>
                <v-card dark class="guest-home-card" v-if="!linkProvided">
                    <v-card-title>Add Your Details</v-card-title>
                    <v-card-text>
                        <v-text-field solo label="Your Name" v-model="guestName"></v-text-field>
                        <v-text-field solo label="Whom you wanna wish*" v-model="name"></v-text-field>
                        <v-textarea solo label="Your wish*" rows="3" v-model="wishMessage"></v-textarea>
                        <b>Preview Wish</b>
                        <v-textarea solo label="Preview Wish*" rows="3" readonly v-model="previewWish"></v-textarea>
                    </v-card-text>
                    <v-card-actions class="d-block">
                        <v-btn color="#33a2be" @click="getWishLink()">Get Wish Link</v-btn>
                    </v-card-actions>
                </v-card>
                <v-card dark v-else class="wish-link-card">
                        <span class="display-1">
                            Here is your wish link
                            <v-icon x-large>mood</v-icon>
                        </span>
                    <div class="ma-4 wish-link">
                        <a :href="wishLink" class="white--text">{{wishLink}}</a>
                        <v-btn icon @click="copyWishLink()"><v-icon>{{copiedContent ? 'done' : 'content_copy'}}</v-icon></v-btn>
                    </div>
                    <span>Spread your wishes with your wish link</span><br><br>
                    <v-btn dark color="#33a2be" @click="createMore()">Create More</v-btn>
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
    name: 'GuestHome',
    components: {
        wishHeader,
    },
    data() {
        return {
            guestName: '',
            name: '',
            wishMessage: '',
            linkProvided: false,
            wishLink: 'http://localhost:2698/#/wishView/arjun',
            copiedContent: false,
        }
    },
    computed: {
        previewWish(){
           return `${this.wishMessage} ${this.name}` 
        }  
    },
    mounted(){
        this.guestExistence();
    },
    methods: {
        guestExistence(){
            const self = this;
            axios.post('/guestUser', {
                userId: self.$route.params.id,
            }).then((res) => {
                if(res.status == 200){
                    // nothing
                } else {
                    alert('Something went wrong');
                }
            }).catch((err) => {
                console.log(err);
            });
        },
        getWishLink(){
            const self = this;
            if(self.name.trim() == '' || self.wishMessage.trim() == ''){
                EventBus.$emit('showSnackbar',{ color: 'error', message: '* Fields are Mandatory'});
            } else {
                axios.post('/addWish', {
                    userId: self.$route.params.id,
                    wish: {
                        name: self.name,
                        wishMessage: self.wishMessage, 
                        guest: self.guestName
                    }
                }).then((res) => {
                    if(res.status == 200){
                        this.linkProvided = true;
                        self.wishLink = res.data.wish.wishLink;
                        self.resetFormData();
                    } else {
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'Something went wrong'});
                    }
                }).catch((err) => {
                    EventBus.$emit('showSnackbar',{ color: 'error', message: 'Something went wrong'});
                });
            }
        },
        resetFormData(){
            const self = this;
            self.guestName = '';
            self.name = '';
            self.wishMessage = '';
        },
        createMore(){
            this.linkProvided = false;
            self.resetFormData();
        },
        copyWishLink(){
            const self = this;
            try {
                var el = document.createElement('textarea');
                el.value = self.wishLink;
                el.setAttribute('readonly', '');
                el.style = {position: 'absolute', left: '-9999px'};
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                self.copiedContent = true;
                setTimeout(function(){
                    self.copiedContent = false;
                },1500);
            } catch (err) {
                self.copiedContent = false;
                console.log('error', err);
            }
        },
    },
}
</script>
<style lang="scss">
.guest-home{
    align-self: center;
    position: relative;
    top: 5rem;
    .guest-home-card{
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
    .wish-link-card{
        margin: auto;
        background: linear-gradient(45deg, #6a808a, #6a809a, #6a810a, #6a810b);
        width: 500px;
        height: auto;
        padding: 2rem;
        .wish-link{
            background: black;
            padding: 1rem;
        }
    }
}
</style>