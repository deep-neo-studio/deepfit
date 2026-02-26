import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft, Info } from 'lucide-react';
import { HIPOPRESSIVE_LEVELS } from '../data/exercises';
import { useProgress } from '../hooks/useProgress';
import { playPhaseBeep } from '../utils/audio';
import HypoAnimation from '../components/HypoAnimation';
import './ExerciseSession.css';

type Phase = 'PREPARE' | 'INHALE' | 'EXHALE' | 'APNEA' | 'REST' | 'FINISHED';

const ExerciseSession: React.FC = () => {
    const { level: levelId } = useParams<{ level: string }>();
    const history = useHistory();
    const level = HIPOPRESSIVE_LEVELS.find(l => l.id === levelId);
    const { saveSession } = useProgress();

    const [phase, setPhase] = useState<Phase>('PREPARE');
    const [timeLeft, setTimeLeft] = useState(5);
    const [isActive, setIsActive] = useState(false);
    const [cycleCount, setCycleCount] = useState(0);
    const [repCount, setRepCount] = useState(0);
    const [showTutorial, setShowTutorial] = useState(() => {
        return localStorage.getItem('hideHypoTutorial') !== 'true';
    });
    const [dontShowAgain, setDontShowAgain] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const closeTutorial = () => {
        if (dontShowAgain) {
            localStorage.setItem('hideHypoTutorial', 'true');
        }
        setShowTutorial(false);
    };

    const startSession = () => setIsActive(true);
    const pauseSession = () => setIsActive(false);
    const resetSession = () => {
        setIsActive(false);
        setPhase('PREPARE');
        setTimeLeft(5);
        setCycleCount(0);
        setRepCount(0);
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (isActive && timeLeft === 0) {
            handlePhaseTransition();
        }
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [isActive, timeLeft, phase]);

    useEffect(() => {
        if (isActive && phase !== 'FINISHED') {
            if (phase === 'APNEA') {
                playPhaseBeep(330, 'triangle', 0.6); // Lower tone, longer duration for apnea
            } else if (phase !== 'PREPARE') {
                playPhaseBeep(440, 'sine', 0.6); // Standard tone for breathing
            }
        }
    }, [phase, isActive]);

    const handlePhaseTransition = () => {
        if (!level) return;
        switch (phase) {
            case 'PREPARE': setPhase('INHALE'); setTimeLeft(3); break;
            case 'INHALE': setPhase('EXHALE'); setTimeLeft(3); break;
            case 'EXHALE':
                if (cycleCount < (level.breathCycles || 3) - 1) {
                    setCycleCount(prev => prev + 1); setPhase('INHALE'); setTimeLeft(3);
                } else {
                    setCycleCount(0); setPhase('APNEA'); setTimeLeft(level.apneaDuration || 15);
                }
                break;
            case 'APNEA': setPhase('REST'); setTimeLeft(10); setRepCount(prev => prev + 1); break;
            case 'REST':
                if (repCount < 5) {
                    setPhase('INHALE'); setTimeLeft(3);
                } else {
                    setPhase('FINISHED');
                    setIsActive(false);
                    saveSession(level.id);
                }
                break;
            default: break;
        }
    };

    const getInstructions = () => {
        switch (phase) {
            case 'PREPARE': return 'Prepárate';
            case 'INHALE': return 'Inhala';
            case 'EXHALE': return 'Exhala';
            case 'APNEA': return 'Vacío';
            case 'REST': return 'Descansa';
            case 'FINISHED': return 'Fin';
            default: return '';
        }
    };

    const getShapeClass = () => {
        switch (phase) {
            case 'INHALE': return 'phase-INHALE';
            case 'EXHALE': return 'phase-EXHALE';
            case 'APNEA': return 'phase-APNEA';
            case 'REST': return 'phase-REST';
            default: return 'phase-PREPARE';
        }
    };

    if (!level) return <div>Nivel no encontrado</div>;

    return (
        <IonPage>
            <IonContent fullscreen className="session-content">
                {showTutorial && (
                    <div className="hypo-tutorial-overlay">
                        <div className="hypo-tutorial-modal">
                            <h2>¿Cómo hacer el Hipopresivo?</h2>

                            <div className="hypo-svg-container" style={{ height: '240px', display: 'flex', justifyContent: 'center' }}>
                                <HypoAnimation />
                            </div>

                            <div className="hypo-tutorial-text">
                                <p><strong>1. Inhala:</strong> Abre tus costillas.</p>
                                <p><strong>2. Exhala:</strong> Suelta todo el aire.</p>
                                <p><strong>3. Vacío (Apnea):</strong> Sin aire, "succiona" tu abdomen hacia arriba y adentro. Mantén la postura.</p>
                            </div>

                            <label className="hypo-tutorial-checkbox">
                                <input
                                    type="checkbox"
                                    checked={dontShowAgain}
                                    onChange={(e) => setDontShowAgain(e.target.checked)}
                                />
                                No volver a mostrar
                            </label>

                            <button className="btn-capsule tutorial-btn" onClick={closeTutorial}>
                                Entendido
                            </button>
                        </div>
                    </div>
                )}

                {/* Decorative */}
                <div className="session-deco-1" />
                <div className="session-deco-2" />

                <div className="session-layout">
                    {/* Header */}
                    <div className="session-header">
                        <button className="session-back-btn" onClick={() => history.goBack()}>
                            <ArrowLeft size={20} />
                        </button>
                        <span className="session-level-name">{level.name}</span>
                    </div>

                    {/* Instruction */}
                    <div className="session-instruction">
                        Sigue el ritmo de la luz
                    </div>

                    {/* The Glowing Orb */}
                    <div className="orb-container">
                        <div className={`glowing-orb ${getShapeClass()}`}>
                            <span className="orb-time">
                                {phase === 'FINISHED' ? '✓' : timeLeft}
                            </span>
                            <span className="orb-label">{getInstructions()}</span>
                        </div>
                        {phase === 'APNEA' && <div className="orb-ping" />}
                    </div>

                    {/* Stats */}
                    <div className="stats-container">
                        <div className="stat-item">
                            <span className="stat-value purple">
                                {cycleCount + 1}/{level.breathCycles || 3}
                            </span>
                            <span className="stat-label">Ciclo</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value pink">
                                {repCount + 1}
                            </span>
                            <span className="stat-label">Reps</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="session-controls">
                        <button className="btn-circle-outline" onClick={resetSession}>
                            <RotateCcw size={20} />
                        </button>

                        {!isActive ? (
                            <button className="btn-capsule" onClick={startSession}>
                                <Play size={18} fill="currentColor" />
                                <span>INICIAR</span>
                            </button>
                        ) : (
                            <button className="btn-capsule pause" onClick={pauseSession}>
                                <Pause size={18} fill="currentColor" />
                                <span>PAUSAR</span>
                            </button>
                        )}

                        <button className="btn-circle-outline" onClick={() => setShowTutorial(true)}>
                            <Info size={20} />
                        </button>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default ExerciseSession;
