# Bye useCallback

In previous examples, we saw how to install the React Compiler and optimize a component using `React.memo`.

Now, let's see if we can also get rid of `useCallback`.

### Disabling the Compiler

As before, let's disable the compiler first.

_./vite.config.ts_

```diff
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(
+     /*
      {
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
    }
+    */
    ),
  ],
});
```

### The Test Scenario

Let's move to the `demo.tsx` file and test the following scenario.

_./src/demo.tsx_

```tsx
import React from "react";

interface Props {
  onReset: () => void;
}

const ResetValue: React.FC<Props> = React.memo((props) => {
  console.log(
    "Hey I'm only rendered the first time, check React.memo + callback"
  );

  return <button onClick={props.onReset}>Reset value</button>;
});

export const MyComponent = () => {
  const [username, setUsername] = React.useState("John");
  const [lastname, setLastname] = React.useState("Doe");

  const resetNameCallback = () => {
    setUsername("");
  };

  return (
    <>
      <h3>
        {username} {lastname}
      </h3>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input value={lastname} onChange={(e) => setLastname(e.target.value)} />
      <ResetValue onReset={resetNameCallback} />
    </>
  );
};
```

### What’s Happening Here?

- A parent component displays `name` and `lastname` and provides a button to reset the name, which is encapsulated in another component.
- The `Reset` component (`ResetValue`) is optimized using `React.memo`, meaning it **should** only render once.
- However, we are passing a function as a prop, which is recreated on each render of `MyComponent`.

If you test it, you'll notice that every time we update any input value, the `ResetValue` component **re-renders**, and the console logs the message.

### Optimizing with useCallback (Pre-Compiler Era)

How did we solve this before the React Compiler? With `useCallback`.

_./src/demo.tsx_

```diff
export const MyComponent = () => {
  const [username, setUsername] = React.useState("John");
  const [lastname, setLastname] = React.useState("Doe");

-  const resetNameCallback = () => {
+  const resetNameCallback = React.useCallback(() => {
    setUsername("");
-  };
+  }, []);

  return (
```

Now, if we run the project, the `ResetValue` component no longer re-renders when changing the input values.

### Testing with the React Compiler

Let's re-enable the compiler.

_./vite.config.ts_

```diff
export default defineConfig({
  plugins: [
    react(),
-    /*{
+   {
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
+    }
-    }*/
  ],
});
```

### Removing Both React.memo and useCallback

Let's remove `React.memo` and `useCallback` to see if the compiler does its job.

_./src/demo.tsx_

```diff
- const ResetValue: React.FC<Props> = React.memo((props) => {
+ const ResetValue: React.FC<Props> = (props) => {
  console.log(
    "Hey I'm only rendered the first time, check React.memo + callback"
  );

  return <button onClick={props.onReset}>Reset value</button>;
- });
+ };
```

```diff
+  const resetNameCallback = () => {
-  const resetNameCallback = React.useCallback(() => {
    setUsername("");
+  };
-  }, []);

  return (
```

### The Result

🎉 **Bingo!** The `ResetValue` component **no longer re-renders** when we change the input values, and we didn't have to manually optimize anything.

### What’s Next?

What if we try `useMemo` next? In the following example, we'll experiment with `useMemo`.

Will it work? Let's find out...

```bash
npm run dev
```
