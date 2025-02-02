# NO bye React.memo predicate

Let's explore a scenario where the React Compiler **cannot** help us—because it's not a mind reader. This involves using `React.memo` with a complex predicate function.

### Disabling the Compiler

First, let's disable the React 19 compiler.

_./vite.config.ts_

```diff
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(
-      {
+   /*{
      babel: {
        plugins: [["babel-plugin-react-compiler", { target: "19" }]],
      },
-    }
+    }*/
    ),
  ],
});
```

### Creating the Example

In this example, we will create a component that displays a **satisfaction face** based on a satisfaction level range.

The images for the faces are placed inside the `assets` folder. You can download them from the repo if you're starting the example from scratch.

#### Adding Styles

At the end of `App.css`, add the following styles:

```css
.App {
  font-family: sans-serif;
  text-align: center;
  min-width: 800px;
}

.very-dissatisfied {
  width: 100%;
  height: 80px;
  background: url("./assets/one.png") no-repeat center;
}

.somewhat-dissatisfied {
  width: 100%;
  height: 80px;
  background: url("./assets/two.png") no-repeat center;
}

.neither {
  width: 100%;
  height: 80px;
  background: url("./assets/three.png") no-repeat center;
}

.somewhat-satisfied {
  width: 100%;
  height: 80px;
  background-color: aqua;
  background: url("./assets/four.png") no-repeat center;
}

.very-satisfied {
  width: 100%;
  height: 80px;
  background: url("./assets/five.png") no-repeat center;
}
```

#### Updating the Main App Component

Modify the main `App.tsx` component to include the `app` class.

```diff
function App() {
  return (
-    <>
+    <div className="app">
      <MyComponent/>
+    </div>
-    </>
  );
}
```

### Implementing the Demo Component

Let's start implementing the `MyComponent` step by step.

_./demo.tsx_

```tsx
import * as React from "react";

interface Props {
  level: number;
}

export const MyComponent = (props: Props) => {
  const { level } = props;

  return <div className="somewhat-satisfied" />;
};
```

#### Testing the Component

Modify `App.tsx` to pass a `level` prop.

```diff
import React from "react";
import { MyComponent } from "./demo";

export const App = () => {
  return (
    <div className="app">
-      <MyComponent />
+      <MyComponent level={100} />
    </div>
  );
};
```

Run the app to verify everything is working.

```bash
npm run dev
```

### Mapping Satisfaction Levels to Faces

Now, we link the `level` prop to the correct face. Add a helper function in `demo.tsx`.

_./src/demo.tsx_

```diff
import * as React from 'react';

+ const setSatisfactionClass = (level : number) => {
+
+   if (level < 100) {
+     return "very-dissatisfied"
+   }
+
+   if (level < 200) {
+     return "somewhat-dissatisfied"
+   }
+
+   if (level < 300) {
+     return "neither"
+   }
+
+   if (level < 400) {
+     return "somewhat-satisfied"
+   }
+
+   return "very-satisfied"
+ }

interface Props {
  level: number;
}

export const MyComponent: React.FC<Props> = (props) => {
  const { level } = props;

+ console.log("** Face component rerender in progress...");

  return (
-    <div className="somewhat-satisfied"/>
+    <div className={setSatisfactionClass(level)}/>
  );
}
```

### Adding State to App.tsx

Now, let's store the satisfaction level in the component state and add a slider to let the user adjust it.

_./src/app.tsx_

```diff
+ import React from "react";
import { MyComponent } from "./demo";
import "./styles.css";

export const App = () => {
+
+   const [satisfactionLevel, setSatisfactionLevel] = React.useState(300);
  return (
-    <div className="App">
+    <div className="App" style={{ display: "flex", flexDirection: "column" }}>
+       <input type="range"
+         min="0"
+         max="500"
+         value={satisfactionLevel}
+         onChange={(event) => setSatisfactionLevel(+event.target.value)}
+       />
+       <span>{satisfactionLevel}</span>
-       <MyComponent level={100}/>
+       <MyComponent level={satisfactionLevel} />
    </div>
  );
}
```

Run the app again:

```bash
npm run dev
```

### Optimizing Rendering with a Predicate

Now, let's optimize rendering so the component only updates when the satisfaction **range** changes.

_./src/demo.tsx_

```diff
import * as React from 'react';

const setSatisfactionClass = level => {
  // Same logic as before...
}

+ const isSameRange = (prevValue : Props, nextValue : Props) => {
+
+   const prevValueClass = setSatisfactionClass(prevValue.level);
+   const nextValueClass = setSatisfactionClass(nextValue.level);
+
+   return prevValueClass === nextValueClass;
+ }

- export const MyComponent: React.FC<Props> = (props : Props) => {
+ export const MyComponent: React.FC<Props> = React.memo( (props) => {
  return (
    <div className={setSatisfactionClass(props.level)}/>
  );
- }
+ }, isSameRange);
```

Now, the component **only** re-renders when the satisfaction **range** changes.

```bash
npm run dev
```

### Can the Compiler Help Here?

Let's find out! Re-enable the compiler:

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

#### Removing `React.memo` with Predicate

```diff
- export const MyComponent = React.memo((props: Props) => {
+ export const MyComponent: React.FC<Props> = (props) => {
  console.log("** Face component rerender in progress...");
  return <div className={setSatisfactionClass(props.level)} />;
-}, isSameRange);
+ }
```

### Conclusion

❌ **The compiler cannot optimize this case.**  
Why? Because it is a more advanced scenario that requires specific logic. React Compiler is **not a mind reader** (yet), so in this case, using `React.memo` **with a predicate** is still a good idea.
