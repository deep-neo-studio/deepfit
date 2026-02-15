import React, { useState, useEffect, useRef } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useParams, useHistory } from 'react-router-dom';
import { Play, Pause, RotateCcw, ArrowLeft } from 'lucide-react';
import { KEGEL_LEVELS } from '../data/exercises';
import { useProgress } from '../hooks/useProgress';
import './ExerciseSession.css';

type Phase = 'PREPARE' | 'CONTRACT' | 'RELAX' | 'REST_SET' | 'FINISHED';

const KegelSession: React.FC = () => {
    const { level: levelId } = useParams<{ level: string }>();
    const history = useHistory();
    const level = KEGEL_LEVELS.find(l => l.id === levelId);
    const { saveSession } = useProgress();

    const [phase, setPhase] = useState<Phase>('PREPARE');
    const [timeLeft, setTimeLeft] = useState(5);
    const [isActive, setIsActive] = useState(false);
    const [currentRep, setCurrentRep] = useState(1);
    const [currentSet, setCurrentSet] = useState(1);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const getPhaseInfo = () => {
        switch (phase) {
            case 'PREPARE': return { text: 'Prepárate' };
            case 'CONTRACT': return { text: 'CONTRAE' };
            case 'RELAX': return { text: 'RELAJA' };
            case 'REST_SET': return { text: 'Descanso' };
            case 'FINISHED': return { text: '¡Terminado!' };
        }
    };

    const getPhaseClass = () => {
        switch (phase) {
            case 'CONTRACT': return 'phase-CONTRACT';
            case 'RELAX': return 'phase-RELAX';
            case 'REST_SET': return 'phase-REST_SET';
            case 'FINISHED': return 'phase-FINISHED';
            default: return 'phase-PREPARE';
        }
    };

    useEffect(() => {
        if (!isActive || !level) return;

        if (timeLeft > 0) {
            timerRef.current = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else {
            handlePhaseTransition();
        }

        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [isActive, timeLeft, phase]);

    const handlePhaseTransition = () => {
        if (!level) return;

        switch (phase) {
            case 'PREPARE':
                setPhase('CONTRACT'); setTimeLeft(level.holdTime || 3);
                break;
            case 'CONTRACT':
                setPhase('RELAX'); setTimeLeft(level.restTime || 5);
                break;
            case 'RELAX':
                if (currentRep < (level.reps || 10)) {
                    setCurrentRep(prev => prev + 1);
                    setPhase('CONTRACT'); setTimeLeft(level.holdTime || 3);
                } else {
                    if (currentSet < (level.sets || 3)) {
                        setCurrentSet(prev => prev + 1);
                        setCurrentRep(1);
                        setPhase('REST_SET'); setTimeLeft(30);
                    } else {
                        setPhase('FINISHED');
                        setIsActive(false);
                        saveSession(level.id);
                    }
                }
                break;
            case 'REST_SET':
                setPhase('CONTRACT'); setTimeLeft(level.holdTime || 3);
                break;
            default: break;
        }
    };

    const toggleTimer = () => setIsActive(!isActive);
    const resetSession = () => {
        setIsActive(false);
        setPhase('PREPARE');
        setTimeLeft(5);
        setCurrentRep(1);
        setCurrentSet(1);
    };

    if (!level) return <div>Nivel no encontrado</div>;

    const info = getPhaseInfo();

    return (
        <IonPage>
            <IonContent fullscreen className="session-content">
                {/* Nebula Background */}
                <div className={`kegel-nebula ${phase === 'CONTRACT' ? 'active' : 'passive'}`}>
                    <div className="nebula-blob-1" />
                    <div className="nebula-blob-2" />
                </div>

                {/* Decorative */}
                <div className="session-deco-1" />

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
                        {phase === 'CONTRACT' ? 'Aprieta con fuerza' : phase === 'RELAX' ? 'Suelta completamente' : ''}
                    </div>

                    {/* The Glowing Orb */}
                    <div className="orb-container">
                        <div className={`glowing-orb ${getPhaseClass()}`}>
                            <div className={`orb-inner-glow ${phase === 'CONTRACT' ? 'contract' : 'default'}`} />
                            <span className="orb-time">
                                {phase === 'FINISHED' ? '✓' : timeLeft}
                            </span>
                            <span className="orb-label">{info.text}</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="stats-container">
                        <div className="stat-item">
                            <span className="stat-value pink">
                                {currentSet}/{level.sets || 3}
                            </span>
                            <span className="stat-label">Serie</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value blue">
                                {currentRep}/{level.reps || 10}
                            </span>
                            <span className="stat-label">Repetición</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="session-controls">
                        <button onClick={resetSession} className="btn-circle-outline">
                            <RotateCcw size={20} />
                        </button>

                        {phase !== 'FINISHED' && (
                            <button onClick={toggleTimer} className={`btn-capsule ${isActive ? 'pause' : ''}`}>
                                {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                <span>{isActive ? 'PAUSAR' : 'INICIAR'}</span>
                            </button>
                        )}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default KegelSession;
