        const AD_SPEND_PER_INSTALLATION = 86000;
        const INSPECTIONS_PER_INSTALLATION = 4;
        const WORKING_DAYS_PER_MONTH = 25;
        const CALENDLY_BASE_URL = "https://calendly.com/regentmedia-co/growthreviewcall";
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyJUCZ5nrgbnn8jbdInBY6RiIu0BmCapD8RMm1SYB_05f-OhURiqMfH5oNkmJCeALEl_Q/exec";

        // Expected number of digits AFTER the country code (no leading 0, numbers only).
        // These are the standard local subscriber lengths for each country's mobile numbers.
        const PHONE_DIGIT_LENGTHS = {
            "+234": 10, // Nigeria      e.g. 8012345678
            "+233": 9,  // Ghana        e.g. 244123456
            "+254": 9,  // Kenya        e.g. 712345678
            "+27": 9,   // South Africa e.g. 821234567
            "+44": 10,  // United Kingdom e.g. 7911123456
            "+1": 10,   // United States  e.g. 2025551234
            "+971": 9   // UAE          e.g. 501234567
        };

        const states = [
            "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
            "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo",
            "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
            "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
            "Sokoto", "Taraba", "Yobe", "Zamfara", "International"
        ];

        const monthlyOptions = [
            { label: "1-5/month", low: 1, high: 5, type: "month" },
            { label: "5-10/month", low: 5, high: 10, type: "month" },
            { label: "10-15/month", low: 10, high: 15, type: "month" },
            { label: "15-20/month", low: 15, high: 20, type: "month" },
            { label: "20-25/month", low: 20, high: 25, type: "month" },
            { label: "25-30/month", low: 25, high: 30, type: "month" },
            { label: "30-35/month", low: 30, high: 35, type: "month" },
            { label: "35-40/month", low: 35, high: 40, type: "month" }
        ];

        const dailyOptions = [
            { label: "1-2/day", low: 1, high: 2, type: "day" },
            { label: "2-3/day", low: 2, high: 3, type: "day" },
            { label: "4-5/day", low: 4, high: 5, type: "day" },
            { label: "5-6/day", low: 5, high: 6, type: "day" },
            { label: "7-8/day", low: 7, high: 8, type: "day" },
            { label: "9-10/day", low: 9, high: 10, type: "day" },
            { label: "10-11/day", low: 10, high: 11, type: "day" },
            { label: "11-12/day", low: 11, high: 12, type: "day" }
        ];

        const state = {
            companyBase: "",
            targetStates: [],
            currentVolume: null,
            goalVolume: null
        };

        const steps = Array.from(document.querySelectorAll(".step"));
        const backBtn = document.getElementById("backBtn");
        const nextBtn = document.getElementById("nextBtn");
        const progressFill = document.getElementById("progressFill");
        const progressLabel = document.getElementById("progressLabel");
        const stepLabel = document.getElementById("stepLabel");
        const bookingModal = document.getElementById("bookingModal");
        const bookReviewCall = document.getElementById("bookReviewCall");
        let currentStep = 0;
        let latestEstimatePayload = null;
const STORAGE_KEY = "regent-solar-funnel-v1";
        function money(value) {
            return "\u20a6" + Math.round(value).toLocaleString("en-NG");
        }

        function moneyRange(low, high) {
            const roundedLow = Math.round(low);
            const roundedHigh = Math.round(high);
            return roundedLow === roundedHigh ? money(roundedLow) : `${money(roundedLow)}-${money(roundedHigh)}`;
        }
function saveProgress() {

    const data = {

        currentStep,

        state,

        firstName: document.getElementById("firstName").value,

        lastName: document.getElementById("lastName").value,

        leadPhone: document.getElementById("leadPhone").value,

        countryCode: document.getElementById("countryCode").value

    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

}



function restoreProgress() {

    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    const data = JSON.parse(saved);

    Object.assign(state, data.state);

    document.getElementById("firstName").value = data.firstName || "";

    document.getElementById("lastName").value = data.lastName || "";

    document.getElementById("leadPhone").value = data.leadPhone || "";

    document.getElementById("countryCode").value = data.countryCode || "+234";



    repaintSelections();



    showStep(data.currentStep || 0);

}
function repaintSelections() {

    // Company Base

    document.querySelectorAll("#companyBaseOptions .choice-card")
        .forEach(btn => {

            const selected = btn.firstChild.textContent === state.companyBase;

            btn.classList.toggle("selected", selected);

        });



    // Target States

    document.querySelectorAll("#targetStateOptions .choice-card")
        .forEach(btn => {

            const selected =
                state.targetStates.includes(btn.firstChild.textContent);

            btn.classList.toggle("selected", selected);

        });



    // Current Volume

    document
        .querySelectorAll('[data-volume-group="currentVolume"] .choice-card')
        .forEach(btn => {

            btn.classList.remove("selected");

        });

    if(state.currentVolume){

        document
            .querySelectorAll('[data-volume-group="currentVolume"] .choice-card')
            .forEach(btn=>{

                if(btn.firstChild.textContent===state.currentVolume.label){

                    btn.classList.add("selected");

                }

            });

    }



    // Goal Volume

    document
        .querySelectorAll('[data-volume-group="goalVolume"] .choice-card')
        .forEach(btn=>{

            btn.classList.remove("selected");

        });

    if(state.goalVolume){

        document
            .querySelectorAll('[data-volume-group="goalVolume"] .choice-card')
            .forEach(btn=>{

                if(btn.firstChild.textContent===state.goalVolume.label){

                    btn.classList.add("selected");

                }

            });

    }

}

        function numberRange(low, high) {
            return low === high ? String(low) : `${low}-${high}`;
        }

        function toMonthlyRange(option) {
            if (!option) {
                return null;
            }

            if (option.type === "day") {
                return {
                    low: option.low * WORKING_DAYS_PER_MONTH,
                    high: option.high * WORKING_DAYS_PER_MONTH,
                    type: "day",
                    label: option.label
                };
            }

            return {
                low: option.low,
                high: option.high,
                type: "month",
                label: option.label
            };
        }

        function volumeDescription(option) {
            const monthly = toMonthlyRange(option);
            if (!monthly) {
                return "";
            }

            if (monthly.type === "day") {
                return `${option.label} (${numberRange(monthly.low, monthly.high)} in a month of ${WORKING_DAYS_PER_MONTH} working days)`;
            }

            return option.label;
        }

        function getBufferedInspectionRange(monthlyRange) {
            const low = Math.max(1, Math.ceil(monthlyRange.low * INSPECTIONS_PER_INSTALLATION * 0.67));
            const high = Math.max(low + 1, Math.ceil(monthlyRange.high * INSPECTIONS_PER_INSTALLATION * 0.84));
            return { low, high };
        }

        function buildCalendlyUrl(payload) {
            // Calendly's a1/a2/a3... params map to the order of CUSTOM QUESTIONS
            // on your event form -- they are not fixed "name"/"phone" slots.
            // Name and email are already prefilled via the built-in name/first_name/
            // last_name/email params below.
            // a1 = "Phone/WhatsApp Number"
            // a2 = "Chosen Recommendation" -- must stay exactly "default" or
            //      "phasedscale" for downstream automation, so we prefix a
            //      warning telling the person not to edit it. If you add more
            //      custom questions on the Calendly side, add them here in the
            //      same top-to-bottom order they appear on the booking form
            //      (a3, a4, ...).
            const DO_NOT_EDIT_WARNING = "DO NOT EDIT THIS FIELD - ";
            const chosenValue = payload.chosenTarget === "Phased scale option" ? "phasedscale" : "default";

            const params = new URLSearchParams({
                name: `${payload.firstName} ${payload.lastName}`.trim(),
                first_name: payload.firstName,
                last_name: payload.lastName,
                a1: payload.whatsappFull,
                a2: `${DO_NOT_EDIT_WARNING}${chosenValue}`
            });
            return `${CALENDLY_BASE_URL}?${params.toString()}`;
        }

        function setError(name, message) {
            const error = document.querySelector(`[data-error-for="${name}"]`);
            if (error) {
                error.textContent = message || "";
            }
        }

        function makeChoiceButton(label, options = {}) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "choice-card";
            button.textContent = label;
            button.setAttribute("aria-pressed", "false");
            if (options.small) {
                const small = document.createElement("small");
                small.textContent = options.small;
                button.appendChild(small);
            }
            return button;
        }

        function renderStateOptions() {
            const companyBaseOptions = document.getElementById("companyBaseOptions");
            const targetStateOptions = document.getElementById("targetStateOptions");

            states.forEach((name) => {
                const baseButton = makeChoiceButton(name);
                baseButton.addEventListener("click", () => {
                    state.companyBase = name;
saveProgress();
                    setError("companyBase", "");
                    companyBaseOptions.querySelectorAll(".choice-card").forEach((button) => {
                        const selected = button.textContent === name;
                        button.classList.toggle("selected", selected);
                        button.setAttribute("aria-pressed", selected ? "true" : "false");
                    });
                });
                companyBaseOptions.appendChild(baseButton);
            });

            ["Nationwide", ...states].forEach((name) => {
                const targetButton = makeChoiceButton(name);
                targetButton.addEventListener("click", () => {
                    const selected = state.targetStates.includes(name);

                    if (name === "Nationwide") {
                        state.targetStates = selected ? [] : ["Nationwide"];
                    } else {
                        state.targetStates = state.targetStates.filter((item) => item !== "Nationwide");
                        if (selected) {
                            state.targetStates = state.targetStates.filter((item) => item !== name);
                        } else {
                            state.targetStates.push(name);
                        }
                    }

                    setError("targetStates", "");
                    targetStateOptions.querySelectorAll(".choice-card").forEach((button) => {
                        const isSelected = state.targetStates.includes(button.firstChild.textContent);
                        button.classList.toggle("selected", isSelected);
                        button.setAttribute("aria-pressed", isSelected ? "true" : "false");
                    });
                });
                targetStateOptions.appendChild(targetButton);
            });saveProgress();
        }

        function renderVolumeGroup(containerId, optionType, stateKey) {
            const container = document.getElementById(containerId);
            const options = optionType === "month" ? monthlyOptions : dailyOptions;

            options.forEach((option) => {
                const monthly = toMonthlyRange(option);
                const button = makeChoiceButton(option.label, {
                    small: option.type === "day" ? `${numberRange(monthly.low, monthly.high)}/month at 25 working days` : ""
                });
                button.addEventListener("click", () => {
                    state[stateKey] = option;
saveProgress();
                    setError(stateKey === "currentVolume" ? "currentVolume" : "goalVolume", "");
                    document.querySelectorAll(`[data-volume-group="${stateKey}"] .choice-card`).forEach((item) => {
                        item.classList.remove("selected");
                        item.setAttribute("aria-pressed", "false");
                    });
                    button.classList.add("selected");
                    button.setAttribute("aria-pressed", "true");
                });
                container.setAttribute("data-volume-group", stateKey);
                container.appendChild(button);
            });
        }

        function validateCurrentStep() {
            setError("companyBase", "");
            setError("targetStates", "");
            setError("currentVolume", "");
            setError("goalVolume", "");
            setError("firstName", "");
            setError("lastName", "");
            setError("leadPhone", "");

            if (currentStep === 0 && !state.companyBase) {
                setError("companyBase", "Select your company base to continue.");
                return false;
            }

            if (currentStep === 1 && state.targetStates.length === 0) {
                setError("targetStates", "Select at least one installation market.");
                return false;
            }

            if (currentStep === 2 && !state.currentVolume) {
                setError("currentVolume", "Select your current installation volume.");
                return false;
            }

            if (currentStep === 3 && !state.goalVolume) {
                setError("goalVolume", "Select your target installation volume.");
                return false;
            }

            if (currentStep === 4) {
                const firstName = document.getElementById("firstName");
                const lastName = document.getElementById("lastName");
                if (!firstName.value.trim()) {
                    setError("firstName", "Enter your first name.");
                    firstName.focus();
                    return false;
                }
                if (!lastName.value.trim()) {
                    setError("lastName", "Enter your last name.");
                    lastName.focus();
                    return false;
                }
            }

            if (currentStep === 5) {
                const phone = document.getElementById("leadPhone");
                const countryCode = document.getElementById("countryCode").value;
                const expectedLength = PHONE_DIGIT_LENGTHS[countryCode];
                const digits = phone.value.trim();

                if (expectedLength && digits.length !== expectedLength) {
                    setError(
                        "leadPhone",
                        `Enter exactly ${expectedLength} digits after ${countryCode} (no leading 0). You entered ${digits.length}.`
                    );
                    phone.focus();
                    return false;
                }

                if (!expectedLength && digits.length < 6) {
                    setError("leadPhone", "Enter a valid WhatsApp number using numbers only.");
                    phone.focus();
                    return false;
                }
            }

            return true;
        }

        function updateProgress() {
            const percent = Math.round(((currentStep + 1) / steps.length) * 100);
            progressFill.style.width = `${percent}%`;
            progressLabel.textContent = `${percent}% complete`;
            stepLabel.textContent = currentStep === steps.length - 1 ? "Estimate ready" : `Step ${currentStep + 1} of ${steps.length}`;
            backBtn.disabled = currentStep === 0;
            nextBtn.textContent = currentStep === steps.length - 2 ? "View estimate" : "Continue";
            nextBtn.style.display = currentStep === steps.length - 1 ? "none" : "inline-flex";
        }

        function showStep(index) {
            steps[currentStep].classList.remove("active");
            currentStep = index;
            steps[currentStep].classList.add("active");updateProgress();
saveProgress();
            const input = steps[currentStep].querySelector("input");
            if (input) {
                setTimeout(() => input.focus(), 80);
            }
        }

        function buildEstimate() {
            const firstName = document.getElementById("firstName").value.trim();
            const lastName = document.getElementById("lastName").value.trim();
            const countryCode = document.getElementById("countryCode").value;
            const whatsappNumber = document.getElementById("leadPhone").value.trim();
            const whatsappFull = `${countryCode}${whatsappNumber}`;
            const targetMarkets = state.targetStates.join(", ");
            const currentRange = toMonthlyRange(state.currentVolume);
            const goalRange = toMonthlyRange(state.goalVolume);
            const goalLowSpend = goalRange.low * AD_SPEND_PER_INSTALLATION;
            const goalHighSpend = goalRange.high * AD_SPEND_PER_INSTALLATION;
            const dailyLow = goalLowSpend / 30;
            const dailyHigh = goalHighSpend / 30;
            const trialLow = dailyLow * 14;
            const trialHigh = dailyHigh * 14;
            const inspections = getBufferedInspectionRange(goalRange);
            const currentMid = (currentRange.low + currentRange.high) / 2;
            const goalMid = (goalRange.low + goalRange.high) / 2;
            const isAggressive = goalMid > currentMid * 2;
            let phaseDetails = "";

            document.getElementById("resultTitle").textContent = `${firstName}, your growth estimate is ready.`;
            document.getElementById("resultIntro").textContent = `For ${targetMarkets}, starting from ${state.companyBase}, this is the ad spend range to discuss on your Growth Review.`;
            document.getElementById("dailySpend").textContent = moneyRange(dailyLow, dailyHigh);
            document.getElementById("trialSpend").textContent = moneyRange(trialLow, trialHigh);
            document.getElementById("monthlySpend").textContent = moneyRange(goalLowSpend, goalHighSpend);
            document.getElementById("inspectionRange").textContent = numberRange(inspections.low, inspections.high);
            document.getElementById("whatYouGetCopy").textContent = `A conservative range of qualified site inspections to support ${volumeDescription(state.goalVolume)}.`;

            document.getElementById("primaryInsight").innerHTML = `You selected <strong>${volumeDescription(state.goalVolume)}</strong> as your target and <strong>${volumeDescription(state.currentVolume)}</strong> as your current baseline. This estimate keeps the site inspection target conservative so the live campaign has room to outperform it.`;

            const downsellBox = document.getElementById("downsellBox");
            const downsellActions = document.getElementById("downsellActions");
            if (isAggressive) {
                const phaseRange = {
                    low: Math.max(1, Math.round(currentRange.low * 2)),
                    high: Math.max(2, Math.round(currentRange.high * 2)),
                    type: "month",
                    label: "2x current volume"
                };
                const phaseLowSpend = phaseRange.low * AD_SPEND_PER_INSTALLATION;
                const phaseHighSpend = phaseRange.high * AD_SPEND_PER_INSTALLATION;
                const phaseDailyLow = phaseLowSpend / 30;
                const phaseDailyHigh = phaseHighSpend / 30;
                const phaseTrialLow = phaseDailyLow * 14;
                const phaseTrialHigh = phaseDailyHigh * 14;
                const phaseInspections = getBufferedInspectionRange(phaseRange);

                document.getElementById("downsellCopy").textContent = `Your target is a big jump from your current volume. A cleaner first move is a phased scale option at ${numberRange(phaseRange.low, phaseRange.high)} installations per month, then we open the full target once the trial proves your market.`;
                document.getElementById("phaseGoal").textContent = `${numberRange(phaseRange.low, phaseRange.high)}/month`;
                document.getElementById("phaseDaily").textContent = moneyRange(phaseDailyLow, phaseDailyHigh);
                document.getElementById("phaseTrial").textContent = moneyRange(phaseTrialLow, phaseTrialHigh);
                document.getElementById("phaseInspections").textContent = `${numberRange(phaseInspections.low, phaseInspections.high)} site inspections`;
                phaseDetails = `${numberRange(phaseRange.low, phaseRange.high)}/month | Daily: ${moneyRange(phaseDailyLow, phaseDailyHigh)} | 14-day trial: ${moneyRange(phaseTrialLow, phaseTrialHigh)} | Site inspections: ${numberRange(phaseInspections.low, phaseInspections.high)}`;
                downsellBox.classList.add("active");
                downsellActions.classList.add("active");
            } else {
                downsellBox.classList.remove("active");
                downsellActions.classList.remove("active");
            }

            latestEstimatePayload = {
                timestamp: new Date().toISOString(),
                firstName,
                lastName,
                countryCode,
                whatsappNumber,
                whatsappFull,
                companyBase: state.companyBase,
                targetInstallationStates: targetMarkets,
                currentVolumeSelected: volumeDescription(state.currentVolume),
                currentMonthlyLow: currentRange.low,
                currentMonthlyHigh: currentRange.high,
                goalVolumeSelected: volumeDescription(state.goalVolume),
                goalMonthlyLow: goalRange.low,
                goalMonthlyHigh: goalRange.high,
                recommendedDailyAdSpend: moneyRange(dailyLow, dailyHigh),
                fourteenDayTrialAdSpend: moneyRange(trialLow, trialHigh),
                thirtyDayAdSpend: moneyRange(goalLowSpend, goalHighSpend),
                conservativeSiteInspections: numberRange(inspections.low, inspections.high),
                phasedScaleSuggested: isAggressive ? "Yes" : "No",
                phasedScaleDetails: phaseDetails,
                chosenTarget: "Not selected yet"
            };

            bookReviewCall.href = buildCalendlyUrl(latestEstimatePayload);
        }

        function submitLeadToGoogleSheet() {

    if (!GOOGLE_SCRIPT_URL || !latestEstimatePayload)
        return Promise.resolve();

    const submissionId =
        latestEstimatePayload.whatsappFull +
        "-" +
        latestEstimatePayload.goalVolumeSelected;

    if (localStorage.getItem("submittedLead") === submissionId)
        return Promise.resolve();

    const SUBMIT_TIMEOUT_MS = 10000;
    const request = fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(latestEstimatePayload)
    });
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Submission timed out")), SUBMIT_TIMEOUT_MS);
    });

    // With mode: "no-cors" we can't read the response, but the fetch promise
    // still rejects on a genuine network failure (offline, dropped connection,
    // DNS failure) and the timeout race catches a request that hangs on a
    // weak connection without ever resolving or rejecting on its own.
    return Promise.race([request, timeout]).then(() => {
        localStorage.setItem("submittedLead", submissionId);
    });
}
        function openModal(chosenTarget) {
            if (latestEstimatePayload) {
                if (chosenTarget) {
                    latestEstimatePayload.chosenTarget = chosenTarget;
                }
                bookReviewCall.href = buildCalendlyUrl(latestEstimatePayload);
            }
            bookingModal.classList.add("active");
            document.body.style.overflow = "hidden";
            document.getElementById("closeBookingModal").focus();
        }

        function closeModal() {
            bookingModal.classList.remove("active");
            document.body.style.overflow = "";
            document.getElementById("openBookingModal").focus();
        }

        const submitOverlay = document.getElementById("submitOverlay");
        const submitLoadingState = document.getElementById("submitLoadingState");
        const submitErrorState = document.getElementById("submitErrorState");
        const retrySubmitBtn = document.getElementById("retrySubmitBtn");

        function showSubmitOverlay() {
            submitLoadingState.hidden = false;
            submitErrorState.hidden = true;
            submitOverlay.classList.add("active");
        }

        function showSubmitError() {
            submitLoadingState.hidden = true;
            submitErrorState.hidden = false;
        }

        function hideSubmitOverlay() {
            submitOverlay.classList.remove("active");
        }

        function attemptSubmitAndAdvance() {
            showSubmitOverlay();
            nextBtn.disabled = true;
            submitLeadToGoogleSheet()
                .then(() => {
                    hideSubmitOverlay();
                    nextBtn.disabled = false;
                    showStep(Math.min(currentStep + 1, steps.length - 1));
                })
                .catch(() => {
                    nextBtn.disabled = false;
                    showSubmitError();
                });
        }

        retrySubmitBtn.addEventListener("click", attemptSubmitAndAdvance);

        nextBtn.addEventListener("click", () => {
            if (!validateCurrentStep()) {
                return;
            }
if (currentStep === steps.length - 2) {
    buildEstimate();
    attemptSubmitAndAdvance();
    return;
}
            showStep(Math.min(currentStep + 1, steps.length - 1));
        });

        backBtn.addEventListener("click", () => {
            showStep(Math.max(currentStep - 1, 0));
        });

        const leadPhoneInput = document.getElementById("leadPhone");
        const countryCodeSelect = document.getElementById("countryCode");

        function applyPhoneLengthRules() {
            const expectedLength = PHONE_DIGIT_LENGTHS[countryCodeSelect.value];
            if (expectedLength) {
                leadPhoneInput.maxLength = expectedLength;
                leadPhoneInput.placeholder = "0".repeat(expectedLength).replace(/^0/, "8");
                if (leadPhoneInput.value.length > expectedLength) {
                    leadPhoneInput.value = leadPhoneInput.value.slice(0, expectedLength);
                }
            } else {
                leadPhoneInput.removeAttribute("maxlength");
            }
            setError("leadPhone", "");
        }

        leadPhoneInput.addEventListener("input", (event) => {
            const expectedLength = PHONE_DIGIT_LENGTHS[countryCodeSelect.value];
            let digitsOnly = event.target.value.replace(/\D/g, "");
            if (expectedLength) {
                digitsOnly = digitsOnly.slice(0, expectedLength);
            }
            event.target.value = digitsOnly;
        });

        countryCodeSelect.addEventListener("change", applyPhoneLengthRules);
        applyPhoneLengthRules();

        document.getElementById("funnelForm").addEventListener("keydown", (event) => {
            if (event.key === "Enter" && currentStep < steps.length - 1) {
                event.preventDefault();
                nextBtn.click();
            }
        });

        document.getElementById("openBookingModal").addEventListener("click", () => {
            const isPhased = latestEstimatePayload && latestEstimatePayload.phasedScaleSuggested === "Yes";
            openModal(isPhased ? "Phased scale option" : "Original target");
        });
        document.getElementById("chooseOriginalTargetBtn").addEventListener("click", () => {
            openModal("Original target");
        });
        document.getElementById("closeBookingModal").addEventListener("click", closeModal);
        document.getElementById("modalBackBtn").addEventListener("click", closeModal);
        bookingModal.addEventListener("click", (event) => {
            if (event.target === bookingModal) {
                closeModal();
            }
        });
bookReviewCall.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
});
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && bookingModal.classList.contains("active")) {
                closeModal();
            }
        });
["click", "input", "change"].forEach(eventName => {
    document.addEventListener(eventName, saveProgress);
});

       renderStateOptions();

renderVolumeGroup("currentMonthlyOptions","month","currentVolume");

renderVolumeGroup("currentDailyOptions","day","currentVolume");

renderVolumeGroup("goalMonthlyOptions","month","goalVolume");

renderVolumeGroup("goalDailyOptions","day","goalVolume");

updateProgress();

restoreProgress();
