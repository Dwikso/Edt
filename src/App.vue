<template>
  <div>
    <!-- Select pour choisir le fichier ICS -->
    <select v-model="selectedFile" @change="updateICSFile">
      <option value="file1">Groupe A</option>
      <option value="file2">Groupe B</option>
    </select>

    <!-- Calendar component qui prend la prop icsFilePath -->
    <Calendar :icsFilePath="icsFilePath" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Calendar from './components/Calendar.vue';

export default defineComponent({
  components: {
    Calendar,
  },
  data() {
    return {
      selectedFile: 'file1',
      files: {
        file1: 'edt/ADECalGrpA.ics',
        file2: 'edt/ADECalGrpB.ics',
      },
      icsFilePath: 'public/edt/ADECalGrpA.ics',
    };
  },
  methods: {
    updateICSFile() {
      this.icsFilePath = this.files[this.selectedFile];
    },
  },
});
</script>
