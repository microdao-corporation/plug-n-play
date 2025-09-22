import './app.css'
import { mount } from 'svelte'
import App from './App.svelte'

// Polyfill
if (typeof window !== 'undefined') window.global = window;

const app = mount(App, {
  target: document.getElementById('app')
})

export default app
