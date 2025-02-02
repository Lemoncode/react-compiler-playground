[![🇬🇧 Read in English](https://img.shields.io/badge/%F0%9F%87%AC%F0%9F%87%A7-View%20in%20English-blue)](./README.md)

# Experimentos con React Compiler 🚀

¡Bienvenido a este repositorio! Aquí exploramos **React Compiler** y probamos sus optimizaciones en comparación con métodos tradicionales como `React.memo`, `useCallback` y `useMemo`. A través de varios ejemplos, analizamos si el compilador nos ayuda a eliminar optimizaciones manuales o si algunos casos aún las requieren.

Cada ejemplo incluye una **guía paso a paso** para ayudarte a configurarlo y entender las optimizaciones, disponible en **inglés (`README.md`)** y **español (`README_ES.md`)**.

## 📌 Ejemplos

Cada ejemplo incluye un desglose del código, explicaciones paso a paso y una conclusión sobre si React Compiler optimiza con éxito el caso.

### 1️⃣ [Configurando React Compiler](./react_compiler_setup.md)
**Descripción:** Aprende a configurar un proyecto de React con React Compiler habilitado.  
👉 Incluye instalación, configuración e inicialización del proyecto.

### 2️⃣ [Bye React.memo](./bye_react_memo.md)
**Descripción:** Exploramos si el compilador puede optimizar automáticamente los casos donde `React.memo` era necesario.  
✅ El compilador elimina la necesidad de `React.memo` en escenarios simples.

### 3️⃣ [Bye useCallback](./bye_usecallback.md)
**Descripción:** Investigamos si el compilador hace que `useCallback` sea obsoleto al optimizar referencias de funciones.  
✅ React Compiler elimina la necesidad de `useCallback` en casos comunes.

### 4️⃣ [Bye useMemo](./bye_usememo.md)
**Descripción:** Probamos si el compilador optimiza cálculos costosos previamente envueltos en `useMemo`.  
✅ El compilador maneja casos simples de memoización sin necesidad de `useMemo`.

### 5️⃣ [NO bye React.memo Predicate](./no_bye_react_memo_predicate.md)
**Descripción:** Un caso donde React Compiler **no** puede ayudar: optimizar un componente basado en una condición compleja.  
❌ React Compiler **no** optimiza este caso, por lo que `React.memo` con un predicado sigue siendo necesario.

## 🛠 Ejecutando los Ejemplos

Cada ejemplo es independiente e incluye una **guía paso a paso** en **inglés (`README.md`)** y **español (`README_ES.md`)** dentro de su carpeta correspondiente.

### Pasos para ejecutar un ejemplo:
1. Clona este repositorio:
   ```bash
   git clone https://github.com/your-username/react-compiler-experiments.git
   cd react-compiler-experiments
   ```

2. Navega a la carpeta del ejemplo que deseas ejecutar:
   ```bash
   cd bye_react_memo  # Reemplázalo con la carpeta del ejemplo que quieras probar
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📢 Contribuir
Si encuentras casos interesantes donde React Compiler funciona (o no), ¡siéntete libre de abrir un issue o enviar un PR!

---

¡Disfruta programando y optimizando con React Compiler! 🚀
