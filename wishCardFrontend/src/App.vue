<template>
  <div id="app">
    <v-app>
      <v-snackbar
        v-model="showSnackbar"
        top center :timeout=10000
        :color="snackBarColor">
        <v-icon dark v-if="snackBarColor == 'error'" class="pr-1">warning</v-icon>
        <v-icon dark v-else class="pr-1">done</v-icon>
        <b v-html="snackBarMessage"></b>
        <v-btn color="black" text @click="showSnackbar = false;">Close</v-btn>
      </v-snackbar>
      <router-view/>
      <v-col style="display:contents;">
        <v-spacer></v-spacer>
        <wishFooter/>
      </v-col>
    </v-app>
  </div>
</template>
<script>
import { EventBus } from '@/assets/js/eventBus';
import wishFooter from '@/components/wishFooter';

export default {
  name: 'App',
  components:{
    wishFooter,
  },
  data() {
    return {
      showSnackbar: false,
      snackBarColor: 'error',
      snackBarMessage: 'Something went wrong!!'
    }
  },
  mounted() {
    EventBus.$on('showSnackbar', (data) => {
      this.showSnackbar = true;
      this.snackBarColor = data.color;
      this.snackBarMessage = data.message;
    });
  },
}
</script>

<style>
#app {
  min-width: 700px;
  min-height: 700px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.error{
  background-color: red;
  border-color: red;
}
</style>
