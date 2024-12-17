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
      :cell-content="cellContent"
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
      const events = this.events.map((event) => ({
        ...event,
        className: event.class,
      }));
      console.log('Événements finaux:', events);
      return events;
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

          console.log(`Événement: ${title}, Couleur: ${color}, Classe: ${eventClass}`);

          return {
            title,
            start,
            end,
            location,
            class: eventClass,
            style: { backgroundColor: color }, // Utilisez directement la couleur comme style inline
          };
        });

        console.log("Liste complète des événements :", events); // Log final des événements formatés
        this.events = events;
      } catch (error) {
        console.error("Erreur lors de l’analyse du contenu ICS :", error);
      }
    },
    cellContent(cell) {
      console.log('Cell content:', cell);
      return '';
    },
  },
});
</script>

<style>
.vuecal .vuecal__event {
  border-radius: 8px !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
  padding: 5px !important;
  margin: 2px !important;
  font-size: 14px !important;
  color: white !important;
  text-align: center !important;
}

.vuecal .vuecal__event[class*="poo"] { background-color: #66FF66 !important; color: black !important; }
.vuecal .vuecal__event[class*="anglais"] { background-color: #008080 !important; color: black !important;}
.vuecal .vuecal__event[class*="base-de-donnees"] { background-color: #C0C0C0 !important; color: black !important; }
.vuecal .vuecal__event[class*="algorithmique-et-programmation-4"] { background-color: #66CCFF !important; }
.vuecal .vuecal__event[class*="architecture-2"] { background-color: #b52844 !important; }
.vuecal .vuecal__event[class*="sae-cpp_ctr-td1"] { background-color: #FF6FCF !important; }
.vuecal .vuecal__event[class*="sae-projet-algo-4-tp-a"] { background-color: #CCFF66 !important; color: black !important; }
.vuecal .vuecal__event[class*="algo-4-td1"] { background-color: #66CCFF !important; }
.vuecal .vuecal__event[class*="no-class"] { background-color: #F0F0F0 !important; color: black !important; }


.vuecal__event:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.vuecal__event-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>

