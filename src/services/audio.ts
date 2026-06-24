export class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private musicVolume = 0.5;
  private sfxVolume = 0.7;
  private musicEnabled = true;
  private sfxEnabled = true;
  private currentMusic: HTMLAudioElement | null = null;

  constructor() {
    this.loadSounds();
  }

  private loadSounds() {
    // 使用 Web Audio API 生成简单音效
    // 避免依赖外部音频文件
  }

  private audioCtx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioCtx;
  }

  // 播放音效
  playSfx(type: 'click' | 'pop' | 'coin' | 'complete' | 'tap' | 'evolution' | 'send' | 'unlock' | 'ambient') {
    if (!this.sfxEnabled && type !== 'ambient') return;
    const ctx = this.getCtx();
    const now = ctx.currentTime;

    switch (type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 800; osc.type = 'sine';
        gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now); osc.stop(now + 0.1);
        break;
      }
      case 'pop': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        osc.type = 'sine';
        gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now); osc.stop(now + 0.15);
        break;
      }
      case 'coin': {
        [1000, 1200, 1500].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq; osc.type = 'sine';
          gain.gain.setValueAtTime(this.sfxVolume * 0.15, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.06 + 0.12);
          osc.start(now + i * 0.06); osc.stop(now + i * 0.06 + 0.12);
        });
        break;
      }
      case 'complete': {
        [523, 659, 784, 1047].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq; osc.type = 'sine';
          gain.gain.setValueAtTime(this.sfxVolume * 0.2, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.25);
          osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.25);
        });
        break;
      }
      case 'tap': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 700; osc.type = 'sine';
        gain.gain.setValueAtTime(this.sfxVolume * 0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
        osc.start(now); osc.stop(now + 0.06);
        break;
      }
      case 'evolution': {
        // 进化庆祝音效 — 上行琶音 + 钟声
        [392, 523, 659, 784, 1047, 1318].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq; osc.type = i >= 4 ? 'triangle' : 'sine';
          gain.gain.setValueAtTime(this.sfxVolume * 0.25, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.4);
          osc.start(now + i * 0.12); osc.stop(now + i * 0.12 + 0.4);
        });
        // 低频鼓点
        const drum = ctx.createOscillator();
        const drumGain = ctx.createGain();
        drum.connect(drumGain); drumGain.connect(ctx.destination);
        drum.frequency.value = 80; drum.type = 'triangle';
        drumGain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        drumGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        drum.start(now); drum.stop(now + 0.3);
        break;
      }
      case 'send': {
        // 发送消息音效 — 轻柔上升
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        osc.type = 'sine';
        gain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
        break;
      }
      case 'unlock': {
        // 成就解锁 — 三连音
        [880, 1100, 1320].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq; osc.type = 'triangle';
          gain.gain.setValueAtTime(this.sfxVolume * 0.3, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.2);
          osc.start(now + i * 0.08); osc.stop(now + i * 0.08 + 0.2);
        });
        break;
      }
      case 'ambient': {
        // 环境音 — 柔和海浪/风声（粉色噪声）
        if (!this.sfxEnabled) return;
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.05;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 400;
        const gain = ctx.createGain();
        gain.gain.value = this.sfxVolume * 0.08;
        source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
        source.start(now);
        // Store reference
        (this as any)._ambientSource = source;
        (this as any)._ambientGain = gain;
        break;
      }
    }
  }

  // 停止环境音
  stopAmbient() {
    if ((this as any)._ambientSource) {
      (this as any)._ambientSource.stop();
      (this as any)._ambientSource = null;
    }
  }

  // 切换音效开关
  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    this.savePref();
    return this.sfxEnabled;
  }

  // 切换背景音乐开关
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (!this.musicEnabled && this.currentMusic) {
      this.currentMusic.pause();
    }
    this.savePref();
    return this.musicEnabled;
  }

  // 设置音效音量
  setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.savePref();
  }

  // 设置音乐音量
  setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.currentMusic) {
      this.currentMusic.volume = this.musicVolume;
    }
    this.savePref();
  }

  // 获取设置
  getSettings() {
    return {
      sfxEnabled: this.sfxEnabled,
      musicEnabled: this.musicEnabled,
      sfxVolume: this.sfxVolume,
      musicVolume: this.musicVolume
    };
  }

  // 保存偏好
  private savePref() {
    localStorage.setItem('xinqingdao-audio-settings', JSON.stringify({
      sfxEnabled: this.sfxEnabled,
      musicEnabled: this.musicEnabled,
      sfxVolume: this.sfxVolume,
      musicVolume: this.musicVolume
    }));
  }

  // 加载偏好
  loadPref() {
    try {
      const saved = localStorage.getItem('xinqingdao-audio-settings');
      if (saved) {
        const pref = JSON.parse(saved);
        this.sfxEnabled = pref.sfxEnabled ?? true;
        this.musicEnabled = pref.musicEnabled ?? true;
        this.sfxVolume = pref.sfxVolume ?? 0.7;
        this.musicVolume = pref.musicVolume ?? 0.5;
      }
    } catch {
      // 使用默认值
    }
  }
}

// 全局单例
export const audioManager = new AudioManager();
audioManager.loadPref();
