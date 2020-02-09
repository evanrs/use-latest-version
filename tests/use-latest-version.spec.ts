import { act, renderHook } from "@testing-library/react-hooks";
import { DependencyList } from "react";

import { useLatestVersion, Value } from "../src/use-latest-version";

type Props<T> = {
  defaultValue?: T;
  dependencies: DependencyList;
};

function setup<T>(initialValue: T, dependencies: DependencyList) {
  return renderHook(
    ({ defaultValue, dependencies }: Props<T>) =>
      useLatestVersion(defaultValue ?? initialValue, dependencies),
    { initialProps: { defaultValue: initialValue, dependencies } }
  );
}

function map<T>([latest, update]: [Value<T>, (v: T) => void]) {
  return { latest, update };
}

it("should return the default value", () => {
  const { result } = setup(1, []);
  const [latest] = result.current;

  expect(latest.value).toBe(1);
});

it("should update value", async () => {
  const { result } = setup(1, ["a"]);

  act(() => map(result.current).update(2));

  expect(map(result.current).latest.value).toBe(2);
});
