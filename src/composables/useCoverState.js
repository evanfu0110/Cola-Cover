import { reactive, watch, nextTick } from 'vue';
import { defaultConfig } from '../config';
import { useDark } from './useDark';
import { extractDominantColors, generateSmartTheme } from '../utils/colorAnalysis';

// 状态管理
export function useCoverState() {
    const { isDark } = useDark();

    const state = reactive({
        // 背景
        bgMode: 'solid',
        bgColor: isDark.value ? '#000000' : '#ffffff',
        bgGradient: {
            type: 'linear',
            angle: 135,
            stops: [
                { offset: 0, color: '#ff9a9e' },
                { offset: 100, color: '#fad0c4' }
            ]
        },
        bgImageUrl: null,
        bgIconUrl: null,
        bgIconName: '',
        bgBlur: 0,

        // 画布尺寸
        canvasWidth: 1000,
        canvasHeight: 500,

        // 高斯模糊层
        glassEnabled: false,
        glassBlur: 10,
        glassOpacity: 20,
        glassTintColor: '#ffffff',
        glassNoise: 0,
        glassSaturation: 100,

        // 图标内容
        iconName: '',
        iconUrl: null,
        squareImageUrl: null,
        squareSize: 300,
        rotation: 0,
        shadowStrength: 60,
        shadowColor: '#646464',
        iconBgSize: 0,
        iconColor: '#eeeeee',

        // 文字内容
        text: defaultConfig.text,
        textMode: 'solid',
        textColor: isDark.value ? '#ffffff' : '#000000',
        textGradient: {
            type: 'linear',
            angle: 90,
            stops: [
                { offset: 0, color: '#cccccc' },
                { offset: 100, color: '#eeeeee' }
            ]
        },
        textSize: 150,
        selectedFont: defaultConfig.fontFamily,
        lineHeight: 1,
        text3D: 0,

        // 水印
        showWatermark: false,
        watermark: defaultConfig.watermark,
        watermarkColor: '#dddddd',

        // UI状态
        isFontMenuOpen: false,
        showSettings: false,
        dragHighlight: null,

        // 内部状态
        hasMultipleLines: false,

        // 智能推荐
        suggestions: null
    });

    // 主题同步
    watch(isDark, (newVal) => {
        if (newVal) {
            // 切暗色
            if (state.bgMode === 'solid' && state.bgColor.toLowerCase() === '#ffffff') state.bgColor = '#000000';
            if (state.textMode === 'solid' && state.textColor.toLowerCase() === '#000000') state.textColor = '#ffffff';
        } else {
            // 切亮色
            if (state.bgMode === 'solid' && state.bgColor.toLowerCase() === '#000000') state.bgColor = '#ffffff';
            if (state.textMode === 'solid' && state.textColor.toLowerCase() === '#ffffff') state.textColor = '#000000';
        }
    });

    // Logo变动自动分析配色
    watch(() => state.squareImageUrl, async (newUrl) => {
        if (!newUrl) {
            state.suggestions = null;
            return;
        }
        try {
            const colors = await extractDominantColors(newUrl);
            state.suggestions = generateSmartTheme(colors);
        } catch (e) {
            console.error('Color analysis failed', e);
        }
    });

    // Watchers for side effects
    watch(() => state.text, (newVal) => {
        state.hasMultipleLines = newVal.includes('\n');
    });

    // --- Canvas Management ---
    const canvases = {
        main: null,
        bg: null,
        gradient: null,
        glass: null,
        text: null,
        watermark: null,
        square: null
    };

    const contexts = {
        main: null,
        bg: null,
        gradient: null,
        glass: null,
        text: null,
        watermark: null,
        square: null
    };

    const initCanvases = (width = 1000, height = 500) => {
        // Helper to create canvas
        const create = () => {
            const c = document.createElement('canvas');
            c.width = width;
            c.height = height;
            return { c, ctx: c.getContext('2d') };
        };

        // Initialize all offscreen canvases
        ['bg', 'gradient', 'glass', 'text', 'watermark', 'square'].forEach(key => {
            const { c, ctx } = create();
            canvases[key] = c;
            contexts[key] = ctx;
        });

        // Main canvas is bound from component
    };

    const setMainCanvas = (canvasElement) => {
        if (!canvasElement) return;
        canvases.main = canvasElement;
        contexts.main = canvasElement.getContext('2d');
        drawComposition();
    };

    // --- Drawing Logic ---

    const drawGradient = () => {
        const { ctx, c } = { ctx: contexts.gradient, c: canvases.gradient };
        ctx.clearRect(0, 0, c.width, c.height);

        let gradient;
        const w = c.width;
        const h = c.height;

        if (state.bgGradient.type === 'linear') {
            const angle = (state.bgGradient.angle || 0) * Math.PI / 180;
            const length = Math.abs(w * Math.cos(angle)) + Math.abs(h * Math.sin(angle));
            const cx = w / 2;
            const cy = h / 2;
            const x1 = cx - (Math.cos(angle) * length) / 2;
            const y1 = cy - (Math.sin(angle) * length) / 2;
            const x2 = cx + (Math.cos(angle) * length) / 2;
            const y2 = cy + (Math.sin(angle) * length) / 2;

            gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        } else {
            // Radial
            gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 2);
        }

        state.bgGradient.stops.forEach(stop => {
            gradient.addColorStop(stop.offset / 100, stop.color);
        });

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    };

    const drawIconAtmosphere = async () => {
        const { ctx, c } = { ctx: contexts.bg, c: canvases.bg };
        ctx.clearRect(0, 0, c.width, c.height);

        if (!state.bgIconUrl) return;

        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const w = c.width;
                const h = c.height;

                // 1. Extract Average Color to fill background (Prevents white edges)
                // Draw image to 1x1 temp canvas
                const perfC = document.createElement('canvas');
                perfC.width = 1; perfC.height = 1;
                const perfCtx = perfC.getContext('2d');
                perfCtx.drawImage(img, 0, 0, 1, 1);
                const [r, g, b] = perfCtx.getImageData(0, 0, 1, 1).data;
                const avgColor = `rgb(${r},${g},${b})`;

                // Fill background with average color base
                ctx.fillStyle = avgColor;
                ctx.fillRect(0, 0, w, h);

                // 2. Draw Giant Diffused Layer (The "Gradient")
                // Draw the icon scaled massively (e.g. 2x coverage) to push colors to corners
                // We use 'cover' logic but multiplied
                const imgRatio = img.width / img.height;
                const canvasRatio = w / h;

                // Base dimensions to cover canvas
                let baseW, baseH;
                if (canvasRatio > imgRatio) {
                    baseW = w; baseH = w / imgRatio;
                } else {
                    baseH = h; baseW = h * imgRatio;
                }

                // Scale up factor for diffusion (Zoom)
                const zoom = 2.0;
                const drawW = baseW * zoom;
                const drawH = baseH * zoom;
                const drawX = (w - drawW) / 2;
                const drawY = (h - drawH) / 2;

                ctx.save();
                // High saturation for vibrant look
                ctx.filter = `blur(${state.bgBlur + 60}px) saturate(200%)`;
                ctx.globalAlpha = 0.8;
                ctx.drawImage(img, drawX, drawY, drawW, drawH);
                ctx.restore();

                // 3. Draw Central Color Anchor
                // Draws the icon smaller (but still blurred) to give structure to the gradient in the center
                // Using ~80% of canvas min dimension
                const centerSize = Math.min(w, h) * 0.8;
                let cW = centerSize; let cH = centerSize;
                if (imgRatio > 1) cH = cW / imgRatio;
                else cW = cH * imgRatio;

                const cX = (w - cW) / 2;
                const cY = (h - cH) / 2;

                ctx.save();
                ctx.filter = `blur(${state.bgBlur + 30}px) saturate(150%)`;
                ctx.globalAlpha = 0.6;
                ctx.drawImage(img, cX, cY, cW, cH);
                ctx.restore();

                resolve();
            };
            img.src = state.bgIconUrl;
        });
    };

    const drawBackground = async () => {
        const { ctx: bgCtx, c: bgCanvas } = { ctx: contexts.bg, c: canvases.bg };
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

        if (state.bgMode === 'solid') {
            bgCtx.fillStyle = state.bgColor;
            bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
        } else if (state.bgMode === 'gradient') {
            drawGradient();
            bgCtx.drawImage(canvases.gradient, 0, 0, bgCanvas.width, bgCanvas.height);
        } else if (state.bgMode === 'icon') {
            await drawIconAtmosphere();
            // If we have a BG image upload, maybe that overrides?
            // Keeping logic compatible with old 'bgImageUrl' if needed, or deprecating it for 'icon'
        } else if (state.bgImageUrl) {
            // Legacy Image Mode
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    // Contain/Cover logic
                    const scaleX = bgCanvas.width / img.width;
                    const scaleY = bgCanvas.height / img.height;
                    const scale = Math.max(scaleX, scaleY);
                    const width = img.width * scale;
                    const height = img.height * scale;
                    const x = (bgCanvas.width - width) / 2;
                    const y = (bgCanvas.height - height) / 2;

                    bgCtx.filter = `blur(${state.bgBlur}px)`;
                    bgCtx.drawImage(img, x, y, width, height);
                    bgCtx.filter = 'none';
                    resolve();
                };
                img.src = state.bgImageUrl;
            });
        }
    };

    const drawNoise = (ctx, w, h, opacity) => {
        if (opacity <= 0) return;
        const imageData = ctx.getImageData(0, 0, w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * opacity * 255;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const drawGlass = () => {
        const { ctx, c } = { ctx: contexts.glass, c: canvases.glass };
        ctx.clearRect(0, 0, c.width, c.height);

        if (!state.glassEnabled) return;

        // Tint
        ctx.fillStyle = state.glassTintColor;
        ctx.globalAlpha = state.glassOpacity / 100;
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.globalAlpha = 1.0;

        // Noise
        if (state.glassNoise > 0) {
            // Draw noise on a temp canvas or directly if we had content.
            // Since glass canvas only has tint now, noise on simple flat color is just static.
            // We can draw static directly.
            // Optimization: Create a noise pattern once? For now dynamic is fine.
            drawNoise(ctx, c.width, c.height, state.glassNoise / 500); // Scale down 0-100 to 0-0.2
        }
    };

    const getHtmlFontStyles = () => {
        const htmlElement = document.documentElement;
        const computedStyle = getComputedStyle(htmlElement);
        return { fontFamily: computedStyle.fontFamily };
    };

    const drawText = () => {
        const { ctx, c } = { ctx: contexts.text, c: canvases.text };
        ctx.clearRect(0, 0, c.width, c.height);
        const { fontFamily } = getHtmlFontStyles();
        const font = state.selectedFont ? `${state.selectedFont}, ${fontFamily}` : fontFamily;
        ctx.font = `600 ${state.textSize}px ${font}`;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Text Fill Style (Solid or Gradient)
        if (state.textMode === 'gradient') {
            const lines = state.text.split('\n');
            const lineHeight = state.textSize * state.lineHeight;
            const totalHeight = lineHeight * lines.length;
            const startY = (c.height - totalHeight) / 2;
            const endY = startY + totalHeight;

            // Create Gradient based on text area or canvas? 
            // Usually text gradient is relative to the text bounding box, but canvas global gradient is easier for now
            // Let's make it relative to canvas width/header to keep it simple, or approximate text block.

            // Better: Gradient relative to Text Block
            const w = c.width;
            const h = c.height; // Use canvas size for simplicity or...
            // Standard linear gradient logic reused from bgGradient but mapped to text bounds would be ideal.
            // For now, let's just reuse the generic context gradient generator logic but applied to text fill.

            let gradient;
            const angle = (state.textGradient.angle || 0) * Math.PI / 180;
            // Calculate gradient vector across the canvas (or text area)
            // Using canvas dimensions allows the gradient to "flow" across the text properly
            const len = Math.abs(w * Math.cos(angle)) + Math.abs(h * Math.sin(angle));
            const cx = w / 2;
            const cy = h / 2;
            const x1 = cx - (Math.cos(angle) * len) / 2;
            const y1 = cy - (Math.sin(angle) * len) / 2;
            const x2 = cx + (Math.cos(angle) * len) / 2;
            const y2 = cy + (Math.sin(angle) * len) / 2;

            gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            state.textGradient.stops.forEach(stop => {
                gradient.addColorStop(stop.offset / 100, stop.color);
            });
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = state.textColor;
        }

        if (state.text3D > 0) {
            ctx.shadowColor = 'rgba(0, 0, 0, .4)';
            ctx.shadowBlur = state.text3D * 0.5;
            ctx.shadowOffsetX = state.text3D;
            ctx.shadowOffsetY = state.text3D;
        } else {
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        const lines = state.text.split('\n');
        const lineHeight = state.textSize * state.lineHeight;
        const totalHeight = lineHeight * lines.length;
        const startY = (c.height - totalHeight) / 2 + lineHeight / 2;

        lines.forEach((line, index) => {
            const y = startY + index * lineHeight;
            ctx.fillText(line, c.width / 2, y);
        });
    };

    const drawWatermark = () => {
        const { ctx, c } = { ctx: contexts.watermark, c: canvases.watermark };
        ctx.clearRect(0, 0, c.width, c.height);
        const { fontFamily } = getHtmlFontStyles();
        const font = state.selectedFont ? `${state.selectedFont}, ${fontFamily}` : fontFamily;
        ctx.font = `italic 14px ${font}`;
        ctx.fillStyle = state.watermarkColor;
        ctx.textAlign = 'right';
        ctx.fillText(state.watermark, c.width - 20, c.height - 20);
    };

    // Ported from legacy script.js
    const drawSquareImage = () => {
        const { ctx: squareCtx, c: squareCanvas } = { ctx: contexts.square, c: canvases.square };
        squareCtx.clearRect(0, 0, squareCanvas.width, squareCanvas.height);

        if (!state.squareImageUrl) return;

        const squareImg = new Image();
        squareImg.onload = () => {
            const totalSize = Number(state.squareSize);
            const borderWidth = 20;
            const size = totalSize - 2 * borderWidth;
            const x = (squareCanvas.width - totalSize) / 2;
            const y = (squareCanvas.height - totalSize) / 2;
            const radius = 30;

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = totalSize;
            tempCanvas.height = totalSize;
            const tempCtx = tempCanvas.getContext('2d');

            // Icon Background (Shape)
            if (state.iconBgSize > 0) {
                const bgPadding = Number(state.iconBgSize);
                tempCtx.fillStyle = state.iconColor;
                // ... (Keep existing rounded rect logic or simplify) ...
                // Simplification for brevity, assume rounded rect draw:
                tempCtx.beginPath();
                tempCtx.roundRect(
                    borderWidth - bgPadding,
                    borderWidth - bgPadding,
                    size + bgPadding * 2,
                    size + bgPadding * 2,
                    radius
                );
                tempCtx.fill();
            }

            // Clip for Image
            tempCtx.save();
            tempCtx.beginPath();
            tempCtx.roundRect(borderWidth, borderWidth, size, size, radius);
            tempCtx.closePath();
            tempCtx.clip();

            // Draw Image Centered/Cover
            const imgAspectRatio = squareImg.width / squareImg.height;
            const containerAspectRatio = 1;
            let tempW, tempH;
            if (imgAspectRatio > containerAspectRatio) {
                tempH = size; tempW = size * imgAspectRatio;
            } else {
                tempW = size; tempH = size / imgAspectRatio;
            }

            // Center
            const ox = (size - tempW) / 2;
            const oy = (size - tempH) / 2;

            tempCtx.drawImage(squareImg, borderWidth + ox, borderWidth + oy, tempW, tempH);
            tempCtx.restore();

            // Main Draw with Transformations
            squareCtx.save();
            squareCtx.shadowColor = state.shadowColor;
            squareCtx.shadowBlur = state.shadowBlur || (state.shadowStrength * 2);
            squareCtx.shadowOffsetX = state.shadowOffsetX || 0;
            squareCtx.shadowOffsetY = state.shadowOffsetY || 0;

            squareCtx.translate(x + totalSize / 2, y + totalSize / 2);
            squareCtx.rotate(state.rotation * Math.PI / 180);
            squareCtx.translate(-(x + totalSize / 2), -(y + totalSize / 2));

            squareCtx.drawImage(tempCanvas, x, y, totalSize, totalSize);
            squareCtx.restore();

            drawComposition();
        };
        // Handle data URL vs external URL
        squareImg.src = state.squareImageUrl;
    };

    const drawComposition = async () => {
        if (!contexts.main) return;
        const ctx = contexts.main;
        const { width, height } = canvases.main;

        ctx.clearRect(0, 0, width, height);

        // 1. Draw Background
        await drawBackground();
        ctx.drawImage(canvases.bg, 0, 0);

        // 2. Glass Effect (If enabled)
        if (state.glassEnabled) {
            // A. Draw what we have so far (Background) into a temp, blur the main canvas?
            // Canvas API filter is easiest if supported:
            // ctx.filter = `blur(${state.glassBlur}px)`;
            // ctx.drawImage(canvases.bg, 0, 0); // Redraw BG blurred?
            // ctx.filter = 'none';

            // Correct way for glass OVER background:
            // We want the background *behind* the glass to be blurred.
            // So redrawing the Background Canvas with a blur filter on top of the sharp one?
            // Or just rendering the BG as blurred initially if glass covers everything?
            // Assuming Glass covers entire card:

            if (state.glassBlur > 0) {
                const tempC = document.createElement('canvas');
                tempC.width = width; tempC.height = height;
                const tempCtx = tempC.getContext('2d');

                // Logic: Draw main BG -> Filter -> Draw back
                // Saturation boost
                const sat = state.glassSaturation || 100;
                tempCtx.filter = `blur(${state.glassBlur}px) saturate(${sat}%)`;
                tempCtx.drawImage(canvases.bg, 0, 0, width, height);

                ctx.drawImage(tempC, 0, 0);
            }

            // Glass Tint & Noise
            drawGlass();
            ctx.drawImage(canvases.glass, 0, 0, width, height);
        }

        // 3. Draw Content
        drawText();
        ctx.drawImage(canvases.text, 0, 0, width, height);

        // 4. Draw Logo/Icon
        // Note: If Square Image logic isn't async-waiting inside `drawSquareImage` (it loads image),
        // it triggers `drawComposition` again when loaded.
        // For this pass, we just draw the canvas if it has content.
        ctx.drawImage(canvases.square, 0, 0, width, height);

        // 5. Draw Watermark
        if (state.showWatermark) {
            drawWatermark();
            ctx.drawImage(canvases.watermark, 0, 0, width, height);
        }
    };

    // Resize helper
    const resizeCanvas = (w, h) => {
        state.canvasWidth = w;
        state.canvasHeight = h;
        initCanvases(w, h); // Re-init offscreens
        if (canvases.main) {
            canvases.main.width = w;
            canvases.main.height = h;
            // contexts.main = canvases.main.getContext('2d'); // Context persists?
        }

        // Smart Text Sizing logic based on preset
        if (w === 1000 && h === 500) {
            state.textSize = 150;
        } else if (w === 730 && h === 310) {
            state.textSize = 100;
        }

        triggerUpdate();
    };

    // Helpers
    const triggerUpdate = () => {
        // Debounce or just call
        drawComposition();
    };

    // Watch all simple properties that require redraw
    watch(
        () => [
            state.bgMode, state.bgColor, state.bgBlur,
            state.glassEnabled, state.glassBlur, state.glassOpacity, state.glassTintColor,
            state.glassNoise, state.glassSaturation,
            state.textMode, state.textColor, state.textSize, state.lineHeight, state.text3D, state.selectedFont, state.text,
            state.showWatermark, state.watermark, state.watermarkColor,
            state.bgGradient, state.textGradient // Deep watch needed?
        ],
        () => {
            triggerUpdate();
        },
        { deep: true }
    );

    // Icon/Image specific updates potentially need custom logic
    watch(() => [state.squareImageUrl, state.squareSize, state.rotation, state.shadowStrength, state.shadowColor, state.iconBgSize, state.iconColor], () => {
        drawSquareImage();
    });

    return {
        state,
        setMainCanvas,
        initCanvases,
        triggerUpdate,
        drawComposition,
        resizeCanvas
    };
}
