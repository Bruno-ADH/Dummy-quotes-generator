document.addEventListener("DOMContentLoaded", () => {
    const quoteText = document.getElementById("quote-text");
    const quoteAuthor = document.getElementById("quote-author");
    const generateButton = document.querySelector(".generateCitation");
    const generateIcon = document.querySelector(".d-icon");
    const favoriteButton = document.querySelector(".favoris i");
    const translateButton = document.querySelector(".translate")
    // const shareFacebook = document.querySelector(".fb");
    // const shareWhatsapp = document.querySelector(".wp");
    // const shareTwitter = document.querySelector(".twitter");
    const share = document.querySelector(".sh")

    let currentQuote = { text: "", author: "" };
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let isTranslated = false;
    let originalText = "";
    let isFetching = false

    // let quotes = [];

    // function getRandomQuote() {
    //     const randomIndex = Math.floor(Math.random() * quotes.length);
    //     return quotes[randomIndex];
    // }

    // function displayRandomQuote() {
    //     const randomQuote = getRandomQuote();
    //     displayTypingEffect(randomQuote.text, randomQuote.author);
    // }


    async function fetchQuote() {
        isTranslated = false;
        originalText = "";
        isFetching = true
        try {
            // const API_URL = "https://api.allorigins.win/get?url=https://kaamelott.chaudie.re/api/random";
            // const response = await fetch(API_URL);
            // const data = await response.json();
            // const parsedData = JSON.parse(data.contents);
            // const citation = parsedData.citation.citation;
            // const auteur = parsedData.citation.infos.personnage;


            const response = await fetch("https://dummyjson.com/quotes/random");
            const data = await response.json();
            // console.log('data :>> ', data);
            const citation = data.quote;
            const auteur = data.author;

            currentQuote = { text: citation, author: auteur };
            displayTypingEffect(citation, auteur);

            // const response = await fetch("quotes.json");
            // quotes = await response.json();
            // displayRandomQuote();
            updateFavoriteIcon();
        } catch (error) {
            console.error("Erreur lors de la récupération de la citation :", error);
            quoteText.textContent = "Impossible de charger une citation.";
            quoteAuthor.textContent = "";
        }
    }

    function displayTypingEffect(text, author) {
        let index = 0;
        quoteText.innerHTML = `<span class="blink"></span>`;
        quoteAuthor.textContent = "";

        function type() {
            if (index < text.length) {
                quoteText.innerHTML = text.substring(0, index + 1) + `<span class="blink"></span>`;
                index++;
                setTimeout(type, 40);
            } else {
                quoteText.classList.add("double-quote");
                document.querySelector(".blink").style.display = "none";
                quoteAuthor.innerHTML = `- ${author} <span class="feather"></span>`;
                isFetching = false
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

    function rotateIcon() {
        generateIcon.style.animation = "turn .5s ease-in-out forwards";
        setTimeout(() => {
            generateIcon.style.animation = "none";
        }, 1000);
    }

    function shareOnFacebook() {
        const quote = quoteText.textContent;
        const author = quoteAuthor.textContent;
        const url = `https://www.facebook.com/sharer/sharer.php?u=&quote=${encodeURIComponent(quote + " " + author)}`;
        window.open(url, "_blank");
    }

    function shareOnWhatsApp() {
        const quote = quoteText.textContent;
        const author = quoteAuthor.textContent;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(quote + " " + author)}`;
        window.open(url, "_blank");
    }

    function shareOnTwitter() {
        const quote = quoteText.textContent;
        const author = quoteAuthor.textContent;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(quote + " " + author)}`;
        window.open(url, "_blank");
    }

    function removeDoubleQuote() {
        const cite = document.querySelector("#quote-text")
        cite.classList.contains("double-quote") && cite.classList.remove("double-quote")
    }

    generateButton.addEventListener("click", () => {
        if (!isFetching) {
            removeDoubleQuote();
            fetchQuote();
            rotateIcon();
        }
    });

    function captureAndShare() {
        const socialButtons = document.querySelector(".social-icons");
        translateButton.classList.add("hidden");
        socialButtons.classList.add("hidden");

        const quoteContainer = document.querySelector("#quote-container");

        setTimeout(() => {
            html2canvas(quoteContainer, {
                backgroundColor: "transparent",
                useCORS: true
            }).then(canvas => {
                translateButton.classList.remove("hidden");
                socialButtons.classList.remove("hidden");
                const imageData = canvas.toDataURL("image/png");

                if (navigator.share) {
                    navigator.share({
                        title: "Citation inspirante",
                        text: "Regarde cette citation !",
                        files: [dataURLtoFile(imageData, "quote.png")]
                    }).catch(error => console.log("Erreur de partage :", error));
                } else {
                    alert("Le partage direct n'est pas supporté sur ce navigateur.");
                }
            });
        }, 300)
    }

    function dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(","), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    share.addEventListener("click", captureAndShare)

    async function translateQuote() {
        const quoteTextElement = document.querySelector("#quote-text");

        try {
            if (!isTranslated) {
                originalText = quoteTextElement.textContent;
                const lang = navigator.language || "fr";
                const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(originalText)}`);
                console.log(response);
                const data = await response.json();

                const translatedText = data[0].map(item => item[0]).join("");
                quoteTextElement.textContent = translatedText;
            } else {
                quoteTextElement.textContent = originalText;
            }
        } catch (error) {
            console.error("Erreur de traduction :", error);
        } finally {
            isTranslated = !isTranslated;
        }
    }

    translateButton.addEventListener("click", translateQuote);
    favoriteButton.addEventListener("click", toggleFavorite);
    // shareFacebook.addEventListener("click", shareOnFacebook);
    // shareWhatsapp.addEventListener("click", shareOnWhatsApp);
    // shareTwitter.addEventListener("click", shareOnTwitter);

    fetchQuote();
});
