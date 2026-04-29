"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StoryCanvas, type ElementKey } from "./StoryCanvas";
import { ImageUploadField } from "./ImageUploadField";
import {
  saveStoryTemplate,
  updateStoryTemplate,
  type StoryPayload,
} from "@/lib/actions/stories";
import {
  Card,
  IconButton,
  MacButton,
  MacField,
  MacInput,
  Segmented,
} from "@/components/admin/mac/primitives";
import {
  Download,
  Save,
  Sparkles,
  Undo2,
  Redo2,
  Image as ImageIcon,
  Type as TypeIcon,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const IDENTITY = { scaleX: 1, scaleY: 1, rotation: 0 };

/* Positions = centre de l'élément. */
const DEFAULT_TRANSFORMS = {
  logo: { x: 0.13, y: 0.08, ...IDENTITY },
  tag: { x: 0.27, y: 0.51, ...IDENTITY },
  title: { x: 0.5, y: 0.63, ...IDENTITY },
  genre: { x: 0.5, y: 0.75, ...IDENTITY },
};

const CATEGORY_COLORS = {
  musique: "#E52321",
  sport: "#2088FF",
  mode: "#D7239F",
  autre: "#1EDAC9",
} as const;

const BG_PALETTE = [
  "transparent",
  "#141110",
  "#0a0a0a",
  "#1a1a2e",
  "#0f2027",
  "#2d1b4e",
  "#7c1d1d",
  "#0d4f3c",
  "#f5f2ea",
  "#e8e4d8",
  "#ff6b9d",
  "#ffd700",
];

const ACCENT_PALETTE = [
  "#E52321",
  "#2088FF",
  "#D7239F",
  "#1EDAC9",
  "#FFD200",
  "#FF6B35",
  "#7C3AED",
  "#0A0A0A",
];

/* Triangle figé : 3% de la hauteur, orientation droite. */
const TRIANGLE_HEIGHT = 0.03;
const TRIANGLE_DIR = "right" as const;

const STORY_PRESETS: { name: string; payload: StoryPayload }[] = [
  {
    name: "Annonce",
    payload: {
      format: "story",
      backgroundUrl: "",
      logoVariant: "light",
      logoTheme: "default",
      textColor: "white",
      titleAlign: "center",
      tag: "Annonce",
      title: "La story de la semaine.",
      accent: "semaine",
      genre: "",
      genreColor: "#E52321",
      darkGradient: true,
      triangleHeight: TRIANGLE_HEIGHT,
      triangleDir: TRIANGLE_DIR,
      transforms: {
        ...DEFAULT_TRANSFORMS,
        tag: { x: 0.27, y: 0.51, scaleX: 1, scaleY: 1, rotation: -4 },
      },
    },
  },
];

const POST_PRESETS: { name: string; payload: StoryPayload }[] = (
  [
    { key: "musique", theme: "default" as const, tag: "Musique", title: "L'ARTISTE DÉVOILE SON NOUVEL\nALBUM « OCTANE » !", accent: "OCTANE" },
    { key: "sport", theme: "sport" as const, tag: "Sport", title: "Le debrief du week-end.", accent: "debrief" },
    { key: "mode", theme: "mode" as const, tag: "Mode", title: "Les looks qui font débat.", accent: "débat" },
    { key: "autre", theme: "autre" as const, tag: "Autre", title: "Culture urbaine & tendances.", accent: "tendances" },
  ] as const
).map(({ key, theme, tag, title, accent }) => ({
  name: tag,
  payload: {
    format: "post" as const,
    backgroundUrl: "",
    logoVariant: "light" as const,
    logoTheme: theme,
    textColor: "white" as const,
    titleAlign: "center" as const,
    tag,
    title,
    accent,
    genre: "",
    genreColor: CATEGORY_COLORS[key],
    darkGradient: true,
    triangleHeight: TRIANGLE_HEIGHT,
    triangleDir: TRIANGLE_DIR,
    transforms: {
      logo: { x: 0.12, y: 0.1, scaleX: 1, scaleY: 1, rotation: 0 },
      tag: { x: 0.25, y: 0.55, scaleX: 1, scaleY: 1, rotation: -4 },
      title: { x: 0.5, y: 0.69, scaleX: 1, scaleY: 1, rotation: 0 },
      genre: { x: 0.5, y: 0.82, scaleX: 1, scaleY: 1, rotation: 0 },
    },
  },
}));

const POST_TEXT_PRESETS: { name: string; payload: StoryPayload }[] = (
  [
    { key: "musique", theme: "default" as const, label: "Musique · texte" },
    { key: "sport", theme: "sport" as const, label: "Sport · texte" },
    { key: "mode", theme: "mode" as const, label: "Mode · texte" },
    { key: "autre", theme: "autre" as const, label: "Autre · texte" },
  ] as const
).map(({ key, theme, label }) => ({
  name: label,
  payload: {
    format: "post-text" as const,
    backgroundUrl: "",
    logoVariant: "light" as const,
    logoTheme: theme,
    textColor: "white" as const,
    titleAlign: "left" as const,
    // Les champs tag / title / accent / genre ne sont pas utilisés en post-text
    // mais restent présents pour compatibilité avec le schéma.
    tag: "",
    title: "",
    accent: "",
    genre: "",
    genreColor: CATEGORY_COLORS[key],
    darkGradient: true,
    triangleHeight: TRIANGLE_HEIGHT,
    triangleDir: TRIANGLE_DIR,
    paragraph1:
      "Lorem ipsum dolor sit amet **consectetur**. Malesuada tincidunt fames eget **tempus blandit** proin tortor. Venenatis auctor ultrices **purus** proin nisi **pellentesque** blandit lectus hendrerit.",
    paragraph2:
      "Lorem **ipsum** dolor sit amet **consectetur**. Malesuada tincidunt fames eget **tempus blandit** proin tortor.",
    transforms: {
      logo: { x: 0.5, y: 0.92, scaleX: 1, scaleY: 1, rotation: 0 },
      tag: { x: 0.25, y: 0.55, scaleX: 1, scaleY: 1, rotation: 0 },
      title: { x: 0.5, y: 0.69, scaleX: 1, scaleY: 1, rotation: 0 },
      genre: { x: 0.5, y: 0.82, scaleX: 1, scaleY: 1, rotation: 0 },
      paragraph1: { x: 0.5, y: 0.26, scaleX: 1, scaleY: 1, rotation: 0 },
      paragraph2: { x: 0.5, y: 0.515, scaleX: 1, scaleY: 1, rotation: 0 },
      accent: { x: 0.139, y: 0.668, scaleX: 1, scaleY: 1, rotation: 0 },
    },
  },
}));

const HISTORY_MAX = 80;

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                    */
/* ------------------------------------------------------------------ */

type Props = {
  initial?: {
    id: string;
    name: string;
    payload: StoryPayload;
  };
};

type Toast = { id: number; tone: "success" | "error"; text: string };

function normalizePayload(p: StoryPayload): StoryPayload {
  const base: StoryPayload = {
    ...p,
    triangleHeight: TRIANGLE_HEIGHT,
    triangleDir: TRIANGLE_DIR,
    logoTheme: p.logoTheme ?? "default",
  };
  // Garantir les transforms post-text (positions par défaut resserrées §2 ↔ trait).
  if (base.format === "post-text") {
    const t = base.transforms as Partial<
      Record<
        | "logo"
        | "tag"
        | "title"
        | "genre"
        | "paragraph1"
        | "paragraph2"
        | "accent",
        { x: number; y: number; scaleX?: number; scaleY?: number; rotation: number }
      >
    >;
    const iden = { scaleX: 1, scaleY: 1, rotation: 0 };
    base.transforms = {
      ...base.transforms,
      paragraph1: t.paragraph1 ?? { x: 0.5, y: 0.26, ...iden },
      paragraph2: t.paragraph2 ?? { x: 0.5, y: 0.515, ...iden },
      accent: t.accent ?? { x: 0.139, y: 0.618, ...iden },
      logo: t.logo ?? { x: 0.5, y: 0.92, ...iden },
    } as StoryPayload["transforms"];
  }
  return base;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function StoryEditor({ initial }: Props = {}) {
  const [payload, setPayloadState] = useState<StoryPayload>(
    normalizePayload(initial?.payload ?? POST_PRESETS[0].payload),
  );
  const [name, setName] = useState(initial?.name ?? "Nouveau post");
  const [templateId, setTemplateId] = useState<string | null>(
    initial?.id ?? null,
  );
  const [selected, setSelected] = useState<ElementKey | null>(null);
  const [pending, startTransition] = useTransition();
  const [inspectorTab, setInspectorTab] = useState<"design" | "text">("design");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const toastIdRef = useRef(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  /* -------- History (undo + redo) -------- */
  const undoStack = useRef<StoryPayload[]>([]);
  const redoStack = useRef<StoryPayload[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const touchHistory = useCallback(() => {
    setCanUndo(undoStack.current.length > 0);
    setCanRedo(redoStack.current.length > 0);
  }, []);

  const pushUndo = useCallback(
    (snap: StoryPayload) => {
      undoStack.current.push(snap);
      if (undoStack.current.length > HISTORY_MAX) undoStack.current.shift();
      redoStack.current = [];
      touchHistory();
    },
    [touchHistory],
  );

  const mutate = useCallback(
    (next: StoryPayload | ((p: StoryPayload) => StoryPayload)) => {
      setPayloadState((p) => {
        pushUndo(p);
        return typeof next === "function"
          ? (next as (p: StoryPayload) => StoryPayload)(p)
          : next;
      });
    },
    [pushUndo],
  );

  const update = <K extends keyof StoryPayload>(
    key: K,
    value: StoryPayload[K],
  ) => mutate((p) => ({ ...p, [key]: value }));

  const undo = useCallback(() => {
    const prev = undoStack.current.pop();
    if (!prev) return;
    setPayloadState((curr) => {
      redoStack.current.push(curr);
      return prev;
    });
    touchHistory();
  }, [touchHistory]);

  const redo = useCallback(() => {
    const next = redoStack.current.pop();
    if (!next) return;
    setPayloadState((curr) => {
      undoStack.current.push(curr);
      return next;
    });
    touchHistory();
  }, [touchHistory]);

  /* Drag on canvas pushes undo once, then updates transforms freely. */
  const onTransformStart = useCallback(() => {
    pushUndo(payload);
  }, [payload, pushUndo]);

  const onTransformChange = useCallback(
    (key: ElementKey, next: StoryPayload["transforms"][ElementKey]) => {
      setPayloadState((p) => ({
        ...p,
        transforms: { ...p.transforms, [key]: next },
      }));
    },
    [],
  );

  const onTextChange = useCallback(
    (
      key: "tag" | "title" | "genre" | "paragraph1" | "paragraph2",
      value: string,
    ) => {
      mutate((p) => ({ ...p, [key]: value }) as StoryPayload);
    },
    [mutate],
  );

  /* -------- Toast helper -------- */
  const toast = useCallback(
    (text: string, tone: "success" | "error" = "success") => {
      const id = ++toastIdRef.current;
      setToasts((ts) => [...ts, { id, tone, text }]);
      setTimeout(() => {
        setToasts((ts) => ts.filter((t) => t.id !== id));
      }, 2600);
    },
    [],
  );

  /* -------- Undo/redo keyboard only -------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target as HTMLElement | null;
      const inInput =
        tgt?.tagName === "INPUT" ||
        tgt?.tagName === "TEXTAREA" ||
        tgt?.isContentEditable;
      if (inInput) return;

      const mod = e.metaKey || e.ctrlKey;
      if (mod && !e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
        return;
      }
      if (
        (mod && e.shiftKey && e.key.toLowerCase() === "z") ||
        (mod && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        redo();
        return;
      }
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  /* -------- Presets -------- */
  const loadPreset = (p: { name: string; payload: StoryPayload }) => {
    mutate(normalizePayload(p.payload));
    setName(p.name);
    setSelected(null);
    // Un preset = toujours un nouveau template (évite d'écraser celui en cours).
    setTemplateId(null);
    if (searchParams?.get("id")) {
      router.replace("/admin/stories", { scroll: false });
    }
  };
  const activePresets =
    payload.format === "post"
      ? POST_PRESETS
      : payload.format === "post-text"
        ? POST_TEXT_PRESETS
        : STORY_PRESETS;

  /* -------- Export (toujours @2x) -------- */
  const onExport = async () => {
    const node = stageRef.current;
    if (!node) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const prev = node.style.transform;
      node.style.transform = "scale(1)";
      const canvas = await html2canvas(node, {
        backgroundColor: null,
        useCORS: true,
        scale: 2,
        width: node.offsetWidth,
        height: node.offsetHeight,
        windowWidth: node.offsetWidth,
        windowHeight: node.offsetHeight,
      });
      const a = document.createElement("a");
      a.download = `${(name || "post").toLowerCase().replace(/\s+/g, "-")}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
      node.style.transform = prev;
      toast("Export PNG généré");
    } catch {
      toast("Erreur d’export", "error");
    }
  };

  /* -------- Save / Update -------- */
  const onSave = () => {
    startTransition(async () => {
      try {
        if (templateId) {
          await updateStoryTemplate({ id: templateId, name, payload });
          toast("Template mis à jour");
        } else {
          const created = await saveStoryTemplate({ name, payload });
          if (created?.id) setTemplateId(created.id);
          toast("Template enregistré");
        }
      } catch {
        toast("Impossible d’enregistrer", "error");
      }
    });
  };

  return (
    <div className="relative">
      {/* ==================== TOOLBAR ==================== */}
      <Card className="sticky top-[60px] z-20 flex items-center justify-between gap-3 px-3 h-[46px] mb-4">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MacInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom du template"
            className="ui-input-subtle h-[30px] text-[13px] font-medium max-w-[260px]"
          />
          <Segmented
            value={payload.format}
            size="sm"
            onChange={(v) =>
              mutate((p) => ({
                ...p,
                format: v as "story" | "post" | "post-text",
              }))
            }
            options={[
              { value: "post", label: "Post" },
              { value: "post-text", label: "Post · texte" },
              { value: "story", label: "Story" },
            ]}
          />
          <span className="hidden lg:inline text-[11px] text-[color:var(--c-text-4)]">
            {payload.format === "story" ? "1080 × 1920" : "1080 × 1380"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <IconButton
            size="sm"
            tooltip="Annuler"
            onClick={undo}
            disabled={!canUndo}
          >
            <Undo2 size={14} strokeWidth={1.75} />
          </IconButton>
          <IconButton
            size="sm"
            tooltip="Rétablir"
            onClick={redo}
            disabled={!canRedo}
          >
            <Redo2 size={14} strokeWidth={1.75} />
          </IconButton>
        </div>

        <div className="flex items-center gap-2">
          <MacButton
            size="sm"
            onClick={onExport}
            icon={<Download size={13} strokeWidth={1.75} />}
          >
            Exporter
          </MacButton>
          <MacButton
            size="sm"
            variant="primary"
            onClick={onSave}
            disabled={pending}
            icon={<Save size={13} strokeWidth={1.75} />}
          >
            {pending
              ? "Enregistrement…"
              : templateId
                ? "Mettre à jour"
                : "Enregistrer"}
          </MacButton>
        </div>
      </Card>

      {/* ==================== LAYOUT ==================== */}
      <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr_300px] gap-4 items-start">
        {/* ---- Left: presets ---- */}
        <aside className="xl:sticky xl:top-[116px]">
          <Card>
            <div className="flex items-center h-9 px-3 border-b border-[color:var(--c-border)]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.05em] text-[color:var(--c-text-3)]">
                <Sparkles
                  size={13}
                  strokeWidth={1.75}
                  className="text-[color:var(--c-text-4)]"
                />
                Modèles
              </div>
            </div>
            <div className="p-3 grid grid-cols-2 gap-3">
              {activePresets.map((p) => (
                <PresetCard
                  key={p.name}
                  name={p.name}
                  payload={normalizePayload(p.payload)}
                  onClick={() => loadPreset(p)}
                />
              ))}
            </div>
          </Card>
        </aside>

        {/* ---- Center: canvas fills ---- */}
        <div className="min-w-0">
          <div
            className="rounded-[10px] border border-[color:var(--c-border)] ui-checker overflow-auto flex items-start justify-center"
            style={{ height: "calc(100vh - 180px)" }}
          >
            <div className="w-full">
              <StoryCanvas
                ref={stageRef}
                payload={payload}
                editable
                selected={selected}
                onSelect={setSelected}
                onTransformStart={onTransformStart}
                onTransformChange={onTransformChange}
                onTextChange={onTextChange}
              />
            </div>
          </div>
          <p className="mt-2 text-[11.5px] text-[color:var(--c-text-3)] text-center">
            Glisse les éléments directement sur le canvas · double-clic pour éditer le texte.
          </p>
        </div>

        {/* ---- Right: inspector ---- */}
        <aside className="xl:sticky xl:top-[116px]">
          <Card>
            <div className="px-2 py-2 border-b border-[color:var(--c-border)]">
              <Segmented
                value={inspectorTab}
                onChange={(v) => setInspectorTab(v)}
                size="sm"
                options={[
                  {
                    value: "design",
                    label: "Design",
                    icon: <Palette size={11} strokeWidth={1.75} />,
                  },
                  {
                    value: "text",
                    label: "Texte",
                    icon: <TypeIcon size={11} strokeWidth={1.75} />,
                  },
                ]}
              />
            </div>

            {payload.format === "post-text" && inspectorTab === "text" ? (
              <div className="p-4 space-y-5">
                <MacField
                  label="Paragraphe 1"
                  hint="Entoure un mot de ** pour le passer en gras — ex. **mot**."
                >
                  <textarea
                    className="ui-input"
                    rows={6}
                    value={(payload as { paragraph1?: string }).paragraph1 ?? ""}
                    onChange={(e) =>
                      mutate((p) =>
                        ({ ...p, paragraph1: e.target.value }) as StoryPayload,
                      )
                    }
                  />
                </MacField>
                <MacField label="Paragraphe 2" hint="Idem **mot** = gras.">
                  <textarea
                    className="ui-input"
                    rows={5}
                    value={(payload as { paragraph2?: string }).paragraph2 ?? ""}
                    onChange={(e) =>
                      mutate((p) =>
                        ({ ...p, paragraph2: e.target.value }) as StoryPayload,
                      )
                    }
                  />
                </MacField>
                <MacField label="Couleur du trait d'accent">
                  <ColorPicker
                    value={payload.genreColor}
                    onChange={(v) => update("genreColor", v)}
                    palette={ACCENT_PALETTE}
                  />
                </MacField>
              </div>
            ) : inspectorTab === "design" ? (
              <div className="p-4 space-y-5">
                <MacField label="Image de fond">
                  <ImageUploadField
                    value={payload.backgroundUrl}
                    onChange={(v) => update("backgroundUrl", v)}
                  />
                </MacField>

                <MacField
                  label="Couleur de fond"
                  hint="« Transparent » laisse apparaître l’image ou le damier."
                >
                  <ColorPicker
                    value={payload.backgroundColor ?? "transparent"}
                    onChange={(v) => update("backgroundColor", v)}
                    palette={BG_PALETTE}
                    allowTransparent
                  />
                </MacField>

                <MacField label="Couleur d’accent">
                  <ColorPicker
                    value={payload.genreColor}
                    onChange={(v) => update("genreColor", v)}
                    palette={ACCENT_PALETTE}
                  />
                </MacField>

                <Toggle
                  label="Dégradé sombre"
                  checked={payload.darkGradient}
                  onChange={(v) => update("darkGradient", v)}
                />

                <MacField label="Déclinaison du logo">
                  <Segmented
                    size="sm"
                    value={payload.logoTheme ?? "default"}
                    onChange={(v) =>
                      update(
                        "logoTheme",
                        v as "default" | "sport" | "mode" | "autre",
                      )
                    }
                    options={[
                      { value: "default", label: "Principal" },
                      { value: "sport", label: "Sport" },
                      { value: "mode", label: "Mode" },
                      { value: "autre", label: "Autre" },
                    ]}
                  />
                </MacField>

                <MacField label="Couleur du logo">
                  <Segmented
                    size="sm"
                    value={payload.logoVariant}
                    onChange={(v) =>
                      update("logoVariant", v as "light" | "black")
                    }
                    options={[
                      { value: "light", label: "Blanc" },
                      { value: "black", label: "Noir" },
                    ]}
                  />
                </MacField>

                <MacField label="Couleur texte">
                  <Segmented
                    size="sm"
                    value={payload.textColor}
                    onChange={(v) =>
                      update("textColor", v as "white" | "ink")
                    }
                    options={[
                      { value: "white", label: "Blanc" },
                      { value: "ink", label: "Noir" },
                    ]}
                  />
                </MacField>

                <MacField label="Alignement titre">
                  <Segmented
                    size="sm"
                    value={payload.titleAlign ?? "center"}
                    onChange={(v) =>
                      update(
                        "titleAlign",
                        v as "left" | "center" | "right",
                      )
                    }
                    options={[
                      {
                        value: "left",
                        label: "",
                        icon: <AlignLeft size={12} strokeWidth={1.75} />,
                      },
                      {
                        value: "center",
                        label: "",
                        icon: <AlignCenter size={12} strokeWidth={1.75} />,
                      },
                      {
                        value: "right",
                        label: "",
                        icon: <AlignRight size={12} strokeWidth={1.75} />,
                      },
                    ]}
                  />
                </MacField>
              </div>
            ) : (
              <div className="p-4 space-y-5">
                <div className="space-y-2">
                  <MacField label="Parallélogramme">
                    <MacInput
                      value={payload.tag}
                      onChange={(e) => update("tag", e.target.value)}
                      placeholder="Hot Take"
                    />
                  </MacField>
                  <div className="grid grid-cols-2 gap-2">
                    <MacField label="Police">
                      <Segmented
                        size="sm"
                        value={payload.tagFont ?? "kabel"}
                        onChange={(v) =>
                          update("tagFont", v as "kabel" | "capitana")
                        }
                        options={[
                          { value: "kabel", label: "Kabel" },
                          { value: "capitana", label: "Capitana" },
                        ]}
                      />
                    </MacField>
                    <MacField label={`Espacement (${((payload.tagTracking ?? 0.2) * 100).toFixed(0)}%)`}>
                      <input
                        type="range"
                        min={-5}
                        max={60}
                        step={1}
                        value={Math.round((payload.tagTracking ?? 0.2) * 100)}
                        onChange={(e) =>
                          update("tagTracking", Number(e.target.value) / 100)
                        }
                        className="w-full"
                      />
                    </MacField>
                  </div>
                </div>

                <div className="space-y-2">
                  <MacField label="Titre" hint="Utilise ↵ pour sauter une ligne.">
                    <textarea
                      className="ui-input"
                      rows={3}
                      value={payload.title}
                      onChange={(e) => update("title", e.target.value)}
                    />
                  </MacField>
                  <div className="grid grid-cols-2 gap-2">
                    <MacField label="Police">
                      <Segmented
                        size="sm"
                        value={payload.titleFont ?? "kabel"}
                        onChange={(v) =>
                          update("titleFont", v as "kabel" | "capitana")
                        }
                        options={[
                          { value: "kabel", label: "Kabel" },
                          { value: "capitana", label: "Capitana" },
                        ]}
                      />
                    </MacField>
                    <MacField label={`Espacement (${((payload.titleTracking ?? -0.02) * 100).toFixed(1)}%)`}>
                      <input
                        type="range"
                        min={-10}
                        max={30}
                        step={1}
                        value={Math.round((payload.titleTracking ?? -0.02) * 100)}
                        onChange={(e) =>
                          update("titleTracking", Number(e.target.value) / 100)
                        }
                        className="w-full"
                      />
                    </MacField>
                  </div>
                </div>

                <MacField label="Mot mis en avant">
                  <MacInput
                    value={payload.accent}
                    onChange={(e) => update("accent", e.target.value)}
                    placeholder="Mot à surligner"
                  />
                </MacField>
                <MacField label="Sous-titre">
                  <MacInput
                    value={payload.genre}
                    onChange={(e) => update("genre", e.target.value)}
                    placeholder="Optionnel"
                  />
                </MacField>
              </div>
            )}
          </Card>
        </aside>
      </div>

      {/* ==================== TOASTS ==================== */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "ui-fade-in flex items-center gap-2 px-3 h-9 rounded-[8px] bg-[color:var(--c-surface)] text-[color:var(--c-text)] border shadow-[var(--s-3)]",
              t.tone === "success"
                ? "border-[color:var(--c-border)]"
                : "border-[color:var(--c-danger-soft)]",
            )}
          >
            <span
              className={cn(
                "w-5 h-5 rounded-full grid place-items-center text-white text-[10px]",
                t.tone === "success"
                  ? "bg-[color:var(--c-success)]"
                  : "bg-[color:var(--c-danger)]",
              )}
            >
              {t.tone === "success" ? <Check size={11} /> : "!"}
            </span>
            <span className="text-[12.5px] font-medium">{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PresetCard — vraie preview via StoryCanvas                         */
/* ------------------------------------------------------------------ */

function PresetCard({
  name,
  payload,
  onClick,
}: {
  name: string;
  payload: StoryPayload;
  onClick: () => void;
}) {
  const transparent =
    !payload.backgroundColor ||
    payload.backgroundColor === "transparent" ||
    payload.backgroundColor === "";
  return (
    <button
      type="button"
      onClick={onClick}
      className="group text-left"
    >
      <div
        className={cn(
          "rounded-[6px] border border-[color:var(--c-border)] overflow-hidden transition-all group-hover:border-[color:var(--c-text)]",
          transparent && "ui-checker",
        )}
      >
        <div className="pointer-events-none">
          <StoryCanvas payload={payload} editable={false} />
        </div>
      </div>
      <p className="mt-1.5 text-[11.5px] font-medium truncate group-hover:text-[color:var(--c-accent)] transition-colors">
        {name}
      </p>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers UI                                                          */
/* ------------------------------------------------------------------ */

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer">
      <span className="text-[12px] font-medium text-[color:var(--c-text-2)]">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-[34px] h-[20px] rounded-full transition-colors ui-focus",
          checked
            ? "bg-[color:var(--c-accent)]"
            : "bg-[color:var(--c-surface-3)]",
        )}
      >
        <span
          className="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-all"
          style={{ left: checked ? 16 : 2 }}
        />
      </button>
    </label>
  );
}

function ColorPicker({
  value,
  onChange,
  palette,
  allowTransparent,
}: {
  value: string;
  onChange: (v: string) => void;
  palette: string[];
  allowTransparent?: boolean;
}) {
  const isTransparent = value === "transparent" || value === "";
  const safeHex =
    isTransparent || !/^#[0-9a-fA-F]{6}$/.test(value) ? "#141110" : value;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label
          className={cn(
            "w-8 h-8 rounded-[6px] border border-[color:var(--c-border)] shrink-0 overflow-hidden cursor-pointer relative",
            isTransparent && "ui-checker",
          )}
          style={isTransparent ? undefined : { background: value }}
        >
          <input
            type="color"
            value={safeHex}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>
        <MacInput
          value={isTransparent ? "TRANSPARENT" : value.toUpperCase()}
          onChange={(e) => {
            const v = e.target.value.trim();
            if (v.toLowerCase() === "transparent" && allowTransparent) {
              onChange("transparent");
            } else {
              onChange(v);
            }
          }}
          className="text-[11px] h-[32px]"
          style={{ fontFamily: "var(--f-mono)" }}
        />
      </div>
      <div className="grid grid-cols-6 gap-1.5">
        {palette.map((c) => {
          const t = c === "transparent";
          const selected =
            (isTransparent && t) ||
            (!isTransparent && value.toLowerCase() === c.toLowerCase());
          return (
            <button
              key={c}
              type="button"
              onClick={() => onChange(c)}
              className={cn(
                "relative w-full aspect-square rounded-[5px] border transition-transform hover:scale-110 overflow-hidden",
                t && "ui-checker",
                selected
                  ? "border-[color:var(--c-text)] ring-2 ring-[color:var(--c-accent-ring)]"
                  : "border-[color:var(--c-border)]",
              )}
              style={t ? undefined : { background: c }}
              aria-label={t ? "Transparent" : c}
              title={t ? "Transparent" : c}
            >
              {t && (
                <span className="absolute inset-0 grid place-items-center text-[9px] font-semibold text-[color:var(--c-text-3)]">
                  ∅
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
