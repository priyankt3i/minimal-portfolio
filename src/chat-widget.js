(function() {
      
    // Inject the CSS
    const style = document.createElement('style');
    style.innerHTML = `
    .hidden {
      display: none;
    }
    #chat-widget-container {
      position: fixed;
      bottom: 20px;
      right: 20px;
      flex-direction: column;
      z-index: 1001; /* Ensure it's above other fixed elements like footer/accordion */
    }
    #chat-popup {
      display: flex; /* Added for flex children */
      flex-direction: column; /* Added for flex children */
      position: absolute; /* Kept from original for desktop view */
      bottom: 90px; /* Adjusted to be above bubble (64px + 20px margin + some buffer) */
      right: 0;
      width: 90vw; /* Use viewport width percentage */
      max-width: 400px; /* Max width for larger screens */
      height: 70vh;
      max-height: 600px; /* Max height in pixels */
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 8px; /* Original had rounded-md */
      box-shadow: 0 4px 12px rgba(0,0,0,0.15); /* Original had shadow-md */
      transition: all 0.3s ease-in-out;
      overflow: hidden; /* Important for child elements to not break rounded corners */
      z-index: 1000; /* Ensure it's above chat bubble if they overlap during transition */
    }
    #chat-popup.hidden { /* Ensure hidden class works */
        display: none !important;
    }
    #chat-bubble {
        /* Basic styling for visibility */
        background-color: #333; /* Dark gray */
        color: white;
        width: 64px; /* w-16 */
        height: 64px; /* h-16 */
        border-radius: 50%; /* rounded-full */
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }
    #chat-header {
        /* Basic styling */
        background-color: #333; /* Dark gray */
        color: white;
        padding: 1rem; /* p-4 */
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #chat-header h3 {
        margin: 0;
        font-size: 1.125rem; /* text-lg */
    }
    #close-popup svg {
        width: 24px; /* w-6 */
        height: 24px; /* h-6 */
    }
    #chat-messages {
        flex-grow: 1; /* flex-1 */
        padding: 1rem; /* p-4 */
        overflow-y: auto;
        background-color: #f9f9f9; /* Light background for messages */
    }
    #chat-input-container {
        padding: 1rem; /* p-4 */
        border-top: 1px solid #e5e7eb; /* border-gray-200 */
    }
    #chat-input-container .flex {
        display: flex;
        align-items: center;
    }
    #chat-messages { /* Ensure this is scrollable */
        flex-grow: 1;
        padding: 1rem;
        overflow-y: auto;
        background-color: #f9f9f9;
        word-break: break-word; /* Prevent long words from breaking layout */
    }
    #chat-input {
        flex-grow: 1; /* flex-1 */
        border: 1px solid #d1d5db; /* border-gray-300 */
        border-radius: 0.375rem; /* rounded-md */
        padding: 0.5rem 1rem; /* px-4 py-2 */
        outline: none;
        width: 75%; /* w-3/4 - approx */
        margin-right: 1rem; /* space-x-4 */
    }
    #chat-submit {
        background-color: #333; /* Dark gray */
        color: white;
        border-radius: 0.375rem; /* rounded-md */
        padding: 0.5rem 1rem; /* px-4 py-2 */
        cursor: pointer;
        border: none;
    }

    @media (max-width: 768px) {
      #chat-popup {
        position: fixed; /* Full screen on mobile */
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        max-width: 100%; /* Override max-width */
        max-height: 100%; /* Override max-height */
        border-radius: 0;
        bottom: 0; /* Ensure it covers the whole screen, overriding desktop 'bottom' */
      }
      #chat-widget-container { /* Adjust container for mobile if bubble needs to move */
        bottom: 10px;
        right: 10px;
      }
    }
    `;
  
    document.head.appendChild(style);
  
    // Create chat widget container
    const chatWidgetContainer = document.createElement('div');
    chatWidgetContainer.id = 'chat-widget-container';
    document.body.appendChild(chatWidgetContainer);
    
    // Inject the HTML
    // Note: Tailwind classes are kept for when/if Tailwind is added.
    // Basic styles are added above for non-Tailwind environments.
    chatWidgetContainer.innerHTML = `
      <div id="chat-bubble" class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer text-3xl">
        <img src="/icons/chat-icon.png" alt="Chat" style="width: 40px; height: 40px;" /> 
      </div>
      <div id="chat-popup" class="hidden absolute bottom-20 right-0 w-96 bg-white rounded-md shadow-md flex flex-col transition-all text-sm">
        <div id="chat-header" class="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-md">
          <h3 class="m-0 text-lg">Hi, this is Kumar's Clone Here!</h3>
          <button id="close-popup" class="bg-transparent border-none text-white cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div id="chat-messages" class="flex-1 p-4 overflow-y-auto"></div>
        <div id="chat-input-container" class="p-4 border-t border-gray-200">
          <div class="flex space-x-4 items-center">
            <input type="text" id="chat-input" class="flex-1 border border-gray-300 rounded-md px-4 py-2 outline-none w-3/4" placeholder="Type your message...">
            <button id="chat-submit" class="bg-gray-800 text-white rounded-md px-4 py-2 cursor-pointer">Send</button>
          </div>
          <div class="flex text-center text-xs pt-4">
        
          </div>
        </div>
      </div>
    `;
  
    // Add event listeners
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    const chatMessages = document.getElementById('chat-messages');
    const chatBubble = document.getElementById('chat-bubble');
    const chatPopup = document.getElementById('chat-popup');
    const closePopup = document.getElementById('close-popup');
  
    chatSubmit.addEventListener('click', function() {
      const message = chatInput.value.trim();
      if (!message) return;
      
      // Display user message immediately
      const userMessageElement = document.createElement('div');
      userMessageElement.className = 'flex justify-end mb-3'; // Tailwind class
      userMessageElement.innerHTML = `
        <div class="bg-gray-800 text-white rounded-lg py-2 px-4 max-w-[70%]" style="background-color: #333; color: white; border-radius: 0.5rem; padding: 0.5rem 1rem; margin-left: auto; margin-bottom: 0.75rem; max-width: 70%;">
          ${message}
        </div>
      `;
      chatMessages.appendChild(userMessageElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  
      chatInput.value = '';
      onUserRequest(message);
    });
  
    chatInput.addEventListener('keyup', function(event) {
      if (event.key === 'Enter') {
        chatSubmit.click();
      }
    });
  
    chatBubble.addEventListener('click', function() {
      togglePopup();
    });
  
    closePopup.addEventListener('click', function() {
      togglePopup();
    });
  
    function togglePopup() {
      const chatPopup = document.getElementById('chat-popup');
      chatPopup.classList.toggle('hidden');
      if (!chatPopup.classList.contains('hidden')) {
        document.getElementById('chat-input').focus();
      }
    }

    function onUserRequest(message) {
        const aboutMeText = `
        Kumar Priyank
I have a pet dog named Sasha she is a Cavapoo, 3 years old chocolate brown in color. Cutest soul.
I was born on 26th of January. I love to code.
I am a fullstack Engineer with over <span id="dynamicYears">13</span> years of industry experience where I have been involved in various stages of SDLC. From Planning to Design, Development, Testing, and Delivery. I can align, lead, and grow world-class product teams from 10 to 50 people.
More recently, I was involved in building a GenAI application for business intelligence and data analysis using Generative AI. Building both front-end, middle-ware, and backend for a complete solution. Training, Finetuning, and Prompt Engineering.
Extensive experience in API development, SQL/NoSQL Database Design, DevOps, Building pipelines, UI/Functional/API automation, and CI/CD to deliver high-quality software products and services to clients in the financial sector.

My Portfolio website : kumarpriyank.com

Skills
 - C 
 - C#
 - C++ 
 - Java 
 - Python
 - JavaScript 
 - TypeScript 
 - HTML5 
 - CSS3 
 - MongoDB 
 - Express.js 
 - React 
 - Node.js 
 - Linux 
 - Windows
 - Git 
 - Docker 
 - Firebase

Executive Summary
 - 13+ years of industry experience
 - Hand-on experience in Azure, AWS, Docker, Ansible, Vercel
 - Proficient in C#, Python, JavaScript, Java

Education
 - 2007-2011 : Bachelor of Technology, Computer Science & Engineering; ICFAI University (Dehradun. India)

Working Experience
Company: Plymouth Rock Assurance
Apr 2024 - Current : STG - Application Development; Boston, MA.

*Key Skills: Building Solutions using GenAI- NodeJs, Python, Jenkins, Groovy, React, HTML, CSS, OpenAI, Ollama, RESTfull API, YAML/JSON*

- Created graphs, charts, and other visualizations to convey the results of data analysis using specialized software.
- Developed and maintained user-facing data visualization websites and chatbots using Python, Streamlit, Django, HTML, CSS, JavaScript, and NodeJs.
- Created interactive dashboards using Streamlit to visualize complex data sets.
- Reviewed and validated data from multiple sources to ensure accuracy and completeness.
- Resolved issues with existing databases through troubleshooting, debugging, and problem-solving techniques.
Company: Advisor360
Aug 2019 - Feb 2024 : DevOps Engineer III; Weston, MA.

*Key Skills: .Net C#, Jenkins, Groovy, AKS, Azure CosmosDB, Azure DevOps Pipelines, Azure LogicApps, MVC, HTML, CSS, Python, Shell/Bash, EntityFramework, Redis, IaS, Docker, Ansible, RESTfull API, YAML/JSON, Razer, SwaggerUI, Svelte*

- Built and maintained backend database and API using MVC, C#, CosmosDB, Razor, and microservices architecture.
- Designed and maintained CI/CD Pipelines as Code using Git, Jenkins, Ansible, AKS, and Ansible.
- Configured K8s clusters for deploying containerized applications across multiple nodes.
- Managed source code repositories such as GitLab, and GitHub by creating branches, and merging pull requests.
- Built in-house ETL Test Framework using SSIS, C#, and EntityFramework
Company: Cognizant US Corp
Feb 2017 - Jul 2019 : Associate - QA Automation Lead; Boston, MA.

*Key Skills: Azure Pipeline, ASP.Net C#, Java, Groovy, Jenkins, TeamCity, UFT, Selenium, VBA, Gherkins, API Testing*

 - Designed and maintained CI/CD pipelines using Jenkins.
 - Developed automated test scripts in Java, Selenium WebDriver, TestNG, and Maven to test web applications.
 - Designed End-To-End test automation for various clients within the company
Company: Cognizant India Pvt. Ltd.
Feb 2017 - Jul 2019 : Associate - QA Automation Lead; Kolkata, India.

*Key Skills: UFT, VBScript, Java, Groovy, Gherkins, BDD, TDD, Functional Automation, Test Design, Agile*

- Documented all the automation test cases, results, and defects found during execution.
- Performed API testing using Postman, SoapUI, and Rest Assured.
- Configured Jenkins jobs to run automated regression suites on a nightly basis.
Company: IBM
Jun 2011 – Feb 2012 : Technical Support Associate; Bangalore, India

*Key Skills: Citrix, IBM WebSphere, Java, Test Design, Agile*
 
- Installed operating systems, applications, security updates, and drivers on user machines.
- Responded promptly to emergencies requiring immediate attention such as server outages or data loss incidents.
- Resolved hardware and software issues for clients promptly while troubleshooting complex problems.
- Utilized remote desktop tools to access customer systems and investigate technical issues.
Misc. Information
Languages: English (Expert), Hindi (fluent/native)

Availability: 1 month's notice
        `;

        const prompt = `Pretend are Kumar Priyank. 
        Always reply in first person. 
        Answer the question based on the provided text. 
        Never reveal the source of your answers.
        Never talk about the text reference you are using to reply.
        If the answer is not found in the text, search the internet. 

        Text: ${aboutMeText}

        Question: ${message}

        Please provide a concise answer.`;
        
        // Display "Thinking..." message or a loader for bot response
        const thinkingElement = document.createElement('div');
        thinkingElement.className = 'flex mb-3';
        thinkingElement.innerHTML = `
          <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]" style="background-color: #e5e7eb; color: black; border-radius: 0.5rem; padding: 0.5rem 1rem; margin-bottom: 0.75rem; max-width: 70%;">
            Thinking...
          </div>
        `;
        chatMessages.appendChild(thinkingElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // Changed to VITE_GEMINI_API_KEY
        if (!apiKey) {
            console.error('Gemini API Key is missing. Make sure VITE_GEMINI_API_KEY is set in your .env file.');
            reply("Sorry, I can't connect to my brain right now (API key missing). Please tell Kumar to check the setup!");
            chatMessages.removeChild(thinkingElement); 
            return;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`; // Changed to Gemini API URL
        
        const headers = {
          'Content-Type': 'application/json',
        };

        // Gemini API payload structure
        const geminiPayload = {
          contents: [{
            role: "user", // Role can be "user" or "model"
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        };
        
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(geminiPayload), // Use Gemini payload
          })
          .then(response => response.json())
          .then(data => {
            chatMessages.removeChild(thinkingElement); 
            if (data.error) {
              console.error('Gemini API error:', data.error);
              reply(`Sorry, I encountered an error: ${data.error.message || 'Unknown error'}`);
              return;
            }
            if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
              console.error('Gemini error: Invalid response structure', data);
              reply("Sorry, I had a little hiccup trying to get that information. Maybe try asking differently?");
              return;
            }
            const responseMessage = data.candidates[0].content.parts[0].text; // Adjusted for Gemini response
            reply(responseMessage);          
          })
          .catch(error => {
            chatMessages.removeChild(thinkingElement); 
            console.error('Gemini fetch error:', error);
            reply("Oops! I couldn't connect to my brain. Please check the internet connection or try again later.");
          });
      }
    
    function reply(message) {
      const chatMessages = document.getElementById('chat-messages');
      const replyElement = document.createElement('div');
      replyElement.className = 'flex mb-3';
      replyElement.innerHTML = `
        <div class="bg-gray-200 text-black rounded-lg py-2 px-4 max-w-[70%]" style="background-color: #e5e7eb; color: black; border-radius: 0.5rem; padding: 0.5rem 1rem; margin-bottom: 0.75rem; max-width: 70%;">
          ${message}
        </div>
      `;
      chatMessages.appendChild(replyElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
  })();
