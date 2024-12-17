<template>
  <div>
    <h1>Emploi du Temps</h1>
    <vue-cal
      :events="calendarEvents"
      locale="fr"
      :time="true"
      hide-weekends
      :time-from="8 * 60"
      :time-to="19 * 60"
      :time-cell-height="60"
      :disableViews="['years', 'year', 'month']"
      active-view="week"
    >
      <!-- Slot pour personnaliser l'affichage des événements -->
      <template #event="{ event }">
        <div>
          <strong>{{ event.title }}</strong>
          <div style="font-size: 10px;">Professeur: {{ event.professor }}</div>
        </div>
      </template>
    </vue-cal>
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
        const comp = new ICAL.Component(jcalData);
        const vevents = comp.getAllSubcomponents("vevent");
        console.log("Événements trouvés :", vevents); // Log des événements extraits

        const events = vevents.map((vevent) => {
          const event = new ICAL.Event(vevent);
          const title = event.summary || "Événement sans titre";
          const start = event.startDate.toJSDate();
          const end = event.endDate.toJSDate();
          const location = event.location || "";
          const desc = event.description || "";

          // Extraire le nom du professeur depuis la description
          let professor = "Inconnu";
          const lines = desc.split(/\r?\n/).filter(line => line.trim() !== ""); // Diviser en lignes non vides
          const exportLineIndex = lines.findIndex(line => line.includes("(Exporté le:")); // Trouver la ligne d'export
          if (exportLineIndex > 0) {
            professor = lines[exportLineIndex - 1].trim(); // Prendre la ligne juste avant
          }

          console.log("Événement analysé :", { title, start, end, location, desc, professor });

          // Définir la couleur et la classe en fonction des matières
          let color = "#00B5E2"; // Default color
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
            title, // Ajouter le nom du professeur au titre
            start,
            end,
            location,
            desc,
            professor, // Ajouter le prof en propre si besoin
            class: eventClass,
            style: { backgroundColor: color },
          };
        });

        console.log("Liste complète des événements :", events); // Log final des événements formatés
        this.events = events;
      } catch (error) {
        console.error("Erreur lors de l’analyse du contenu ICS :", error);
      }
    },
  },
});
</script>

<style>
h1{
  display: flex;
  justify-content: center;
  padding: 10px;
}

.vuecal {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.vuecal .vuecal__event {
  border-radius: 8px !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
  padding: 3px !important;
  margin: 2px !important;
  font-size: 12px !important;
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
.vuecal .vuecal__event[class*="sae-projet-algo-4-tp-b"] { background-color: #CCFF66 !important; color: black !important; }
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

@media (max-width: 768px) {
  .vuecal .vuecal__event {
    font-size: 10px !important;
    padding: 2px;
  }

  h1 {
    font-size: 12px !important;
  }
  .vuecal {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .vuecal {
    font-size: 10px;
  }

  h1 {
    font-size: 16px !important;
  }

  .vuecal .vuecal__event {
    font-size: 9px !important;
    padding: 1px !important;
  }

  .vuecal__body {
    overflow-x: auto ;
  }
}


</style>
