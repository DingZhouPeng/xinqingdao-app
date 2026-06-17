import { useState } from 'react';
import { audioManager } from '../services/audio';

interface AudioSettingsProps {
  onClose: () => void;
}

export default function AudioSettings({ onClose }: AudioSettingsProps) {
  const [settings, setSettings] = useState(audioManager.getSettings());

  const handleToggleSfx = () => {
    const enabled = audioManager.toggleSfx();
    setSettings({ ...settings, sfxEnabled: enabled });
    if (enabled) audioManager.playSfx('click');
  };

  const handleToggleMusic = () => {
    const enabled = audioManager.toggleMusic();
    setSettings({ ...settings, musicEnabled: enabled });
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    audioManager.setSfxVolume(volume);
    setSettings({ ...settings, sfxVolume: volume });
  };

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    audioManager.setMusicVolume(volume);
    setSettings({ ...settings, musicVolume: volume });
  };

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="settings-panel glass-card">
        <header className="settings-header">
          <h2>音效设置</h2>
          <button className="close-btn" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </header>

        <div className="settings-content">
          {/* 音效开关 */}
          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-icon">🔊</span>
              <span>音效</span>
            </div>
            <button
              className={`toggle-switch ${settings.sfxEnabled ? 'active' : ''}`}
              onClick={handleToggleSfx}
              aria-label={settings.sfxEnabled ? '关闭音效' : '开启音效'}
            >
              <div className="toggle-thumb" />
            </button>
          </div>

          {/* 音效音量 */}
          {settings.sfxEnabled && (
            <div className="setting-item">
              <label className="setting-label" htmlFor="sfx-volume">
                <span className="setting-icon">🔉</span>
                <span>音效音量</span>
              </label>
              <input
                id="sfx-volume"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.sfxVolume}
                onChange={handleSfxVolumeChange}
                className="volume-slider"
              />
            </div>
          )}

          {/* 背景音乐开关 */}
          <div className="setting-item">
            <div className="setting-label">
              <span className="setting-icon">🎵</span>
              <span>背景音乐</span>
            </div>
            <button
              className={`toggle-switch ${settings.musicEnabled ? 'active' : ''}`}
              onClick={handleToggleMusic}
              aria-label={settings.musicEnabled ? '关闭音乐' : '开启音乐'}
            >
              <div className="toggle-thumb" />
            </button>
          </div>

          {/* 音乐音量 */}
          {settings.musicEnabled && (
            <div className="setting-item">
              <label className="setting-label" htmlFor="music-volume">
                <span className="setting-icon">🎶</span>
                <span>音乐音量</span>
              </label>
              <input
                id="music-volume"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.musicVolume}
                onChange={handleMusicVolumeChange}
                className="volume-slider"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
