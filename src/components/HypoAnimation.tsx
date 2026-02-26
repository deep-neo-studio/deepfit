import React, { useEffect, useRef } from 'react';

const HypoAnimation: React.FC = () => {
    const torsoRef = useRef<SVGPathElement>(null);
    const cropTopRef = useRef<SVGPathElement>(null);
    const headRef = useRef<SVGGElement>(null);
    const armRef = useRef<SVGPathElement>(null);

    // Coordenadas Base (Postura Neutral / Relajada)
    const neutralPath = [
        [190, 160], // Inicio: Cuello Frontal
        [150, 200, 140, 260, 150, 320], // Curva 1: Pecho (Relajado)
        [160, 390, 170, 460, 190, 520], // Curva 2: Abdomen (Relajado)
        [270, 520],                     // Línea: Base de la pelvis
        [280, 460, 280, 380, 260, 300], // Curva 3: Espalda Baja
        [240, 260, 230, 200, 230, 160]  // Curva 4: Espalda Alta al Cuello
    ];

    // Coordenadas Objetivo (Postura de Vacío / Apnea)
    const vacuumPath = [
        [190, 130], // Cuello Frontal (Se eleva 30px)
        [150, 170, 120, 240, 140, 300], // Pecho (Se expande hacia afuera y arriba)
        [230, 320, 230, 420, 190, 520], // Abdomen (Profundamente succionado hacia adentro y arriba)
        [270, 520],                     // Pelvis (Estática)
        [280, 460, 280, 360, 260, 280], // Espalda Baja (Sigue la elevación)
        [240, 240, 230, 170, 230, 130]  // Espalda Alta al Cuello (Se eleva)
    ];

    useEffect(() => {
        let startTime: number | null = null;
        let animationFrameId: number;
        const duration = 3000; // 3 seconds per breathe cycle phase (0 to 1)

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Ping-pong between 0 and 1
            // e.g. duration = 3000. 
            // Phase goes 0 -> 1 -> 0 -> 1 over time.
            let val = (Math.sin((elapsed / duration) * Math.PI - Math.PI / 2) + 1) / 2;

            // Or a more breathing-like custom curve (inhale fast, hold, exhale, apnea hold):
            // For simplicity, we use sine wave ping-pong for smooth continuous animation.

            // 1. Interpolación de los vértices del Torso
            const currentTorso = neutralPath.map((group, i) => {
                return group.map((num, j) => {
                    return num + (vacuumPath[i][j] - num) * val;
                });
            });

            // Construir el string 'd' del Torso
            const torsoData = `
                M ${currentTorso[0].join(',')} 
                C ${currentTorso[1].join(',')} 
                C ${currentTorso[2].join(',')} 
                L ${currentTorso[3].join(',')} 
                C ${currentTorso[4].join(',')} 
                C ${currentTorso[5].join(',')} Z
            `;
            if (torsoRef.current) torsoRef.current.setAttribute('d', torsoData.trim());

            // 2. Construir el string 'd' del Crop Top
            const startX = currentTorso[1][4];
            const startY = currentTorso[1][5];
            const endX = currentTorso[4][4];
            const endY = currentTorso[4][5];

            const ctrlX = (startX + endX) / 2;
            const ctrlY = Math.max(startY, endY) + 15;

            const cropTopData = `
                M ${currentTorso[0].join(',')} 
                C ${currentTorso[1].join(',')} 
                Q ${ctrlX},${ctrlY} ${endX},${endY} 
                C ${currentTorso[5].join(',')} Z
            `;
            if (cropTopRef.current) cropTopRef.current.setAttribute('d', cropTopData.trim());

            // 3. Elevación de la Cabeza
            const headYOffset = val * -30;
            if (headRef.current) headRef.current.setAttribute('transform', `translate(0, ${headYOffset})`);

            // 4. Animación del Brazo
            const armX0 = 200, armY0 = 200 - (val * 30);
            const armCX1 = 230 + (val * 5), armCY1 = 300 - (val * 20);
            const armCX2 = 220 + (val * 5), armCY2 = 400 - (val * 20);
            const armX1 = 210 + (val * 5), armY1 = 480 - (val * 20);

            if (armRef.current) {
                armRef.current.setAttribute('d', `M ${armX0},${armY0} C ${armCX1},${armCY1} ${armCX2},${armCY2} ${armX1},${armY1}`);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <svg viewBox="100 0 250 850" style={{ height: '100%', maxWidth: '100%' }}>
            <defs>
                <filter id="shadow-blur">
                    <feGaussianBlur stdDeviation="5" />
                </filter>
            </defs>

            {/* Sombra en el suelo */}
            <ellipse cx="230" cy="760" rx="90" ry="12" fill="rgba(255,255,255,0.15)" filter="url(#shadow-blur)" />

            <g id="character">
                {/* Cabeza */}
                <g ref={headRef} fill="#f5cba7">
                    <path d="M 230, 160 
                             C 240, 110 250, 50 210, 50 
                             C 170, 50 160, 80 160, 100 
                             L 150, 110 L 160, 120 L 155, 135 
                             C 175, 145 180, 155 190, 160 Z" />
                </g>

                {/* Torso */}
                <path ref={torsoRef} fill="#f5cba7" />

                {/* Crop Top (Color ajustado al tema de la app, púrpura/rosado) */}
                <path ref={cropTopRef} fill="#a78bfa" />

                {/* Pantalones */}
                <path d="M 190, 520 
                         C 190, 600 200, 650 190, 750 
                         L 250, 750 
                         C 260, 650 250, 600 270, 520 Z" fill="#2f3542" />

                {/* Brazo */}
                <path ref={armRef} fill="none" stroke="#e6b18a" strokeWidth="26" strokeLinecap="round" />
            </g>
        </svg>
    );
};

export default HypoAnimation;
