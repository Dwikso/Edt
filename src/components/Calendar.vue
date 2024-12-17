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
import { defineComponent, watch } from 'vue';
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
    // Générer les événements avec couleurs et classes
    calendarEvents() {
      return this.events.map((event) => ({
        ...event,
        // Style inline pour la couleur
        style: { backgroundColor: event.color },
        // Classe CSS dynamique
        className: event.class,
      }));
    },
  },
  mounted() {
    this.loadICSFile(); // Charger le fichier ICS au montage
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
    // Charger le fichier ICS
    async loadICSFile() {
      try {
        const response = await fetch(this.icsFilePath);
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement du fichier : ${this.icsFilePath}`);
        }
        const icsContent = await response.text();
        this.parseICS(icsContent); // Analyser le contenu du fichier ICS
      } catch (error) {
        console.error("Erreur lors du chargement ou de l’analyse du fichier ICS :", error);
      }
    },

    // Analyser le contenu ICS
    parseICS(icsContent) {
      try {
        const jcalData = ICAL.parse(icsContent);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");

        const events = vevents.map((vevent) => {
          const event = new ICAL.Event(vevent);
          const title = event.summary || "Événement sans titre";
          const start = event.startDate.toJSDate();
          const end = event.endDate.toJSDate();
          const location = event.location || "";

          let color = "#00B5E2"; // Couleur par défaut
          let eventClass = "no-class"; // Classe CSS par défaut
          let matched = false;

          // Associer des couleurs et des classes
          for (const subject in this.subjectColors) {
            if (title.toLowerCase().includes(subject.toLowerCase())) {
              color = this.subjectColors[subject];
              eventClass = subject
                .toLowerCase()
                .replace(/[\s]+/g, "-")
                .replace(/[^\w-]/g, "");
              matched = true;
              break;
            }
          }
          if (!matched) {
            eventClass = "no-class";
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

        this.events = events;
      } catch (error) {
        console.error("Erreur lors de l’analyse du contenu ICS :", error);
      }
    },
  },
});
</script>


<style>

.vuecal {
}

.vuecal__event {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 5px;
  margin: 2px;
  font-size: 14px;
  color: white;
  text-align: center;
}


.vuecal__event.poo {
  background-color: #66FF66 !important;
}

.vuecal__event.anglais {
  background-color: #008080 !important;
}

.vuecal__event.base_de_donnees {
  background-color: #C0C0C0 !important;
  color: black;
}

.vuecal__event.algorithmique-et-programmation-4 {
  background-color: #66CCFF !important;
}

.vuecal__event.architecture-2 {
  background-color: #b52844 !important;
}

.vuecal__event.sae-cpp_ctr-td1 {
  background-color: #FF6FCF !important;
}

.vuecal__event.sae-projet-algo-4-tp-a {
  background-color: #CCFF66 !important;
  color: black;
}

.vuecal__event.sae-projet-algo-4-tp-b {
  background-color: #CCFF66 !important;
  color: black;
}

.vuecal__event.algo-4-td1 {
  background-color: #66CCFF !important;
}

.vuecal__event.no-class {
  background-color: #F0F0F0 !important;
  color: black;
}


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

