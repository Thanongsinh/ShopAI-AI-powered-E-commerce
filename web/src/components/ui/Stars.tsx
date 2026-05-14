interface Props {
  rating: number;
  size?: number;
}

export function Stars({ rating, size = 12 }: Props) {
  return (
    <span className="inline-flex gap-[1px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{ fontSize: size, color: i <= rating ? '#F59E0B' : '#E5E7EB' }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
