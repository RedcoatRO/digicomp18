/**
 * Builds and sends the evaluation result object to the parent window.
 *
 * @param score The final score achieved by the user.
 * @param maxScore The maximum possible score.
 * @param details A string containing detailed feedback on the user's performance.
 * @param tasksCompleted The number of main tasks the user successfully completed.
 * @param totalTasks The total number of main tasks in the exercise.
 */
export const sendEvaluationResult = (
    score: number,
    maxScore: number,
    details: string,
    tasksCompleted: number,
    totalTasks: number
) => {
    // 1. Construct the object with all the required fields.
    const resultPayload = {
        type: 'evaluationResult', // Mandatory type identifier
        score: score,
        maxScore: maxScore,
        details: details,
        tasksCompleted: tasksCompleted,
        totalTasks: totalTasks,
        extractedText: `Scor: ${score}/${maxScore}. Detalii: ${details.replace(/\n/g, ' ')}`,
        timestamp: new Date().toISOString(),
    };

    // 2. Send the object to the parent window.
    // The targetOrigin '*' is used for simplicity in this sandboxed environment,
    // but a specific origin should be used in a production application for security.
    window.parent.postMessage(resultPayload, '*');

    // 3. Log the object to the console for debugging purposes.
    console.log('Trimit rezultat:', resultPayload);
};
