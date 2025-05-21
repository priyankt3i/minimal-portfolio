import './style.css';
import './chat-widget.js'; // Import the chat widget

// Lottie Player References are no longer needed globally
// const lottieEducation = document.getElementById('lottieEducation');
// const lottieGraduation = document.getElementById('lottieGraduation');
// const lottieWork = document.getElementById('lottieWork');
// const allLottiePlayers = [lottieEducation, lottieGraduation, lottieWork];

// Content Block References
const dynamicContentTitle = document.getElementById('dynamicContentTitle');
const educationContentBlock = document.getElementById('educationContentBlock');
const ibmExperienceBlock = document.getElementById('ibmExperienceBlock');
const cognizantExperienceBlock = document.getElementById('cognizantExperienceBlock');
const advisor360ExperienceBlock = document.getElementById('advisor360ExperienceBlock');
const plymouthRockExperienceBlock = document.getElementById('plymouthRockExperienceBlock');
const welcomeContentBlock = document.getElementById('welcomeContentBlock'); // Added Welcome Block
const allContentBlocks = [welcomeContentBlock, educationContentBlock, ibmExperienceBlock, cognizantExperienceBlock, advisor360ExperienceBlock, plymouthRockExperienceBlock]; // Added Welcome Block

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Gemini Modal Elements
const geminiModal = document.getElementById('geminiModal');
const geminiModalTitle = document.getElementById('geminiModalTitle');
const geminiModalBody = document.getElementById('geminiModalBody');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const geminiLoader = document.getElementById('geminiLoader');

// Mapping pane index to content (Lottie property removed)
const paneConfigurations = [
    { title: "Welcome!", content: welcomeContentBlock, id: "welcome" }, // Added Welcome Pane
    { title: "Current: PlymouthRock", content: plymouthRockExperienceBlock, id: "plymouthrock" },
    { title: "Previous: Advisor360", content: advisor360ExperienceBlock, id: "advisor360" },
    { title: "Historic: Cognizant", content: cognizantExperienceBlock, id: "cognizant" },
    { title: "Pre-Historic: IBM", content: ibmExperienceBlock, id: "ibm" },
    { title: "Education & Qualifications", content: educationContentBlock, id: "university" }
];
// let previousPaneIndex = 0; // No longer needed for Lottie graduation logic

class AccordionDrag {
    constructor(containerId) {
        this.track = document.getElementById(containerId);
        if (!this.track) {
            console.error(`Accordion track with id "${containerId}" not found.`);
            return;
        }
        this.container = this.track.parentElement;
        this.panes = Array.from(this.track.children);
        this.activeIndex = 0;
        this.totalVisible = Math.min(5, this.panes.length);
        this.expandedWidth = 60; // %
        this.compressedWidth = (this.totalVisible > 1) ? (100 - this.expandedWidth) / (this.totalVisible - 1) : 0;
        this.isDragging = false;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        
        if (this.panes.length === 0) {
            console.warn("Accordion has no panes.");
            return;
        }
        if (this.totalVisible <= 1) {
            this.compressedWidth = 0;
            this.expandedWidth = 100;
        }
        this.init();
    }

    init() {
        this.setActive(0, true);
        this.bindEvents();
    }

    setActive(index, isInitialCall = false) {
        if (index < 0 || index >= this.panes.length) return;

        // const oldActiveIndex = this.activeIndex; // Not needed without Lottie graduation logic
        this.activeIndex = index;

        for (const [i, pane] of this.panes.entries()) {
            const isActive = i === index;
            pane.classList.toggle("active", isActive);
            pane.style.flex = `0 0 ${isActive ? this.expandedWidth : this.compressedWidth}%`;
        }
        
        this.updatePageContent(index); // Removed oldActiveIndex and isInitialCall as they were for Lottie
        this.scrollToActive();
    }
    
    updatePageContent(newIndex) { // Simplified: no Lottie logic
        for (const block of allContentBlocks) {
            block?.classList.add('hidden-content');
        }

        const config = paneConfigurations[newIndex];
        if (config) {
            if (dynamicContentTitle) {
                 dynamicContentTitle.textContent = config.title;
            }
            config.content?.classList.remove('hidden-content');
        } else {
             console.warn("No pane configuration for index:", newIndex);
        }
        // previousPaneIndex = newIndex; // No longer needed
    }

    scrollToActive() {
        if (!this.container || this.panes.length === 0) return;
        const containerWidth = this.container.offsetWidth;

        let offsetLeft = 0;
        for (let i = 0; i < this.activeIndex; i++) {
            if(this.panes[i]) offsetLeft += this.panes[i].offsetWidth;
        }
        
        let shift = offsetLeft;

        if (this.totalVisible > 1 && this.panes.length > 1) {
            const compressedPaneWidth = (this.compressedWidth / 100) * containerWidth;
            let idealShift = offsetLeft;
            if (this.activeIndex > 0) {
                idealShift -= compressedPaneWidth;
            }
             shift = idealShift;
        }

        const maxScroll = this.track.scrollWidth - containerWidth;
        shift = Math.max(0, Math.min(shift, maxScroll));

        this.currentTranslate = -shift;
        this.prevTranslate = this.currentTranslate;
        this.track.style.transition = "transform 0.3s ease";
        this.track.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    bindEvents() {
        const wrapper = this.container;
        if (!wrapper) return;

        const pointerDown = (e) => {
            this.isDragging = true;
            this.startX = e.clientX;
            this.track.style.transition = "none";
        };

        const pointerMove = (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const dx = e.clientX - this.startX;
            this.currentTranslate = this.prevTranslate + dx;
            const maxScrollVal = 0;
            const minScrollVal = -(this.track.scrollWidth - this.container.offsetWidth);
            this.currentTranslate = Math.max(minScrollVal, Math.min(this.currentTranslate, maxScrollVal));
            this.track.style.transform = `translateX(${this.currentTranslate}px)`;
        };

        const pointerUp = () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.prevTranslate = this.currentTranslate;
            this.track.style.transition = "transform 0.3s ease";
            
            const containerRect = this.container.getBoundingClientRect();
            const trackRect = this.track.getBoundingClientRect();
            let closestIndex = 0;
            let minDistance = Number.POSITIVE_INFINITY;

            for (const [i, pane] of this.panes.entries()) {
                const paneRect = pane.getBoundingClientRect();
                const paneCenterInTrack = (paneRect.left - trackRect.left) + (paneRect.width / 2);
                const targetCenterInTrack = (containerRect.width / 2) - this.currentTranslate;
                
                const distance = Math.abs(paneCenterInTrack - targetCenterInTrack);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = i;
                }
            }
            this.setActive(closestIndex);
        };

        wrapper.addEventListener("pointerdown", pointerDown);
        wrapper.addEventListener("pointermove", pointerMove);
        window.addEventListener("pointerup", pointerUp);

        for (const [i, pane] of this.panes.entries()) {
            pane.addEventListener("click", () => this.setActive(i));
        }
    }
}

const accordionInstance = new AccordionDrag("accordion"); // Make accordionInstance a const
document.addEventListener("DOMContentLoaded", () => {
    // accordionInstance = new AccordionDrag("accordion"); // Remove this line as it's already initialized

    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');

    prevBtn?.addEventListener('click', () => {
        if (accordionInstance?.panes?.length > 0) {
            const newIndex = Math.max(0, accordionInstance.activeIndex - 1);
            accordionInstance.setActive(newIndex);
        }
    });

    nextBtn?.addEventListener('click', () => {
         if (accordionInstance?.panes?.length > 0) {
            const newIndex = Math.min(accordionInstance.panes.length - 1, accordionInstance.activeIndex + 1);
            accordionInstance.setActive(newIndex);
        }
    });
    updateDynamicYears(); // Calculate and update years of experience
});

// Function to calculate years since graduation
function calculateYearsSinceGraduation() {
    const graduationYear = 2011;
    const graduationMonth = 5; // June is month 5 (0-indexed for JavaScript Date)
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    let years = currentYear - graduationYear;
    
    if (currentMonth < graduationMonth) {
        years--;
    }
    
    return years;
}

// Function to update the dynamic years span
function updateDynamicYears() {
    const yearsElement = document.getElementById('dynamicYears');
    if (yearsElement) {
        yearsElement.textContent = calculateYearsSinceGraduation();
    }
}

function setTheme(isDark) {
    body.classList.toggle('dark-mode', isDark);
    themeToggle.textContent = isDark ? 'Light Mode' : 'Dark Mode';
}
themeToggle.addEventListener('click', () => {
    setTheme(!body.classList.contains('dark-mode'));
});

function showGeminiModal(isLoading = true, title = "✨ Gemini's Suggestion", content = "") {
    geminiModalTitle.textContent = title;
    if (isLoading) {
        geminiModalBody.innerHTML = '';
        geminiModalBody.appendChild(geminiLoader);
        geminiLoader.style.display = 'block';
    } else {
        geminiLoader.style.display = 'none';
        geminiModalBody.textContent = content;
    }
    geminiModal.classList.add('visible');
}

function hideGeminiModal() {
    geminiModal.classList.remove('visible');
}

modalCloseBtn.addEventListener('click', hideGeminiModal);
geminiModal.addEventListener('click', (event) => {
    if (event.target === geminiModal) {
        hideGeminiModal();
    }
});

async function callGeminiAPI(prompt, modalTitle) {
    showGeminiModal(true, modalTitle);
    
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Gemini API Key is missing. Make sure VITE_GEMINI_API_KEY is set in your .env file.');
        showGeminiModal(false, "API Key Error", "Gemini API key is missing. Please check .env file and restart the dev server.");
        return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    const headers = {
      'Content-Type': 'application/json',
    };

    const geminiPayload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(geminiPayload)
        });
        
        const data = await response.json();

        if (data.error) {
            console.error('Gemini API error:', data.error);
            showGeminiModal(false, "Error", `Gemini API Error: ${data.error.message || 'Unknown error'}`);
            return;
        }
        if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
            console.error('Gemini error: Invalid response structure', data);
            showGeminiModal(false, "Error", "Received an invalid response structure from Gemini.");
            return;
        }
        const generatedText = data.candidates[0].content.parts[0].text;
        showGeminiModal(false, modalTitle, generatedText);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        showGeminiModal(false, "Error", "Could not connect to Gemini. Please check your connection or try again later.");
    }
}

function addGeminiSummaryButtons() {
    // Select all .entry elements that could contain a summary button,
    // including those in education and experiences sections.
    const entries = document.querySelectorAll('#portfolioContentArea .entry'); 
    for (const entry of entries) {
        const summaryButton = entry.querySelector('.gemini-summary-button');
        if (summaryButton && !summaryButton.dataset.listenerAttached) {
             summaryButton.addEventListener('click', () => {
                const companyNameElement = entry.querySelector('h4');
                const jobTitleElement = entry.querySelector('.job-title');
                
                const companyName = companyNameElement ? companyNameElement.firstChild.textContent.trim() : "N/A";
                const jobTitle = jobTitleElement ? jobTitleElement.textContent.trim() : "N/A";
                
                const bulletPoints = Array.from(entry.querySelectorAll('ul li'))
                                       .map(li => li.firstChild.textContent.trim())
                                       .join("\n - ");
                
                const prompt = `You are a grumpy, sarcastic dad in your late 50s. You always have a comment about “kids these days,” complain about tech you don’t understand, and reluctantly give advice—even though you're usually right. Based on the following job details, generate a concise 2-3 sentence summary of the role and its key achievements.\n\nCompany: ${companyName}\nJob Title: ${jobTitle}\nResponsibilities and Achievements:\n - ${bulletPoints}\n\nSummary:`;
                callGeminiAPI(prompt, `✨ Summary for ${jobTitle} at ${companyName}`);
            });
            summaryButton.dataset.listenerAttached = 'true';
        }
    }
}

window.addEventListener('load', () => {
    addGeminiSummaryButtons();
    // Lottie player initialization logic removed
    setTheme(false);
});

window.addEventListener('resize', () => {
    if (accordionInstance && typeof accordionInstance.scrollToActive === 'function') {
         if (accordionInstance.totalVisible > 1) {
            accordionInstance.compressedWidth = (100 - accordionInstance.expandedWidth) / (accordionInstance.totalVisible - 1);
         } else {
            accordionInstance.compressedWidth = 0;
         }
         accordionInstance.setActive(accordionInstance.activeIndex);
    }
});
