<script lang="ts">
    import { getAllProfiles } from "$lib/firebase";
    import Profile from "./profile.svelte";
    const profiles = getAllProfiles();
</script>

{#if Object.keys($profiles).length === 0}
    Loading profiles...
{:else}
    <div>
        {#each Object.values($profiles) as profile}
            <h3>{profile.name}</h3>
        {/each}
    </div>
{/if}
