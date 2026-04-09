import { memo } from "react";

function Stat({ value, label, accent }) {
  return (
    <div className="stat-block">
      <div
        className="stat-block__value"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      <div className="stat-block__label">{label}</div>
    </div>
  );
}

export default memo(Stat);