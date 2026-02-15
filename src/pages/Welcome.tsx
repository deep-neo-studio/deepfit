import React, { useState, useEffect } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Dumbbell } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import './Welcome.css';

const USER_NAME_KEY = 'user_name';

const Welcome: React.FC = () => {
    const history = useHistory();
    const [name, setName] = useState('');

    useEffect(() => {
        const savedName = localStorage.getItem(USER_NAME_KEY);
        if (savedName) {
            history.replace('/home');
        }
    }, [history]);

    const handleContinue = () => {
        const trimmed = name.trim();
        if (trimmed) {
            localStorage.setItem(USER_NAME_KEY, trimmed);
            history.replace('/home');
        }
    };

    const handleSkip = () => {
        localStorage.setItem(USER_NAME_KEY, 'Atleta');
        history.replace('/home');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && name.trim()) {
            handleContinue();
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen className="welcome-page">
                {/* Decorative circles */}
                <div className="welcome-circle-1" />
                <div className="welcome-circle-2" />
                <div className="welcome-circle-3" />

                <div className="welcome-container">
                    {/* App Icon */}
                    <div className="welcome-icon-wrap">
                        <Dumbbell size={52} color="#c084fc" strokeWidth={1.8} />
                    </div>

                    <h1 className="welcome-title">
                        Deep<span className="gradient-text">Fit</span>
                    </h1>
                    <p className="welcome-subtitle">
                        Tu compañero de entrenamiento de suelo pélvico e hipopresivos. ¿Cómo te llamas?
                    </p>

                    {/* Name Input */}
                    <div className="welcome-input-group">
                        <label className="welcome-input-label">Tu nombre</label>
                        <input
                            type="text"
                            className="welcome-input"
                            placeholder="Escribe tu nombre..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            maxLength={30}
                        />
                    </div>

                    <button
                        className="welcome-btn"
                        onClick={handleContinue}
                        disabled={!name.trim()}
                    >
                        Continuar
                    </button>

                    <button className="welcome-skip" onClick={handleSkip}>
                        Omitir por ahora
                    </button>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Welcome;
