'use client';

/** Aantal wijzigen. Twee knoppen met een duidelijk voorgelezen doel. */

export function QuantityStepper({
  value,
  onChange,
  label,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  /** Waar dit aantal bij hoort, bijvoorbeeld "Duinjas, maat M". */
  label: string;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center border border-line">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="flex h-9 w-9 items-center justify-center text-ink transition-opacity duration-200 hover:opacity-60"
      >
        <span className="sr-only">
          {value === 1 ? `${label} verwijderen` : `Eén ${label} minder`}
        </span>
        <span aria-hidden="true">–</span>
      </button>

      <span className="min-w-8 text-center text-[0.875rem] tabular-nums" aria-live="off">
        <span className="sr-only">Aantal {label}: </span>
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="flex h-9 w-9 items-center justify-center text-ink transition-opacity duration-200 hover:opacity-60 disabled:opacity-30"
      >
        <span className="sr-only">Eén {label} meer</span>
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );
}
