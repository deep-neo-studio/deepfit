import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Dumbbell, Zap, Heart, Wind } from 'lucide-react';
import { KEGEL_LEVELS } from '../data/exercises';
import './Hipopressives.css';

const KegelLanding: React.FC = () => {
    const history = useHistory();

    const getIcon = (id: string) => {
        switch (id) {
            case 'kegel-beginner': return <Heart size={22} />;
            case 'kegel-intermediate': return <Dumbbell size={22} />;
            case 'kegel-power': return <Zap size={22} />;
            case 'kegel-relax': return <Wind size={22} />;
            default: return <Dumbbell size={22} />;
        }
    };

    const getIconColor = (id: string) => {
        switch (id) {
            case 'kegel-power': return 'yellow';
            case 'kegel-relax': return 'blue';
            default: return 'pink';
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen className="kegel-content">
                {/* Decorative circles */}
                <div className="kegel-deco-circle-1" />
                <div className="kegel-deco-circle-2" />

                {/* Header */}
                <div className="hipo-header">
                    <button className="hipo-back-btn" onClick={() => history.goBack()}>
                        <ArrowLeft size={20} />
                    </button>
                </div>

                {/* Hero */}
                <div className="hipo-hero">
                    <div className="kegel-badge">
                        <Dumbbell size={14} />
                        Kegel
                    </div>
                    <h1 className="hipo-hero-title">Suelo Pélvico</h1>
                    <p className="hipo-hero-sub">Fortalece, controla y relaja tu musculatura pélvica.</p>
                </div>

                {/* Level cards */}
                <div className="hipo-section-title">Programas disponibles</div>
                <div className="kegel-levels">
                    {KEGEL_LEVELS.map((level) => (
                        <div
                            key={level.id}
                            className="kegel-level-card"
                            onClick={() => history.push(`/kegel/session/${level.id}`)}
                        >
                            <div className={`kegel-level-icon ${getIconColor(level.id)}`}>
                                {getIcon(level.id)}
                            </div>
                            <div className="kegel-level-text">
                                <h3>{level.name}</h3>
                                <p>{level.description}</p>
                            </div>
                            <div className="kegel-level-meta">
                                <span className="kegel-level-duration">{level.duration}</span>
                                <span className="kegel-level-detail">{level.sets}×{level.reps} reps</span>
                                <ChevronRight size={16} className="hipo-level-arrow" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Spacer at bottom */}
                <div style={{ height: '2rem' }} />
            </IonContent>
        </IonPage>
    );
};

export default KegelLanding;
