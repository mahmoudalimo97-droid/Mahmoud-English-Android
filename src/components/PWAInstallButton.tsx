import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenGuide?: () => void;
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenGuide, className }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  // If already running as an installed PWA / standalone, suppress the install prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (!success && onOpenGuide) {
        onOpenGuide();
      }
    } else if (onOpenGuide) {
      onOpenGuide();
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      title="تثبيت التطبيق على هاتف الأندرويد لفتحه مباشرة (APK / App)"
      className={
        className ||
        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-xs transition-all active:scale-95'
      }
    >
      <Download className="w-3.5 h-3.5" />
      <span>تثبيت كـ تطبيق أندرويد</span>
    </button>
  );
};
