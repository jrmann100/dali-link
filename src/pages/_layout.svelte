<script lang="ts">
	import { auth, user } from "$lib/firebase";
	import { ready, url, isActive } from "@roxi/routify";
	import A2HS from "$lib/A2HS.svelte";

	$: if ($user === null)
		(window as any).google.accounts.id.prompt((notification: any) => {
			if (
				notification.isDismissedMoment() &&
				notification.getDismissedReason() === "credential_returned" &&
				$user === null
			)
				$user = undefined;
		});
	function renderButton(el: HTMLDivElement) {
		(window as any).google.accounts.id.renderButton(el, {
			scope: "profile email",
			width: 240,
			height: 100,
			longtitle: true,
			theme: "filled_blue",
		});
	}

	// tell HMR not to wait for <slot> to render.
	$ready();
</script>

<header>
	<A2HS />
	<a href={$url("./index")}>
		<span class="latin">dali-link</span> - networking for members, by members.
	</a>
</header>

<main>
	{#if $user !== null && $user !== undefined}
		<slot />
	{:else if $user === null}
		<div class="splash">
			<div id="google" use:renderButton />
		</div>
	{/if}
</main>

<footer>
	{#if $user === null}
		You are logged out.
	{:else if $user === undefined}
		You are logging in...
	{:else}
		You are {$user.displayName}. (
		{#if !$isActive("./profile")}
			<a href={$url("./profile")}>profile</a>
		{:else}
			<a href={$url("./index")}>home</a>
		{/if}
		|
		<a href={"#"} on:click={async () => await auth.signOut()}>log out</a>
		)
	{/if}
</footer>

<style>
	div#google {
		transform: scale(1.5);
	}
</style>
