const DIRECTORY_DB_ID = 'e5e2c0c2-81dc-4ce5-ac7a-857b090b07de';
const WAITLIST_DB_ID = '9cc90250-0596-4b4d-b2a1-f06e9b20db06';

// Initialize view
document.addEventListener('DOMContentLoaded', () => {
    updateWaitlistCount();
    
    // Check for referrals
    const urlParams = new URLSearchParams(window.location.search);
    const referral = urlParams.get('ref') || 'direct';
    window.referralSource = referral;
});

// Search Logic
async function handleSearch() {
    const query = document.getElementById('interest-search').value.trim();
    if (!query) return;

    const resultsSection = document.getElementById('results-section');
    const resultTitle = document.getElementById('result-title');
    const resultCategory = document.getElementById('result-category');
    const factCard = document.getElementById('fact-card');
    const productList = document.getElementById('product-list');
    const eventList = document.getElementById('event-list');

    // Show results section
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
    
    // Loading state
    resultTitle.innerText = `Searching for "${query}"...`;
    productList.innerHTML = '<div class="animate-pulse bg-stone h-24 rounded-lg"></div>';
    eventList.innerHTML = '<div class="animate-pulse bg-stone h-24 rounded-lg"></div>';

    try {
        // Fetch from Fixy Directory
        const response = await fetch(`https://app.baget.ai/api/public/databases/${DIRECTORY_DB_ID}/rows`);
        const data = await response.json();
        const interests = data.rows || [];

        // Find match
        const match = interests.find(i => 
            i.interest_name.toLowerCase().includes(query.toLowerCase()) || 
            query.toLowerCase().includes(i.interest_name.toLowerCase())
        );

        if (match) {
            displayResults(match);
        } else {
            // No direct match in seed data, fallback or message
            resultTitle.innerText = `Interests for "${query}"`;
            resultCategory.innerText = "Custom Search";
            factCard.innerText = `We're currently expanding our verified database. Join the waitlist to be notified when "${query}" is fully mapped!`;
            
            productList.innerHTML = createItemCard('Amazon Search Results', `View high-rated toddler ${query} gear.`, `https://www.amazon.com/s?k=toddler+${query.replace(' ', '+')}&i=toys-and-games`);
            eventList.innerHTML = createItemCard('Google Events', `Find local ${query} activities near you.`, `https://www.google.com/search?q=${query.replace(' ', '+')}+for+toddlers+near+me`);
        }
    } catch (error) {
        console.error('Search failed:', error);
        resultTitle.innerText = "Oops, search failed.";
    }
}

function displayResults(match) {
    const resultTitle = document.getElementById('result-title');
    const resultCategory = document.getElementById('result-category');
    const factCard = document.getElementById('fact-card');
    const productList = document.getElementById('product-list');
    const eventList = document.getElementById('event-list');

    resultTitle.innerText = match.interest_name;
    resultCategory.innerText = match.category;
    factCard.innerText = `Did you know? ${match.fact_card || "This fixation helps develop spatial reasoning and complex motor skills."}`;

    // Products
    const productKeywords = match.amazon_product_refs || match.interest_name;
    productList.innerHTML = `
        ${createItemCard('The "Gold Standard" Book', `Expert-vetted reading for ${match.interest_name}.`, `https://www.amazon.com/s?k=${productKeywords.replace(/ /g, '+')}+book+toddler`)}
        ${createItemCard('High-Quality Physical Toy', `Non-plastic, high-durability play.`, `https://www.amazon.com/s?k=${productKeywords.replace(/ /g, '+')}+toy+wooden`)}
    `;

    // Events
    const eventQuery = match.local_event_query_terms || match.interest_name;
    eventList.innerHTML = `
        ${createItemCard('Nearby Experience', `Find the nearest ${match.interest_name} outing.`, `https://www.google.com/search?q=${eventQuery.replace(/ /g, '+')}+near+me`)}
        ${createItemCard('Community Workshop', `Interactive discovery sessions.`, `https://www.google.com/search?q=${match.interest_name}+workshop+for+preschoolers`)}
    `;
}

function createItemCard(title, desc, url) {
    return `
        <a href="${url}" target="_blank" class="block p-5 bg-stone/50 border border-forest/10 rounded-xl hover:bg-stone hover:border-amber transition group">
            <div class="flex justify-between items-center">
                <div>
                    <h4 class="font-heading font-bold text-forest group-hover:text-amber">${title}</h4>
                    <p class="text-sm text-charcoal/60">${desc}</p>
                </div>
                <svg class="w-5 h-5 text-forest/20 group-hover:text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
        </a>
    `;
}

// Waitlist Submission
const waitlistForm = document.getElementById('waitlist-form');
waitlistForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('waitlist-email').value;
    const interest = document.getElementById('interest-search').value || 'general';
    const statusEl = document.getElementById('waitlist-status');

    try {
        const response = await fetch(`https://app.baget.ai/api/public/databases/${WAITLIST_DB_ID}/rows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    email: email,
                    interest: interest,
                    source: window.referralSource || 'direct'
                }
            })
        });

        if (response.ok) {
            statusEl.innerText = "You're on the list! Keep an eye on your inbox for our June launch.";
            statusEl.classList.remove('hidden');
            waitlistForm.reset();
            updateWaitlistCount();
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        statusEl.innerText = "Something went wrong. Please try again.";
        statusEl.classList.remove('hidden');
    }
});

async function updateWaitlistCount() {
    try {
        const response = await fetch(`https://app.baget.ai/api/public/databases/${WAITLIST_DB_ID}/count`);
        const data = await response.json();
        if (data.count) {
            document.getElementById('waitlist-counter').innerText = `${data.count} parents have joined the waitlist`;
        }
    } catch (error) {
        console.error('Count fetch failed');
    }
}
