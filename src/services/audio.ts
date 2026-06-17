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

  // 播放音效
  playSfx(type: 'click' | 'pop' | 'coin' | 'complete' | 'tap') {
    if (!this.sfxEnabled) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = this.sfxVolume * 0.3;

    switch (type) {
      case 'click':
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        break;
      case 'pop':
        oscillator.frequency.value = 600;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        break;
      case 'coin':
        oscillator.frequency.value = 1000;
        oscillator.type = 'square';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        setTimeout(() => {
          oscillator.frequency.value = 1200;
        }, 50);
        break;
      case 'complete':
        oscillator.frequency.value = 880;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        setTimeout(() => {
          const osc2 = audioContext.createOscillator();
          const gain2 = audioContext.createGain();
          osc2.connect(gain2);
          gain2.connect(audioContext.destination);
          osc2.frequency.value = 1100;
          gain2.gain.value = this.sfxVolume * 0.3;
          gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
          osc2.start();
          osc2.stop(audioContext.currentTime + 0.3);
        }, 100);
        break;
      case 'tap':
        oscillator.frequency.value = 700;
        oscillator.type = 'sine';
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
        break;
    }

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
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
