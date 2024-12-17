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
            }
            catch (error) {
                console.error("Error loading or parsing the ICS file:", error);
            }
        },
        // Analyse du contenu ICS
        parseICS(icsContent) {
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
            }
            catch (error) {
                console.error("Erreur lors de l’analyse du contenu ICS :", error);
            }
        }
    },
});
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{
            VueCal,
        },
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VueCal;
    /** @type { [typeof __VLS_components.VueCal, typeof __VLS_components.vueCal, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ events: ((__VLS_ctx.calendarEvents)), locale: ("fr"), time: ((true)), hideWeekends: (true), timeFrom: ((8 * 60)), timeTo: ((19 * 60)), timeCellHeight: ((50)), disableViews: ((['years', 'year', 'month'])), activeView: ("week"), }));
    const __VLS_2 = __VLS_1({ events: ((__VLS_ctx.calendarEvents)), locale: ("fr"), time: ((true)), hideWeekends: (true), timeFrom: ((8 * 60)), timeTo: ((19 * 60)), timeCellHeight: ((50)), disableViews: ((['years', 'year', 'month'])), activeView: ("week"), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {};
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
let __VLS_self;
