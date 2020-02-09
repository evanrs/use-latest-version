import { ulid } from "ulid";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  DependencyList
} from "react";

export type Value<T> = {
  version: string;
  value: T;
};

export function useLatestVersion<T>(
  defaultValue: T,
  dependencies: DependencyList
): [Value<T>, (v: T) => void] {
  const [current, setCurrent] = useState<Value<T>>({
    version: "",
    value: defaultValue
  });
  const [next, setNext] = useState<Value<T>>();

  const version = useMemo(ulid, dependencies);
  const update = useCallback((value: T) => setNext({ version, value }), [
    version
  ]);

  useEffect(() => {
    if (next && current.version < next.version) {
      setCurrent(next);
    }
  }, [current, next]);

  return [current, update];
}
