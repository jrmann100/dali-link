[![Firebase Hosting](https://github.com/jrmann100/dali-link/actions/workflows/firebase-hosting.yml/badge.svg)](https://github.com/jrmann100/dali-link/actions/workflows/firebase-hosting.yml)

<img src="public/icon.svg" height="96" width="96">

# [dali-link](https://jrmann100.github.io/feed)

Connecting DALI Lab members digitally since 2021.

This project was built for the DALI Lab Social Media Challenge.
It is a full-stack serverless app built on Firebase and using Svelte Routify.

By [@jrmann100](https://github.com/jrmann100)

https://user-images.githubusercontent.com/17690438/118416777-20508780-b666-11eb-8234-5cafa03e69b4.mov

## Objectives

- [x] Present a [dataset](https://github.com/dali-lab/dali-challenges/blob/master/data/DALI_Data.json) of user profile data using a clean UI.<br>The Svelte language organized the product into components and views, supercharging a custom-built interface with reactive Typescript markup.
- [x] Use Firebase to organize data.<br>Firebase Firestore provided the framework to [organize the data](json.js) into a document-based database, with custom [security rules](firestore.rules) to prevent tampering.
- [x] Use ES6 modules, both custom and [from NPM](package.json) to extend the abilities of the code.<br>Inspect libraries using VSCode Intellisense.
- [x] Organize the site into [key views](src/_pages).<br>Vite compiles the TypeScript and Svelte using the Routify framework. 
- [x] Deploy [the site](https://dali-link.web.app) on Firebase Hosting.
- [x] Make the application progressive and offline-compatible.
    - Use service workers, an app manifest, and many `<meta>` tags to convert the product into a Progressive Web App.
    - Pass all checks on the Lighthouse PWA Analysis Tool.
    - Enable Firestore offline caching.
- [x] Allow profiles to be created, written to, updated, and deleted.<br>Use Svelte Stores to make Firestore data reactive, automatically saving and syncing across the app.
- [x] Integrate Firebase Auth/Google OAuth for a personalized experience.<br>Add Google Sign-In and One Tap for quick authentication. Link Firestore profiles to user accounts. Protect views; sync user data across all views.

## Building and Deploying

Build the project:
```bash
npm ci && npm run build
```

Preview [the product](https://dali-link.web.app) locally:
```bash
npm run serve:vite
```

(Maintainers only) deploy the product:
```bash
firebase deploy
```

#### A brief note on version control
_This project originally began as [jrmann100/funfax](https://github.com/jrmann100/funfax), but my vision for the product and the challenge requirements diverged quickly. I plan to continue developing funfax.net on my own with the experience I've gained from this project._
