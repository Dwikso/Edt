<template>
  <div class="calendar-container">
    <h1>Emploi du Temps</h1>

    <!-- Vue Cal -->
    <vue-cal
      :events="calendarEvents"
      :event-color="getEventColor"
      :event-class="getEventClass"
      locale="fr"
      :time="true" hide-weekends
      :time-from="8 * 60"
      :time-top="19 * 60"
      :timeCellHeight="50"
    ></vue-cal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import ICAL from "ical.js";

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
      events: [],
      subjectColors: {
        "POO": '#66FF66',
        "Anglais": '#008080',
        "Base de donnees": '#FFCC66',
        "Algorithmique et Programmation 4": '#66CCFF',
        "SAE Projet Algo 4 TP-A": '#CCFF66',
        "Architecture 2 TD1": "#b52844",
        "Architecture 2": "#b52844",
        "SAE CPP_CTR TD1": "#FF6FCF",
        "Algo 4 TD1": "#66CCFF",
      },
    };
  },
  computed: {
    calendarEvents() {
      console.log("Événements à afficher dans le calendrier :", this.events);

      return this.events.map((event) => {
        const eventData = {
          color: event.color || '#00B5E2',
          end: new Date(event.end),
          location: event.location,
          start: new Date(event.start),
          title: event.title,
          class: event.class,
        };

        console.log("Événement avec couleur et classe:", eventData);

        return eventData;
      });
    },
  },
  mounted() {
    this.loadICSFile();
  },
  methods: {
    async loadICSFile() {
      try {
        const response = await fetch(this.icsFilePath);
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement du fichier : ${this.icsFilePath}. Code HTTP : ${response.status}`);
        }
        const icsContent = await response.text();
        this.parseICS(icsContent);
      } catch (error) {
        console.error("Erreur lors du chargement ou de l’analyse du fichier ICS :", error);
        alert("Impossible de charger le fichier ICS. Vérifiez l'URL du fichier ou la disponibilité du serveur.");
      }
    },
    parseICS(icsContent) {
      try {
        const jcalData = ICAL.parse(icsContent);
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");

        const events = vevents.map((vevent) => {
          const event = new ICAL.Event(vevent);
          const start = event.startDate.toJSDate();
          const end = event.endDate.toJSDate();
          const location = event.location || '';
          const title = event.summary || 'Événement sans titre';

          let color = '#00B5E2';
          let eventClass = '';
          let matched = false;

          for (const subject in this.subjectColors) {
            if (title.toLowerCase().includes(subject.toLowerCase())) {
              color = this.subjectColors[subject];
              eventClass = subject.toLowerCase().replace(/\s/g, '-');
              matched = true;
              break;
            }
          }

          if (!matched) {
            eventClass = 'no-class';
            color = '#00B5E2';
          }

          console.log("Événement extrait avec couleur et classe:", { title, start, end, location, color, eventClass });

          return {
            title,
            start,
            end,
            location,
            color,
            class: eventClass,
          };
        });

        console.log("Événements extraits avec couleurs et classes :", events);
        this.events = events;
      } catch (error) {
        console.error("Erreur lors de l’analyse du contenu ICS :", error);
      }
    },

    getEventColor(event) {
      return event.color || '#00B5E2';
    },

    getEventClass(event) {
      return event.class || 'no-class';
    },
  },
});
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

.calendar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 0;
  box-sizing: border-box;
}

h1 {
  text-align: center;
  margin: 10px 0;
  font-size: 24px;
  color: #333;
}

.vue-cal {
  flex-grow: 1;
}

.vuecal__event-time {
  height: 60px;
}

.vuecal__event {
  height: 50px;
}

.vuecal__event.poo {
  background-color: #66FF66;
  color: black;
}

.vuecal__event.anglais {
  background-color: #008080;
  color: black;
}

.vuecal__event.base-de-donnees {
  background-color: #FFCC66;
  color: black;
}

.vuecal__event.algorithmique-et-programmation-4 {
  background-color: #66CCFF;
  color: black;
}

.vuecal__event.architecture-2 {
  background-color: #b52844;
  color: black;
}

.vuecal__event.architecture-2-td1 {
  background-color: #b52844;
  color: black;
}

.vuecal__event.sae-cpp_ctr-td1 {
  background-color: #FF6FCF;
  color: black;
}

.vuecal__event.no-class {
  background-color: #f0f0f0;
  color: black;
}

.vuecal__event.sae-projet-algo-4-tp-a {
  background-color: #CCFF66;
  color: black;
}

.vuecal__event.algo-4-td1 {
  background-color: #66CCFF;
  color: black;
}

.vuecal__event-content {
  height: 100px;
}
</style>
