import type { App } from "vue";

import PrimeVue from "primevue/config"
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import DialogService from 'primevue/dialogservice';
import Tooltip from 'primevue/tooltip';

import "@/assets/styles/global.css"
// @ts-ignore
import Lara from "@/assets/styles/theme/primevue-presets/lara"
import MandatoryComponents from "./components/MandatoryComponents.vue";

export default {
    install(app: App) {
        app
            .use(PrimeVue, {
                unstyled: true,
                pt: Lara,
                ripple: true
            })
            .use(ToastService)
            .use(ConfirmationService)
            .use(DialogService)
            .directive('tooltip', Tooltip)
            .component("MandatoryComponents", MandatoryComponents)

        console.debug("User interface installed.");
    }
}
