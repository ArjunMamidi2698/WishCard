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
                            <v-text-field solo v-model="wish.wish" :readonly="!wish.edit" hide-details class="my-3"></v-text-field>
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
                            <v-text-field solo v-model="newWish.name" hide-details class="my-3 mr-2" label="Whom you wanna wish*"></v-text-field>
                            <v-text-field solo v-model="newWish.wish" hide-details class="my-3" label="Your wish*"></v-text-field>
                            <v-btn icon @click="saveWish()" class="align-self-center"><v-icon>done</v-icon></v-btn>
                            <v-btn icon @click="closeNewWishPopup()" class="align-self-center"><v-icon>close</v-icon></v-btn>
                        </div>
                    </div>
                </v-card-text>
            </v-card>
        </v-container>
    </div>
</template>
<script>
import wishHeader from '@/components/wishHeader.vue'

export default {
    name: 'userHome',
    components: {
        wishHeader,
    },
    data() {
        return {
            showCreateWishPopup: false,
            newWish: {
                name: '',
                wish: '',
            },
            wishes: [
                {
                    wishId: '1',
                    wish: 'wish message',
                    name: 'Arjun',
                    edit: false,
                    link: 'http://localhost:2698/#/wishView/wishId',
                    copiedContent: false,
                },{
                    wishId: '2',
                    wish: 'wish message',
                    name: 'Arjun',
                    edit: false,
                    link: 'http://localhost:2698/#/wishView/wishId',
                    copiedContent: false,
                },{
                    wishId: '3',
                    wish: 'wish message',
                    name: 'Arjun',
                    edit: false,
                    link: 'http://localhost:2698/#/wishView/wishId',
                    copiedContent: false,
                },{
                    wishId: '4',
                    wish: 'wish message',
                    name: 'Arjun',
                    edit: false,
                    link: 'http://localhost:2698/#/wishView/wishId',
                    copiedContent: false,
                },{
                    wishId: '5',
                    wish: 'wish message',
                    name: 'Arjun',
                    edit: false,
                    link: 'http://localhost:2698/#/wishView/wishId',
                    copiedContent: false,
                },{
                    wishId: '6',
                    wish: 'wish message',
                    name: 'Arjun',
                    edit: false,
                    link: 'http://localhost:2698/#/wishView/wishId',
                    copiedContent: false,
                },{
                    wishId: '7',
                    wish: 'wish message',
                    name: 'Arjun',
                    edit: false,
                    link: 'http://localhost:2698/#/wishView/wishId',
                    copiedContent: false,
                },{
                    wishId: '8',
                    wish: 'wish message',
                    name: 'Arjun',
                    edit: false,
                    link: 'http://localhost:2698/#/wishView/wishId',
                    copiedContent: false,
                },
            ],
        }
    },
    methods: {
        deleteWishLink(wishObj, index){
            const self = this;
            self.wishes.splice(index, 1);
        },
        copyWishLink(wish){
            const self = this;
            const wishLink = wish.link;
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
                    wish: wish.wish
                };
            } else {
                self.updateWish(wish);
            }
            wish.edit = !wish.edit;
        },
        updateWish(wish){
            const self = this;
        },
        cancelEdit(wish, index){
            const self = this;
            wish.name = wish.dummyData.name || wish.name;
            wish.wish = wish.dummyData.wish || wish.wish;
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
            self.showCreateWishPopup = false;
            
        },
        closeNewWishPopup(){
            const self = this;
            self.showCreateWishPopup = false;
            self.newWish = {
                name: '',
                wish: '',
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