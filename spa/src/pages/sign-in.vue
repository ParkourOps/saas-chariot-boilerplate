<script setup lang="ts">
import { EmailAddress } from '@/_common_/models';
import {useUserAuthentication} from '@/framework/features/user-authentication';
import actor from '@/framework/libraries/actor';
import Actor from '@/framework/libraries/actor';
import logger from '@/framework/libraries/logger';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';
const userAuthentication = useUserAuthentication();
const toast = useToast();

    definePage({
        meta: {
            requiresAuth: false,
            showTopBar: false,
        }
    });

    const emailAddress = ref<string>();
    const emailAddressValid = ref<boolean>();

    const sendSignInLink = Actor.act(async ()=>{
        try {
            await userAuthentication.signInWithLink.sendSignInLink(
                emailAddress.value ?? "",
                {name: '/sign-in'},
            );
            toast.add({
                severity: "success",
                summary: "Link sent!",
                detail: "Please check your inbox."
            });
        } catch (e) {
            if (e instanceof Error) {
                logger.error(e);
                toast.add({
                    severity: "error",
                    summary: "Link not sent.",
                    detail: e.message,
                });
            } else {
                toast.add({
                    severity: "error",
                    summary: "Link not sent.",
                    detail: "Something went wrong. Please try again and get in touch if this error persists."
                });
            }
        }
    });

    onMounted(async ()=>{
        await actor.act([
            // attempt to catch sign in attempt
            async ()=>{
                try {
                    await userAuthentication.signInWithLink.catchSignInWithLinkAttempt();
                } catch (e) {
                    if (e instanceof Error) {
                        logger.error(e);
                        toast.add({
                            severity: "error",
                            summary: "Could not sign in.",
                            detail: e.message,
                        });
                    }
                }
            },
            // use email stored from previous attempt if available
            ()=>{
                emailAddress.value = userAuthentication.signInWithLink.getSignInEmailFromPreviousSignInWithLinkAttempt() ?? undefined;
            }
        ])();
    })
</script>

<template>
    <SingleCardLayout>
        <template #header>
            <div class="pt-6 sm:pt-8 flex flex-col gap-4">
                <Logo class="mx-auto" />
                <p class="text-center max-w-80 mx-auto">Please enter your email address and we'll send you a sign in link.</p>
            </div>
        </template>

        <template #default>
            <div class="flex flex-col gap-4">
                <FormInputText name="email" label="Email" align="center" icon="fi-ss-envelope" v-model="emailAddress" v-model:valid="emailAddressValid" :schema="EmailAddress" required size="large" />
            </div>
        </template>

        <template #footer>
            <Button class="w-full" :disabled="!emailAddressValid" @click="sendSignInLink">Send</Button>
        </template>
    </SingleCardLayout>
</template>
