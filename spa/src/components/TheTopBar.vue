<script setup lang="ts">
import { useUserAuthentication } from '@/framework/features/user-authentication';
import actor from '@/framework/libraries/actor';

    const userAuthentication = useUserAuthentication();

    const signOut = actor.act(userAuthentication.signOut);
</script>

<template>
    <header class="bg-primary-500 shadow">
        <div class="flex flex-row justify-center items-center sm:justify-between w-full max-w-screen-xl mx-auto text-surface-0 p-4">
            <h1 class="font-extrabold text-xl sm:text-3xl w-fit">
                SaaS Chariot
            </h1>
            <Button severity="plain" size="small" text rounded @click="signOut">Sign Out</Button>
        </div>
    </header>
</template>
