# React Compiler Experiments 🚀

Welcome to this repository! Here, we explore **React Compiler** and test its optimizations against traditional methods like `React.memo`, `useCallback`, and `useMemo`. Through various examples, we analyze whether the compiler helps us eliminate manual optimizations—or if some cases still require them.

Each example includes a **step-by-step guide** to help you set up and understand the optimizations, available in both **English (`README.md`)** and **Spanish (`README_ES.md`)**.

## 📌 Examples

Each example includes a breakdown of the code, step-by-step explanations, and a conclusion about whether React Compiler successfully optimizes the scenario.

### 1️⃣ [Setting Up React Compiler](./react_compiler_setup.md)
**Description:** Learn how to set up a React project with React Compiler enabled.  
👉 Covers installation, configuration, and project initialization.

### 2️⃣ [Bye React.memo](./bye_react_memo.md)
**Description:** We explore whether the compiler can automatically optimize cases where `React.memo` was previously required.  
✅ The compiler successfully eliminates the need for `React.memo` in simple scenarios.

### 3️⃣ [Bye useCallback](./bye_usecallback.md)
**Description:** Investigating whether the compiler makes `useCallback` obsolete when optimizing function references.  
✅ React Compiler removes the need for `useCallback` in common cases.

### 4️⃣ [Bye useMemo](./bye_usememo.md)
**Description:** We test whether the compiler optimizes expensive calculations previously wrapped in `useMemo`.  
✅ The compiler handles simple memoization cases without requiring `useMemo`.

### 5️⃣ [NO bye React.memo Predicate](./no_bye_react_memo_predicate.md)
**Description:** A scenario where React Compiler **does not** help—optimizing a component based on a complex conditional predicate.  
❌ React Compiler **cannot** optimize this case, meaning `React.memo` with a predicate is still necessary.

## 🛠 Running the Examples

Each example is self-contained and includes a **step-by-step guide** in both **English (`README.md`)** and **Spanish (`README_ES.md`)** inside its respective folder.

### Steps to run an example:
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/react-compiler-experiments.git
   cd react-compiler-experiments
   ```

2. Navigate to the example folder you want to run:
   ```bash
   cd bye_react_memo  # Replace with the desired example folder
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 📢 Contributing
Feel free to open issues or submit PRs if you find interesting cases where React Compiler does (or doesn't) optimize as expected.

---

Enjoy coding and optimizing with React Compiler! 🚀
