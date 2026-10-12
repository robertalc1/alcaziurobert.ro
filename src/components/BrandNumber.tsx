type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type BrandNumberProps = {
  value: Digit | `0${Digit}`;
  className?: string;
};

/** A reusable, font-independent numeral with the primary button's blue finish. */
const BrandNumber = ({ value, className = "" }: BrandNumberProps) => (
  <span className={`brand-number ${className}`}>
    <span className="sr-only">{value}</span>
    {String(value).split("").map((digit, index) => (
      <img
        key={`${digit}-${index}`}
        src={`/numbers/${digit}.svg`}
        alt=""
        aria-hidden="true"
        width={80}
        height={100}
        decoding="async"
        draggable={false}
      />
    ))}
  </span>
);

export default BrandNumber;
