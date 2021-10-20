<script lang="ts">
    import {
        getProfile,
        profileExists,
        createProfile,
        deleteProfile,
    } from "$lib/firebase";
    import { debounce } from "$lib/utils";
    import type { DocumentData } from "firebase/firestore";
    import { writable } from "svelte/store";
    import type { Writable } from "svelte/store";
    import { beforeUrlChange } from "@roxi/routify";

    let saved = "";

    const cloudProfile = getProfile();
    const localProfile: Writable<DocumentData | undefined> =
        writable(undefined);

    cloudProfile.subscribe((prof) => {
        if (
            $cloudProfile === undefined ||
            JSON.stringify($cloudProfile) === JSON.stringify($localProfile) // object comparison
        )
            return;
        if ($localProfile !== undefined) saved = "(updated.)";

        $localProfile = Object.assign({}, $cloudProfile); // super important to clone it
        $ethnicities = ethnAll.filter((eth) => $cloudProfile![eth]);
    });

    const pushToCloud = debounce((prof: DocumentData | undefined) => {
        if (
            $localProfile === undefined ||
            JSON.stringify($localProfile) === JSON.stringify($cloudProfile) // object comparison
        )
            return;
        $cloudProfile = Object.assign({}, $localProfile); // super important to clone it
        saved = "(saved.)";
    }, 750);

    localProfile.subscribe((prof) => {
        if (JSON.stringify($localProfile) !== JSON.stringify($cloudProfile)) {
            saved = "(saving...)";
            pushToCloud();
        }
    });

    const ethnAll = [
        "American Indian or Alaska Native",
        "Asian",
        "Black or African American",
        "Hispanic or Latino",
        "Middle Eastern",
        "Native Hawaiian or Other Pacific Islander",
        "White",
        "Other",
    ];

    const ethnicities: Writable<string[]> = writable([]);
    ethnicities.subscribe((eths) => {
        if (eths.length !== 0 && $localProfile !== undefined)
            ethnAll.forEach(
                (eth) => ($localProfile![eth] = eths.includes(eth) ? eth : "")
            );
    });

    $beforeUrlChange(() => {
        if (saved === "(saving...)") {
            alert("Please allow one second for changes to save.");
            return false;
        } else return true;
    });
</script>

{#if $cloudProfile === undefined || $localProfile === undefined}
    <div class="splash">
        {#await profileExists()}
            <span>Loading profile...</span>
        {:then profileDoesExist}
            {#if !profileDoesExist}
                <input
                    type="button"
                    value="Create your profile."
                    on:click={() => createProfile()}
                />
            {/if}
        {/await}
    </div>
{:else}
    <form class="profile" on:submit={(e) => e.preventDefault()}>
        <fieldset>
            <legend>Your profile {saved}</legend>
            {#each [["name", "Full Name"], ["major", "Major"], ["minor", "Minor"], ["modification", "Modification"], ["role", "DALI role"], ["home", "Hometown"], ["quote", "Quote"], ["favoriteShoe", "Favorite Shoe"], ["favoriteArtist", "Favorite Artist"], ["year", "Year"]] as [name, display]}
                <label
                    >{display}:
                    <input
                        {name}
                        type="text"
                        bind:value={$localProfile[name]}
                    /></label
                >
            {/each}
            <div class="sets">
                <fieldset>
                    <legend>Gender</legend>
                    {#each ["Male", "Female", "Other"] as gender}
                        <label>
                            <input
                                name="gender"
                                type="radio"
                                bind:group={$localProfile.gender}
                                value={gender}
                            />
                            {gender}</label
                        >{/each}
                </fieldset>
                <fieldset>
                    <legend>Phone Type</legend>
                    {#each ["iOS", "Android", "Other"] as type}
                        <label>
                            <input
                                name="phone"
                                type="radio"
                                bind:group={$localProfile.phoneType}
                                value={type}
                            />{type}</label
                        >
                    {/each}
                </fieldset>
                <fieldset>
                    <legend>Misc.</legend>
                    <label
                        ><input
                            name="color"
                            type="color"
                            bind:value={$localProfile.favoriteColor}
                        /> Favorite color</label
                    >
                    <label
                        ><input
                            name="birthday"
                            type="date"
                            bind:value={$localProfile.birthday}
                        /> Birthday
                    </label>
                    <label
                        ><input
                            name="picture"
                            type="url"
                            size="10"
                            bind:value={$localProfile.picture}
                        /> Photo URL
                    </label>
                    <label
                        ><input
                            name="delete"
                            type="button"
                            value="delete my profile"
                            on:click={() => {
                                if (
                                    confirm(
                                        "Deleting your profile is irreversible.\nAre you sure you want to continue?"
                                    )
                                )
                                    deleteProfile();
                            }}
                        />
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Ethnicity</legend>
                    {#each ethnAll as ethnicity}
                        <label>
                            <input
                                name="gender"
                                type="checkbox"
                                bind:group={$ethnicities}
                                value={ethnicity}
                            />{ethnicity}</label
                        >
                    {/each}
                </fieldset>
            </div>
        </fieldset>
    </form>
{/if}

<svelte:window
    on:beforeunload={saved === "(saving...)"
        ? (e) => {
              e.preventDefault();
              e.returnValue = "";
          }
        : undefined}
/>

<svelte:head>
    <title>dali-link | profile</title>
</svelte:head>

<style>
    form {
        min-width: 80%;
    }
    label {
        display: flex;
        margin-bottom: 0.5rem;
        align-items: center;
    }
    input[type="text"] {
        flex: 1;
    }

    input {
        margin: 0 0.5rem;
    }

    div.sets {
        display: flex;
        flex-wrap: wrap;
    }

    div.sets > fieldset > legend {
        margin: auto;
    }

    /*
    Keep the form frame fixed on the page.
    */

    form {
        height: 100%;
    }

    form > fieldset {
        height: 95%;
        overflow-y: scroll;
    }

    form > fieldset > legend {
        position: relative;
        padding: 0.1rem 0.2rem;
    }

    form > fieldset > legend:after {
        content: "";
        position: absolute;
        left: 0;
        top: calc(50% - 0.05rem);
        height: calc(50% + 0.05rem);
        width: calc(100% - 0.1rem);
        border: 0.1rem solid var(--black);
        border-top-width: 0;
    }
</style>
