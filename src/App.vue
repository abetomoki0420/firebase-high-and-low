<script setup lang="ts">
import { ref } from "vue";
import { useHighAndLow } from "@/composables/highAndLow";

const {
  player,
  isPlayerTurn,
  playerPoints,
  information,
  waiting,
  enter,
  exit,
  choice,
} = useHighAndLow();

const entryName = ref("");

const entry = () => {
  if (!entryName.value) {
    return;
  }

  enter(entryName.value);
  entryName.value;
};
</script>

<template>
  <h1>High and Low</h1>
  <template v-if="!player">
    <div>
      <label for="username">Name</label>
      <input v-model="entryName" id="username" type="text" />
      <button @keydown.enter="entry" @click="entry">Entry</button>
    </div>
  </template>
  <template v-else>
    <div>
      <span>Your: {{ player }}</span>
      <span>Points: {{ playerPoints }}</span>
      <button @click="exit">exit</button>
    </div>
    <template v-if="waiting">
      <span>waiting a player...</span>
    </template>
    <template v-else>
      <div v-if="information">
        <div>
          <span>remain: {{ information.remainNumber }}</span>
        </div>
        <div v-if="information.currentNumber">
          <span>current: {{ information.currentNumber }}</span>
        </div>
        <template v-if="isPlayerTurn">
          <button @click="choice('high')">High</button>
          <button @click="choice('low')">Low</button>
        </template>
      </div>
    </template>
  </template>
</template>
