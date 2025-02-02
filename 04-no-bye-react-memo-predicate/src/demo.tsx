import * as React from "react";

interface Props {
  level: number;
}

const setSatisfactionClass = (level: number) => {
  if (level < 100) {
    return "very-dissatisfied";
  }

  if (level < 200) {
    return "somewhat-dissatisfied";
  }

  if (level < 300) {
    return "neither";
  }

  if (level < 400) {
    return "somewhat-satisfied";
  }

  return "very-satisfied";
};

const isSameRange = (prevValue: Props, nextValue: Props) => {
  const prevValueClass = setSatisfactionClass(prevValue.level);
  const nextValueClass = setSatisfactionClass(nextValue.level);

  return prevValueClass === nextValueClass;
};

export const MyComponent: React.FC<Props> = (props) => {
  const { level } = props;
  console.log("** Face component rerender in progress...");

  return <div className={setSatisfactionClass(level)} />;
};
