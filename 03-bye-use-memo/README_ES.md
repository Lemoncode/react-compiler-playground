# Bye useMemo

Ahora le toca a `useMemo`, ese hook que nos permite memorizar el resultado de una función y evitar que se recalcule en cada renderizado.

Empezamos como antes, deshabilitamos el compilador

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

Y ahora vamos a por el fichero `demo.tsx`, y vamos a probar el siguiente escenario:

_./src/demo.tsx_

```tsx
import React from "react";

const ExpensiveComponent: React.FC<{ count: number }> = ({ count }) => {
  const computedValue = (() => {
    console.log("Expensive computation");
    return count * 2;
  })();

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

¿ Qué tenemos aquí?

- Un componente que hace una supuesto calculo que se come muchos recursos.
- Sólo queremos que se lance cuando `count` cambie.

Si lo lanzamos vemos que se cambia cuando pulsamos el botón de incrementar, pero también cuando pulsamos el botón de `Toggle`.

¿ Como podemos evitar esto?, además de envolver el componente en `React.memo`, también podemos utilizar el hook de `useMemo`.

```diff
const ExpensiveComponent: React.FC<{ count: number }> = ({ count }) => {
-  const computedValue = (() => {
-    console.log("Expensive computation...");
-    return count * 2;
-  })();
+  const computedValue = React.useMemo(() => {
+    console.log("Expensive computation...");
+    return count * 2;
+  }, [count]);

  return <div>Computed Value: {computedValue}</div>;
};
```

Aquí le decimos a React que solo recalcule el valor de `computedValue` cuando `count` cambie.

Y ahora si funcionaria

Vamos a probarlo habilitando el compilador.

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

Y vamos a quitar el `useMemo`

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

¿Funcionará? Veamos...

```bash
npm run dev
```

Esto está muy bien, porque la de veces que nos olvidamos de meter un `useMemo` y se nos lía parda.
