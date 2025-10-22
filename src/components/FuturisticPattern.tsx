"use client";

export default function FuturisticPattern() {
  return (
    <>
      <div className="futuristic-pattern">
        <span className="ripple-overlay"></span>
        <svg className="texture-filter">
        <filter id="advanced-texture">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.7"
            numOctaves={3}
            result="noise"
          />
          <feSpecularLighting
            in="noise"
            surfaceScale="2"
            specularConstant="0.8"
            specularExponent="20"
            lightingColor="#fff"
            result="specular"
          >
            <fePointLight x="50" y="50" z="100" />
          </feSpecularLighting>
          <feComposite
            in="specular"
            in2="SourceGraphic"
            operator="in"
            result="litNoise"
          />
          <feBlend in="SourceGraphic" in2="litNoise" mode="overlay" />
        </filter>
      </svg>

      <style jsx>{`
        .futuristic-pattern {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            145deg,
            rgb(0, 0, 0),
            rgba(10, 10, 10, 0.98),
            rgb(15, 15, 15)
          );
          filter: url(#advanced-texture);
        }

        .texture-filter {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
        }

        .ripple-overlay {
          position: absolute;
          inset: 0;
        }
      `}</style>
      </div>
      
      {/* Black overlay */}
      <div className="absolute inset-0 bg-black/10"></div>
    </>
  );
}

