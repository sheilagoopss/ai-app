export const getNumber = (value?: string | number): number => {
  if (!value) return 0;
  if (typeof value === "number") {
    return value;
  } else if (typeof value === "string") {
    const cleanedValue = value.replace(/,/g, "");
    return cleanedValue.includes(".")
      ? parseFloat(cleanedValue)
      : parseInt(cleanedValue, 10);
  }
  return 0;
};
