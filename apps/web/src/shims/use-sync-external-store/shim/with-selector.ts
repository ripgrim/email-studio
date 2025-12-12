// React 19 has useSyncExternalStore built-in
// This shim provides the with-selector variant
// Based on the official use-sync-external-store implementation
import { useSyncExternalStore } from "react";
import { useRef, useMemo, useCallback } from "react";

export function useSyncExternalStoreWithSelector<T, U>(
	subscribe: (onStoreChange: () => void) => () => void,
	getSnapshot: () => T,
	getServerSnapshot: (() => T) | undefined,
	selector: (snapshot: T) => U,
	isEqual?: (a: U, b: U) => boolean,
): U {
	// Use refs to always get the latest functions
	const selectorRef = useRef(selector);
	const getSnapshotRef = useRef(getSnapshot);
	const isEqualRef = useRef(isEqual);
	
	selectorRef.current = selector;
	getSnapshotRef.current = getSnapshot;
	isEqualRef.current = isEqual;
	
	// Cache previous selected value and snapshot
	const prevSnapshotRef = useRef<T>();
	const prevSelectionRef = useRef<U>();
	
	// Create stable getSelection function
	const getSelection = useCallback((): U => {
		const nextSnapshot = getSnapshotRef.current();
		
		if (prevSnapshotRef.current === nextSnapshot) {
			return prevSelectionRef.current!;
		}
		
		const nextSelection = selectorRef.current(nextSnapshot);
		
		if (prevSelectionRef.current !== undefined && 
			(isEqualRef.current 
				? isEqualRef.current(prevSelectionRef.current, nextSelection)
				: Object.is(prevSelectionRef.current, nextSelection))) {
			return prevSelectionRef.current;
		}
		
		prevSnapshotRef.current = nextSnapshot;
		prevSelectionRef.current = nextSelection;
		return nextSelection;
	}, []);
	
	// Cache server snapshot
	const serverSelectionRef = useRef<U>();
	if (serverSelectionRef.current === undefined && getServerSnapshot) {
		const serverSnapshot = getServerSnapshot();
		serverSelectionRef.current = selector(serverSnapshot);
	}
	
	const getServerSelection = useMemo(() => {
		if (!getServerSnapshot) return undefined;
		return () => serverSelectionRef.current!;
	}, [getServerSnapshot]);

	return useSyncExternalStore(subscribe, getSelection, getServerSelection);
}

