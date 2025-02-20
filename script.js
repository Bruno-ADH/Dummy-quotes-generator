document.addEventListener("DOMContentLoaded", () => {
    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    const generateButton = document.querySelector(".generateCitation");
    const favoriteButton = document.querySelector(".favoris i");
    const shareFacebook = document.querySelector(".fb");
    const shareWhatsapp = document.querySelector(".wp");
    const shareTwitter = document.querySelector(".twitter");

    let currentQuote = { text: "", author: "" };
    let favorites = JSON.parse(localStorage.getItem("favorites")) || []; 
    async function fetchQuote() {
        try {
            const response = await fetch("https://kaamelott.chaudie.re/api/random");
            const data = await response.json();
            const citation = data.citation.citation;
            const auteur = data.citation.infos.personnage;
            
            currentQuote = { text: citation, author: auteur };
            displayTypingEffect(citation, auteur);
            updateFavoriteIcon();
        } catch (error) {
            console.error("Erreur lors de la récupération de la citation :", error);
            quoteText.textContent = "Impossible de charger une citation.";
            quoteAuthor.textContent = "";
        }
    }

    function displayTypingEffect(text, author) {
        let index = 0;
        quoteText.textContent = "";
        quoteAuthor.textContent = "";

        function type() {
            if (index < text.length) {
                quoteText.textContent += text.charAt(index);
                index++;
                setTimeout(type, 40); 
            } else {
                quoteAuthor.textContent = `- ${author}`;
            }
        }
        type();
    }

    function updateFavoriteIcon() {
        const isFavorite = favorites.some(fav => fav.text === currentQuote.text && fav.author === currentQuote.author);
        if (isFavorite) {
            favoriteButton.classList.remove("far"); 
            favoriteButton.classList.add("fas"); 
        } else {
            favoriteButton.classList.remove("fas"); 
            favoriteButton.classList.add("far"); 
        }
    }

    function toggleFavorite() {
        const index = favorites.findIndex(fav => fav.text === currentQuote.text && fav.author === currentQuote.author);
        
        if (index === -1) {
            favorites.push(currentQuote);
        } else {
            favorites.splice(index, 1);
        }

        localStorage.setItem("favorites", JSON.stringify(favorites)); 
        updateFavoriteIcon(); 
    }

    function shareOnFacebook() {
        const quote = quoteText.textContent;
        const author = quoteAuthor.textContent;
     