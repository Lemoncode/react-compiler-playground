# Bye useMemo

Continuing with our series of experiments with the React Compiler, it's now time to test `useMemo`, the close sibling of `React.memo`. This hook allows us to memoize the result of a function and prevent it from recalculating on every render.

### Disabling the Compiler

As before, let's start by disabling the compiler.

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

Let's modify the `demo.tsx` file and test the following scenario.

_./src/demo.tsx_

```tsx
import React from "react";

const ExpensiveComponent: React.FC<{ count: number }> = ({ count }) => {
  const computedValue = count * 2;

  return <div>Computed Value: {computedValue}</div>;
};

export const MyComponent = () => {
  const [count, setCount] = React.useState(0);
  const [otherState, setOtherState] = React.useState(false);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setOtherState(!otherState)}>Toggle</button>
      <ExpensiveComponent count={count} />
    </div>
  );
};
```

### What’s Happening Here?

- A parent component has a counter and a boolean state.
- Clicking the `Increment` button increases the counter, which causes a child component to re-render.
- The child component simulates an expensive computation (although multiplying by two isn't really that expensive), and we only want it to recalculate when the counter changes.

If we test it, we’ll see that the child component updates when we press `Increment`, but also when we press `Toggle`.

### Optimizing with useMemo

How can we avoid this? We can use `useMemo` to wrap the function performing the computation.

```diff
const ExpensiveComponent: React.FC<{ count: number }> = ({ count }) => {
-  const computedValue = count * 2;
+  const computedValue = React.useMemo(() => {
+    console.log("Expensive computation...");
+    return count * 2;
+  }, [count]);

  return <div>Computed Value: {computedValue}</div>;
};
```

Now, React will only recompute `computedValue` when `count` changes.

### Testing with the Compiler

Let's enable the compiler again.

_./vite.config.ts_

```diff
export default defineConfig({
  plugins: [
    react(,
-    /*{
+   {
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
+    }
-    }*/
    )
  ],
});
```

### Removing useMemo

To verify if the compiler optimizes correctly, let's remove `useMemo`. In this case, we wrap the computation inside a self-invoking function so we can include a `console.log` statement.

```diff
const ExpensiveComponent: React.FC<{ count: number }> = ({ count }) => {
+  const computedValue = (() => {
+    console.log("Expensive computation");
+    return count * 2;
+  })();
-  const computedValue = React.useMemo(() => {
-    console.log("Expensive computation...");
-    return count * 2;
-  }, [count]);

  return <div>Computed Value: {computedValue}</div>;
};
```

### The Final Test

Will it work? Let's find out...

```bash
npm run dev
```

### Conclusion

This is great because we often forget to use `useMemo`, which can lead to unnecessary re-renders.

In the next example, we will take one final look at `React.memo` and test what happens when we introduce a condition for evaluation.
