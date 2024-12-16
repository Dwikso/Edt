import Calendar from './components/Calendar.vue';
export default (await import('vue')).defineComponent({
    components: {
        Calendar,
    },
});
; /* PartiallyEnd: #3632/script.vue */
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{
            Calendar,
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
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Calendar;
    /** @type { [typeof __VLS_components.Calendar, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ icsFilePath: (('/edt/ADECalGrpA.ics')), }));
    const __VLS_2 = __VLS_1({ icsFilePath: (('/edt/ADECalGrpA.ics')), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
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
