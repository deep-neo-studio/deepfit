import React, { useState, useRef } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { ArrowLeft, Volume2, Upload, Music, Trash2, Play, Pause, X, Check, Edit2, RotateCcw } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import './Settings.css';

const USER_NAME_KEY = 'user_name';
const SOUND_APNEA_KEY = 'deepfit_sound_apnea';
const SOUND_REST_KEY = 'deepfit_sound_rest';
const PROGRESS_KEY = 'hipopressive_progress';

interface SoundData {
    name: string;
    dataUrl: string;
}

const Settings: React.FC = () => {
    const history = useHistory();
    const [userName, setUserName] = useState(localStorage.getItem(USER_NAME_KEY) || 'Atleta');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(userName);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    // Sound states
    const [apneaSound, setApneaSound] = useState<SoundData | null>(() => {
        const saved = localStorage.getItem(SOUND_APNEA_KEY);
        return saved ? JSON.parse(saved) : null;
    });
    const [restSound, setRestSound] = useState<SoundData | null>(() => {
        const saved = localStorage.getItem(SOUND_REST_KEY);
        return saved ? JSON.parse(saved) : null;
    });
    const [playingSound, setPlayingSound] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const apneaInputRef = useRef<HTMLInputElement>(null);
    const restInputRef = useRef<HTMLInputElement>(null);

    const userInitial = userName.charAt(0).toUpperCase();

    // === Name editing ===
    const handleSaveName = () => {
        const trimmed = tempName.trim();
        if (trimmed) {
            localStorage.setItem(USER_NAME_KEY, trimmed);
            setUserName(trimmed);
        }
        setIsEditingName(false);
    };

    const handleCancelEdit = () => {
        setTempName(userName);
        setIsEditingName(false);
    };

    // === Sound upload ===
    const handleSoundUpload = (key: string, setter: React.Dispatch<React.SetStateAction<SoundData | null>>) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Limit to 5MB
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo debe ser menor a 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const soundData: SoundData = {
                    name: file.name,
                    dataUrl: reader.result as string,
                };
                localStorage.setItem(key, JSON.stringify(soundData));
                setter(soundData);
            };
            reader.readAsDataURL(file);
        };
    };

    const handleRemoveSound = (key: string, setter: React.Dispatch<React.SetStateAction<SoundData | null>>) => {
        localStorage.removeItem(key);
        setter(null);
        stopSound();
    };

    // === Sound playback ===
    const playSound = (dataUrl: string, id: string) => {
        stopSound();
        const audio = new Audio(dataUrl);
        audio.onended = () => setPlayingSound(null);
        audio.play();
        audioRef.current = audio;
        setPlayingSound(id);
    };

    const stopSound = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
        setPlayingSound(null);
    };

    // === Reset progress ===
    const handleResetProgress = () => {
        localStorage.removeItem(PROGRESS_KEY);
        setShowResetConfirm(false);
    };

    return (
        <IonPage>
            <IonContent fullscreen className="settings-page">
                {/* Header */}
                <div className="settings-header">
                    <button className="settings-back-btn" onClick={() => history.goBack()}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="settings-title">Configuraciones</h1>
                </div>

                <div className="settings-container">
                    {/* User Profile */}
                    <div className="settings-card" style={{ marginBottom: '1.5rem' }}>
                        <div className="settings-profile">
                            <div className="settings-avatar">{userInitial}</div>
                            {isEditingName ? (
                                <div className="settings-name-edit">
                                    <input
                                        type="text"
                                        className="settings-name-input"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                        autoFocus
                                        maxLength={30}
                                    />
                                    <div className="settings-name-actions">
                                        <button className="name-action-btn save" onClick={handleSaveName}>
                                            <Check size={16} />
                                        </button>
                                        <button className="name-action-btn cancel" onClick={handleCancelEdit}>
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="settings-profile-info"
                                    onClick={() => { setTempName(userName); setIsEditingName(true); }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <h3>{userName} <Edit2 size={14} style={{ opacity: 0.4, marginLeft: 4 }} /></h3>
                                    <p>Toca para editar nombre</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sounds Section */}
                    <div className="settings-section">
                        <h2 className="settings-section-title">
                            <Volume2 size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                            Sonidos
                        </h2>
                        <div className="settings-card">
                            {/* Apnea Sound */}
                            <div className="sound-slot">
                                <div className="sound-slot-icon">
                                    <Music size={20} />
                                </div>
                                <div className="sound-slot-info">
                                    <h3>Fase de Apnea</h3>
                                    <p>{apneaSound ? apneaSound.name : 'Sin archivo seleccionado'}</p>
                                </div>
                                <div className="sound-slot-actions">
                                    {apneaSound && (
                                        <>
                                            <button
                                                className="sound-action-btn play"
                                                onClick={() => playingSound === 'apnea' ? stopSound() : playSound(apneaSound.dataUrl, 'apnea')}
                                            >
                                                {playingSound === 'apnea' ? <Pause size={14} /> : <Play size={14} />}
                                            </button>
                                            <button
                                                className="sound-action-btn delete"
                                                onClick={() => handleRemoveSound(SOUND_APNEA_KEY, setApneaSound)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                    <button className="sound-slot-btn" onClick={() => apneaInputRef.current?.click()}>
                                        <Upload size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                        {apneaSound ? 'Cambiar' : 'Subir'}
                                    </button>
                                </div>
                                <input
                                    ref={apneaInputRef}
                                    type="file"
                                    accept="audio/*"
                                    style={{ display: 'none' }}
                                    onChange={handleSoundUpload(SOUND_APNEA_KEY, setApneaSound)}
                                />
                            </div>

                            {/* Rest Sound */}
                            <div className="sound-slot">
                                <div className="sound-slot-icon">
                                    <Music size={20} />
                                </div>
                                <div className="sound-slot-info">
                                    <h3>Fase de Descanso</h3>
                                    <p>{restSound ? restSound.name : 'Sin archivo seleccionado'}</p>
                                </div>
                                <div className="sound-slot-actions">
                                    {restSound && (
                                        <>
                                            <button
                                                className="sound-action-btn play"
                                                onClick={() => playingSound === 'rest' ? stopSound() : playSound(restSound.dataUrl, 'rest')}
                                            >
                                                {playingSound === 'rest' ? <Pause size={14} /> : <Play size={14} />}
                                            </button>
                                            <button
                                                className="sound-action-btn delete"
                                                onClick={() => handleRemoveSound(SOUND_REST_KEY, setRestSound)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </>
                                    )}
                                    <button className="sound-slot-btn" onClick={() => restInputRef.current?.click()}>
                                        <Upload size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                        {restSound ? 'Cambiar' : 'Subir'}
                                    </button>
                                </div>
                                <input
                                    ref={restInputRef}
                                    type="file"
                                    accept="audio/*"
                                    style={{ display: 'none' }}
                                    onChange={handleSoundUpload(SOUND_REST_KEY, setRestSound)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reset Progress */}
                    <div className="settings-section">
                        <h2 className="settings-section-title">Datos</h2>
                        <div className="settings-card">
                            <div className="settings-item" onClick={() => setShowResetConfirm(true)}>
                                <div className="settings-item-left">
                                    <div className="settings-item-icon red">
                                        <RotateCcw size={20} />
                                    </div>
                                    <div className="settings-item-info">
                                        <h3>Resetear Progreso</h3>
                                        <p>Elimina todas las sesiones y racha</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* App Info */}
                    <div className="settings-app-info">
                        <p>Deep<span style={{ color: '#c084fc' }}>Fit</span> v1.0</p>
                        <p className="settings-app-sub">Tu compañero de entrenamiento</p>
                    </div>
                </div>

                {/* Reset Confirmation Modal */}
                {showResetConfirm && (
                    <div className="settings-modal-overlay" onClick={() => setShowResetConfirm(false)}>
                        <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                            <h3>¿Resetear progreso?</h3>
                            <p>Se eliminarán todas tus sesiones, racha y estadísticas. Esta acción no se puede deshacer.</p>
                            <div className="settings-modal-actions">
                                <button className="modal-btn cancel" onClick={() => setShowResetConfirm(false)}>
                                    Cancelar
                                </button>
                                <button className="modal-btn danger" onClick={handleResetProgress}>
                                    Sí, resetear
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Settings;
