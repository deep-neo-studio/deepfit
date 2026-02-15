import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { HIPOPRESSIVE_LEVELS } from '../data/exercises';
import { ArrowLeft, Activity, Wind, Clock, ChevronRight } from 'lucide-react';
import './Hipopressives.css';

const Hipopressives: React.FC = () => {
    const history = useHistory();

    return (
        <IonPage>
            <IonContent fullscreen className="hipo-content">
                {/* Decorative circles */}
                <div className="hipo-deco-circle-1" />
                <div className="hipo-deco-circle-2" />

                {/* Header */}
                <div className="hipo-header">
                    <button className="hipo-back-btn" onClick={() => history.goBack()}>
                        <ArrowLeft size={20} />
                    </button>
                </div>

                {/* Hero */}
                <div className="hipo-hero">
                    <div className="hipo-badge">
                        <Activity size={14} />
                        Hipopresivos
                    </div>
                    <h1 className="hipo-hero-title">Elige tu nivel</h1>
                    <p className="hipo-hero-sub">Progresa gradualmente para mejores resultados.</p>
                </div>

                {/* Level cards */}
                <div className="hipo-section-title">Niveles disponibles</div>
                <div className="hipo-levels">
                    {HIPOPRESSIVE_LEVELS.map((level) => (
                        <div
                            key={level.id}
                            className="hipo-level-card"
                            onClick={() => history.push(`/hipopressives/session/${level.id}`)}
                        >
                            <div className="hipo-level-icon">
                                <Activity size={22} />
                            </div>
                            <div className="hipo-level-text">
                                <h3>{level.name}</h3>
                                <p>{level.description}</p>
                            </div>
                            <div className="hipo-level-meta">
                                <span className="hipo-level-time">
                                    <Wind size={12} />
                                    {level.apneaDuration}s
                                </span>
                                <span className="hipo-level-time">
                                    <Clock size={12} />
                                    ~{level.totalTime} min
                                </span>
                                <ChevronRight size={16} className="hipo-level-arrow" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Warning */}
                <div className="hipo-warning">
                    <h4>⚠️ Importante</h4>
                    <p>
                        Evita estos ejercicios si estás embarazada, tienes hipertensión no controlada o problemas intestinales agudos.
                    </p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Hipopressives;
