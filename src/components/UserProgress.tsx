import React from 'react';
import { useProgress } from '../hooks/useProgress';
import { Trophy, TrendingUp, Calendar, ChevronRight } from 'lucide-react';

const UserProgress: React.FC = () => {
    const { progress, getRecommendation } = useProgress();
    const recommendation = getRecommendation();

    return (
        <div className="w-full px-4 mb-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="text-purple-400" size={24} />
                Tu Progreso
            </h2>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col items-center">
                    <span className="text-3xl font-bold text-white mb-1">{progress.totalSessions}</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Sesiones</span>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 flex flex-col items-center">
                    <span className="text-3xl font-bold text-white mb-1 flex items-center gap-1">
                        {progress.streak} <span className="text-orange-400 text-lg">🔥</span>
                    </span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Racha (Días)</span>
                </div>
            </div>

            {/* Recommendation Card */}
            <div className="glass-card bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-purple-500/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="text-xs text-purple-300 font-semibold uppercase tracking-wider mb-1">
                            Recomendación
                        </div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {recommendation.levelName}
                            {recommendation.levelId !== 'beginner' && <Trophy size={16} className="text-yellow-400" />}
                        </h3>
                        <p className="text-sm text-gray-300 mt-1 max-w-[200px]">
                            {recommendation.message}
                        </p>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default UserProgress;
