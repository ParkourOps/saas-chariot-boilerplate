import { defineStore } from "pinia";
import { ref, computed } from "vue";
import UniqueIdGenerator from "@/_common_/libraries/unique-id-generator"

type PendingAction = {
    id: string
}

const uniqueIdGenerator = new UniqueIdGenerator("action");

const useBusyStatus = defineStore("Busy", ()=>{
    const pendingActions = ref<Array<PendingAction>>([]);

    function registerPendingAction() {
        const id = uniqueIdGenerator.generate();
        console.debug(`Doing: ${id}`);
        pendingActions.value.push({
            id,
        });
        return {
            unregisterPendingAction() {
                console.debug(`Done: ${id}`);
                pendingActions.value = pendingActions.value.filter((a)=>a.id !== id);
            },
        };
    }

    const busy = computed(() => pendingActions.value.length > 0);

    return {
        registerPendingAction,
        busy
    }
});

export default useBusyStatus;
