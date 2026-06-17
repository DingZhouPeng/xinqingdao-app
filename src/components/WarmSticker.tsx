interface WarmStickerProps {
  emoji: string;
  label: string;
  onClick?: () => void;
}

export default function WarmSticker({ emoji, label, onClick }: WarmStickerProps) {
  return (
    <button className="warm-sticker" onClick={onClick}>
      <span>{emoji}</span>
      <small>{label}</small>
    </button>
  );
}
