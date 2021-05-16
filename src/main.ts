import HMR from '@roxi/routify/hmr';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
    onNeedRefresh() {
        // show a prompt to user
    },
    onOfflineReady() {
        // show a ready to work offline to user
    },
});

import App from './App.svelte'

const app = HMR(App, { target: document.body }, 'routify-app')

export default app