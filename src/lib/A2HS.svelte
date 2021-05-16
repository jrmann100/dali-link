<script lang="ts">
    import { onMount } from "svelte";

    let enabled = false;
    let wrapper: HTMLDivElement;

    // https://stackoverflow.com/a/51847335
    interface BeforeInstallPromptEvent extends Event {
        readonly platforms: Array<string>;
        readonly userChoice: Promise<{
            outcome: "accepted" | "dismissed";
            platform: string;
        }>;
        prompt(): Promise<void>;
    }

    let deferredPrompt: BeforeInstallPromptEvent;

    // From https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
    onMount(() => {
        // Unofficial; only supported in Chrome.
        (window as any).addEventListener(
            "beforeinstallprompt",
            (e: BeforeInstallPromptEvent) => {
                console.log(e);
                // Prevent Chrome 67 and earlier from automatically showing the prompt.
                e.preventDefault();
                // Stash the event so it can be triggered later.
                deferredPrompt = e;
                // Show wrapper.
                enabled = true;
            }
        );
    });

    const installClicked = async () => {
        // Hide wrapper.
        enabled = false;
        // Show dialog.
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
    };
</script>

<div
    title="Install"
    bind:this={wrapper}
    class:enabled
    on:click={installClicked}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 0 24 24"
        width="24"
    >
        <path
            d="M16.59 9H15V4c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v5H7.41c-.89 0-1.34 1.08-.71 1.71l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.63-.63.19-1.71-.7-1.71zM5 19c0 .55.45 1 1 1h12c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1z"
        /></svg
    >
</div>

<style>
    div {
        transition: opacity 0.2s, border-width 0.2s, width 0.5s,
            margin-right 0.5s;
        width: 0;
        height: 2rem;
        border: 0rem solid var(--black);
        cursor: pointer;
        border-radius: 1rem;
        overflow: hidden;
        opacity: 0;
        display: inline-block;
        margin-right: 0;
    }

    div.enabled {
        border-width: 0.2rem;
        opacity: 1;
        width: 2rem;
        margin-right: 0.5rem;
    }

    div svg {
        width: 2rem;
        height: 2rem;
        fill: var(--black);
    }
</style>
