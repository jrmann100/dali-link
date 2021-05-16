<script lang="ts">
    import { getProfile } from "$lib/firebase";
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let uid: string;
    export let expanded: boolean;
    const profile = getProfile(uid);

    const emojify = () => {
        if (!$profile) return "";
        const unicode = {
            man: "\u{1f468}",
            woman: "\u{1f469}",
            person: "\u{1f9d1}",
            job: "\u{200d}",
            technologist: "\u{1f4bb}",
            artist: "\u{1f3a8}",
            officeWorker: "\u{1f4bc}",
            light: "\u{1f3fb}",
            medlight: "\u{1f3fc}",
            med: "\u{1f3fd}",
            meddark: "\u{1f3fe}",
            dark: "\u{1f3ff}",
        };
        let emoji = "";
        if ($profile.gender === "Male") emoji += unicode.man;
        else if ($profile.gender === "Female") emoji += unicode.woman;
        else emoji += unicode.person;
        if ($profile["White"] !== "") emoji += unicode.light;
        else if ($profile["White"] !== "") emoji += unicode.light;
        else if ($profile["Black or African American"] !== "")
            emoji += unicode.dark;
        else if ($profile["Middle Eastern"] !== "") emoji += unicode.med;
        else if ($profile["Hispanic or Latino"] !== "") emoji += unicode.med;
        else if ($profile["Asian"] !== "") emoji += unicode.medlight;
        else if ($profile["Native Hawaiian or Other Pacific Islander"] !== "")
            emoji += unicode.medlight;
        emoji += unicode.job;
        if ($profile.role.toLowerCase().includes("developer"))
            emoji += unicode.technologist;
        else if ($profile.role.toLowerCase().includes("designer"))
            emoji += unicode.artist;
        else emoji += unicode.officeWorker;
        return emoji;
    };
</script>

{#if $profile}
    <div
        class="wrapper"
        on:keydown={(e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.click();
            }
        }}
        on:click={(e) => {
            if (!expanded) e.currentTarget.scrollIntoView({ block: "center" });
            dispatch("expand");
        }}
        class:expanded
        tabindex="0"
        style="--favorite-color: {$profile.favoriteColor}"
    >
        <img
            loading="lazy"
            width="50"
            src={$profile.picture}
            alt="DALI member's profile."
        />
        <div class="data">
            <b>{$profile.name} <small>{$profile.year}</small></b>
            <span>
                <span class="emoji">
                    {emojify()}
                </span>
                {$profile.role}</span
            >
            <span
                >🎓 {$profile.major}
                {#if $profile.modification !== ""}+ {$profile.modification}{/if}
                {#if $profile.minor !== ""}<br /><small
                        ><i>minoring in {$profile.minor}</i></small
                    >{/if}
            </span>
        </div>
    </div>
{/if}

<style>
    div.wrapper {
        border: 0.1rem solid var(--black);
        box-sizing: border-box;
        margin: 0.5rem;
        position: relative;
        width: 80%;
        margin: auto;
        display: grid;
        grid-template-rows: 8rem 12rem;
        grid-template-columns: 8rem auto;
        background-color: transparent;
        transition: background-color 0.2s, transform 0.2s, height 0.3s,
            box-shadow 0.2s;
        cursor: pointer;
        height: 8rem;
        overflow-y: hidden;
    }
    div.wrapper.expanded {
        height: 20rem;
    }

    div.wrapper:hover,
    div.wrapper:focus {
        background-color: var(--transp);
        transform: scale(1.01);
        box-shadow: 0 0.2rem 0.5rem rgba(0, 0, 0, 0.5);
    }

    div.wrapper:hover > img,
    div.wrapper:focus > img {
        transform: scale(1.02);
    }

    div.wrapper > img {
        grid-column: 1;
        height: 80%;
        width: 80%;
        align-self: center;
        justify-self: center;
        object-fit: cover;
        border: 0.2rem solid var(--black);
        border-radius: 1rem;
        box-shadow: 0 0.2rem 0.1rem rgba(0, 0, 0, 0.5);
        border-bottom-width: 0.5rem;
        border-bottom-color: var(--favorite-color);
        transition: transform 0.2s;
    }
    div.data {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 0.5rem 0;
        box-sizing: border-box;
    }
    span.emoji {
        font-size: 200%;
    }
</style>
