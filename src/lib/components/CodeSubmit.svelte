<script>
    import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome'
    import { faCheckCircle, faTimesCircle, faQuestionCircle, faUpload } from '@fortawesome/free-solid-svg-icons'
    import { config } from '@fortawesome/fontawesome-svg-core'

    import axios from 'axios'

    import '@fortawesome/fontawesome-svg-core/styles.css'
    config.autoAddCss = false

    import CodeMirror from 'svelte-codemirror-editor'
    import { python } from "@codemirror/lang-python"
	import toast from 'svelte-french-toast';
	import { API_SUBMIT_URL, API_RESULT_URL } from '$lib/utils';

    export let code = ''

    export let feedback = true
    export let hint = true

    $: console.log(code)
    
    $: loading = false
    $: acceptStatus = ''
    $: uploaded = false
    $: isHintOpen = false
    $: feedbackMessage = ''
    $: error = false


    const toggleHintModal = () => {
        isHintOpen = !isHintOpen
    }

    const handleSubmit = async () => {

        if (!code) {
            // toast.error('No code to submit')
            error = true
            feedbackMessage = 'Please enter some code to submit.'
            return
        }
        
        loading = true
        error = false
        acceptStatus = ''
        uploaded = false
        feedbackMessage = ''

        try {
            const response = await axios.post(API_SUBMIT_URL, {
                source_code: code
            })

            uploaded = true

            const { token } = response.data

            pollForResult(`${API_RESULT_URL}/${token}`)

        } catch (error) {
            console.error(error)
            error = true
            feedbackMessage = `Critical Error: ${error.message} (${error.code})\nAn error occurred while submitting your code.`
        } finally {
            loading = false
        }
    }

    const pollForResult = (/** @type {string} */ serverUrl) => {
        
        const intervalId = setInterval(async () => {
            try {
                const resultResponse = await axios.get(serverUrl)

                clearInterval(intervalId)

                if (resultResponse.data.status.id === 3) {
                    toast.success('Accepted')
                    acceptStatus = true
                    error = false
                    feedbackMessage = `Success: ${resultResponse.data.stdout || "No output"}`

                } else if (resultResponse.data.status.id === 4) {
                    toast.error('Wrong Answer')
                    acceptStatus = false
                    error = true
                    feedbackMessage = resultResponse.data.stderr || resultResponse.data.compile_output || "Wrong Answer!"


                } else if (resultResponse.data.status.id > 4) {
                    toast.error('Compilation or execution failed')
                    acceptStatus = false
                    error = true
                    feedbackMessage = resultResponse.data.stderr || resultResponse.data.compile_output || "An error occurred."
                }
            } catch (error) {
                console.error(error)
                error = true
                feedbackMessage = `Error fetching result: ${error}`
            }
        }, 2000)
    }

</script>

<div class="pb-6">
    <CodeMirror 
        bind:value={code} 
        lang={python()} 
        styles={{
            "&": {
                width: "min(600px, 90%)",
                height: "150px"
                
            }, 
            ".cm-editor": {
                border: "12px solid #000",
                borderRadius: "5px",
                padding: "5px"
            }
        }}
    />

    <button
        on:click={handleSubmit}
        disabled={loading}
        class="bg-gradient-to-r bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 mt-4 rounded-full shadow-lg transition-all ease-in-out duration-300 {loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}"
    >
        {#if loading}
            <span class="animate-spin rounded-full h-5 w-5 border-t-2 border-white inline-block mr-2"></span>
            Submitting...
        {:else}
            Submit Code
        {/if}
    </button>

    {#if uploaded}
        <FontAwesomeIcon icon={faUpload} class="text-green-300 text-3xl pl-10" />
    {/if}
    {#if feedback === true && acceptStatus === true}
        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 text-3xl pl-10" />
    {/if}
    {#if feedback === true && acceptStatus === false}
        <FontAwesomeIcon icon={faTimesCircle} class="text-red-500 text-3xl pl-10" />
    {/if}

    {#if hint}
        <button
            on:click={toggleHintModal}
            class="text-gray-400 hover:text-gray-500 transition-all ease-in-out duration-300"
            title="Hints"
        >
            <FontAwesomeIcon icon={faQuestionCircle} class="text-3xl" />
        </button>
    {/if}



    {#if feedback === true && error === true}
        <textarea
            value={feedbackMessage}
            readOnly
            rows={2}
            style={{
                width: '100%',
                marginTop: '20px',
                backgroundColor: '#f8f9fa',
                color: error ? 'red' : 'green',
                border: '1px solid',
                borderColor: error ? 'red' : 'green',
                padding: '10px',
                resize: 'vertical',  // Allows vertical resizing only
                fontFamily: 'monospace'
            }}
        />
    {/if}

    {#if isHintOpen}
        <div class="
            fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50
            transition-opacity duration-300 ease-out {isHintOpen ? "opacity-100" : "opacity-0"}
        ">
            <div class="
                relative bg-white p-6 rounded-lg shadow-lg w-1/4 transform
                transition-transform duration-300 ease-out {isHintOpen ? 'scale-100' : 'scale-95'} 
            ">
                <button
                    on:click={toggleHintModal}
                    class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors duration-300 font-bold"
                    title="Close"
                >
                    <FontAwesomeIcon icon={faTimesCircle} class="text-2xl" />
                </button>

                <h2 class="text-xl font-bold mb-4">Hints</h2>
                <ul class="list-disc list-inside text-gray-700">
                    <li>Make sure you're printing the right format.</li>
                    <li>Check your variable names carefully</li>
                    <li>Try using a different approach if you're stuck</li>
                </ul>
            </div>
        </div>
    {/if}

</div>
