export default function CapacityField({
  label,
  name,
  value,
  handler,
  error,
  range,
}) {
  return (
    <>
      {" "}
      <div className="text-left mt-5 text-base font-medium tracking-normal dark:text-white  text-gray-700">
        {" "}
        {label}{" "}
      </div>{" "}
      <input
        type="number"
        min={range[0]}
        max={range[1] || ""}
        step={1}
        name={name}
        value={value}
        className="pl-3 shrink-0 mt-3.5 rounded-lg border border-solid dark:text-black bg-gray-100 bg-opacity-90 border-zinc-800 border-opacity-30 h-[41px]"
        onChange={handler}
      />{" "}
      {error !== "" && (
        <span className="text-red-700 font-bold text-wrap">{error}</span>
      )}
    </>
  );
}
