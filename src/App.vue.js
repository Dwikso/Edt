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
    __VLS_elementAsFunction(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({ ...{ onChange: (__VLS_ctx.updateICSFile) }, value: ((__VLS_ctx.selectedFile)), });
    __VLS_elementAsFunction(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({ value: ("file1"), });
    __VLS_elementAsFunction(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({ value: ("file2"), });
    const __VLS_0 = __VLS_resolvedLocalAndGlobalComponents.Calendar;
    /** @type { [typeof __VLS_components.Calendar, ] } */
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({ icsFilePath: ((__VLS_ctx.icsFilePath)), }));
    const __VLS_2 = __VLS_1({ icsFilePath: ((__VLS_ctx.icsFilePath)), }, ...__VLS_functionalComponentArgsRest(__VLS_1));
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
