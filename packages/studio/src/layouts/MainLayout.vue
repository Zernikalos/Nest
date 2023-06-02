<template>
  <q-layout view="hHh lpr lFf">
    <q-header>
      <q-bar class="q-electron-drag bg-blue-grey-9 text-white">
          <q-icon name="img:zklogo.png">
          </q-icon>

          <div>Zernikalos Studio</div>

        <q-space />

        <q-btn dense flat icon="minimize" @click="minimize" />
        <q-btn dense flat icon="crop_square" @click="toggleMaximize"/>
        <q-btn dense flat icon="close" @click="closeApp"/>
      </q-bar>
<!--        <q-toolbar class="bg-primary text-white">-->
<!--            <q-btn flat round dense icon="menu" class="q-mr-sm" />-->
<!--            <q-avatar>-->
<!--                <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">-->
<!--            </q-avatar>-->

<!--            <q-toolbar-title>Quasar Framework</q-toolbar-title>-->

<!--            <q-btn flat round dense icon="whatshot" />-->
<!--        </q-toolbar>-->
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      behavior="desktop"
      mini-to-overlay
      mini
    >
      <NavigationBar></NavigationBar>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {ref} from "vue"
import NavigationBar from "components/navigationbar/NavigationBar.vue"

// const miniState = ref(false)

const leftDrawerOpen = ref(false)

// function toggleLeftDrawer () {
//   leftDrawerOpen.value = !leftDrawerOpen.value
// }

function minimize() {
    // @ts-ignore
    window.ElectronWindowAPI.minimize()
}

function toggleMaximize() {
    // @ts-ignore
    window.ElectronWindowAPI.toggleMaximize()
}

function closeApp() {
    // @ts-ignore
    window.ElectronWindowAPI.close()
}
</script>
