<script>

    import Markdown from '$lib/components/Markdown.svelte'
    import CodeSubmit from '$lib/components/CodeSubmit.svelte'
    // export let questionId
    export let description
    // export let stdin
    // export let expectedOutput
    // export let hint = ''
    export let feedback = true
    export let hints = ''
    export let code = ''
</script>

<div>
    <Markdown content={description} />

    <CodeSubmit {feedback} {code} />

    <hr />
</div>

<style>
    hr {
        border-top: 1px solid lightgray;
        padding: 3px;
    }
</style>