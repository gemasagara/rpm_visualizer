const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');

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
    rpm: 1000,
    maxRpm: 5000,
    radius: 120,
    indicatorLength: 30,
    rotation: 0,
    clockwise: true,
    arc: 360,
    running: false
};

// Sync controls
rpmSlider.addEventListener('input', (e) => {
    state.rpm = parseInt(e.target.value);
    rpmInput.value = state.rpm;
});

rpmInput.addEventListener('input', (e) => {
    state.rpm = parseInt(e.target.value) || 0;
    rpmSlider.value = state.rpm;
});

rpmPlusBtn.addEventListener('click', () => {
    state.maxRpm += 500;
    rpmSlider.max = state.maxRpm;
    rpmInput.max = state.maxRpm;
    maxRpmDisplay.textContent = state.maxRpm;
});

rpmMinusBtn.addEventListener('click', () => {
    if (state.maxRpm > 100) {
        state.maxRpm -= 500;
        rpmSlider.max = state.maxRpm;
        rpmInput.max = state.maxRpm;
        maxRpmDisplay.textContent = state.maxRpm;
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
    startBtn.style.backgroundColor = '#000';
    startBtn.style.color = '#fff';
    stopBtn.style.backgroundColor = '#fff';
    stopBtn.style.color = '#000';
});

stopBtn.addEventListener('click', () => {
    state.running = false;
    stopBtn.style.backgroundColor = '#000';
    stopBtn.style.color = '#fff';
    startBtn.style.backgroundColor = '#fff';
    startBtn.style.color = '#000';
});

resetBtn.addEventListener('click', () => {
    state.rotation = 0;
    state.rpm = 0;
    state.running = false;
    state.arc = 360;
    rpmSlider.value = 0;
    rpmInput.value = 0;
    arcSlider.value = 360;
    arcInput.value = 360;
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
