import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Activity, Dumbbell, ChevronRight, Settings, TrendingUp, Flame, Calendar } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import './Home.css';

const USER_NAME_KEY = 'user_name';

// Donut chart component
const DonutChart: React.FC<{ value: number; max: number; colorClass: string; label: string }> = ({ value, max, colorClass, label }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const percent = Math.min(value / max, 1);
    const offset = circumference * (1 - percent);

    return (
        <div className="home-donut">
            <div className="home-donut-ring">
                <svg viewBox="0 0 90 90">
                    <circle className="donut-bg" cx="45" cy="45" r={radius} />
                    <circle
                        className={`donut-fill ${colorClass}`}
                        cx="45"
                        cy="45"
                        r={radius}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                    />
                </svg>
                <span className="home-donut-value">{Math.round(percent * 100)}%</span>
            </div>
            <span className="home-donut-label">{label}</span>
        </div>
    );
};

const Home: React.FC = () => {
    const history = useHistory();
    const { progress } = useProgress();
    const userName = localStorage.getItem(USER_NAME_KEY) || 'Atleta';

    // Calculate weekly sessions (goal: 7 days)
    const weeklyGoal = 7;
    const weeklySessions = Math.min(progress.streak, weeklyGoal);

    // Calculate monthly progress (goal: 30 sessions)
    const monthlyGoal = 30;
    const monthlySessions = Math.min(progress.totalSessions, monthlyGoal);

    return (
        <IonPage>
            <IonContent fullscreen className="home-content">
                {/* Decorative circles */}
                <div className="home-deco-circle-1" />
                <div className="home-deco-circle-2" />

                {/* Header */}
                <div className="home-header">
                    <div className="home-header-left">
                        <h1>
                            Hola, <span className="gradient-text">{userName}</span>
                        </h1>
                        <p>Tu cuerpo es tu templo.</p>
                    </div>
                    <button className="home-settings-btn" onClick={() => history.push('/settings')}>
                        <Settings size={20} />
                    </button>
                </div>

                {/* Progress Panel with Donuts */}
                <div className="home-progress-panel">
                    <div className="home-progress-header">
                        <TrendingUp size={18} color="#a78bfa" />
                        <h2>Tu Progreso</h2>
                    </div>

                    <div className="home-progress-donuts">
                        <DonutChart
                            value={weeklySessions}
                            max={weeklyGoal}
                            colorClass="purple"
                            label="Racha"
                        />
                        <DonutChart
                            value={monthlySessions}
                            max={monthlyGoal}
                            colorClass="pink"
                            label="Sesiones"
                        />
                    </div>

                    <div className="home-stats-row">
                        <div className="home-stat">
                            <Flame size={16} color="#f97316" />
                            <span className="home-stat-value">{progress.streak}</span>
                            <span className="home-stat-label">días</span>
                        </div>
                        <div className="home-stat">
                            <Calendar size={16} color="#8b5cf6" />
                            <span className="home-stat-value">{progress.totalSessions}</span>
                            <span className="home-stat-label">total</span>
                        </div>
                    </div>
                </div>

                {/* Exercise Options */}
                <div className="home-exercises-section">
                    <div className="home-exercises-title">Elige tu ejercicio</div>

                    <button className="home-exercise-btn" onClick={() => history.push('/hipopressives')}>
                        <div className="home-exercise-btn-icon purple">
                            <Activity size={22} />
                        </div>
                        <div className="home-exercise-btn-text">
                            <h3>Hipopresivos</h3>
                            <p>Técnica de vacío abdominal</p>
                        </div>
                        <ChevronRight size={18} className="home-exercise-btn-arrow" />
                    </button>

                    <button className="home-exercise-btn" onClick={() => history.push('/kegel')}>
                        <div className="home-exercise-btn-icon pink">
                            <Dumbbell size={22} />
                        </div>
                        <div className="home-exercise-btn-text">
                            <h3>Kegel</h3>
                            <p>Fortalecimiento suelo pélvico</p>
                        </div>
                        <ChevronRight size={18} className="home-exercise-btn-arrow" />
                    </button>
                </div>



            </IonContent>
        </IonPage>
    );
};

export default Home;
