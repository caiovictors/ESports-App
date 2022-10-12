interface AdsInfosProps {
  label: string;
  value: string;
  colorValue?: string;
}

export function AdsInfos({ label, value, colorValue }: AdsInfosProps) {
  return (
    <div className="flex flex-col w-[150px]">
      <span className="text-sm text-[#D4D4D8]">{label}</span>
      <span
        className={`text-sm font-bold text-ellipsis truncate ${colorValue}`}
      >
        {value}
      </span>
    </div>
  );
}
