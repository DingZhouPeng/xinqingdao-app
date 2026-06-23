import { useEffect, useState } from 'react';
import AppShell from './components/AppShell';
import PageTransition from './components/PageTransition';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import MoodPage from './pages/MoodPage';
import AiGuidePage from './pages/AiGuidePage';
import ActionPage from './pages/ActionPage';
import QuickReliefPage from './pages/QuickReliefPage';
import SocialPage from './pages/SocialPage';
import GrowthPage from './pages/GrowthPage';
import LighthousePage from './pages/LighthousePage';
import ShopPage from './pages/ShopPage';
import DailyTasksPage from './pages/DailyTasksPage';
import PetCarePage from './pages/PetCarePage';
import AchievementsPage from './pages/AchievementsPage';
import PetReminder from './components/PetReminder';
import AudioSettings from './components/AudioSettings';
import OnboardingGuide from './components/OnboardingGuide';
import AchievementUnlocked from './components/AchievementUnlocked';
import type { ABCInput, ActiveView, EmotionRecord, MoodInput, Recommendation, UserProfile, GameProgress } from './types';
import { appendRecord, loadSnapshot, saveSnapshot } from './services/storage';
import { loadGameProgress, saveGameProgress, earnCoins, purchaseOutfit, equipOutfit, feedPet, playWithPet, restPet, addPetXp } from './services/gameProgress';
import { loadDailyTasks, saveDailyTasks, completeTask } from './services/dailyTasks';
import type { DailyTasksState } from './types/dailyTasks';
import { loadRelayState, saveRelayState } from './services/relay';
import type { RelayState } from './types/relay';
import RelayCodeOverlay from './components/RelayCodeOverlay';
import { loadAchievements, saveAchievements, loadStats, saveStats, checkAchievements, updateLoginStreak, type UserStats } from './services/achievements';
import type { AchievementsState, Achievement } from './types/achievements';
import { audioManager } from './services/audio';
import type { EvolutionStage, EvolutionTrait } from './types/evolution';
import EvolutionCelebration from './components/EvolutionCelebration';
import { OUTFITS } from './data/outfits';

export default function App() {
  const [snapshot, setSnapshot] = useState(loadSnapshot);
  const [gameProgress, setGameProgress] = useState<GameProgress>(loadGameProgress);
  const [dailyTasks, setDailyTasks] = useState<DailyTasksState>(loadDailyTasks);
  const [achievements, setAchievements] = useState<AchievementsState>(loadAchievements);
  const [stats, setStats] = useState<UserStats>(loadStats);
  const [relayState, setRelayState] = useState<RelayState>(loadRelayState);
  const [pendingRelayCode, setPendingRelayCode] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>(snapshot.profile ? 'home' : 'onboarding');
  const [moodInput, setMoodInput] = useState<MoodInput | null>(null);
  const [abc, setAbc] = useState<ABCInput | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [showPetReminder, setShowPetReminder] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showOnboardingGuide, setShowOnboardingGuide] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [evoCelebration, setEvoCelebration] = useState<{
    evolution: import('./types/evolution').EvolutionState;
    previousStage: EvolutionStage;
    newTraits: EvolutionTrait[];
  } | null>(null);

  useEffect(() => {
    saveSnapshot(snapshot);
  }, [snapshot]);

  useEffect(() => {
    saveGameProgress(gameProgress);
  }, [gameProgress]);

  useEffect(() => {
    saveDailyTasks(dailyTasks);
  }, [dailyTasks]);

  useEffect(() => {
    saveAchievements(achievements);
  }, [achievements]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    saveRelayState(relayState);
  }, [relayState]);

  // URL Hash detection for relay codes
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#relay=([A-Z0-9]{6})$/);
    if (match) {
      const code = match[1];
      if (snapshot.profile) {
        setPendingRelayCode(code);
      } else {
        localStorage.setItem('xinqingdao-pending-relay-code', code);
      }
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  // 登录连续天数更新
  useEffect(() => {
    if (snapshot.profile) {
      const updatedStats = updateLoginStreak(stats);
      if (updatedStats.loginStreak !== stats.loginStreak) {
        setStats(updatedStats);
      }
    }
  }, [snapshot.profile]);

  // 成就检查
  const checkAndUpdateAchievements = () => {
    const { state: newState, newlyUnlocked } = checkAchievements(
      achievements,
      stats,
      snapshot,
      gameProgress
    );

    if (newlyUnlocked.length > 0) {
      setAchievements(newState);
      // 显示第一个解锁的成就
      setUnlockedAchievement(newlyUnlocked[0]);
      // 奖励金币
      const totalReward = newlyUnlocked.reduce((sum, a) => sum + a.reward, 0);
      setGameProgress(prev => earnCoins(prev, totalReward, '成就奖励'));
      audioManager.playSfx('complete');
    }
  };

  // 每次相关状态变化时检查成就
  useEffect(() => {
    if (snapshot.profile) {
      checkAndUpdateAchievements();
    }
  }, [stats, gameProgress.currency.totalEarned, gameProgress.unlockedOutfits.length, gameProgress.petState.happiness]);

  // 宠物状态提醒检查
  useEffect(() => {
    if (!snapshot.profile || activeView !== 'home') return;

    const checkPetStatus = () => {
      const { petState } = gameProgress;
      const needsAttention = petState.hunger < 30 || petState.energy < 30 || petState.happiness < 40;

      if (needsAttention) {
        // 检查距离上次关闭是否超过 5 分钟
        const lastDismissed = localStorage.getItem('xinqingdao-pet-reminder-dismissed');
        if (lastDismissed) {
          const elapsed = Date.now() - parseInt(lastDismissed, 10);
          if (elapsed < 5 * 60 * 1000) return; // 5分钟内不重复弹出
        }
        setShowPetReminder(true);
      }
    };

    checkPetStatus();
    const interval = setInterval(checkPetStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [gameProgress, snapshot.profile, activeView]);

  // 检查是否需要显示新手引导
  useEffect(() => {
    if (snapshot.profile && activeView === 'home') {
      const completed = localStorage.getItem('xinqingdao-onboarding-completed');
      const hasPendingRelay = !!localStorage.getItem('xinqingdao-pending-relay-code');
      // 有待处理接力消息时优先显示接力，不弹新手引导
      if (!completed && !hasPendingRelay && !pendingRelayCode) {
        setTimeout(() => setShowOnboardingGuide(true), 1000);
      }
    }
  }, [snapshot.profile, activeView, pendingRelayCode]);

  const completeOnboarding = (profile: UserProfile) => {
    setSnapshot((current) => ({ ...current, profile }));
    audioManager.playSfx('complete');
    // Check for pending relay code
    const pendingCode = localStorage.getItem('xinqingdao-pending-relay-code');
    if (pendingCode) {
      localStorage.removeItem('xinqingdao-pending-relay-code');
      setPendingRelayCode(pendingCode);
    }
    setActiveView('home');
  };

  const handleMoodNext = (input: MoodInput, safetyHigh: boolean) => {
    setMoodInput(input);
    audioManager.playSfx('complete');
    setGameProgress(prev => earnCoins(prev, 10, '记录情绪'));
    // 精灵 XP
    setGameProgress(prev => {
      const result = addPetXp(prev, 5);
      if (result.didEvolve && result.newStage && prev.petState.evolution) {
        setEvoCelebration({
          evolution: result.newProgress.petState.evolution!,
          previousStage: prev.petState.evolution.stage,
          newTraits: result.newTraits,
        });
      }
      return result.newProgress;
    });
    setDailyTasks(prev => completeTask(prev, 'record-mood'));
    setStats(prev => ({ ...prev, records: prev.records + 1 }));
    setActiveView(safetyHigh ? 'lighthouse' : 'ai');
  };

  const handleGenerate = (nextAbc: ABCInput, nextRecommendation: Recommendation) => {
    setAbc(nextAbc);
    setRecommendation(nextRecommendation);
    audioManager.playSfx('complete');
    setActiveView(nextRecommendation.safetyLevel === 'high' ? 'lighthouse' : 'action');
  };

  const handleCompleteRecord = (record: EmotionRecord) => {
    setSnapshot((current) => appendRecord(current, record));
    audioManager.playSfx('coin');
    // 完成完整流程，奖励 20 币
    setGameProgress(prev => earnCoins(prev, 20, '完成记录'));
    setActiveView('growth');
  };

  const handlePurchase = (outfitId: string) => {
    const outfit = OUTFITS.find(o => o.id === outfitId);
    if (outfit) {
      audioManager.playSfx('coin');
      setGameProgress(prev => purchaseOutfit(prev, outfitId, outfit.price));
    }
  };

  const handleEquip = (outfitId: string | undefined) => {
    audioManager.playSfx('click');
    setGameProgress(prev => equipOutfit(prev, outfitId));
  };

  const handleFeedPet = () => {
    audioManager.playSfx('complete');
    setGameProgress(prev => feedPet(prev));
    setStats(prev => ({ ...prev, petCareCount: prev.petCareCount + 1 }));
  };

  const handlePlayWithPet = () => {
    audioManager.playSfx('complete');
    setGameProgress(prev => playWithPet(prev));
    setStats(prev => ({ ...prev, petCareCount: prev.petCareCount + 1 }));
  };

  const handleRestPet = () => {
    audioManager.playSfx('click');
    setGameProgress(prev => restPet(prev));
    setStats(prev => ({ ...prev, petCareCount: prev.petCareCount + 1 }));
  };

  const renderView = () => {
    if (activeView === 'onboarding') return (
      <OnboardingPage
        onComplete={completeOnboarding}
        pendingRelayCode={localStorage.getItem('xinqingdao-pending-relay-code')}
      />
    );
    if (activeView === 'home') return <HomePage snapshot={snapshot} gameProgress={gameProgress} onNavigate={setActiveView} isEvolving={!!evoCelebration} />;
    if (activeView === 'mood') return <MoodPage onNext={handleMoodNext} onBubblePopped={(count) => setStats(prev => ({ ...prev, bubblesPopped: prev.bubblesPopped + count }))} />;
    if (activeView === 'relief') return <QuickReliefPage />;
    if (activeView === 'ai' && moodInput) return <AiGuidePage moodInput={moodInput} onGenerate={handleGenerate} />;
    if (activeView === 'action' && moodInput && abc && recommendation) return <ActionPage moodInput={moodInput} abc={abc} recommendation={recommendation} onComplete={handleCompleteRecord} />;
    if (activeView === 'social') return (
      <SocialPage
        relayState={relayState}
        snapshot={snapshot}
        gameProgress={gameProgress}
        onRelayStateChange={setRelayState}
        onNavigate={setActiveView}
        onEarnCoins={(amount, reason) => setGameProgress(prev => earnCoins(prev, amount, reason))}
        onGrantXp={(amount) => {
          setGameProgress(prev => {
            const result = addPetXp(prev, amount);
            if (result.didEvolve && result.newStage && prev.petState.evolution) {
              setEvoCelebration({
                evolution: result.newProgress.petState.evolution!,
                previousStage: prev.petState.evolution.stage,
                newTraits: result.newTraits,
              });
            }
            return result.newProgress;
          });
        }}
        onStatsUpdate={(updates) => setStats(prev => {
          const next = { ...prev, ...updates };
          if (updates.relayTotalReach && next.relayTotalReach > next.relayMaxChainReach) {
            next.relayMaxChainReach = next.relayTotalReach;
          }
          return next;
        })}
      />
    );
    if (activeView === 'growth') return <GrowthPage snapshot={snapshot} />;
    if (activeView === 'lighthouse') return <LighthousePage snapshot={snapshot} />;
    if (activeView === 'shop') return <ShopPage gameProgress={gameProgress} onPurchase={handlePurchase} onEquip={handleEquip} />;
    if (activeView === 'daily-tasks') return <DailyTasksPage dailyTasksState={dailyTasks} onBack={() => setActiveView('home')} />;
    if (activeView === 'pet-care') return <PetCarePage gameProgress={gameProgress} onFeed={handleFeedPet} onPlay={handlePlayWithPet} onRest={handleRestPet} onBack={() => setActiveView('home')} />;
    if (activeView === 'achievements') return <AchievementsPage achievementsState={achievements} stats={stats} onBack={() => setActiveView('home')} />;
    return <HomePage snapshot={snapshot} gameProgress={gameProgress} onNavigate={setActiveView} />;
  };

  return (
    <AppShell activeView={activeView} onNavigate={setActiveView}>
      <PageTransition transitionKey={activeView}>
        {renderView()}
      </PageTransition>

      {/* 宠物提醒 */}
      {showPetReminder && (
        <PetReminder
          petState={gameProgress.petState}
          onDismiss={() => {
            localStorage.setItem('xinqingdao-pet-reminder-dismissed', Date.now().toString());
            setShowPetReminder(false);
          }}
          onGoToCare={() => {
            localStorage.removeItem('xinqingdao-pet-reminder-dismissed');
            setShowPetReminder(false);
            setActiveView('pet-care');
          }}
        />
      )}

      {/* 音效设置 */}
      {showAudioSettings && (
        <AudioSettings onClose={() => setShowAudioSettings(false)} />
      )}

      {/* 新手引导 */}
      {showOnboardingGuide && (
        <OnboardingGuide onComplete={() => setShowOnboardingGuide(false)} />
      )}

      {/* 成就解锁弹窗 */}
      {unlockedAchievement && (
        <AchievementUnlocked
          achievement={unlockedAchievement}
          onClose={() => setUnlockedAchievement(null)}
        />
      )}

      {/* 进化庆祝 */}
      {evoCelebration && (
        <EvolutionCelebration
          evolution={evoCelebration.evolution}
          previousStage={evoCelebration.previousStage}
          newTraits={evoCelebration.newTraits}
          onClose={() => {
            setEvoCelebration(null);
            // 奖励进化金币
            setGameProgress(prev => earnCoins(prev, 30, '精灵进化'));
          }}
        />
      )}

      {/* 温暖接力 - 分享码查看弹窗 */}
      {pendingRelayCode && snapshot.profile && (
        <RelayCodeOverlay
          code={pendingRelayCode}
          relayState={relayState}
          onDismiss={() => setPendingRelayCode(null)}
          onRelayStateChange={setRelayState}
          onEarnCoins={(amount, reason) => setGameProgress(prev => earnCoins(prev, amount, reason))}
          onStatsUpdate={(updates) => setStats(prev => ({
            ...prev,
            ...updates,
            relayMaxChainReach: updates.relayTotalReach ? Math.max(prev.relayMaxChainReach, prev.relayTotalReach + (updates.relayTotalReach || 0)) : prev.relayMaxChainReach
          }))}
        />
      )}

      {/* 音效设置按钮 - 固定在右下角 */}
      {activeView === 'home' && (
        <button
          className="floating-settings-btn"
          onClick={() => {
            audioManager.playSfx('click');
            setShowAudioSettings(true);
          }}
          aria-label="音效设置"
        >
          🔊
        </button>
      )}
    </AppShell>
  );
}
