import { useEffect, useCallback, useRef } from 'react';

interface KeyboardNavigationOptions {
    onArrowDown?: () => void;
    onArrowUp?: () => void;
    onArrowRight?: () => void;
    onArrowLeft?: () => void;
    onEnter?: () => void;
    onSpace?: () => void;
    onHome?: () => void;
    onEnd?: () => void;
    enabled?: boolean;
    target?: HTMLElement | null;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
    const {
        onArrowDown,
        onArrowUp,
        onArrowRight,
        onArrowLeft,
        onEnter,
        onSpace,
        onHome,
        onEnd,
        enabled = true,
        target = null,
    } = options;

    const handleKeyDown = useCallback(
        (event: Event) => {
            if (!enabled) return;

            const keyboardEvent = event as KeyboardEvent;

            switch (keyboardEvent.key) {
                case 'ArrowDown':
                    keyboardEvent.preventDefault();
                    onArrowDown?.();
                    break;
                case 'ArrowUp':
                    keyboardEvent.preventDefault();
                    onArrowUp?.();
                    break;
                case 'ArrowRight':
                    keyboardEvent.preventDefault();
                    onArrowRight?.();
                    break;
                case 'ArrowLeft':
                    keyboardEvent.preventDefault();
                    onArrowLeft?.();
                    break;
                case 'Enter':
                    keyboardEvent.preventDefault();
                    onEnter?.();
                    break;
                case ' ':
                    keyboardEvent.preventDefault();
                    onSpace?.();
                    break;
                case 'Home':
                    keyboardEvent.preventDefault();
                    onHome?.();
                    break;
                case 'End':
                    keyboardEvent.preventDefault();
                    onEnd?.();
                    break;
            }
        },
        [
            enabled,
            onArrowDown,
            onArrowUp,
            onArrowRight,
            onArrowLeft,
            onEnter,
            onSpace,
            onHome,
            onEnd,
        ]
    );

    useEffect(() => {
        const element = target || document;
        element.addEventListener('keydown', handleKeyDown);
        return () => element.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown, target]);
}
