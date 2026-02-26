import React, { useState, useRef } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { ArrowLeft, Volume2, Upload, Music, Trash2, Play, Pause, X, Check, Edit2, RotateCcw } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import './Settings.css';

const USER_NAME_KEY = 'user_name';
const PROGRESS_KEY = 'hipopressive_progress';

const Settings: React.FC = () => {
    const history = useHistory();
    const [userName, setUserName] = useState(localStorage.getItem(USER_NAME_KEY) || 'Atleta');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(userName);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

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

                    {/* Sound section removed as we use auto-generated sounds now */}

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
