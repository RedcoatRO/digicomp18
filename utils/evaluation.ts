import { ActionLogEntry, AppState, ConnectionStatus, EvaluationResult, ActionType } from '../types';

/**
 * Calculates the user's score based on their actions and the final state.
 * @param actions The log of all actions taken by the user.
 * @param finalState The complete state of the app at the time of evaluation.
 * @param isLive A flag to determine if this is a live score update or the final calculation.
 * @returns An object containing the score and detailed feedback.
 */
export const calculateScore = (
    actions: ActionLogEntry[],
    finalState: AppState,
    isLive: boolean = false
): EvaluationResult => {
    let score = 100;
    const details: { text: string; correct: boolean }[] = [];
    
    // --- PENALTIES FOR INEFFICIENT/INCORRECT ACTIONS ---

    // Penalty for opening irrelevant windows
    const irrelevantWindows = ['wordpad', 'terminal'];
    const openedIrrelevantWindow = actions.some(a => a.type === ActionType.OPEN_WINDOW && irrelevantWindows.includes(a.payload.window));
    if (openedIrrelevantWindow) {
        score -= 10;
        details.push({ text: 'Ai deschis aplicații care nu erau necesare pentru rezolvarea problemei.', correct: false });
    }

    // Penalty for wrong password attempts
    const wrongPasswordAttempts = actions.filter(a => a.type === ActionType.SUBMIT_WIFI_PASSWORD && !a.payload.correct).length;
    if (wrongPasswordAttempts > 0) {
        score -= wrongPasswordAttempts * 10;
        details.push({ text: `Ai introdus parola greșită de ${wrongPasswordAttempts} ori.`, correct: false });
    }
    
    // Penalty for asking for hints
    const hintRequests = actions.filter(a => a.type === ActionType.REQUEST_HINT).length;
    if (hintRequests > 0) {
        score -= hintRequests * 5;
        details.push({ text: `Ai cerut un indiciu de ${hintRequests} ori.`, correct: false });
    }

    // If this is just for the live score display, we stop here.
    if (isLive) {
        return {
            score: Math.max(0, Math.min(100, score)),
            maxScore: 100,
            details: [],
            tasksCompleted: 0,
            totalTasks: 1,
            summary: ''
        };
    }

    // --- FINAL EVALUATION ---
    
    const connectionFixed = finalState.connectionStatus === ConnectionStatus.Connected;
    let tasksCompleted = 0;
    const totalTasks = 1;
    let summary = '';

    if (connectionFixed) {
        tasksCompleted = 1;
        details.unshift({ text: 'Ai navigat în folderul care conține fisierul.', correct: true }); // Mockup text
        details.unshift({ text: 'Ai deschis încă fișierul corect.', correct: true }); // Mockup text

        if (score >= 90) {
            summary = "Felicitări! Ai rezolvat problema rapid și eficient.";
        } else {
            summary = "Exercițiul s-a încheiat. Ai rezolvat problema, dar ai putea fi mai eficient data viitoare.";
        }
    } else {
        tasksCompleted = 0;
        score = Math.max(0, score - 50); // Heavy penalty for not fixing the issue
        details.unshift({ text: 'Nu ai deschis încă fișierul corect.', correct: false });
        details.unshift({ text: 'Ai navigat în folderul care conține fisierul.', correct: true });

        const calledIsp = actions.some(a => a.type === ActionType.CONTACT_ISP);
        if (calledIsp) {
            score = Math.max(10, score - 15); // Penalty for giving up, but ensure some points
            details.push({ text: 'Ai apelat la suportul ISP în loc să rezolvi problema direct.', correct: false });
        }
        summary = "Exercițiul s-a încheiat. Data viitoare, încearcă să folosești mai eficient uneltele de căutare.";
    }

    // Clamp score between 0 and 100
    const finalScore = Math.round(Math.max(0, Math.min(100, score)));
    
    // Add a dummy correct/incorrect detail for the mockup style.
    if (finalScore < 50) {
       // details.unshift({ text: "Nu ai deschis încă fișierul corect.", correct: false });
    } else {
       // details.unshift({ text: "Ai navigat în folderul care conține fisierul.", correct: true });
    }


    return {
        score: finalScore,
        maxScore: 100,
        details,
        tasksCompleted,
        totalTasks,
        summary,
    };
};
