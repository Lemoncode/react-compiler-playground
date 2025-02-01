# Bye useMemo

Vamos a por el primer paso, lo primero que vamos a hacer es deshabilitar el compilador y ver lo que ocurre y como lo arreglabamos antes con `useMemo`.

Lo primero, deshabilitamos el compilador:

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

Y en el fichero `demo.tsx` vamos a añadir el siguiente código:

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
    name: " John ",
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

¿Qué estamos haciendo aquí?

- Tenemos un useState que guarda un objeto con los campos `nombre` y `apellidos`.

- Tenemos un componente `DisplayUsername` que recibe el nombre y lo muestra en un `h3`.

- El apellido directamente lo mostramos en el mismo component.

- Tenemos dos inputs, uno para el nombre y otro para el apellido.

> Ojo esto es un ejemplo muy simplificado y forzado para ver el comportamiento de React.memo.

Si te fijas `DisplayUsername` sólo recibe como props la propiedad `name`, por lo que si cambiamos el apellido, no debería de volver a renderizarse ¿O sí? Si lo probamos... cada vez que cambiamos nombre o apellido, `displayUsername` se renderiza.

¿Cómo optimizabamos esto en la era `precompilador` con `useMemo`?

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

Si ahora ejecutamos podemos ver como `DisplayUsername` sólo se renderiza cuando cambiamos el nombre.

¿Probamos con el compilador?

Activamos el compilador de nuevo

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

Vamos a eliminar ese `React.memo` y vamos a ver que ocurre.

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

Ejecutamos, abrimos la consola y.... ¡¡ funciona !!
