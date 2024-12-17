<template>
  <div>
    <h1>Emploi du Temps</h1>
    <!-- VueCal avec les événements -->
    <vue-cal
      :events="calendarEvents"
      locale="fr"
      :time="true"
      hide-weekends
      :time-from="8 * 60"
      :time-to="19 * 60"
      :time-cell-height="50"
      :disableViews="['years', 'year', 'month']"
      active-view="week"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import ICAL from 'ical.js';

export default defineComponent({
  components: {
    VueCal,
  },
  props: {
    icsFilePath: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      events: [], // Les événements bruts
      subjectColors: {
        "POO": "#66FF66",
        "Anglais": "#008080",
        "Base de donnees": "#FFCC66",
        "Algorithmique et Programmation 4": "#66CCFF",
        "SAE Projet Algo 4 TP-A": "#CCFF66",
        "SAE Projet Algo 4 TP-B": "#CCFF66",
        "Architecture 2 TD1": "#b52844",
        "Architecture 2": "#b52844",
        "SAE CPP_CTR TD1": "#FF6FCF",
        "Algo 4 TD1": "#66CCFF",
      },
    };
  },
  computed: {
    calendarEvents() {
      return this.events.map((event) => ({
        ...event,
        style: { backgroundColor: event.color },
        className: event.class,
      }));
    },
  },
  watch: {
    icsFilePath: {
      immediate: true,
      handler() {
        this.loadICSFile();
      },
    },
  },
  methods: {
    // Charger le fichier ICS avec gestion des chemins et cache
    async loadICSFile() {
      const url = `${window.location.origin}${this.icsFilePath}?nocache=${Date.now()}`; // URL absolue avec cache-buster
      console.log("Trying to fetch ICS file from:", url); // Debug log

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const icsContent = await response.text();
        console.log("ICS file loaded successfully:", icsContent); // Debug log
        this.parseICS(icsContent); // Analyse le contenu ICS
      } catch (error) {
        console.error("Error loading or parsing the ICS file:", error);
      }
    },

    // Analyse du contenu ICS
    parseICS(icsContent: string) {
      try {
        console.log("Contenu ICS reçu :", icsContent); // Log du contenu brut

        const jcalData = ICAL.parse(icsContent);
        console.log("Données après parsing ICAL :", jcalData); // Log des données parsées

        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");
        console.log("Événements trouvés :", vevents); // Log des événements extraits

        const events = vevents.map((vevent) => {
          const event = new ICAL.Event(vevent);
          const title = event.summary || "Événement sans titre";
          const start = event.startDate.toJSDate();
          const end = event.endDate.toJSDate();
          const location = event.location || "";

          console.log("Événement analysé :", { title, start, end, location }); // Log chaque événement traité

          let color = "#00B5E2"; // Couleur par défaut
          let eventClass = "no-class";

          for (const subject in this.subjectColors) {
            if (title.toLowerCase().includes(subject.toLowerCase())) {
              color = this.subjectColors[subject];
              eventClass = subject
                .toLowerCase()
                .replace(/[\s]+/g, "-")
                .replace(/[^\w-]/g, "");
              break;
            }
          }

          return {
            title,
            start,
            end,
            location,
            color,
            class: eventClass,
          };
        });

        console.log("Liste complète des événements :", events); // Log final des événements formatés
        this.events = events;
      } catch (error) {
        console.error("Erreur lors de l’analyse du contenu ICS :", error);
      }
    }
  },
});
</script>

<style>
.vuecal__event {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 5px;
  margin: 2px;
  font-size: 14px;
  color: white;
  text-align: center;
}

.vuecal__event.no-class {
  background-color: #f0f0f0 !important;
  color: black;
}

.vuecal__event:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}
</style>
