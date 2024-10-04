<script>

    export let disabled = false
    export let href = '#'

</script>


{#if disabled}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span on:click class="inline-flex items-center px-4 py-2 bg-gray-400 text-gray-700 rounded-md shadow cursor-not-allowed">
        <slot />
    </span>
{:else}
    <a 
        href={href}
        class="inline-flex px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
        on:click
    >
        <slot />
    </a>
    
{/if}