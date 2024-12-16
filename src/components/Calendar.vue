<template>
  <div class="calendar-container">
    <h1>Calendrier des événements</h1>

    <!-- Vue Cal -->
    <vue-cal
      :events="calendarEvents"
      :event-color="getEventColor"
      locale="fr"
    />
  </div>
</template>

<script>
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
      // Liste des matières et des couleurs associées
      subjectColors: {
        "POO": '#66FF66',
        "Anglais": '#008080',
        "Base de données": '#FFCC66',
        "Algorithmique et Programmation 4": '#66CCFF',
        "SAE Projet Algo 4 TP-A": '#CCFF66',
        "Architecture 2 TD1": "#CCCCCC",
        "Architecture 2": "#CCCCCC",
        "SAE CPP_CTR TD1": "#FF6FCF",
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
        };

        console.log("Événement avec couleur:", eventData);

        return eventData;
      });
    },
  },
  mounted() {
    this.loadICSFile(); // Chargement du fichier ICS
  },
  methods: {
    // Charge le fichier ICS
    async loadICSFile() {
      try {
        const response = await fetch(this.icsFilePath);
        if (!response.ok) {
          throw new Error(`Erreur lors du chargement du fichier : ${this.icsFilePath}`);
        }
        const icsContent = await response.text();
        this.parseICS(icsContent); // Analyse du fichier ICS
      } catch (error) {
        console.error("Erreur lors du chargement ou de l’analyse du fichier ICS :", error);
      }
    },
    // Analyse le contenu du fichier ICS
    parseICS(icsContent) {
      try {
        const jcalData = ICAL.parse(icsContent); // Convertit le contenu ICS en données JCAL
        const comp = new ICAL.Component(jcalData); // Crée le composant ICAL
        const vevents = comp.getAllSubcomponents("vevent"); // Récupère tous les événements

        const events = vevents.map((vevent) => {
          const event = new ICAL.Event(vevent);
          const start = event.startDate.toJSDate(); // Convertir directement en objet Date
          const end = event.endDate.toJSDate(); // Convertir directement en objet Date
          const location = event.location || ''; // Lieu
          const title = event.summary || 'Événement sans titre'; // Titre de l'événement

          // Attribution de la couleur en fonction de la matière
          let color = '#00B5E2'; // Couleur par défaut (si pas de correspondance)
          for (const subject in this.subjectColors) {
            // Recherche sensible à la casse dans le titre
            if (title.toLowerCase().includes(subject.toLowerCase())) {
              color = this.subjectColors[subject];
              break;
            }
          }

          console.log("Événement extrait :", { title, start, end, location, color });

          return {
            title,   // Titre
            start,   // Date de début (objet Date)
            end,     // Date de fin (objet Date)
            location, // Lieu
            color,   // Couleur spécifique à la matière
          };
        });

        console.log("Événements extraits :", events);
        this.events = events; // Mettre à jour les événements dans le data
      } catch (error) {
        console.error("Erreur lors de l’analyse du contenu ICS :", error);
      }
    },

    // Fonction pour obtenir la couleur de l'événement
    getEventColor(event) {
      return event.color || '#00B5E2'; // Utiliser la couleur attribuée à l'événement
    },
  },
});
</script>

<style>
/* Assurez-vous que le calendrier occupe toute la fenêtre */
html, body {
  height: 100%; /* Garantit que le body et le html prennent toute la hauteur */
  margin: 0;    /* Enlève les marges par défaut */
}

.calendar-container {
  height: 100%; /* Prend toute la hauteur de l'écran */
  display: flex;
  flex-direction: column; /* Permet d'aligner les éléments de manière verticale */
  justify-content: flex-start; /* Garantit que le contenu reste en haut */
  padding: 0; /* Enlève les marges */
  box-sizing: border-box;
}

h1 {
  text-align: center;
  margin: 10px 0;
  font-size: 24px;
  color: #333;
}

.vue-cal {
  flex-grow: 1; /* Prend toute la place restante dans le conteneur */
}

/* Augmenter la hauteur des lignes horaires */
.vuecal .vuecal-time {
  height: 60px; /* Ajustez cette valeur selon vos besoins */
}

/* Optionnel : ajuster la taille des événements pour qu'ils s'adaptent mieux */
.vuecal .vuecal-event {
  height: 50px; /* Vous pouvez ajuster cette valeur pour modifier la taille des événements */
}
</style>
