const positions = [
  'top',
  'right',
  'bottom',
  'left',
  'top-left',
  'top-right',
  'bottom-right',
  'bottom-left',
];

export default function EdgeAmbience() {
  return (
    <div className="edge-blobs-wrapper" aria-hidden="true">
      {positions.map((position) => (
        <div className={`blob blob-${position}`} key={position} />
      ))}
    </div>
  );
}
