export interface Tab {
  name: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
}

export type NavigationType = "TOP" | "BOTTOM";

export interface NavigationProps {
  tabs: Tab[];
  type: NavigationType;
  logo?: string;
}
