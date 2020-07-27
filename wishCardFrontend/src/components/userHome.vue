<template>
    <div class="user-home-main">
        <wishHeader/>
        <v-container>
            <v-card dark class="wishes-card">
                <v-card-title>
                    Your Wish Links
                    <v-spacer></v-spacer>
                    <v-btn icon large title="Add a Wish Link" @click="createWishLink()"><v-icon large>add</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <div v-for="(wish, index) in wishes" :key="wish.wishId">
                        <h2 class="text-left">{{wish.name}}</h2>
                        <div class="d-flex">
                            <v-text-field solo v-show="wish.edit" v-model="wish.name" :readonly="!wish.edit" hide-details class="my-3 mr-2"></v-text-field>
                            <v-text-field solo v-model="wish.wishMessage" :readonly="!wish.edit" hide-details class="my-3"></v-text-field>
                            <v-btn icon @click="editWish(wish, index)" class="align-self-center"><v-icon>{{wish.edit ? 'done' : 'create'}}</v-icon></v-btn>
                            <v-btn icon @click="cancelEdit(wish, index)" class="align-self-center" v-show="wish.edit"><v-icon>close</v-icon></v-btn>
                            <v-btn icon @click="deleteWishLink(wish, index)" class="align-self-center"><v-icon>delete</v-icon></v-btn>
                            <v-btn icon @click="copyWishLink(wish)" class="align-self-center"><v-icon>{{wish.copiedContent ? 'done' : 'content_copy'}}</v-icon></v-btn>
                        </div>
                    </div>
                    <div v-if="showCreateWishPopup">
                        <v-divider class="my-2"></v-divider>
                        <h2 class="text-left">Add Your Wish details</h2>
                        <div class="d-flex">
                            <v-text-field solo v-model="newWish.name" hide-details class="my-3 mr-2" label="Whom you wanna wish"></v-text-field>
                            <v-text-field solo v-model="newWish.wishMessage" hide-details class="my-3" label="Your wish*"></v-text-field>
                            <v-btn icon @click="saveWish()" class="align-self-center"><v-icon>done</v-icon></v-btn>
                            <v-btn icon @click="closeNewWishPopup()" class="align-self-center"><v-icon>close</v-icon></v-btn>
                        </div>
                        <div>
                            <h4 class="text-left">Preview Wish</h4>
                            <v-textarea solo v-model="previewWish" hide-details rows="2" readonly label="Preview wish"></v-textarea>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>
<script>
import { EventBus } from '@/assets/js/eventBus';
import wishHeader from '@/components/wishHeader.vue'
import axios from 'axios';

export default {
    name: 'userHome',
    components: {
        wishHeader,
    },
    computed: {
        previewWish(){
           return `${this.newWish.wishMessage} ${this.newWish.name}` 
        }  
    },
    data() {
        return {
            showCreateWishPopup: false,
            newWish: {
                name: '',
                wishMessage: '',
            },
            wishes: [],
        }
    },
    created(){
        this.getWishesList();
    },
    methods: {
        getWishesList(){
            const self = this;
            axios.post('/wishMessagesList', {
                userId: self.$route.params.id,
            }).then((res) => {
                if(res.status == 200){
                    self.wishes = res.data.data;
                    self.wishes.forEach(obj => {
                        obj['edit'] = false;
                        obj['copiedContent'] = false;
                    });
                } else {
                    self.wishes = [];
                    EventBus.$emit('showSnackbar',{ color: 'error', message: 'Something went wrong'});
                }
            }).catch((err) => {
                if(err.status == 403){
                    EventBus.$emit('showSnackbar',{ color: 'error', message: 'Not Authorized'});
                    setTimeout(() => {
                        this.$router.push('/login');
                    }, 4000);
                } else {
                    EventBus.$emit('showSnackbar',{ color: 'error', message: 'Something went wrong'});
                }
            });
        },
        deleteWishLink(wishObj, index){
            const self = this;
            if(confirm('Are you sure?')){
                axios.post('/deleteWish', {
                    userId: self.$route.params.id,
                    wish: {
                        wishId: wishObj.wishId,
                    }
                }).then((res) => {
                    if(res.status == 200){
                        self.wishes.splice(index, 1);
                        EventBus.$emit('showSnackbar',{ color: 'success', message: 'Wish card Deleted Successfully'});
                    } else {
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'Something went wrong'});
                    }
                }).catch((err) => {
                    if(err.status == 403){
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'Not Authorized'});
                        setTimeout(() => {
                            this.$router.push('/login');
                        }, 4000);
                    }else {
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'Something went wrong'});
                    }
                });
            }
        },
        copyWishLink(wish){
            const self = this;
            const wishLink = wish.wishLink;
            try {
                var el = document.createElement('textarea');
                el.value = wishLink;
                el.setAttribute('readonly', '');
                el.style = {position: 'absolute', left: '-9999px'};
                document.body.appendChild(el);
                el.select();
                document.execCommand('copy');
                document.body.removeChild(el);
                wish.copiedContent = true;
                setTimeout(function(){
                    wish.copiedContent = false;
                },1500);
            } catch (err) {
                wish.copiedContent = false;
                console.log('error', err);
            }
        },
        editWish(wish, index){
            const self = this;
            if(!wish.edit){
                wish['dummyData'] = {
                    name: wish.name,
                    wishMessage: wish.wishMessage
                };
                wish.edit = !wish.edit;
            } else {
                self.updateWish(wish);
            }
        },
        updateWish(wish){
            const self = this;
            if(wish.wishMessage.trim() == ''){
                EventBus.$emit('showSnackbar',{ color: 'error', message: 'Wish Message cannot be empty'});
            } else {
                axios.post('/updateWish', {
                    userId: self.$route.params.id,
                    wish: {
                        wishId: wish.wishId,
                        wishMessage: wish.wishMessage,
                        name: wish.name,
                    }
                }).then((res) => {
                    if(res.status == 200){
                        wish.edit = !wish.edit;
                        EventBus.$emit('showSnackbar',{ color: 'success', message: 'Updated Wish Successfully'});
                    } else {
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'Something went wrong'});
                    }
                }).catch((err) => {
                    if(err.status == 403){
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'Not Authorized'});
                        setTimeout(() => {
                            this.$router.push('/login');
                        }, 4000);
                    }else {
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'Something went wrong'});
                    }
                });
            }
        },
        cancelEdit(wish, index){
            const self = this;
            wish.name = wish.dummyData.name || wish.name;
            wish.wishMessage = wish.dummyData.wishMessage || wish.wishMessage;
            wish.edit = !wish.edit;
        },

        createWishLink(){
            const self = this;
            let options = {
              duration: 900,
              offset: 0,
              easing: 'easeInOutCubic'
            }
            this.$vuetify.goTo(window.innerHeight, options);
            self.showCreateWishPopup = true;
        },
        saveWish(){
            const self = this;
            if(self.newWish.wishMessage.trim() == ''){
                EventBus.$emit('showSnackbar',{ color: 'error', message: '* Fields are Mandatory'});
            } else {
                axios.post('/addWish', {
                    userId: self.$route.params.id,
                    wish: {
                        name: self.newWish.name,
                        wishMessage: self.newWish.wishMessage, 
                    }
                }).then((res) => {
                    if(res.status == 200){
                        self.showCreateWishPopup = false;
                        self.wishes.push(res.data.wish);
                        self.resetFormData();
                        EventBus.$emit('showSnackbar',{ color: 'success', message: 'Wish Card Added Successfully'});
                    } else {
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'Something went wrong'});
                    }
                }).catch((err) => {
                    if(err.status == 403){
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'Not Authorized'});
                        setTimeout(() => {
                            this.$router.push('/login');
                        }, 4000);
                    }else {
                        EventBus.$emit('showSnackbar',{ color: 'error', message: 'Something went wrong'});
                    }
                });
            }
        },
        resetFormData(){
            const self = this;
            self.newWish = {
                name: '',
                wishMessage: '',
            };
        },
        closeNewWishPopup(){
            const self = this;
            self.showCreateWishPopup = false;
            self.newWish = {
                name: '',
                wishMessage: '',
            }
        }
    }, 
}
</script>
<style lang="scss">
.user-home-main{
    .wishes-card{
        margin: auto;
        background: linear-gradient(45deg, #6a808a, #6a809a, #6a810a, #6a810b);
        width: 100%;
        height: auto;
        padding-bottom: 2rem;
        .v-card__title{
            font-size: 2rem;
            padding: 2rem;
        }
        .v-card__text{
            padding: 0 2rem;
        }
    }
}
</style>