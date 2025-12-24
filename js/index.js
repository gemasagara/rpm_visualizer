const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const controlsPanel = document.querySelector('.controls');
const resizeHandle = document.querySelector('.resize-handle');

// Stopwatch state
let stopwatchState = {
    elapsedMs: 0,
    isRunning: false,
    lastStartTime: 0
};

// Resize functionality
let isResizing = false;

resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;

    const container = document.querySelector('.container');
    const newWidth = container.getBoundingClientRect().right - e.clientX;
    
    // Set minimum and maximum width constraints
    const minWidth = 200;
    const maxWidth = window.innerWidth * 0.7;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
        controlsPanel.style.width = newWidth + 'px';
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
});

// Elements
const rpmSlider = document.getElementById('rpmSlider');
const rpmInput = document.getElementById('rpmInput');
const radiusSlider = document.getElementById('radiusSlider');
const radiusInput = document.getElementById('radiusInput');
const indicatorLengthSlider = document.getElementById('indicatorLengthSlider');
const indicatorLengthInput = document.getElementById('indicatorLengthInput');
const rpmPlusBtn = document.getElementById('rpmPlusBtn');
const rpmMinusBtn = document.getElementById('rpmMinusBtn');
const maxRpmDisplay = document.getElementById('maxRpmDisplay');
const arcSlider = document.getElementById('arcSlider');
const arcInput = document.getElementById('arcInput');
const directionClockwise = document.getElementById('directionClockwise');
const directionCounterClockwise = document.getElementById('directionCounterClockwise');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

// State
let state = {
    rpm: 100,
    maxRpm: 5000,
    radius: 120,
    indicatorLength: 30,
    rotation: 0,
    clockwise: true,
    arc: 360,
    running: false
};

// Utility function to set RPM with proper validation and synchronization
function setRPM(value) {
    // Parse to number and ensure it's valid
    let newRpm = parseInt(value) || 0;
    
    // Clamp RPM between min (0) and max (state.maxRpm)
    newRpm = Math.max(0, Math.min(newRpm, state.maxRpm));
    
    // Only update if value actually changed
    if (newRpm !== state.rpm) {
        state.rpm = newRpm;
        
        // Synchronize both slider and input
        rpmSlider.value = state.rpm;
        rpmInput.value = state.rpm;
    }
}

// Utility function to set max RPM with proper validation
function setMaxRPM(newValue) {
    let newMaxRpm = newValue;
    
    // Enforce minimum of 100
    if (newMaxRpm < 100) {
        newMaxRpm = 100;
    }
    
    if (newMaxRpm !== state.maxRpm) {
        state.maxRpm = newMaxRpm;
        
        // Update slider and input constraints
        rpmSlider.max = state.maxRpm;
        rpmInput.max = state.maxRpm;
        maxRpmDisplay.textContent = state.maxRpm;
        
        // If current RPM exceeds new max, clamp it
        if (state.rpm > state.maxRpm) {
            setRPM(state.maxRpm);
        }
    }
}

// Utility function to format stopwatch time
function formatStopwatch(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(centiseconds).padStart(2, '0')}`;
}

// Utility function to update stopwatch state
function updateStopwatchState() {
    if (stopwatchState.isRunning) {
        const now = performance.now();
        const elapsedSinceStart = now - stopwatchState.lastStartTime;
        stopwatchState.elapsedMs += elapsedSinceStart;
        stopwatchState.lastStartTime = now;
    }
}

// Sync controls - slider input
rpmSlider.addEventListener('input', (e) => {
    setRPM(e.target.value);
});

// Sync controls - number input
rpmInput.addEventListener('input', (e) => {
    setRPM(e.target.value);
});

// RPM max adjustment buttons
rpmPlusBtn.addEventListener('click', () => {
    // Special case: if at 100, increase by 400 to reach 500
    if (state.maxRpm === 100) {
        setMaxRPM(500);
    } else {
        setMaxRPM(state.maxRpm + 500);
    }
});

rpmMinusBtn.addEventListener('click', () => {
    // Only decrease if above 100
    if (state.maxRpm > 100) {
        setMaxRPM(state.maxRpm - 500);
    }
});

arcSlider.addEventListener('input', (e) => {
    state.arc = parseInt(e.target.value);
    arcInput.value = state.arc;
});

arcInput.addEventListener('input', (e) => {
    state.arc = parseInt(e.target.value) || 0;
    arcSlider.value = state.arc;
});

directionClockwise.addEventListener('click', () => {
    state.clockwise = true;
    directionClockwise.classList.add('active');
    directionCounterClockwise.classList.remove('active');
});

directionCounterClockwise.addEventListener('click', () => {
    state.clockwise = false;
    directionCounterClockwise.classList.add('active');
    directionClockwise.classList.remove('active');
});

startBtn.addEventListener('click', () => {
    state.running = true;
    stopwatchState.isRunning = true;
    stopwatchState.lastStartTime = performance.now();
    startBtn.style.backgroundColor = '#000';
    startBtn.style.color = '#fff';
    stopBtn.style.backgroundColor = '#fff';
    stopBtn.style.color = '#000';
});

stopBtn.addEventListener('click', () => {
    state.running = false;
    stopwatchState.isRunning = false;
    stopBtn.style.backgroundColor = '#000';
    stopBtn.style.color = '#fff';
    startBtn.style.backgroundColor = '#fff';
    startBtn.style.color = '#000';
});

resetBtn.addEventListener('click', () => {
    state.rotation = 0;
    setRPM(100);
    state.running = false;
    state.arc = 360;
    arcSlider.value = 360;
    arcInput.value = 360;
    stopwatchState.elapsedMs = 0;
    stopwatchState.isRunning = false;
    startBtn.style.backgroundColor = '#fff';
    startBtn.style.color = '#000';
    stopBtn.style.backgroundColor = '#000';
    stopBtn.style.color = '#fff';
});

radiusSlider.addEventListener('input', (e) => {
    state.radius = parseInt(e.target.value);
    radiusInput.value = state.radius;
});

radiusInput.addEventListener('input', (e) => {
    state.radius = parseInt(e.target.value) || 40;
    radiusSlider.value = state.radius;
});

indicatorLengthSlider.addEventListener('input', (e) => {
    state.indicatorLength = parseInt(e.target.value);
    indicatorLengthInput.value = state.indicatorLength;
});

indicatorLengthInput.addEventListener('input', (e) => {
    state.indicatorLength = parseInt(e.target.value) || 10;
    indicatorLengthSlider.value = state.indicatorLength;
});

// Timing for accurate RPM calculation
let lastFrameTime = performance.now();

// Animation loop
function animate(currentTime) {
    // Calculate delta time in seconds
    const deltaTime = (currentTime - lastFrameTime) / 1000;
    lastFrameTime = currentTime;

    // Update stopwatch state
    updateStopwatchState();

    // Update rotation based on RPM only if running
    if (state.running) {
        // RPM = rotations per minute
        // 1 rotation = 2π radians
        // rotations per second = RPM / 60
        // radians per second = (RPM / 60) * 2π
        const radiansPerSecond = (state.rpm / 60) * (2 * Math.PI);
        state.rotation += (state.clockwise ? 1 : -1) * radiansPerSecond * deltaTime;
    }

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stopwatch at top center
    const stopwatchText = formatStopwatch(stopwatchState.elapsedMs);
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(stopwatchText, canvas.width / 2, 20);

    // Draw circle arc
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const arcRad = (state.arc / 360) * (2 * Math.PI);
    const startAngle = Math.PI / 2 + state.rotation; // Start at bottom (180 degrees from top), rotated
    const endAngle = startAngle + arcRad;
    ctx.arc(centerX, centerY, state.radius, startAngle, endAngle);
    ctx.stroke();

    // Draw center dot
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Draw indicator flag
    ctx.save();
    ctx.translate(centerX, centerY);
    // Position flag at center of arc: (arc/2) degrees from south (180 degrees rotated)
    const arcOffset = (state.arc / 2) * (Math.PI / 180);
    ctx.rotate(state.rotation + Math.PI / 2 + arcOffset);
    
    // Draw pole
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(state.radius, 0);
    ctx.lineTo(state.radius + state.indicatorLength, 0);
    ctx.stroke();
    
    // Draw flag triangle with flat side parallel to the line
    const flagX = state.radius + state.indicatorLength;
    const flagTipOffset = state.clockwise ? 15 : -15; // Flip direction based on rotation direction
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(flagX - 10, 0);  // left base on the line
    ctx.lineTo(flagX + 10, 0);  // right base on the line
    ctx.lineTo(flagX, flagTipOffset);      // tip pointing outward or inward
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();

    requestAnimationFrame(animate);
}

animate();
