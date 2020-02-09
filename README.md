# use-latest-version

A [react hook](https://reactjs.org/docs/hooks-intro.html) that guarentees out of order calls to [setState](https://reactjs.org/docs/hooks-reference.html#usestate) return only the latest value.

`npm install use-latest-version`

## Example

In this example we get search results from a service for the users input. Unfortunately between our users dodgy connection and this shoddy service we can't guarantee they'll all get back in the right order.

```ts
function useShoddyService(input) {
  const [latest, update] = useLatestVersion({ results: [] }, [input]);

  useEffect(() => {
    fetch(`shoddyservice.com/search/${input}`).then(async response => {
      const results = await response.json();
      update({ results });
    });
  }, [input]);

  return latest.value;
}
```

With `use-latest-version` we don't have to worry about about the order they're received in — earlier versions will be ignored if they arrive late.

## Usage

The hook returns the current state and a versioned update method.
```ts
const [latest, update] = useLatestVersion(defaultValue, dependencies)
```

The state is an object of `version` and `value`
```ts
const [{ version, value }, update] = useLatestVersion(defaultValue, dependencies)
```

The `version` is a [ulid](https://github.com/ulid/javascript) and has a monotonic sort order — it's comparable.

```
a.version < b.version ? b.value: a.value
```

The `update` method is bound to a single version until our depedencies change.

```
const [input, setInput] = useState("")
const [latest, update] = useLatestVersion(defaultValue, [input])

// in some callback or effect
update(1)
update(2)

// on the next render
latest.value === 2

// if we then
setInput("cat")

// our next render will have a newly versioned update method
update(3)

// and so will update our value
latest.value === 3
```
Our list of `dependencies` is our way of staging our next update. Earlier instances of `update` will still be accepted if they're a newer version than the current value.

## License

**[MIT](LICENSE)** Licensed