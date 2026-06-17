import { useState } from 'react';
import type { GameProgress } from '../types';
import { OUTFITS } from '../data/outfits';
import QingqingPet from '../components/QingqingPet';

interface ShopPageProps {
  gameProgress: GameProgress;
  onPurchase: (outfitId: string) => void;
  onEquip: (outfitId: string | undefined) => void;
}

export default function ShopPage({ gameProgress, onPurchase, onEquip }: ShopPageProps) {
  const [preview, setPreview] = useState<string | undefined>(gameProgress.petState.outfit);

  const canBuy = (price: number) => gameProgress.currency.coins >= price;
  const isUnlocked = (outfitId: string) => gameProgress.unlockedOutfits.includes(outfitId);
  const isEquipped = (outfitId: string) => gameProgress.petState.outfit === outfitId;

  const handleBuy = (outfitId: string, price: number) => {
    if (canBuy(price)) {
      onPurchase(outfitId);
    }
  };

  const handlePreview = (outfitId: string) => {
    setPreview(outfitId);
  };

  const handleEquip = () => {
    onEquip(preview);
  };

  const handleTakeOff = () => {
    setPreview(undefined);
    onEquip(undefined);
  };

  return (
    <div className="page shop-page">
      <header className="page-header">
        <h1>装扮商店</h1>
        <div className="coin-display">💰 {gameProgress.currency.coins}</div>
      </header>

      <section className="preview-card panel-card">
        <h2>预览</h2>
        <div className="preview-stage">
          <QingqingPet petState={gameProgress.petState} size="large" />
          {preview && (
            <div className="outfit-overlay">
              {OUTFITS.find(o => o.id === preview)?.emoji}
            </div>
          )}
        </div>
        <div className="preview-actions">
          {preview && isUnlocked(preview) && (
            <button className="primary-button" onClick={handleEquip}>
              {isEquipped(preview) ? '已装备' : '装备'}
            </button>
          )}
          {gameProgress.petState.outfit && (
            <button className="ghost-button" onClick={handleTakeOff}>
              脱下装扮
            </button>
          )}
        </div>
      </section>

      <section className="shop-grid">
        {OUTFITS.map((outfit) => {
          const unlocked = isUnlocked(outfit.id);
          const equipped = isEquipped(outfit.id);

          return (
            <div
              key={outfit.id}
              className={`shop-item ${unlocked ? 'is-unlocked' : ''} ${equipped ? 'is-equipped' : ''}`}
              onClick={() => unlocked && handlePreview(outfit.id)}
            >
              <div className="item-icon">{outfit.emoji}</div>
              <strong>{outfit.name}</strong>
              {!unlocked && (
                <button
                  className={`buy-button ${canBuy(outfit.price) ? '' : 'is-disabled'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuy(outfit.id, outfit.price);
                  }}
                  disabled={!canBuy(outfit.price)}
                >
                  💰 {outfit.price}
                </button>
              )}
              {unlocked && !equipped && <span className="owned-badge">已拥有</span>}
              {equipped && <span className="equipped-badge">已装备</span>}
            </div>
          );
        })}
      </section>
    </div>
  );
}
