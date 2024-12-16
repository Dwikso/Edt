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
                    throw new Error(`Erreur lors du chargement du fichier : ${this.icsFilePath}`);
                }
                const icsContent = await response.text();
                this.parseICS(icsContent);
            }
            catch (error) {
                console.error("Erreur lors du chargement ou de l’analyse du fichier ICS :", error);
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
            }
            catch (error) {
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
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("calendar-container") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.VueCal;
    /** @type { [typeof __VLS_components.VueCal, typeof __VLS_components.vueCal, typeof __VLS_components.VueCal, typeof __VLS_components.vueCal, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ events: ((__VLS_ctx.calendarEvents)), eventColor: ((__VLS_ctx.getEventColor)), eventClass: ((__VLS_ctx.getEventClass)), locale: ("fr"), time: ((true)), hideWeekends: (true), timeFrom: ((8 * 60)), timeTop: ((19 * 60)), timeCellHeight: ((50)), }));
    const __VLS_2 = __VLS_1({ events: ((__VLS_ctx.calendarEvents)), eventColor: ((__VLS_ctx.getEventColor)), eventClass: ((__VLS_ctx.getEventClass)), locale: ("fr"), time: ((true)), hideWeekends: (true), timeFrom: ((8 * 60)), timeTop: ((19 * 60)), timeCellHeight: ((50)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_styleScopedClasses['calendar-container'];
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
