<script lang="ts">
    import { getAllProfilesID } from "$lib/firebase";
    const profiles = getAllProfilesID();
    import ProfileCard from "$lib/ProfileCard.svelte";
    let selected: number | null = null;
</script>

{#if Object.keys($profiles).length === 0}
    <div class="splash">Loading profiles...</div>
{:else}
    <div>
        {#each Object.values($profiles) as uid, i}
            <ProfileCard
                on:expand={() => (selected = selected === i ? null : i)}
                {uid}
                expanded={i === selected}
            />
        {/each}
    </div>
{/if}
