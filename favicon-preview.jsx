import { useState } from "react";

const RED = "#ff2e43";
const GREEN = "#1ec98a";
const BG = "#000000";

const SIZES = [16, 32, 64, 128];

function FaviconC({ size, colorA, colorB }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx={size <= 32 ? 5 : 7} fill={BG} />
      <path d="M 3 22 A 14 14 0 0 1 29 10"
        stroke={colorA} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M 29 10 A 14 14 0 0 1 3 22"
        stroke={colorB} strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2" fill={colorA} />
    </svg>
  );
}

const variants = [
  {
    id: "vr",
    label: "Verde + Vermelho",
    colorA: GREEN,
    colorB: RED,
    desc: "Arco verde horário, vermelho anti-horário. Ponto central verde.",
  },
  {
    id: "rv",
    label: "Vermelho + Verde",
    colorA: RED,
    colorB: GREEN,
    desc: "Arco vermelho horário, verde anti-horário. Ponto central vermelho.",
  },
  {
    id: "vb",
    label: "Verde + Branco (original C)",
    colorA: GREEN,
    colorB: "#f4f0e6",
    desc: "Versão com branco substituindo o vermelho.",
  },
  {
    id: "rb",
    label: "Vermelho + Branco",
    colorA: RED,
    colorB: "#f4f0e6",
    desc: "Paleta noir clássica — vermelho e branco sobre preto.",
  },
];

export default function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{
      background: "#080808", minHeight: "100vh", color: "#f4f0e6",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif",
      padding: "28px 18px",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        <div style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5f5b54", marginBottom: 6 }}>
          CineStats · Favicon · Logo C
        </div>
        <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 800 }}>Variações de cor — Arcos em S</h1>
        <p style={{ margin: "0 0 24px", color: "#9a958c", fontSize: 13, lineHeight: 1.5 }}>
          Mesmo formato do Logo C, testando combinações com verde e vermelho.
        </p>

        {variants.map(({ id, label, colorA, colorB, desc }) => (
          <div key={id} onClick={() => setSelected(id)} style={{
            background: selected === id ? "#0d100d" : "#0c0c0e",
            border: `1px solid ${selected === id ? colorA : "#26262b"}`,
            borderRadius: 12, padding: "16px 18px", marginBottom: 12, cursor: "pointer",
            transition: "all 0.15s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              {/* Mini swatch das duas cores */}
              <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                <div style={{ width: 8, height: 16, borderRadius: "3px 0 0 3px", background: colorA }} />
                <div style={{ width: 8, height: 16, borderRadius: "0 3px 3px 0", background: colorB }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{label}</span>
            </div>

            <div style={{
              display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap",
              background: "#0e0e10", borderRadius: 8, padding: "14px 16px", marginBottom: 10,
            }}>
              {SIZES.map(size => (
                <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <FaviconC size={size} colorA={colorA} colorB={colorB} />
                  <span style={{ fontSize: 10, color: "#5f5b54" }}>{size}px</span>
                </div>
              ))}
              {/* Tab simulada */}
              <div style={{
                marginLeft: "auto", background: "#1e1e22", borderRadius: 6,
                padding: "5px 10px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
              }}>
                <FaviconC size={16} colorA={colorA} colorB={colorB} />
                <span style={{ fontSize: 11, color: "#9a958c", whiteSpace: "nowrap" }}>CineStats</span>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: 13, color: "#9a958c", lineHeight: 1.5 }}>{desc}</p>
          </div>
        ))}

        {selected && (
          <div style={{
            background: "#0d100d",
            border: `1px solid ${variants.find(v => v.id === selected)?.colorA}`,
            borderRadius: 12, padding: "14px 18px", marginTop: 6,
          }}>
            <div style={{ fontSize: 10, color: variants.find(v => v.id === selected)?.colorA, fontWeight: 700, marginBottom: 3, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Selecionado
            </div>
            <div style={{ fontSize: 14, color: "#f4f0e6" }}>
              {variants.find(v => v.id === selected)?.label} — confirme e implemento no{" "}
              <code style={{ background: "#26262b", padding: "1px 5px", borderRadius: 4, fontSize: 12 }}>index.html</code>.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
