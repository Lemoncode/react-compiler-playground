# NO bye React.memo predicate

Vamos con un ejemplo en el que el compilador ya no nos puede ayudar... claro que tampoco es adivino y son los `useMemo` con una condición compleja en el predicado.

Lo primero que vamos a hacer es comentar el compilador de React 19:

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

En este ejemplo vamos a hace un componente que muestre una carita más feliz o menos en base a unos rangos de valores de satisfacción.

Las _caritas_ las hemos colocado debajo de la carpeta `assets` y las puedes bajar del repo si quieres hacer el ejemplo desde cero.

Y al final de App.css vamos a añadir una clase para cada cara:

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

Metemos en el div principal la clase app:

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

Vamos ahora a por el componetne de Demo, este lo vamos a implementar por pasos.

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

Hacemos una prueba en _App.tsx_

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

Hagamos un punto de control y ejecutemos el ejemplo: comprobamos que todo funciona como esperamos.

```bash
npm run dev
```

Ahora es el momento de enlazar la propiedad con las correspondientes caras, vamos a crear una función para eso en demo.tsx

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

En app.tsx vamos a guardar el nivel de satisfación actual en el estado del componente, además de incluir un slider para dejar que el usuario lo actualice.

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

Vemos que todo sigue funcionando:

```bash
npm run dev
```

Para terminar vamos a optimizar el renderizado, el cual sólo deberíamos lanzarlo cuando cambie el rango de satisfacción:

_./src/demo.tsx_

```diff
import * as React from 'react';

const setSatisfactionClass = level => {

  if (level < 100) {
    return "very-dissatisfied"
  }

  if (level < 200) {
    return "somewhat-dissatisfied"
  }

  if (level < 300) {
    return "neither"
  }

  if (level < 400) {
    return "somewhat-satisfied"
  }

  return "very-satisfied"
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

  const { level } = props;

  return (
    <div className={setSatisfactionClass(level)}/>
  );
- }
+ }, isSameRange);
```

Si ahora ponemos un punto de parada en el método de renderizado de MyComponent, podemos ver que el renderizado sólo se lleva a cabo cuando el usuario cambio el rango de satisfacción (por ejemplo de 99 a 100).

```bash
npm run dev
```

¿ Aquí nos ayudaría el compiler? Vamos a ver...

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

Y ahora eliminamos el código de `useMemo` con predicado:

```diff
- export const MyComponent = React.memo((props: Props) => {
+ export const MyComponent: React.FC<Props> = (props) => {
  const { level } = props;
  console.log("** Face component rerender in progress...");

  return <div className={setSatisfactionClass(level)} />;
-}, isSameRange);
+ }
```

Aquí el compilador no nos ayuda, ¿Por qué? Porque es un caso más avanzado, ... y bueno de momento React compiler no es pitoniso.

Así que, para este caso SI que es buena idea utilizar `useMemo` con un predicado complejo.
