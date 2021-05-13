<script lang="ts">
    import { getProfile, user } from "$lib/firebase";
    import { debounce } from "$lib/utils";
    import type { DocumentData } from "firebase/firestore";
    import { writable, get } from "svelte/store";
    import type { Writable } from "svelte/store";

    // This is not a good solution! Only works if user is editing one field at a time.
    let saved = true;

    const cloudProfile = getProfile();
    const localProfile: Writable<DocumentData | undefined> =
        writable(undefined);

    cloudProfile.subscribe((prof) => {
        if (
            $cloudProfile === undefined ||
            JSON.stringify($cloudProfile) === JSON.stringify($localProfile) // object comparison
        )
            return;
        $localProfile = Object.assign({}, $cloudProfile); // super important to clone it
        console.log("> downloading profile");
    });

    localProfile.subscribe(
        debounce((prof: DocumentData | undefined) => {
            if (
                $localProfile === undefined ||
                JSON.stringify($localProfile) === JSON.stringify($cloudProfile) // object comparison
            )
                return;
            console.log("< uploading profile");
            $cloudProfile = Object.assign({}, $localProfile); // super important to clone it
        }, 700)
    );
</script>

{#if $cloudProfile === undefined || $localProfile === undefined}
    Loading profile...
{:else}
    <form class="profile" on:submit={(e) => e.preventDefault()}>
        <fieldset>
            <legend>Your profile</legend>
            {#each [["name", "Full Name"], ["major", "Major"], ["minor", "Minor"], ["modification", "Modification"], ["role", "DALI role"], ["home", "Hometown"], ["quote", "Quote"], ["favoriteShoe", "Favorite Shoe"], ["favoriteArtist", "Favorite Artist"]] as [name, display]}
                <div class="input-wrapper">
                    <label for={name}>{display}</label>
                    <input
                        {name}
                        type="text"
                        bind:value={$localProfile[name]}
                    /><br />
                </div>
            {/each}
        </fieldset>
    </form>
{/if}

<svelte:window
    on:beforeunload={saved === false
        ? (e) => {
              e.preventDefault();
              e.returnValue = "";
          }
        : undefined}
/>

<svelte:head>
    <title>funfax | profile</title>
</svelte:head>

<!-- global because it doesn't acknowledge dataset attrs. -->
<style global>
    form.profile {
        line-height: 200%;
        min-width: 90%;
    }
    div.input-wrapper {
        display: flex;
        margin-bottom: 0.5rem;
    }
    div.input-wrapper label {
        margin-right: 1rem;
    }
    div.input-wrapper label::after {
        content: ":";
    }
    div.input-wrapper input {
        flex: 1;
    }
</style>
