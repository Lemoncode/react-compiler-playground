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
