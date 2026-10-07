(() => {
    const themes = {
        jungle: {
            root: 50,
            scale: [0, 3, 5, 7, 10, 12],
            chords: [0, 3, 5, 0, 5, 3, 0, 7],
            melody: [0, null, 2, 3, null, 2, 4, null, 3, null, 2, 0, null, 4, 3, null],
            waveform: 'triangle',
            ambience: 'jungle',
            percussion: 'wood'
        },
        island: {
            root: 57,
            scale: [0, 2, 4, 7, 9, 12],
            chords: [0, 4, 5, 3, 0, 5, 4, 0],
            melody: [0, null, 2, null, 4, 2, null, 1, 3, null, 4, null, 2, 1, null, 0],
            waveform: 'sine',
            ambience: 'ocean',
            percussion: 'water'
        },
        grassland: {
            root: 53,
            scale: [0, 2, 4, 6, 7, 9, 12],
            chords: [0, 4, 2, 5, 0, 5, 4, 2],
            melody: [0, null, 3, 4, null, 2, 1, null, 4, null, 5, 3, null, 2, 1, null],
            waveform: 'sine',
            ambience: 'wind',
            percussion: 'seed'
        }
    };

    const labels = { jungle: '叢林', island: '海島', grassland: '草原' };
    const bpm = 86;
    const beatSeconds = 60 / bpm;
    const phraseBeats = 128;
    const phraseSeconds = beatSeconds * phraseBeats;
    let context;
    let master;
    let currentTheme = 'jungle';
    let enabled = true;
    let volume = 0.42;
    let playing = false;
    let loopTimer;
    let activeSources = [];
    let noiseBuffer;
    let playbackToken = 0;

    function getContext() {
        if (context) return context;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return null;
        context = new AudioContextClass();
        master = context.createGain();
        master.gain.value = 0;
        master.connect(context.destination);
        noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
        const channel = noiseBuffer.getChannelData(0);
        for (let index = 0; index < channel.length; index++) channel[index] = Math.random() * 2 - 1;
        return context;
    }

    function midiFrequency(note) {
        return 440 * (2 ** ((note - 69) / 12));
    }

    function keepSource(source) {
        activeSources.push(source);
        source.onended = () => {
            activeSources = activeSources.filter(active => active !== source);
            try { source.disconnect(); } catch {}
        };
    }

    function playTone(note, at, duration, options = {}) {
        const audio = getContext();
        if (!audio) return;
        const oscillator = audio.createOscillator();
        const envelope = audio.createGain();
        const filter = audio.createBiquadFilter();
        oscillator.type = options.wave || 'sine';
        oscillator.frequency.setValueAtTime(midiFrequency(note), at);
        if (options.detune) oscillator.detune.value = options.detune;
        filter.type = options.filterType || 'lowpass';
        filter.frequency.setValueAtTime(options.cutoff || 2200, at);
        filter.Q.value = options.q || 0.7;
        const peak = options.volume || 0.035;
        const attack = options.attack || 0.08;
        envelope.gain.setValueAtTime(0.0001, at);
        envelope.gain.linearRampToValueAtTime(peak, at + attack);
        envelope.gain.exponentialRampToValueAtTime(Math.max(0.0001, peak * (options.sustain || 0.42)), at + Math.max(attack + 0.02, duration * 0.55));
        envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
        oscillator.connect(filter);
        filter.connect(envelope);
        envelope.connect(master);
        oscillator.start(at);
        oscillator.stop(at + duration + 0.03);
        keepSource(oscillator);
    }

    function playPad(note, at, duration) {
        playTone(note, at, duration, { wave: 'sine', volume: 0.014, attack: 0.8, sustain: 0.62, cutoff: 900 });
        playTone(note + 12, at + 0.03, duration * 0.9, { wave: 'triangle', volume: 0.006, attack: 1.1, sustain: 0.45, cutoff: 1300, detune: -4 });
    }

    function playNoise(at, duration, theme, gainValue) {
        const audio = getContext();
        if (!audio) return;
        const source = audio.createBufferSource();
        const filter = audio.createBiquadFilter();
        const envelope = audio.createGain();
        source.buffer = noiseBuffer;
        source.loop = true;
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(theme === 'ocean' ? 420 : theme === 'wind' ? 240 : 1800, at);
        filter.Q.value = theme === 'jungle' ? 0.6 : 0.25;
        envelope.gain.setValueAtTime(0.0001, at);
        envelope.gain.linearRampToValueAtTime(gainValue, at + Math.min(2, duration / 4));
        envelope.gain.setValueAtTime(gainValue, at + duration - 2);
        envelope.gain.linearRampToValueAtTime(0.0001, at + duration);
        source.connect(filter);
        filter.connect(envelope);
        envelope.connect(master);
        source.start(at);
        source.stop(at + duration + 0.02);
        keepSource(source);
    }

    function playPercussion(at, theme, volume) {
        const audio = getContext();
        if (!audio) return;
        const source = audio.createBufferSource();
        const filter = audio.createBiquadFilter();
        const envelope = audio.createGain();
        source.buffer = noiseBuffer;
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(theme === 'wood' ? 380 : theme === 'water' ? 1500 : 2600, at);
        filter.Q.value = 0.8;
        envelope.gain.setValueAtTime(volume, at);
        envelope.gain.exponentialRampToValueAtTime(0.0001, at + (theme === 'wood' ? 0.2 : 0.12));
        source.connect(filter);
        filter.connect(envelope);
        envelope.connect(master);
        source.start(at);
        source.stop(at + 0.24);
        keepSource(source);
    }

    function schedulePhrase() {
        const audio = getContext();
        if (!audio || !playing || !enabled) return;
        const startAt = audio.currentTime + 0.12;
        const theme = themes[currentTheme] || themes.jungle;
        const barSeconds = beatSeconds * 4;
        const ambientType = theme.ambience;
        playNoise(startAt, phraseSeconds, ambientType, ambientType === 'ocean' ? 0.013 : 0.008);

        for (let bar = 0; bar < 32; bar++) {
            const barAt = startAt + bar * barSeconds;
            const chordOffset = theme.chords[bar % theme.chords.length];
            const chordRoot = theme.root + chordOffset;
            playPad(chordRoot, barAt, barSeconds * 3.8);
            playPad(chordRoot + theme.scale[2], barAt + 0.05, barSeconds * 3.3);
            playPad(chordRoot + theme.scale[4], barAt + 0.1, barSeconds * 3.1);
            playTone(theme.root - 12 + chordOffset, barAt, barSeconds * 0.9, { wave: 'sine', volume: 0.027, attack: 0.18, sustain: 0.22, cutoff: 420 });

            for (let beat = 0; beat < 4; beat++) {
                const absoluteBeat = bar * 4 + beat;
                const motifIndex = absoluteBeat % theme.melody.length;
                const melodyIndex = theme.melody[motifIndex];
                const beatAt = barAt + beat * beatSeconds;
                if (melodyIndex !== null && (bar % 2 === 0 || beat % 2 === 0)) {
                    const note = theme.root + 12 + theme.scale[melodyIndex];
                    playTone(note, beatAt, beatSeconds * 1.25, {
                        wave: theme.waveform,
                        volume: currentTheme === 'island' ? 0.039 : 0.028,
                        attack: currentTheme === 'island' ? 0.018 : 0.12,
                        sustain: 0.12,
                        cutoff: currentTheme === 'jungle' ? 1700 : 2600
                    });
                }
                if (beat === 0 && bar % 2 === 0) playPercussion(beatAt, theme.percussion, 0.025);
                if (beat === 2 && bar % 4 === 2) playPercussion(beatAt, theme.percussion, 0.015);
                if (currentTheme === 'island' && beat === 3 && bar % 2 === 1) {
                    playTone(theme.root + 24 + theme.scale[(bar + 2) % theme.scale.length], beatAt, 0.7, { wave: 'sine', volume: 0.012, attack: 0.02, sustain: 0.08, cutoff: 3600 });
                }
            }
        }
        loopTimer = window.setTimeout(() => {
            if (playing && enabled) schedulePhrase();
        }, phraseSeconds * 1000);
    }

    function stop(fadeSeconds = 0.45) {
        playbackToken++;
        playing = false;
        window.clearTimeout(loopTimer);
        if (!context || !master) return;
        const now = context.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setTargetAtTime(0.0001, now, Math.max(0.03, fadeSeconds / 4));
        const sources = [...activeSources];
        window.setTimeout(() => {
            sources.forEach(source => {
                try { source.stop(); } catch {}
                try { source.disconnect(); } catch {}
            });
            activeSources = activeSources.filter(source => !sources.includes(source));
        }, fadeSeconds * 1000 + 80);
    }

    async function start(theme = currentTheme) {
        currentTheme = themes[theme] ? theme : 'jungle';
        stop(0.12);
        if (!enabled) return;
        const requestToken = ++playbackToken;
        const audio = getContext();
        if (!audio) return;
        try { await audio.resume(); } catch { return; }
        if (!enabled || requestToken !== playbackToken) return;
        playing = true;
        const now = audio.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setValueAtTime(0.0001, now);
        master.gain.linearRampToValueAtTime(volume * 0.75, now + 1.8);
        schedulePhrase();
    }

    async function unlock() {
        const audio = getContext();
        if (!audio) return;
        try { await audio.resume(); } catch {}
    }

    function setEnabled(value) {
        enabled = Boolean(value);
        if (!enabled) stop();
    }

    function setVolume(value) {
        volume = Math.max(0, Math.min(1, Number(value) || 0));
        if (context && master && playing) {
            master.gain.setTargetAtTime(volume * 0.75, context.currentTime, 0.08);
        }
    }

    function setTheme(value) {
        if (themes[value]) currentTheme = value;
    }

    function getState() {
        return { theme: currentTheme, label: labels[currentTheme], enabled, playing, volume, durationSeconds: phraseSeconds };
    }

    window.menuMusic = { start, stop, unlock, setEnabled, setVolume, setTheme, getState, labels };
})();
