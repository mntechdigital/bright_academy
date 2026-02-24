import { 
  LayoutDashboard, 
  Grip, 
  Package, 
  ImagePlus,
  // HelpCircle
} from "lucide-react";

export const NAV_ITEMS = [
  // Dashboard - always visible (not in roleFeature)
  { 
    icon: LayoutDashboard, 
    label: "Overview", 
    href: "/dashboard" 
  },
  
  // Services - index: 6
  { 
    icon: Grip, 
    label: "Teachers", 
    href: "/teachers" 
  },

  // Video Gallery - index: 12
  {
    icon: ImagePlus,
    label: "Students",
    href: "/students"
  },
  
  // Packages - index: 9
  { 
    icon: Package, 
    label: "Classes", 
    href: "/classes" 
  },

  // Result - index: 15
  { 
    icon: Package, 
    label: "Result", 
    href: "/result" 
  },
  
];