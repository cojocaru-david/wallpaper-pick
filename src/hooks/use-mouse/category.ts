import { MousePointer2Icon, type LucideIcon } from "lucide-react";

export type CategoryMetaType = {
  name: string;
  description: string;
  latestUpdateDate: Date;
  icon: LucideIcon;
  isComingSoon?: boolean;
};

export const useMouseCategory: CategoryMetaType = {
  name: "Use Mouse",
  icon: MousePointer2Icon,
  latestUpdateDate: new Date("2024-09-24"),
  description: "A simple hook to get the mouse position.",
};

export default useMouseCategory;
