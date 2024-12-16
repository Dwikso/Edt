<template>
  <div>
    <Calendar :icsFilePath="'edt/ADECalGrpA.ics'" />
  </div>
</template>

<script lang="ts">
import Calendar from './components/Calendar.vue';

export default {
  components: {
    Calendar,
  },
};
</script>
