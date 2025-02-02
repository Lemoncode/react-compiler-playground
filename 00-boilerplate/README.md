# Creating the Project

When working with React, sometimes you need to optimize rendering or even prevent your code from getting stuck in certain cases. This often requires using hooks like `useMemo` or `useCallback`, which can be a hassle—especially if you've had the chance to try newer frameworks like `Svelte` or `Solid`. You might have noticed that these hooks feel like manual workarounds. So, isn't there a better way to handle this? Well, yes!  

Alongside React 19, the React team has introduced a new tool called `React Compiler`, which automatically optimizes your code, allowing you to forget about these hooks.  

In this series of examples, we’ll test various optimization techniques that we use in our training sessions and see how `React Compiler` handles them.  

### Setting Up the Project  

As a first example, we'll create a blank project and add support for React Compiler.  

**⚠️ Note:** This example was created in February 2025, when React Compiler was still in beta. If you're reading this in the future, the installation process might have changed—or it might not even be necessary anymore. You can check the [official React Compiler page](https://react.dev/learn/react-compiler) for the latest updates.  

We'll start the project from scratch using Vite:  

```bash
npm create vite@latest my-project --template react-ts
```

Select **React** and **TypeScript**.  

At the time of creating this repository, Vite was still installing React 18, so let's update to version 19:  

```bash
npm install react@latest react-dom@latest
```

Since React Compiler was still in beta when we created this project, we also needed to install it manually:  

```bash
npm install --save-dev babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
```

```bash
npm install react-compiler-runtime@beta
```

Then, configure it in the `vite.config.ts` file:  

```diff
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(
+    {
+      babel: {
+        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
+      },
+    }
    ),
  ],
});
```

Now, let's start the project. To verify that the plugin is active, open the DevTools (`Components` tab), and you should see some stars next to the optimized components.  

```bash
npm run dev
```

To reduce clutter, I’ve removed unused images and code and created a `Demo` component.  

![DevTools component tab with stars](./content/devtools.png)

Now that everything is set up, let's start experimenting with it!
