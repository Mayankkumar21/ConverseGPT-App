const axios = require('axios');

document.getElementById('generateBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('prompt').value;
    const responseContainer = document.getElementById('response');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Show loading spinner
    loadingSpinner.classList.remove('hidden');

    // Prepare the request data
    const requestData = {
        model: 'gemma:2b',
        stream: false,
        prompt: prompt
    };

    try {
        const response = await axios.post('http://localhost:11434/api/generate', requestData);
        
        const responseData = response.data;

        // Clear previous responses
        responseContainer.innerHTML = '';

        // Convert markdown response to plain text
        const responseText = convertMarkdownToText(responseData.response);
        const responseBox = document.createElement('div');
        responseBox.classList.add('border', 'rounded-md', 'bg-gray-700', 'text-gray-300', 'px-4', 'py-2', 'mt-4', 'overflow-auto', 'break-words');
        responseContainer.appendChild(responseBox);
        // Add response to the container with typing animation
        await typeWriter(responseBox, responseText);

        // Hide loading spinner
        loadingSpinner.classList.add('hidden');
    } catch (error) {
        console.error('Error:', error);
        // Handle error here
        // Hide loading spinner
        loadingSpinner.classList.add('hidden');
    }
});

// Function to convert markdown to plain text
function convertMarkdownToText(markdown) {
    // Remove asterisks from ** **
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '$1');

    // Remove asterisks from *** ***
    markdown = markdown.replace(/\*\*\*(.*?)\*\*\*/g, '$1');

    // Add newline before and after code blocks
    markdown = markdown.replace(/```([\s\S]+?)```/g, '\n$1\n');
    
    // Return the formatted text
    return markdown;
}







// Function to simulate typing animation
// Function to simulate typing animation
async function typeWriter(element, text) {
    const chunkSize = 50; // Adjust chunk size as needed

    // Split text into chunks
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
    }

    // Append chunks to the container with typing animation
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        for (let j = 0; j < chunk.length; j++) {
            if (chunk[j] === ' ') {
                element.innerHTML += '&nbsp;';
            } else if (chunk[j] === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += chunk[j];
            }
            element.scrollTop = element.scrollHeight;
            await new Promise(resolve => setTimeout(resolve, 5)); // Adjust typing speed as needed
        }
    }
}

