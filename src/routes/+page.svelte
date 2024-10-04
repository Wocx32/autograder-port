<script>
    import Markdown from "$lib/components/Markdown.svelte";
    import CodeSubmit from "$lib/components/CodeSubmit.svelte";
    import Question from "$lib/components/Question.svelte";

    let content = `
## Question 4
Convert the following math expression to python code:

$$s=s_0+v_0t+\\frac{1}{2}gt^2$$

Create the variables and values are as follows:

$$s_0 = 10$$

$$v_0 = 20$$

$$g = 10$$

$$t = 5$$

Calculate the value of $$s$$ and print it on the screen. 

Be sure to display the result as an **integer**.

\`\`\`python
num = int(input())
\`\`\`
`
</script>

<!-- <Question description={content} /> -->

<div class="flex bg-gray-200 items-start justify-center min-h-screen w-full pb-20">
    <div class="fixed top-0 left-0 m-5 p-4 text-white bg-green-500 font-extrabold text-2xl border border-transparent rounded-lg shadow-lg z-10">
        Score: 0/16
    </div>

    <div class="p-8 bg-white rounded-lg shadow-lg max-w-[50%] w-full border border-blue-500 mt-10 md:mt-20">
        <h1 class="text-2xl md:text-2xl font-bold text-center text-blue-500 mb-4">
            Lab 1
        </h1>

        <Question description={content} />
    </div>
</div>