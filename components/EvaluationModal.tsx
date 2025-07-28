import React from 'react';
import { useAppContext } from '../contexts/AppContext';

const EvaluationModal: React.FC = () => {
    const { evaluationResult } = useAppContext();

    if (!evaluationResult) return null;

    const { score, maxScore, summary, details } = evaluationResult;

    const getScoreColor = (s: number) => {
        if (s < 40) return 'text-red-500';
        if (s < 75) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div 
            role="alertdialog" 
            aria-modal="true" 
            aria-labelledby="evaluation-title"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in z-50"
        >
            <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10 text-gray-800 dark:text-gray-200">
                <div className="p-6 sm:p-8 text-center border-b border-gray-200 dark:border-gray-700">
                    <h2 id="evaluation-title" className="text-2xl font-bold mb-4">Rezultatul Evaluării</h2>
                    
                    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4">
                        <p className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">SCOR FINAL</p>
                        <p className={`text-6xl font-bold my-2 ${getScoreColor(score)}`}>
                            {score} <span className="text-4xl text-gray-400 dark:text-gray-500">/ {maxScore}</span>
                        </p>
                    </div>

                    <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                        {summary}
                    </p>
                </div>
                
                <div className="p-6 sm:p-8 max-h-60 overflow-y-auto">
                    <ul className="space-y-3">
                        {details.map((detail, index) => (
                            <li key={index} className="flex items-start">
                                <span className={`mr-3 mt-1 text-sm font-bold ${detail.correct ? 'text-green-500' : 'text-red-500'}`}>
                                    {detail.correct ? '[CORECT]' : '[INCORECT]'}
                                </span>
                                <span className="text-sm text-gray-700 dark:text-gray-300">{detail.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div className="px-6 pb-2 text-center">
                    <p className="text-xs text-gray-400">
                        Fereastra de evaluare va rămâne deschisă pentru analiză.
                    </p>
                 </div>
            </div>
        </div>
    );
};

export default React.memo(EvaluationModal);
