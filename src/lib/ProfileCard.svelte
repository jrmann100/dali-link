<script lang="ts">
    import { getProfile } from "$lib/firebase";
    export let uid: string;
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
        else emoji += person;
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
    <div tabindex="0" style="--favorite-color: {$profile.favoriteColor}">
        <img
            loading="lazy"
            width="50"
            src={$profile.picture}
            alt="DALI member's profile."
        />
        <table>
            <th>{$profile.name} <small>{$profile.year}</small></th>
            <tr>
                <span class="emoji">
                    {emojify()}
                </span>
                {$profile.role}</tr
            >
        </table>
    </div>
{/if}

<style>
    div {
        border: 0.1rem solid var(--black);
        box-sizing: border-box;
        margin: 0.5rem;
        position: relative;
        min-width: 90%;
        display: grid;
        grid-template-rows: 8rem 8rem;
        grid-template-columns: 8rem auto;
        background-color: transparent;
        transition: background-color 0.2s, transform 0.2s, height 0.3s;
        cursor: pointer;
        height: 8rem;
        overflow-y: hidden;
    }
    div.expanded {
        height: 16rem;
    }

    div:hover,
    div:focus {
        background-color: var(--transp);
        transform: scale(1.01);
    }

    div:hover > img,
    div:focus > img {
        transform: scale(1.02);
    }

    img {
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
    table {
        grid-column: 2;
        padding: 0.5rem;
        box-sizing: border-box;
    }
    th {
        height: max-content;
        font-size: 130%;
        font-weight: normal;
        text-align: left;
    }
    span.emoji {
        font-size: 200%;
    }
</style>
