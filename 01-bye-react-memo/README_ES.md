# Bye React.memo

En el ejemplo anterior creamos un proyecto en blanco y le metimos soporte a React Compiler.

Ahora vamos a ver como podemos optimizar a la antigua un componente con `React.memo` y ver que pasa si metemos el complicador en el proyecto.

Antes de ponernos manos a la obra, hacemos un poco de limpia en el proyecto semilla:

- Borramos de `public` y `./src/assets` imagenes que no vams a usar.

- Creamos un fichero `demo.tsx` en la raíz del proyecto.

- Y añadimos un componente tonto que se va a llamar `MyComponent`.

Y ahora sí, vamos al lío, lo primero que vamos a hacer es deshabilitar el compilador y ver como optimizar sin su ayuda, utilizando `React.memo`.

Deshabilitamos el compilador:

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

¿Cómo optimizabamos esto en la era `precompilador` con `React.memo`?

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

Sin duda alguna los mejores avances en librerías, son lo que nos permiten olvidarnos de ellos y centrarnos en lo que realmente importa, en este caso, en la lógica de nuestra aplicación.

