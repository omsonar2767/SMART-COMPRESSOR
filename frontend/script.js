(function () {
    "use strict";

    /* ---------- Theme toggle ---------- */
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    const body = document.body;

    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light');
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            body.classList.remove('light');
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    let currentTheme = 'dark';
    applyTheme(currentTheme);

    themeToggle.addEventListener('click', function () {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme);
    });

    /* ---------- Nav active state (single page, cosmetic) ---------- */
    document.querySelectorAll('.nav-item').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    /* ---------- Elements ---------- */
    const contextInput = document.getElementById('contextInput');
    const queryInput = document.getElementById('queryInput');
    const estTokens = document.getElementById('estTokens');
    const compressBtn = document.getElementById('compressBtn');
    const resetBtn = document.getElementById('resetBtn');

    const processBadge = document.getElementById('processBadge');
    const steps = Array.from(document.querySelectorAll('.step'));
    const pipeNodes = Array.from(document.querySelectorAll('.pipe-node'));

    const resultsBadge = document.getElementById('resultsBadge');
    const origTokensEl = document.getElementById('origTokens');
    const compTokensEl = document.getElementById('compTokens');
    const reductionPctEl = document.getElementById('reductionPct');
    const savingsBarFill = document.getElementById('savingsBarFill');
    const savingsPctLabel = document.getElementById('savingsPctLabel');
    const compressedOutput = document.getElementById('compressedOutput');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');

    const totalChunksEl = document.getElementById('totalChunks');
    const selectedChunksEl = document.getElementById('selectedChunks');
    const discardedChunksEl = document.getElementById('discardedChunks');

    const compareOriginal = document.getElementById('compareOriginal');
    const compareCompressed = document.getElementById('compareCompressed');

    /* ---------- Token estimator (rough, ~4 chars/token) ---------- */
    function estimateTokens(text) {
        return Math.max(0, Math.round(text.trim().length / 4));
    }

    function updateEstimate() {
        estTokens.textContent = estimateTokens(contextInput.value).toLocaleString();
    }
    contextInput.addEventListener('input', updateEstimate);
    updateEstimate();

    /* ---------- Sample compressed output ---------- */
    const SAMPLE_COMPRESSED = `RAG grounds LLM output by retrieving relevant passages, but growing context length raises token cost and latency. Smart context compression scores retrieved chunks with BM25 against the query, selects the highest-relevance passages, and condenses them with an LLM summarizer instead of using verbose raw text.

This pipeline typically cuts token usage by 50-75% while keeping downstream QA accuracy within 2% of the uncompressed baseline — making it a practical default for production RAG systems operating at scale.`;

    const originalPreview = "Retrieval-Augmented Generation (RAG) combines a retriever with a generative language model, grounding LLM output in retrieved documents. A key challenge is context length — naive truncation loses information while including everything wastes tokens on redundant content...";

    /* ---------- Processing simulation ---------- */
    let isProcessing = false;

    function resetSteps() {
        steps.forEach(function (step) {
            step.classList.remove('active', 'done');
            step.querySelector('.step-spinner').style.opacity = 0;
        });
        pipeNodes.forEach(n => n.classList.remove('active', 'done'));
        pipeNodes[2].classList.add('active'); // Compress node default highlight
    }

    function runStep(index) {
        return new Promise(function (resolve) {
            const step = steps[index];
            step.classList.add('active');
            const duration = 550 + Math.random() * 350;
            setTimeout(function () {
                step.classList.remove('active');
                step.classList.add('done');
                resolve();
            }, duration);
        });
    }

    async function runProcessing() {
        processBadge.textContent = 'Running';
        processBadge.classList.remove('idle');
        processBadge.classList.add('running');

        pipeNodes.forEach(n => n.classList.remove('active', 'done'));
        pipeNodes[0].classList.add('done');
        pipeNodes[1].classList.add('done');

        for (let i = 0; i < steps.length; i++) {
            pipeNodes[2].classList.add('active');
            await runStep(i);
        }

        pipeNodes[2].classList.remove('active');
        pipeNodes[2].classList.add('done');
        pipeNodes[3].classList.add('active');

        processBadge.textContent = 'Complete';
        processBadge.classList.remove('running');
        processBadge.classList.add('success');
    }

    function animateCount(el, from, to, suffix, duration) {
        const start = performance.now();
        function tick(now) {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = Math.round(from + (to - from) * eased);
            el.textContent = val.toLocaleString() + (suffix || '');
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = to.toLocaleString() + (suffix || '');
        }
        requestAnimationFrame(tick);
    }

    async function handleCompress() {
        if (isProcessing) return;
        const contextText = contextInput.value.trim();
        const queryText = queryInput.value.trim();

        if (!contextText) {
            contextInput.focus();
            contextInput.style.borderColor = 'var(--warn)';
            setTimeout(() => { contextInput.style.borderColor = ''; }, 900);
            return;
        }

        isProcessing = true;
        compressBtn.disabled = true;
        compressBtn.querySelector('span:last-child').textContent = 'Compressing…';

        resultsBadge.textContent = 'Processing';
        resultsBadge.classList.remove('success');
        resultsBadge.classList.add('running');

        resetSteps();

        await runProcessing();

        // Compute realistic-looking sample numbers
        const originalTokens = Math.max(estimateTokens(contextText), 180);
        const reduction = 0.62 + Math.random() * 0.14; // 62-76%
        const compressedTokens = Math.max(40, Math.round(originalTokens * (1 - reduction)));
        const actualReductionPct = Math.round((1 - compressedTokens / originalTokens) * 100);

        origTokensEl.textContent = originalTokens.toLocaleString();
        animateCount(compTokensEl, 0, compressedTokens, '', 900);
        reductionPctEl.textContent = actualReductionPct + '%';

        requestAnimationFrame(function () {
            savingsBarFill.style.width = actualReductionPct + '%';
        });
        savingsPctLabel.textContent = actualReductionPct + '%';

        compressedOutput.innerHTML = '';
        compressedOutput.classList.add('filled');
        const pre = document.createElement('div');
        pre.style.whiteSpace = 'pre-wrap';
        pre.textContent = SAMPLE_COMPRESSED;
        compressedOutput.appendChild(pre);

        compareOriginal.textContent = originalPreview;
        compareCompressed.textContent = SAMPLE_COMPRESSED.split('\n\n')[0];

        const totalChunks = 4;
        const selected = 3;
        totalChunksEl.textContent = totalChunks;
        selectedChunksEl.textContent = selected;
        discardedChunksEl.textContent = totalChunks - selected;

        resultsBadge.textContent = 'Complete';
        resultsBadge.classList.remove('running');
        resultsBadge.classList.add('success');

        compressBtn.disabled = false;
        compressBtn.querySelector('span:last-child').textContent = 'Compress Context';
        isProcessing = false;
    }

    compressBtn.addEventListener('click', handleCompress);

    /* ---------- Copy ---------- */
    copyBtn.addEventListener('click', async function () {
        const text = compressedOutput.textContent.trim();
        if (!text || compressedOutput.querySelector('.output-placeholder')) return;
        try {
            await navigator.clipboard.writeText(text);
        } catch (e) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        const original = copyBtn.innerHTML;
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5L10 17.5L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Copied';
        setTimeout(function () {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = original;
        }, 1600);
    });

    /* ---------- Download ---------- */
    downloadBtn.addEventListener('click', function () {
        const text = compressedOutput.textContent.trim();
        if (!text || compressedOutput.querySelector('.output-placeholder')) return;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'compressed-context.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    /* ---------- Reset ---------- */
    function resetAll() {
        contextInput.value = '';
        queryInput.value = '';
        updateEstimate();

        resetSteps();
        processBadge.textContent = 'Idle';
        processBadge.classList.remove('running', 'success');
        processBadge.classList.add('idle');

        resultsBadge.textContent = 'Awaiting run';
        resultsBadge.classList.remove('running', 'success');

        origTokensEl.textContent = '0';
        compTokensEl.textContent = '—';
        reductionPctEl.textContent = '—';
        savingsBarFill.style.width = '0%';
        savingsPctLabel.textContent = '0%';

        compressedOutput.classList.remove('filled');
        compressedOutput.innerHTML = '<span class="output-placeholder">Run a compression to see the optimized context here.</span>';

        compareOriginal.textContent = 'Original context will appear here after a compression run.';
        compareCompressed.textContent = 'Compressed context will appear here after a compression run.';

        totalChunksEl.textContent = '0';
        selectedChunksEl.textContent = '0';
        discardedChunksEl.textContent = '0';

        isProcessing = false;
        compressBtn.disabled = false;
        compressBtn.querySelector('span:last-child').textContent = 'Compress Context';
    }

    resetBtn.addEventListener('click', resetAll);

    /* Initialize pipeline highlight */
    resetSteps();

})();
