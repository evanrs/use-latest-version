import { useState } from "react";
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
    {
      initialProps: { defaultValue: initialValue, dependencies } as Props<T>
    }
  );
}

function map<T>([latest, update]: [Value<T>, (v: T) => void]) {
  return { latest, update };
}

async function wait(ms?: number) {
  await new Promise(next => setTimeout(next, ms ?? 10));
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

it("should only accept highest version update", async () => {
  const { result, rerender } = setup(1, ["first"]);

  const first = map(result.current);

  await wait();
  rerender({ dependencies: ["second"] });
  const second = map(result.current);

  await wait();
  rerender({ dependencies: ["third"] });
  const third = map(result.current);

  act(() => second.update(2));
  act(() => first.update(1));
  expect(map(result.current).latest.value).toBe(2);

  act(() => third.update(3));
  expect(map(result.current).latest.value).toBe(3);
});
