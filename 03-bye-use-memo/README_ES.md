# Bye useMemo

Seguimos con esta serie de ejemplos probando el compilador de React, y ahora le toca el turno al primo hermano de `React.memo`, `useMemo` , ese hook que nos permite memorizar el resultado de una función y evitar que se recalcule en cada renderizado.

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

¿ Qué tenemos aquí?

- Un componente padre en el qu tenemos un contador y un estado booleano.

- Si pulsamos el botón de `Increment` incrementamos el contador, y esto hace que se repinte un componente hijo en el que simulamos un un cálculo complejo (bueno multplicar por dos un número no lo es), y sólo queremos que se dispare cuando cambie el contador.

Si lo lanzamos vemos que se cambia cuando pulsamos el botón de incrementar, pero también cuando pulsamos el botón de `Toggle`.

¿ Como podemos evitar esto?,podemos utilizar el hook de `useMemo` y envolver a esa función que tiene un cálculo complejo.

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

Aquí le decimos a React que solo recalcule el valor de `computedValue` cuando `count` cambie.

Y ahora, sí funcionaria

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

Y vamos a quitar el `useMemo`, en esta caso para ver si se invoca o no ese código, lo hemos envuelto en una función autoinvocada (así le podemos añadir un console.log, no haría falta hacer esto)

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

Para terminar, en el siguiente ejemplo, vamos a dar una última vuelta de tuerca a `React.memo` y ver que pasa si el metemos una condición para evaluar.


Esto está muy bien, porque la de veces que nos olvidamos de meter un `useMemo` y se nos lía parda.
