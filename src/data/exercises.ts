export interface ExerciseLevel {
    id: string;
    name: string;
    description: string;
    apneaDuration?: number; // Optional now
    breathCycles?: number;
    totalTime?: number;
    recommendedFrequency?: string;
    // Kegel specific
    holdTime?: number;
    restTime?: number;
    reps?: number;
    sets?: number;
    type?: 'strength' | 'power' | 'relax';
    duration?: string;
}

export const HIPOPRESSIVE_LEVELS: ExerciseLevel[] = [
    {
        id: 'beginner',
        name: 'Principiante',
        description: 'Aprende la técnica básica. Apneas cortas de 10-15 segundos.',
        apneaDuration: 15,
        breathCycles: 3,
        totalTime: 10,
        recommendedFrequency: '3 veces/semana',
        sets: 3
    },
    {
        id: 'intermediate',
        name: 'Intermedio',
        description: 'Mejora tu capacidad. Apneas de 20-25 segundos.',
        apneaDuration: 25,
        breathCycles: 3,
        totalTime: 15,
        recommendedFrequency: '3-4 veces/semana',
        sets: 4
    },
    {
        id: 'athlete',
        name: 'Atleta / Avanzado',
        description: 'Para deportistas. Apneas de hasta 45 segundos y posturas dinámicas.',
        apneaDuration: 45,
        breathCycles: 2,
        totalTime: 20,
        recommendedFrequency: '5 veces/semana',
        sets: 5
    },
    {
        id: 'maintenance',
        name: 'Mantenimiento',
        description: 'Sesión rápida diaria para mantener el tono.',
        apneaDuration: 20,
        breathCycles: 3,
        totalTime: 5,
        recommendedFrequency: 'Diario',
        sets: 2
    }
];

export const KEGEL_LEVELS: ExerciseLevel[] = [
    {
        id: 'kegel-beginner',
        name: 'Principiante',
        duration: '5 min',
        description: 'Contracciones suaves para despertar la musculatura. 3s contracción / 5s relajación.',
        holdTime: 3,
        restTime: 5,
        reps: 10,
        sets: 3,
        type: 'strength',
        recommendedFrequency: 'Diario'
    },
    {
        id: 'kegel-intermediate',
        name: 'Intermedio',
        duration: '10 min',
        description: 'Mayor tiempo bajo tensión para ganar resistencia. 6s contracción / 6s relajación.',
        holdTime: 6,
        restTime: 6,
        reps: 12,
        sets: 3,
        type: 'strength',
        recommendedFrequency: '3-4 veces/semana'
    },
    {
        id: 'kegel-power',
        name: 'Power / Atleta',
        duration: '15 min',
        description: 'Alta intensidad (85% CVM). 10s contracción máxima.',
        holdTime: 10,
        restTime: 10,
        reps: 10,
        sets: 4,
        type: 'power',
        recommendedFrequency: '2-3 veces/semana'
    },
    {
        id: 'kegel-relax',
        name: 'Relajación',
        duration: '8 min',
        description: 'Prevención de hipertonía. Enfoque en soltar completamente.',
        holdTime: 2,
        restTime: 10,
        reps: 8,
        sets: 3,
        type: 'relax',
        recommendedFrequency: 'Post-entreno'
    }
];
