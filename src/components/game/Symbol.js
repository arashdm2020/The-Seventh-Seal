export default function Symbol({ name, ...props }) {
  return (
    <svg
      viewBox="-18 -18 36 36"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>{name[0].toUpperCase() + name.slice(1)}</title>
      {name === "key" && (
        <>
          <circle cx="-7" cy="-7" r="6" />
          <path d="M-3 -3 13 13M8 8 13 3M11 11 16 6" />
        </>
      )}
      {name === "flame" && (
        <>
          <path d="M0 -16C8 -6 2 -5 9 -10C20 4 10 15 0 15C-13 15 -17 4 -8 -7C-8 0 -3 -1 0 -16Z" />
          <path d="M1 1C9 10 5 14 0 14C-5 14 -7 8 1 1Z" />
        </>
      )}
      {name === "crown" && (
        <>
          <path d="M-13 9 -15 -8 -6 -1 0 -14 6 -1 15 -8 13 9Z M-12 13H12" />
          <circle cy="-14" r="1" />
        </>
      )}
      {name === "serpent" && (
        <>
          <path d="M8 -10C-6 -19 -17 -8 -5 -2C12 7 11 17 -3 14C-16 10 -10 3 -4 6" />
          <path d="M5 -13 14 -12 11 -5 5 -7Z M14 -12 17 -15" />
          <circle cx="10" cy="-10" r=".8" fill="currentColor" />
        </>
      )}
      {name === "hourglass" && (
        <>
          <path d="M-11 -15H11M-11 15H11M-8 -14C-8 -5 8 -5 8 14M8 -14C8 -5 -8 -5 -8 14M-5 -10H5M-5 11 0 7 5 11Z" />
        </>
      )}
      {name === "compass" && (
        <>
          <circle r="13" />
          <path d="M5 -10 3 3 -5 10 -3 -3Z M0 -16V-13M0 13V16M-16 0H-13M13 0H16" />
          <circle r="1" />
        </>
      )}
      {name === "gate" && (
        <>
          <path d="M-12 15V-4A12 12 0 0 1 12 -4V15 M-7 15V-4A7 7 0 0 1 7 -4V15 M0 -11V15M-7 1H7M-7 9H7M-15 15H15" />
        </>
      )}
      {name === "raven" && (
        <>
          <path d="M-14 10 -7 -3 0 -6 4 -13 11 -11 16 -6 9 -5 8 3 -2 10 -14 10Z M-7 -3 2 2 -7 8 M-2 10 -4 15M2 8 2 15M-7 15H5" />
          <circle cx="7" cy="-9" r="1" fill="currentColor" />
        </>
      )}
      {name === "anchor" && (
        <>
          <circle cy="-11" r="4" />
          <path d="M0 -7V15M-8 -3H8M-13 4C-13 15 13 15 13 4M-16 8 -13 4 -9 7M9 7 13 4 16 8" />
        </>
      )}
      {name === "hand" && (
        <path d="M-8 15 -15 2Q-16 -2 -12 -1L-7 5V-8Q-7 -13 -3 -10V-14Q-3 -18 1 -14V-11Q4 -15 6 -10V-7Q10 -11 11 -6V6L7 15Z M-3 -10V1M1 -11V1M6 -7V2" />
      )}
      {name === "skull" && (
        <>
          <path d="M-9 7C-20 -4 -11 -15 0 -15C11 -15 20 -4 9 7V14H-9Z M-4 8V14M4 8V14" />
          <circle cx="-6" cy="-3" r="3" />
          <circle cx="6" cy="-3" r="3" />
          <path d="M0 2 -2 6H2Z" />
        </>
      )}
      {name === "infinity" && (
        <path d="M0 0C-6 -13 -16 -11 -16 0C-16 11 -6 13 0 0C6 -13 16 -11 16 0C16 11 6 13 0 0Z" />
      )}
      {name === "sun" && (
        <>
          <circle r="7" />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M0 -11V-15" transform={`rotate(${i * 45})`} />
          ))}
        </>
      )}
      {name === "moon" && (
        <path d="M5 -13A13 13 0 1 0 5 13A15 15 0 0 1 5 -13Z" />
      )}
      {name === "star" && (
        <path d="M0 -15 4 -5 15 -4 7 3 9 14 0 8 -9 14 -7 3 -15 -4 -4 -5Z" />
      )}
      {name === "eye" && (
        <>
          <path d="M-16 0Q0 -20 16 0Q0 20 -16 0Z" />
          <circle r="5" />
          <circle r="1" fill="currentColor" />
        </>
      )}
      {name === "mountain" && (
        <>
          <path d="M-15 12 0 -13 15 12Z M-5 -4 0 0 5 -4" />
          <path d="M-11 16H11" />
        </>
      )}
      {name === "diamond" && (
        <path d="M0 -14 11 0 0 14 -11 0Z M0 -7 5 0 0 7 -5 0Z" />
      )}
      {name === "circle" && (
        <>
          <circle r="12" />
          <circle r="7" />
          <path d="M-15 0H15M0 -15V15" />
        </>
      )}
      {name === "path" && (
        <>
          <path d="M0 15V0L-12 -12M0 0 12 -12M-12 -5V-12H-5M5 -12H12V-5" />
          <circle cy="10" r="2" />
        </>
      )}
    </svg>
  );
}
