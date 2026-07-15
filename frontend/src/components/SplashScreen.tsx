import { useEffect, useState } from 'react';
import loaderHtml from '../imports/nar_lottie_preview.html?raw';

interface SplashScreenProps {
  visible: boolean;
}

export default function SplashScreen({ visible }: SplashScreenProps) {
  const [shouldRender, setShouldRender] = useState(visible);
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setIsVisible(false);
    const timeout = window.setTimeout(() => setShouldRender(false), 220);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 18,
        background: 'radial-gradient(circle at top, rgba(11, 20, 33, 0.92), rgba(3, 6, 12, 0.98))',
        padding: 24,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 220ms ease',
      }}
    >
      <div
        style={{
          width: 'min(82vmin, 760px)',
          aspectRatio: '1 / 1',
          borderRadius: 28,
          overflow: 'hidden',
          border: '1px solid rgba(23, 36, 58, 0.95)',
          boxShadow: '0 30px 90px rgba(0, 0, 0, 0.65)',
          background: '#05070b',
        }}
      >
        <iframe
          title="NAR loading animation"
          srcDoc={loaderHtml}
          style={{ width: '100%', height: '100%', border: 'none', background: '#05070b' }}
        />
      </div>
    </div>
  );
}
