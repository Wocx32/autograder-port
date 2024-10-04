<script>
    import { onMount } from "svelte";
    import rehypeKatex from "rehype-katex";
    import rehypeStringify from "rehype-stringify";
    import remarkMath from "remark-math";
    import remarkParse from "remark-parse";
    import remarkRehype from "remark-rehype";
    import rehypeHighlight from "rehype-highlight";
    import { unified } from "unified";

    import 'katex/dist/katex.min.css';
    import 'highlight.js/styles/github.css';

    export let content = "";
    let renderedContent = "";

    async function renderMarkdown() {
        const file = await unified()
            .use(remarkParse)
            .use(remarkMath)
            .use(remarkRehype)
            .use(rehypeKatex)
            .use(rehypeHighlight)
            .use(rehypeStringify)
            .process(content);

        renderedContent = String(file);
    }

    onMount(() => {
        renderMarkdown();
    });

</script>

<div class="prose prose-lg prose-pre:p-0 prose:pre-rounded-none prose-pre:mt-5 prose-pre:mb-0 prose-p:mt-5 prose-p:mb-0 text-left pt-3 pb-3">
    {@html renderedContent}
</div>