import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, Phone, MapPin, MessageCircle, Clock, Tag } from "lucide-react";
import { medicalCenters } from "../data/medicalCenters";

type City     = "Todos" | "Santo Domingo" | "Santiago";
type Category = "Todos" | "público" | "privado";

const CITY_OPTIONS: City[]         = ["Todos", "Santo Domingo", "Santiago"];
const CATEGORY_OPTIONS: Category[] = ["Todos", "público", "privado"];

const PUBLIC_COLOR  = "#3D8A62";
const PRIVATE_COLOR = "#3B9ED4";

function accentColor(category: string) {
  return category === "público" ? PUBLIC_COLOR : PRIVATE_COLOR;
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: 20,
        border: `2px solid ${active ? color : "#E8E0EE"}`,
        background: active ? `${color}18` : "white",
        color: active ? color : "#7A9B87",
        fontSize: "0.85rem",
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "Nunito, sans-serif",
        transition: "all 0.18s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function ActionButton({
  href,
  emoji,
  label,
  color,
}: {
  href: string;
  emoji: string;
  label: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "8px 14px",
        borderRadius: 14,
        background: `${color}12`,
        border: `1.5px solid ${color}30`,
        textDecoration: "none",
        fontFamily: "Nunito, sans-serif",
      }}
    >
      <span style={{ fontSize: "0.9rem" }}>{emoji}</span>
      <span style={{ fontSize: "0.78rem", fontWeight: 700, color }}>{label}</span>
    </a>
  );
}

function CenterCard({ center, index }: { center: typeof medicalCenters[0]; index: number }) {
  const color   = accentColor(center.category);
  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(center.address)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{
        background: "white",
        borderRadius: 20,
        overflow: "hidden",
        border: `1.5px solid ${color}30`,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      }}
    >
      {/* Color top strip */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />

      <div style={{ padding: "16px 18px" }}>
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <h3 style={{ fontSize: "1rem", fontWeight: 900, color: "#1E3A2F", lineHeight: 1.3, margin: 0, flex: 1 }}>
            {center.name}
          </h3>
          <span
            style={{
              flexShrink: 0,
              fontSize: "0.7rem",
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: 20,
              background: `${color}18`,
              color,
              textTransform: "capitalize",
              border: `1px solid ${color}30`,
            }}
          >
            {center.category}
          </span>
        </div>

        {/* Type */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 8 }}>
          <Tag style={{ width: 14, height: 14, color, flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: "0.82rem", color: "#4A6754", fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            {center.type}
          </p>
        </div>

        {/* Address */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: 8 }}>
          <MapPin style={{ width: 14, height: 14, color: "#9A8EAA", flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: "0.82rem", color: "#7A9B87", fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            {center.address}
          </p>
        </div>

        {/* Phone */}
        {center.phone && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <Phone style={{ width: 14, height: 14, color: "#9A8EAA", flexShrink: 0 }} />
            <p style={{ fontSize: "0.82rem", color: "#7A9B87", fontWeight: 600, margin: 0 }}>
              {center.phone}
            </p>
          </div>
        )}

        {/* Schedule */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 7, marginBottom: center.note ? 10 : 14 }}>
          <Clock style={{ width: 14, height: 14, color: "#9A8EAA", flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: "0.82rem", color: "#7A9B87", fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
            {center.schedule}
          </p>
        </div>

        {/* Note */}
        {center.note && (
          <div
            style={{
              background: `${color}0C`,
              border: `1px solid ${color}22`,
              borderRadius: 12,
              padding: "9px 12px",
              marginBottom: 14,
            }}
          >
            <p style={{ fontSize: "0.8rem", color, fontWeight: 600, margin: 0, lineHeight: 1.55 }}>
              ℹ️ {center.note}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {center.phone && (
            <ActionButton
              href={`tel:${center.phone.replace(/[-\s]/g, "")}`}
              emoji="📞"
              label="Llamar"
              color={color}
            />
          )}
          <ActionButton
            href={mapsUrl}
            emoji="🗺️"
            label="Cómo llegar"
            color="#7B52AB"
          />
          {center.whatsapp && (
            <ActionButton
              href={`https://wa.me/${center.whatsapp}`}
              emoji="💬"
              label="WhatsApp"
              color="#25D366"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function MedicalCenters() {
  const navigate  = useNavigate();
  const [city,     setCity]     = useState<City>("Todos");
  const [category, setCategory] = useState<Category>("Todos");

  const filtered = medicalCenters.filter(c => {
    const matchCity     = city === "Todos"     || c.city === city;
    const matchCategory = category === "Todos" || c.category === category;
    return matchCity && matchCategory;
  });

  const publicCount  = filtered.filter(c => c.category === "público").length;
  const privateCount = filtered.filter(c => c.category === "privado").length;

  return (
    <div style={{ minHeight: "100vh", background: "#F7F4F8", fontFamily: "Nunito, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1E3A2F 0%, #3D8A62 60%, #3B9ED4 100%)",
          padding: "48px 24px 28px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "rgba(255,255,255,0.18)",
              border: "none",
              borderRadius: "50%",
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <ChevronLeft style={{ width: 22, height: 22, color: "white" }} />
          </button>
          <div>
            <h1 style={{ color: "white", fontSize: "1.6rem", fontWeight: 900, margin: 0, lineHeight: 1.2 }}>
              🏥 Centros de Salud
            </h1>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: "0.82rem", fontWeight: 600, margin: "4px 0 0" }}>
              Rehabilitación y fisioterapia en República Dominicana
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10 }}>
          {[
            { label: "Total",    value: medicalCenters.length, color: "rgba(255,255,255,0.18)" },
            { label: "Públicos", value: medicalCenters.filter(c => c.category === "público").length,  color: `${PUBLIC_COLOR}55`  },
            { label: "Privados", value: medicalCenters.filter(c => c.category === "privado").length,  color: `${PRIVATE_COLOR}55` },
          ].map(s => (
            <div
              key={s.label}
              style={{ flex: 1, background: s.color, borderRadius: 14, padding: "10px 8px", textAlign: "center" }}
            >
              <p style={{ fontSize: "1.3rem", fontWeight: 900, color: "white", margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.8)", fontWeight: 700, margin: "3px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "20px", maxWidth: 760, margin: "0 auto" }}>

        {/* Filters */}
        <div style={{ background: "white", borderRadius: 18, padding: "14px 16px", marginBottom: 18, border: "1.5px solid #E8F5EE" }}>
          {/* City filter */}
          <p style={{ fontSize: "0.72rem", color: "#9A8EAA", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Ciudad
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {CITY_OPTIONS.map(c => (
              <FilterChip
                key={c}
                label={c}
                active={city === c}
                color="#3D8A62"
                onClick={() => setCity(c)}
              />
            ))}
          </div>

          {/* Category filter */}
          <p style={{ fontSize: "0.72rem", color: "#9A8EAA", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
            Tipo
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <FilterChip label="Todos"    active={category === "Todos"}    color="#7A9B87"        onClick={() => setCategory("Todos")} />
            <FilterChip label="Público"  active={category === "público"}  color={PUBLIC_COLOR}   onClick={() => setCategory("público")} />
            <FilterChip label="Privado"  active={category === "privado"}  color={PRIVATE_COLOR}  onClick={() => setCategory("privado")} />
          </div>
        </div>

        {/* Results count */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <p style={{ fontSize: "0.88rem", color: "#7A9B87", fontWeight: 700, margin: 0 }}>
            {filtered.length} {filtered.length === 1 ? "centro" : "centros"} encontrados
          </p>
          {category === "Todos" && filtered.length > 0 && (
            <>
              {publicCount  > 0 && <span style={{ fontSize: "0.75rem", fontWeight: 700, color: PUBLIC_COLOR,  background: `${PUBLIC_COLOR}15`,  border: `1px solid ${PUBLIC_COLOR}30`,  padding: "2px 10px", borderRadius: 20 }}>{publicCount} públicos</span>}
              {privateCount > 0 && <span style={{ fontSize: "0.75rem", fontWeight: 700, color: PRIVATE_COLOR, background: `${PRIVATE_COLOR}15`, border: `1px solid ${PRIVATE_COLOR}30`, padding: "2px 10px", borderRadius: 20 }}>{privateCount} privados</span>}
            </>
          )}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: 12 }}>🔍</span>
            <p style={{ fontSize: "1rem", fontWeight: 700, color: "#4A6754" }}>
              No hay centros con los filtros seleccionados
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.map((center, i) => (
              <CenterCard key={center.name} center={center} index={i} />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div
          style={{
            marginTop: 24,
            padding: "14px 16px",
            borderRadius: 16,
            background: "#EAF6FF",
            border: "1.5px solid #A8D8F0",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>⚕️</span>
          <p style={{ fontSize: "0.82rem", color: "#1A5276", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
            Verifica horarios y disponibilidad antes de visitar. La información puede cambiar. Siempre consulta con tu médico tratante antes de iniciar cualquier programa de rehabilitación.
          </p>
        </div>
      </div>
    </div>
  );
}
