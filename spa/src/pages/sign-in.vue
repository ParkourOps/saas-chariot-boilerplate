<script setup lang="ts">
import { EmailAddress } from "@/_common_/models";
import { signInWithLink as _signInWithLink, signInWithThirdPartyAccount as _signInWithThirdPartyAccount} from "@/framework/features/user-authentication";
import actor from "@/framework/libraries/actor";
import Actor from "@/framework/libraries/actor";
import handleErrorInUI from "@/framework/utilities/handle-error-in-ui";
import { useToast } from "primevue/usetoast";
import { onMounted, ref } from "vue";

const toast = useToast();

definePage({
    meta: {
        requiresAuth: false,
        showTopBar: false
    }
});

const emailAddress = ref<string>();
const emailAddressValid = ref<boolean>();

const sendSignInLink = Actor.act(async () => {
    try {
        await _signInWithLink.sendSignInLink(emailAddress.value ?? "", {
            name: "/sign-in"
        });
        toast.add({
            severity: "info",
            summary: "Link sent!",
            detail: "Please check your inbox."
        });
    } catch (e) {
        handleErrorInUI(
            toast,
            e,
            "Failed to send link.",
            "Something went wrong while trying to send your sign in link (probably on our side). Please try again and get in touch if this error persists."
        );
    }
});

const signInWithThirdPartyAccount = (
    provider: Parameters<typeof _signInWithThirdPartyAccount>[0]
) =>
    Actor.act(async () => {
        try {
            await _signInWithThirdPartyAccount(provider);
        } catch (e) {
            handleErrorInUI(
                toast,
                e,
                "Failed to sign in.",
                "Something went wrong while trying to sign in with your third-party account account. Please try again and get in touch if this error persists."
            );
        }
    });

onMounted(async () => {
    await actor.act([
        // attempt to catch sign in attempt
        async () => {
            try {
                await _signInWithLink.catchSignInWithLinkAttempt();
            } catch (e) {
                handleErrorInUI(
                    toast,
                    e,
                    "Failed to sign in.",
                    "Something went wrong while trying to sign in with link. Please try again and get in touch if this error persists."
                );
            }
        },
        // use email stored from previous attempt if available
        () => {
            emailAddress.value =
                _signInWithLink.getSignInEmailFromPreviousSignInWithLinkAttempt() ??
                undefined;
        }
    ])();
});
</script>

<template>
    <SingleCardLayout>
        <template #header> </template>

        <template #default>
            <div class="flex flex-col gap-4">
                <Logo class="mx-auto" />
                <p class="text-center max-w-96 mx-auto px-4 my-4">
                    Please enter your email address and we'll send you a sign in link.
                </p>
                <FormInputText
                    name="email"
                    label="Email"
                    align="center"
                    icon="fi-ss-envelope"
                    v-model="emailAddress"
                    v-model:valid="emailAddressValid"
                    :schema="EmailAddress"
                    required
                    size="large"
                />
            </div>
        </template>

        <template #footer>
            <Button class="w-full" :disabled="!emailAddressValid" @click="sendSignInLink"
                >Get Link</Button
            >
            <Divider />
            <p class="text-center my-8">Or sign in with...</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                    class="w-full"
                    severity="secondary"
                    @click="signInWithThirdPartyAccount('google')()"
                >
                    <Vector name="google" class="size-5 fill-white dark:fill-surface-900" />
                </Button>
                <Button
                    class="w-full"
                    severity="secondary"
                    @click="signInWithThirdPartyAccount('github')()"
                >
                    <Vector name="github" class="size-6 fill-white dark:fill-surface-900" />
                </Button>
                <Button
                    class="w-full"
                    severity="secondary"
                    @click="signInWithThirdPartyAccount('twitter')()"
                >
                    <Vector name="twitter" class="size-6 fill-white dark:fill-surface-900" />
                </Button>
                <Button
                    class="w-full"
                    severity="secondary"
                    @click="signInWithThirdPartyAccount('facebook')()"
                >
                    <Vector name="facebook" class="size-6 fill-white dark:fill-surface-900" />
                </Button>
            </div>
        </template>
    </SingleCardLayout>
</template>
