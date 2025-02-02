# Bye React.memo

In the previous example, we created a blank project and added support for React Compiler.

Now, let's see how we can optimize a component the old-fashioned way using `React.memo` and observe what happens when we introduce the compiler into the project.

### Cleaning Up the Project

Before getting started, let's clean up our seed project:

- Remove unused images from `public` and `./src/assets`.
- Create a `demo.tsx` file in the project root.
- Add a simple component called `MyComponent`.

### Disabling the Compiler and Using React.memo

First, we disable the compiler to see how to optimize without its help by using `React.memo`.

_Disable the compiler in `vite.config.ts`:_

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

### Adding the Component

In `demo.tsx`, add the following code:

```tsx
import React from "react";

interface Props {
  name: string;
}

export const DisplayUsername = (props: Props) => {
  console.log(
    "Hey I'm only rerendered when name gets updated, check React.memo"
  );

  return <h3>{props.name}</h3>;
};

export const MyComponent = () => {
  const [userInfo, setUserInfo] = React.useState({
    name: "John",
    lastname: "Doe",
  });

  return (
    <>
      <DisplayUsername name={userInfo.name} />
      <input
        value={userInfo.name}
        onChange={(e) =>
          setUserInfo({
            ...userInfo,
            name: e.target.value,
          })
        }
      />
      <input
        value={userInfo.lastname}
        onChange={(e) =>
          setUserInfo({
            ...userInfo,
            lastname: e.target.value,
          })
        }
      />
    </>
  );
};
```

### What’s Happening Here?

- We have a `useState` hook storing an object with `name` and `lastname` fields.
- The `DisplayUsername` component receives the `name` prop and displays it inside an `h3`.
- The `lastname` is displayed directly in the same component.
- We have two inputs, one for the `name` and another for the `lastname`.

> This is a highly simplified and forced example to demonstrate `React.memo` behavior.

If you look closely, `DisplayUsername` only receives the `name` property. Therefore, if we update the `lastname`, it **should not** re-render—right? If we test it, we see that `DisplayUsername` re-renders whenever we change either `name` or `lastname`.

### Optimizing with React.memo (Pre-Compiler Era)

```diff
- export const DisplayUsername = (props: Props) => {
+ export const DisplayUsername = React.memo((props: Props) => {
  console.log(
    "Hey I'm only rerendered when name gets updated, check React.memo"
  );

  return <h3>{props.name}</h3>;
- };
+ });
```

Now, if we run the project, we can see that `DisplayUsername` **only** re-renders when `name` changes.

### Testing with the Compiler

Let's re-enable the compiler.

_Enable the compiler in `vite.config.ts`:_

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

### Removing React.memo

```diff
+ export const DisplayUsername = (props: Props) => {
- export const DisplayUsername = React.memo((props: Props) => {
  console.log(
    "Hey I'm only rerendered when name gets updated, check React.memo"
  );

  return <h3>{props.name}</h3>;
+ };
- });
```

Now, let's run the project, open the console, and... **it works!** 🎉

Without a doubt, the best advancements in libraries are the ones that allow us to forget about them and focus on what truly matters—our application's logic.
