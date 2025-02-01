# Bye useCallback

Vamos a ver si con `useCallback` también podemos quitarnoslo de enmedio.

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

¿Qué tenemos aquí?

- Un component optimizado con React memo (se llama ResetValue), que se supone que solo se renderiza la primera vez.

- Peeroo... ojo el estamos pasando una función como prop, que se crea en cada renderizado de `MyComponent`.

Si probamos verás que cada vez que cambiamos alguno de los valores de los inputs, se renderiza el componente `ResetValue` y se imprime en consola el mensaje.

¿Cómo solucionabamos esto antes que no teníamos el compilador de React, con `useCallback`?

Vamos a probarlo.

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

Si ahora probamos, verás que el componente `ResetValue` ya no se renderiza cada vez que cambiamos el valor de los inputs.

Vamos a probar con el compilador de React, lo habilitamos de nuevo.

_./vite.config.ts_

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

Y... redoble de tambores, vamos a quitar tanto el `React.memo` como el `useCallback` y ver si el compilador hace su trabajo.

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

¿Funcionará? Veamos...

```bash
npm run dev
```
