(function () {
    "use strict";

    // ==================================================
    // BACKEND CONFIGURATION
    // ==================================================

    const API_URL = "https://smart-compressor-1-v6yq.onrender.com";


    // ==================================================
    // THEME TOGGLE
    // ==================================================

    const themeToggle = document.getElementById("themeToggle");
    const sunIcon = document.getElementById("sunIcon");
    const moonIcon = document.getElementById("moonIcon");
    const body = document.body;

    function applyTheme(theme) {
        if (theme === "light") {
            body.classList.add("light");
            sunIcon.style.display = "none";
            moonIcon.style.display = "block";
        } else {
            body.classList.remove("light");
            sunIcon.style.display = "block";
            moonIcon.style.display = "none";
        }
    }

    let currentTheme = "dark";
    applyTheme(currentTheme);

    themeToggle.addEventListener("click", function () {
        currentTheme =
            currentTheme === "dark" ? "light" : "dark";

        applyTheme(currentTheme);
    });


    // ==================================================
    // NAVIGATION
    // ==================================================

    document.querySelectorAll(".nav-item").forEach(function (item) {

        item.addEventListener("click", function (e) {

            e.preventDefault();

            document
                .querySelectorAll(".nav-item")
                .forEach(function (i) {
                    i.classList.remove("active");
                });

            item.classList.add("active");
        });

    });


    // ==================================================
    // ELEMENTS
    // ==================================================

    const contextInput =
        document.getElementById("contextInput");

    const queryInput =
        document.getElementById("queryInput");

    const estTokens =
        document.getElementById("estTokens");

    const compressBtn =
        document.getElementById("compressBtn");

    const resetBtn =
        document.getElementById("resetBtn");

    const processBadge =
        document.getElementById("processBadge");

    const steps =
        Array.from(document.querySelectorAll(".step"));

    const pipeNodes =
        Array.from(document.querySelectorAll(".pipe-node"));

    const resultsBadge =
        document.getElementById("resultsBadge");

    const origTokensEl =
        document.getElementById("origTokens");

    const compTokensEl =
        document.getElementById("compTokens");

    const reductionPctEl =
        document.getElementById("reductionPct");

    const savingsBarFill =
        document.getElementById("savingsBarFill");

    const savingsPctLabel =
        document.getElementById("savingsPctLabel");

    const compressedOutput =
        document.getElementById("compressedOutput");

    const copyBtn =
        document.getElementById("copyBtn");

    const downloadBtn =
        document.getElementById("downloadBtn");

    const totalChunksEl =
        document.getElementById("totalChunks");

    const selectedChunksEl =
        document.getElementById("selectedChunks");

    const discardedChunksEl =
        document.getElementById("discardedChunks");

    const compareOriginal =
        document.getElementById("compareOriginal");

    const compareCompressed =
        document.getElementById("compareCompressed");


    // ==================================================
    // TOKEN ESTIMATION
    // ==================================================

    function estimateTokens(text) {

        if (!text.trim()) {
            return 0;
        }

        return Math.max(
            0,
            Math.round(text.trim().length / 4)
        );
    }


    function updateEstimate() {

        const tokens =
            estimateTokens(contextInput.value);

        estTokens.textContent =
            tokens.toLocaleString();
    }


    contextInput.addEventListener(
        "input",
        updateEstimate
    );

    updateEstimate();


    // ==================================================
    // PROCESSING STEPS
    // ==================================================

    let isProcessing = false;


    function resetSteps() {

        steps.forEach(function (step) {

            step.classList.remove(
                "active",
                "done"
            );

            const spinner =
                step.querySelector(".step-spinner");

            if (spinner) {
                spinner.style.opacity = 0;
            }

        });


        pipeNodes.forEach(function (node) {

            node.classList.remove(
                "active",
                "done"
            );

        });


        pipeNodes[2].classList.add("active");
    }


    function runStep(index) {

        return new Promise(function (resolve) {

            const step = steps[index];

            step.classList.add("active");

            const duration =
                400 + Math.random() * 300;

            setTimeout(function () {

                step.classList.remove("active");

                step.classList.add("done");

                resolve();

            }, duration);

        });

    }


    async function runProcessing() {

        processBadge.textContent =
            "Running";

        processBadge.classList.remove(
            "idle",
            "success"
        );

        processBadge.classList.add(
            "running"
        );


        pipeNodes.forEach(function (node) {

            node.classList.remove(
                "active",
                "done"
            );

        });


        pipeNodes[0].classList.add("done");
        pipeNodes[1].classList.add("done");


        for (
            let i = 0;
            i < steps.length;
            i++
        ) {

            pipeNodes[2].classList.add("active");

            await runStep(i);

        }


        pipeNodes[2].classList.remove(
            "active"
        );

        pipeNodes[2].classList.add(
            "done"
        );

        pipeNodes[3].classList.add(
            "active"
        );

    }


    // ==================================================
    // ANIMATE NUMBER
    // ==================================================

    function animateCount(
        element,
        from,
        to,
        duration
    ) {

        const start =
            performance.now();


        function tick(now) {

            const progress =
                Math.min(
                    1,
                    (now - start) / duration
                );


            const eased =
                1 - Math.pow(
                    1 - progress,
                    3
                );


            const value =
                Math.round(
                    from +
                    (to - from) *
                    eased
                );


            element.textContent =
                value.toLocaleString();


            if (progress < 1) {

                requestAnimationFrame(tick);

            } else {

                element.textContent =
                    to.toLocaleString();

            }

        }


        requestAnimationFrame(tick);
    }


    // ==================================================
    // COMPRESS CONTEXT
    // ==================================================

    async function handleCompress() {

        if (isProcessing) {
            return;
        }


        const contextText =
            contextInput.value.trim();

        const queryText =
            queryInput.value.trim();


        // -------------------------------
        // Validate context
        // -------------------------------

        if (!contextText) {

            contextInput.focus();

            contextInput.style.borderColor =
                "var(--warn)";

            setTimeout(function () {

                contextInput.style.borderColor =
                    "";

            }, 900);

            return;
        }


        // -------------------------------
        // Validate query
        // -------------------------------

        if (!queryText) {

            queryInput.focus();

            queryInput.style.borderColor =
                "var(--warn)";

            setTimeout(function () {

                queryInput.style.borderColor =
                    "";

            }, 900);

            return;
        }


        // -------------------------------
        // Start processing
        // -------------------------------

        isProcessing = true;

        compressBtn.disabled = true;

        compressBtn.querySelector(
            "span:last-child"
        ).textContent = "Compressing…";


        resultsBadge.textContent =
            "Processing";

        resultsBadge.classList.remove(
            "success"
        );

        resultsBadge.classList.add(
            "running"
        );


        resetSteps();


        try {

            // ==========================================
            // SEND DATA TO FASTAPI
            // ==========================================

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            context:
                                contextText,

                            query:
                                queryText

                        })
                    }
                );


            // ==========================================
            // READ RESPONSE
            // ==========================================

            const data =
                await response.json();


            // ==========================================
            // HANDLE BACKEND ERROR
            // ==========================================

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Compression failed."
                );

            }


            // ==========================================
            // PROCESSING ANIMATION
            // ==========================================

            await runProcessing();


            // ==========================================
            // UPDATE RESULTS
            // ==========================================

            const originalTokens =
                data.original_tokens;

            const compressedTokens =
                data.compressed_tokens;

            const reduction =
                data.reduction;


            origTokensEl.textContent =
                originalTokens.toLocaleString();


            animateCount(
                compTokensEl,
                0,
                compressedTokens,
                700
            );


            reductionPctEl.textContent =
                reduction + "%";


            savingsBarFill.style.width =
                reduction + "%";


            savingsPctLabel.textContent =
                reduction + "%";


            // ==========================================
            // COMPRESSED CONTEXT
            // ==========================================

            compressedOutput.innerHTML = "";

            compressedOutput.classList.add(
                "filled"
            );


            const output =
                document.createElement("div");


            output.style.whiteSpace =
                "pre-wrap";


            output.textContent =
                data.compressed_context;


            compressedOutput.appendChild(
                output
            );


            // ==========================================
            // CONTEXT ANALYSIS
            // ==========================================

            totalChunksEl.textContent =
                data.total_chunks;


            selectedChunksEl.textContent =
                data.selected_chunks;


            discardedChunksEl.textContent =
                data.discarded_chunks;


            // ==========================================
            // ORIGINAL VS COMPRESSED
            // ==========================================

            compareOriginal.textContent =
                contextText;


            compareCompressed.textContent =
                data.compressed_context;


            // ==========================================
            // COMPLETE
            // ==========================================

            resultsBadge.textContent =
                "Complete";

            resultsBadge.classList.remove(
                "running"
            );

            resultsBadge.classList.add(
                "success"
            );


            processBadge.textContent =
                "Complete";

            processBadge.classList.remove(
                "running"
            );

            processBadge.classList.add(
                "success"
            );


        } catch (error) {

            console.error(
                "Backend Error:",
                error
            );


            resultsBadge.textContent =
                "Error";

            resultsBadge.classList.remove(
                "running",
                "success"
            );


            processBadge.textContent =
                "Failed";

            processBadge.classList.remove(
                "running",
                "success"
            );

            processBadge.classList.add(
                "idle"
            );


            alert(
                "Could not connect to FastAPI.\n\n" +
                error.message +
                "\n\nMake sure FastAPI is running on port 8000."
            );


        } finally {

            compressBtn.disabled =
                false;

            compressBtn.querySelector(
                "span:last-child"
            ).textContent =
                "Compress Context";

            isProcessing =
                false;

        }

    }


    compressBtn.addEventListener(
        "click",
        handleCompress
    );


    // ==================================================
    // COPY
    // ==================================================

    copyBtn.addEventListener(
        "click",
        async function () {

            const text =
                compressedOutput.textContent.trim();


            if (
                !text ||
                compressedOutput.querySelector(
                    ".output-placeholder"
                )
            ) {

                return;

            }


            try {

                await navigator.clipboard.writeText(
                    text
                );

            } catch (error) {

                const textarea =
                    document.createElement(
                        "textarea"
                    );

                textarea.value = text;

                document.body.appendChild(
                    textarea
                );

                textarea.select();

                document.execCommand(
                    "copy"
                );

                document.body.removeChild(
                    textarea
                );

            }


            const original =
                copyBtn.innerHTML;


            copyBtn.classList.add(
                "copied"
            );


            copyBtn.innerHTML =
                '<svg viewBox="0 0 24 24" fill="none">' +
                '<path d="M5 12.5L10 17.5L19 7" ' +
                'stroke="currentColor" stroke-width="2.2" ' +
                'stroke-linecap="round" ' +
                'stroke-linejoin="round"/>' +
                '</svg> Copied';


            setTimeout(function () {

                copyBtn.classList.remove(
                    "copied"
                );

                copyBtn.innerHTML =
                    original;

            }, 1600);

        }
    );


    // ==================================================
    // DOWNLOAD
    // ==================================================

    downloadBtn.addEventListener(
        "click",
        function () {

            const text =
                compressedOutput.textContent.trim();


            if (
                !text ||
                compressedOutput.querySelector(
                    ".output-placeholder"
                )
            ) {

                return;

            }


            const blob =
                new Blob(
                    [text],
                    {
                        type: "text/plain"
                    }
                );


            const url =
                URL.createObjectURL(blob);


            const link =
                document.createElement("a");


            link.href = url;

            link.download =
                "compressed-context.txt";


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );

        }
    );


    // ==================================================
    // RESET
    // ==================================================

    function resetAll() {

        contextInput.value = "";

        queryInput.value = "";

        updateEstimate();


        resetSteps();


        processBadge.textContent =
            "Idle";

        processBadge.classList.remove(
            "running",
            "success"
        );

        processBadge.classList.add(
            "idle"
        );


        resultsBadge.textContent =
            "Awaiting run";

        resultsBadge.classList.remove(
            "running",
            "success"
        );


        origTokensEl.textContent =
            "0";

        compTokensEl.textContent =
            "—";

        reductionPctEl.textContent =
            "—";


        savingsBarFill.style.width =
            "0%";

        savingsPctLabel.textContent =
            "0%";


        compressedOutput.classList.remove(
            "filled"
        );


        compressedOutput.innerHTML =
            '<span class="output-placeholder">' +
            "Run a compression to see the optimized context here." +
            "</span>";


        compareOriginal.textContent =
            "Original context will appear here after a compression run.";


        compareCompressed.textContent =
            "Compressed context will appear here after a compression run.";


        totalChunksEl.textContent =
            "0";

        selectedChunksEl.textContent =
            "0";

        discardedChunksEl.textContent =
            "0";


        isProcessing =
            false;


        compressBtn.disabled =
            false;


        compressBtn.querySelector(
            "span:last-child"
        ).textContent =
            "Compress Context";

    }


    resetBtn.addEventListener(
        "click",
        resetAll
    );


    // ==================================================
    // INITIALIZE
    // ==================================================

    resetSteps();

})();