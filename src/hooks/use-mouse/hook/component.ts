export const ComponentBadgeList = [
  {
    slug: "new",
    name: "New",
    description:
      "This component is new and has not been tested by the community yet.",
  },
  {
    slug: "updated",
    name: "Updated",
    description: "This component has been updated recently.",
  },
  {
    slug: "deprecated",
    name: "Deprecated",
    description:
      "This component is deprecated and will be removed in the future.",
  },
  {
    slug: "experimental",
    name: "Experimental",
    description: "This component is experimental and might not be stable.",
  },
  {
    slug: "no-js",
    name: "No JS",
    description: "This component does not require JavaScript to work.",
  },
  {
    slug: "prefer-desktop",
    name: "Prefer Desktop",
    description: "This component is best used on desktop devices.",
  },
  {
    slug: "better-in-dark-mode",
    name: "Better in Dark Mode",
    description: "This component looks better in dark mode.",
  },
] as const;

export type ComponentBadgeSlug = (typeof ComponentBadgeList)[number]["slug"];
export type ComponentHeightType = "xs" | "sm" | "md" | "lg" | "xl";

export type ComponentMetaType = {
  name: string;
  description: string;
  isResizable?: boolean;
  componentBadges?: ComponentBadgeSlug[];
  isIframed?: boolean;
  rerenderButton?: boolean;
  inspiration?: string;
  inspirationLink?: string;
  sizePreview?: ComponentHeightType;
};

export const Component: ComponentMetaType = {
  name: "Use Mouse",
  description: "A hook to get the mouse position",
};

export default Component;
