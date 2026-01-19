// Simple color quantization and extraction
export const extractDominantColors = (imageUrl, maxColors = 5) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            // Downscale for performance and quantization
            const size = 64;
            canvas.width = size;
            canvas.height = size;
            ctx.drawImage(img, 0, 0, size, size);

            const imageData = ctx.getImageData(0, 0, size, size).data;
            const colorMap = {};

            // Quantize and count
            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const a = imageData[i + 3];

                if (a < 128) continue; // Skip transparent

                // Quantize to reduced color space (e.g. step 32)
                const step = 32;
                const qr = Math.floor(r / step) * step;
                const qg = Math.floor(g / step) * step;
                const qb = Math.floor(b / step) * step;

                const key = `${qr},${qg},${qb}`;
                colorMap[key] = (colorMap[key] || 0) + 1;
            }

            // Sort by frequency
            const sortedColors = Object.entries(colorMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, maxColors)
                .map(([key]) => {
                    const [r, g, b] = key.split(',').map(Number);
                    // Convert to Hex
                    return "#" + [r, g, b].map(x => {
                        const hex = x.toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                    }).join('');
                });

            resolve(sortedColors);
        };
        img.onerror = reject;
        img.src = imageUrl;
    });
};

export const generateSmartTheme = (colors) => {
    if (!colors || colors.length === 0) return null;

    const primary = colors[0];
    const secondary = colors[1] || colors[0];
    const tertiary = colors[2] || colors[0];

    // Helper to decide white/black text based on background brightness
    const getContrastColor = (hex) => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128 ? '#000000' : '#ffffff';
    };

    const contrastPrimary = getContrastColor(primary);
    const contrastSecondary = getContrastColor(secondary);

    return {
        bg: {
            solid: [
                primary,
                secondary,
                '#ffffff',
                '#000000'
            ],
            gradient: [
                { type: 'linear', angle: 135, stops: [{ offset: 0, color: primary }, { offset: 100, color: secondary }] },
                { type: 'linear', angle: 45, stops: [{ offset: 0, color: secondary }, { offset: 100, color: tertiary }] },
                { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#ffffff' }, { offset: 100, color: primary }] },
                // Add a subtle dark one
                { type: 'linear', angle: 180, stops: [{ offset: 0, color: secondary }, { offset: 100, color: '#000000' }] }
            ]
        },
        text: {
            solid: [
                '#ffffff',
                '#000000',
                // Add highly readable versions of theme colors if possible, or just accents
                contrastPrimary === '#ffffff' ? primary : '#f0f0f0', // If primary is dark, use it as is? No, if primary is dark, text should be light.
                // Actually safer to just give White/Black and maybe one colored accent that pops
                secondary
            ],
            gradient: [
                { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#ffffff' }, { offset: 100, color: '#cccccc' }] }, // Silver
                { type: 'linear', angle: 90, stops: [{ offset: 0, color: '#ffd700' }, { offset: 100, color: '#fdb931' }] }, // Gold (Pop)
                { type: 'linear', angle: 90, stops: [{ offset: 0, color: primary }, { offset: 100, color: secondary }] },
                { type: 'linear', angle: 90, stops: [{ offset: 0, color: secondary }, { offset: 100, color: tertiary }] }
            ]
        }
    };
};
