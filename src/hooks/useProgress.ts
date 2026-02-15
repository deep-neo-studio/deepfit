import { useState, useEffect } from 'react';

export interface UserProgress {
    totalSessions: number;
    streak: number;
    lastSessionDate: string | null;
    levelCounts: Record<string, number>;
    startDate: string;
}

const STORAGE_KEY = 'hipopressive_progress';

export const useProgress = () => {
    const [progress, setProgress] = useState<UserProgress>({
        totalSessions: 0,
        streak: 0,
        lastSessionDate: null,
        levelCounts: {},
        startDate: new Date().toISOString(),
    });

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setProgress(JSON.parse(saved));
        } else {
            // Initialize if empty
            const initial = {
                totalSessions: 0,
                streak: 0,
                lastSessionDate: null,
                levelCounts: {},
                startDate: new Date().toISOString(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
            setProgress(initial);
        }
    }, []);

    const saveSession = (levelId: string) => {
        const today = new Date().toISOString().split('T')[0];
        const newProgress = { ...progress };

        // Update counts
        newProgress.totalSessions += 1;
        newProgress.levelCounts[levelId] = (newProgress.levelCounts[levelId] || 0) + 1;

        // Update streak
        if (newProgress.lastSessionDate) {
            const lastDate = new Date(newProgress.lastSessionDate);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                newProgress.streak += 1;
            } else if (diffDays > 1) {
                newProgress.streak = 1; // Reset streak if missed a day
            }
            // If same day, streak doesn't change
        } else {
            newProgress.streak = 1;
        }

        newProgress.lastSessionDate = today;

        setProgress(newProgress);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
    };

    const getRecommendation = () => {
        // Logic based on documentation:
        // Beginner: < 2 weeks or < 6 sessions
        // Intermediate: > 2 weeks & > 6 sessions
        // Advanced: > 12 weeks & > 36 sessions

        const sessions = progress.totalSessions;
        // Calculate weeks since start
        const start = new Date(progress.startDate);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - start.getTime());
        const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));

        if (diffWeeks >= 12 && sessions >= 36) {
            return {
                levelId: 'athlete',
                levelName: 'Atleta',
                message: '¡Nivel Experto alcanzado! Mantén la consistencia.'
            };
        } else if (diffWeeks >= 2 && sessions >= 6) {
            return {
                levelId: 'intermediate',
                levelName: 'Intermedio',
                message: 'Estás listo para aumentar la intensidad.'
            };
        } else {
            return {
                levelId: 'beginner',
                levelName: 'Principiante',
                message: 'Completa 2 semanas para avanzar.'
            };
        }
    };

    return { progress, saveSession, getRecommendation };
};
