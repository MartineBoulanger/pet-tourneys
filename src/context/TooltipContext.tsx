'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { AbilityTooltip, PetTypeTooltip } from '@/components/layout';
import {
  FullAbility,
  Family,
  TooltipState,
  TooltipContextValue,
} from '@/types/supabase.types';

const TooltipContext = createContext<TooltipContextValue | null>(null);

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const show = useCallback((state: TooltipState) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setTooltip(state);
  }, []);

  const showAbilityTooltip = useCallback(
    (ability: FullAbility, e: React.MouseEvent) =>
      show({ kind: 'ability', data: ability, x: e.clientX, y: e.clientY }),
    [show],
  );

  const showFamilyTooltip = useCallback(
    (family: Family, e: React.MouseEvent) =>
      show({ kind: 'family', data: family, x: e.clientX, y: e.clientY }),
    [show],
  );

  const hideTooltip = useCallback(() => {
    hideTimer.current = setTimeout(() => setTooltip(null), 100);
  }, []);

  const updatePosition = useCallback((e: React.MouseEvent) => {
    setTooltip((prev) =>
      prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
    );
  }, []);

  return (
    <TooltipContext.Provider
      value={{
        showAbilityTooltip,
        showFamilyTooltip,
        hideTooltip,
        updatePosition,
      }}
    >
      {children}
      {tooltip?.kind === 'ability' && (
        <AbilityTooltip ability={tooltip.data} x={tooltip.x} y={tooltip.y} />
      )}
      {tooltip?.kind === 'family' && (
        <PetTypeTooltip type={tooltip.data} x={tooltip.x} y={tooltip.y} />
      )}
    </TooltipContext.Provider>
  );
}

export function useTooltip() {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error('useTooltip must be used inside TooltipProvider');
  return ctx;
}
