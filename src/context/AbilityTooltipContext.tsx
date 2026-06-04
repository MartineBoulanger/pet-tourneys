'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { AbilityTooltip } from '@/components/layout';
import { FullAbility } from '@/types/supabase.types';

type TooltipState = {
  ability: FullAbility;
  x: number;
  y: number;
};

type AbilityTooltipContextValue = {
  showTooltip: (ability: FullAbility, e: React.MouseEvent) => void;
  hideTooltip: () => void;
  updatePosition: (e: React.MouseEvent) => void;
};

const AbilityTooltipContext = createContext<AbilityTooltipContextValue | null>(
  null,
);

export function AbilityTooltipProvider({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const showTooltip = useCallback(
    async (ability: FullAbility, e: React.MouseEvent) => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setTooltip({ ability, x: e.clientX, y: e.clientY });
    },
    [],
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
    <AbilityTooltipContext.Provider
      value={{ showTooltip, hideTooltip, updatePosition }}
    >
      {children}
      {tooltip && (
        <AbilityTooltip ability={tooltip.ability} x={tooltip.x} y={tooltip.y} />
      )}
    </AbilityTooltipContext.Provider>
  );
}

export function useAbilityTooltip() {
  const ctx = useContext(AbilityTooltipContext);
  if (!ctx)
    throw new Error(
      'useAbilityTooltip must be used inside AbilityTooltipProvider',
    );
  return ctx;
}
