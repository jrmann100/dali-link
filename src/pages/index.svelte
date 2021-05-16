<script lang="ts">
    import { getAllProfilesID } from "$lib/firebase";
    const profiles = getAllProfilesID();
    import ProfileCard from "$lib/ProfileCard.svelte";
</script>

{#if Object.keys($profiles).length === 0}
    <div class="splash">Loading profiles...</div>
{:else}
    <div>
        {#each Object.values($profiles) as uid}
            <ProfileCard {uid} />
        {/each}
    </div>
{/if}

<style>
    div {
        min-width: 90%;
    }
</style>
