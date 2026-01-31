/* =====================================================
   AUDIO SYSTEM - Web Audio API Sound Synthesis
   ===================================================== */

class AudioManager {
    constructor() {
        this.context = null;
        this.isMuted = false;
        this.volume = 0.5;
        this.initialized = false;
    }

    // Initialize audio context on first user interaction
    async init() {
        if (this.initialized) return;

        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // Master volume control
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
    }

    // Mute toggle
    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }

    // Create a gain node with volume
    createGain() {
        if (!this.context) return null;
        const gain = this.context.createGain();
        gain.gain.value = this.isMuted ? 0 : this.volume;
        gain.connect(this.context.destination);
        return gain;
    }

    // Generate page flip sound
    playPageFlip() {
        if (!this.context || this.isMuted) return;

        const now = this.context.currentTime;
        const duration = 0.25;

        // Create noise buffer for paper-like sound
        const bufferSize = this.context.sampleRate * duration;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate filtered noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        // Create buffer source
        const source = this.context.createBufferSource();
        source.buffer = buffer;

        // Create filter for paper-like texture
        const filter = this.context.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        filter.Q.value = 1;

        // Create envelope gain
        const gainNode = this.context.createGain();
        gainNode.gain.setValueAtTime(this.volume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Connect nodes
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.context.destination);

        // Play
        source.start(now);
        source.stop(now + duration);

        // Add a subtle whoosh
        this.playWhoosh(0.15);
    }

    // Generate whoosh/air movement sound
    playWhoosh(volumeMultiplier = 1) {
        if (!this.context || this.isMuted) return;

        const now = this.context.currentTime;
        const duration = 0.3;

        // Create oscillator for base tone
        const osc = this.context.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + duration);

        // Create filter
        const filter = this.context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + duration);

        // Create gain envelope
        const gainNode = this.context.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.1 * volumeMultiplier, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Connect
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.context.destination);

        // Play
        osc.start(now);
        osc.stop(now + duration);
    }

    // Generate book opening sound
    playBookOpen() {
        if (!this.context || this.isMuted) return;

        const now = this.context.currentTime;

        // Creak sound
        this.playCreak(now, 0.4);

        // Delayed page rustle
        setTimeout(() => this.playPageFlip(), 200);
        setTimeout(() => this.playPageFlip(), 350);
    }

    // Generate book closing sound
    playBookClose() {
        if (!this.context || this.isMuted) return;

        const now = this.context.currentTime;

        // Soft thud
        this.playThud(now);

        // Quick page rustle before
        this.playPageFlip();
    }

    // Creak sound for book spine
    playCreak(startTime, duration = 0.3) {
        if (!this.context) return;

        const now = startTime || this.context.currentTime;

        // FM synthesis for creak
        const carrier = this.context.createOscillator();
        const modulator = this.context.createOscillator();
        const modGain = this.context.createGain();
        const outputGain = this.context.createGain();

        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(80, now);
        carrier.frequency.exponentialRampToValueAtTime(40, now + duration);

        modulator.type = 'sine';
        modulator.frequency.setValueAtTime(15, now);
        modulator.frequency.linearRampToValueAtTime(5, now + duration);

        modGain.gain.value = 30;

        outputGain.gain.setValueAtTime(0, now);
        outputGain.gain.linearRampToValueAtTime(this.volume * 0.15, now + 0.1);
        outputGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
        carrier.connect(outputGain);
        outputGain.connect(this.context.destination);

        modulator.start(now);
        carrier.start(now);
        modulator.stop(now + duration);
        carrier.stop(now + duration);
    }

    // Soft thud for book closing
    playThud(startTime) {
        if (!this.context) return;

        const now = startTime || this.context.currentTime;
        const duration = 0.15;

        const osc = this.context.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + duration);

        const gainNode = this.context.createGain();
        gainNode.gain.setValueAtTime(this.volume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Add compression for punch
        const compressor = this.context.createDynamicsCompressor();
        compressor.threshold.value = -20;
        compressor.knee.value = 10;
        compressor.ratio.value = 12;
        compressor.attack.value = 0;
        compressor.release.value = 0.1;

        osc.connect(compressor);
        compressor.connect(gainNode);
        gainNode.connect(this.context.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    // Hover sound - very subtle paper touch
    playHover() {
        if (!this.context || this.isMuted) return;

        const now = this.context.currentTime;
        const duration = 0.08;

        const bufferSize = this.context.sampleRate * duration;
        const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
        }

        const source = this.context.createBufferSource();
        source.buffer = buffer;

        const filter = this.context.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;

        const gainNode = this.context.createGain();
        gainNode.gain.value = this.volume * 0.05;

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.context.destination);

        source.start(now);
    }
}

// Export singleton instance
const audioManager = new AudioManager();
