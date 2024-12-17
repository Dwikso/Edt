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
        file1: '/edt/ADECalGrpA.ics',
        file2: '/edt/ADECalGrpB.ics',
      },
      icsFilePath: '/edt/ADECalGrpA.ics',
    };
  },
  methods: {
    updateICSFile() {
      this.icsFilePath = this.files[this.selectedFile];
    },
  },
});
</script>

<style>
/* Style global de la select box */
select {
  appearance: none; /* Retirer les styles natifs des navigateurs */
  -webkit-appearance: none; /* Chrome/Safari */
  -moz-appearance: none; /* Firefox */
  width: 100%; /* Responsive */
  max-width: 300px; /* Largeur maximale */
  padding: 10px 12px; /* Espacement intérieur */
  font-size: 16px;
  color: #333; /* Texte gris foncé */
  background-color: #f8f8f8; /* Couleur de fond douce */
  border: 1px solid #ccc; /* Bordure grise */
  border-radius: 6px; /* Coins arrondis */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Ombre légère */
  cursor: pointer; /* Curseur pointeur */
  transition: all 0.3s ease-in-out; /* Transition douce */
  outline: none;

  /* Ajouter une flèche personnalisée */
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gray"><path d="M5.516 7.548a.625.625 0 0 1 .854 0L10 11.179l3.63-3.63a.625.625 0 0 1 .884.884l-4.073 4.073a.625.625 0 0 1-.884 0L5.516 8.432a.625.625 0 0 1 0-.884z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 14px;
}

/* Effet au survol */
select:hover {
  border-color: #999; /* Bordure légèrement plus foncée */
  background-color: #f0f0f0;
}

/* Effet au focus */
select:focus {
  border-color: #00b5e2; /* Bordure bleue */
  box-shadow: 0 0 4px rgba(0, 181, 226, 0.6); /* Ombre bleutée */
}

/* Style pour option */
option {
  background-color: white;
  color: #333;
  font-size: 14px;
}

/* Responsive pour petits écrans */
@media (max-width: 480px) {
  select {
    font-size: 14px;
    padding: 8px 10px;
    max-width: 100%; /* Utilise toute la largeur */
  }
}


</style>
