import { useState, useEffect, useCallback, useMemo, useRef, DependencyList } from "react";

export type Value<T> = {
  version: number;
  value: T;
};

export function useLatestVersion<T>(
  defaultValue: T,
  dependencies: DependencyList,
): [Value<T>, (v: T) => void] {
  const [current, setCurrent] = useState<Value<T>>({
    version: 0,
    value: defaultValue,
  });
  const [next, setNext] = useState<Value<T>>();

  const version = useVersionNumber(dependencies);
  const update = useCallback((value: T) => setNext({ version, value }), [version]);

  useEffect(() => {
    if (next && current.version < next.version) {
      setCurrent(next);
    }
  }, [current, next]);

  return [current, update];
}

export function useVersionNumber(dependencies: DependencyList) {
  const ref = useRef(0);
  return useMemo(() => ++ref.current, dependencies);
}
