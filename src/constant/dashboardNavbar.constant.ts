import { 
  LayoutDashboard, 
  Grip, 
  Package, 
  Landmark, 
  Users, 
  ImagePlus, 
  MessageCircleMore, 
  FileText, 
  Shield,
  Settings, 
  Layers2,
  Mail,
  User,
  LogOut,
  // HelpCircle
} from "lucide-react";

export const NAV_ITEMS = [
  // Dashboard - always visible (not in roleFeature)
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    href: "/dashboard" 
  },
  
  // Services - index: 6
  { 
    icon: Grip, 
    label: "Services", 
    href: "/services" 
  },

  // Video Gallery - index: 12
  {
    icon: ImagePlus,
    label: "Video Gallery",
    href: "/video-gallery"
  },
  
  // Packages - index: 9
  { 
    icon: Package, 
    label: "Packages", 
    href: "/packages" 
  },
  
  // Five pillars of islam - index: 4
  { 
    icon: Landmark, 
    label: "Five pillars of islam", 
    href: "/fivePillarsOfIslam" 
  },
  
  // Contacts - index: 5
  { 
    icon: Users, 
    label: "Contacts", 
    href: "/contacts" 
  },
  
  // Gallery - index: 10
  { 
    icon: ImagePlus, 
    label: "Gallery", 
    href: "/gallery" 
  },
  
  // Reviews - index: 11
  { 
    icon: MessageCircleMore, 
    label: "Reviews", 
    href: "/reviews" 
  },
  
  // Blogs - index: 3
  { 
    icon: FileText, 
    label: "Blogs", 
    href: "/blogs" 
  },
  
  // Roles & Permissions - index: 2
  { 
    icon: Shield, 
    label: "Roles", 
    href: "/roles_permissions" 
  },

  
  // Page Settings - index: 8 (with dropdown children)
  {
    icon: Settings,
    label: "Page Settings",
    href: "/page-setting",
    children: [
      { 
        label: "Hero Area", 
        href: "/dashboard/page-setting/hero-area", 
        icon: Layers2 
      },
      { 
        label: "About Us", 
        href: "/dashboard/page-setting/about-us", 
        icon: FileText 
      },
      { 
        label: "Contacts Us", 
        href: "/dashboard/page-setting/contact-us", 
        icon: Mail 
      },
    ],
  },
  
  // Update Profile - index: 7
  { 
    icon: User, 
    label: "Update Profile", 
    href: "/update-profile" 
  },

  // Auth/Logout - index: 1
  { 
    icon: LogOut, 
    label: "Log Out", 
    href: "/auth",
    isLogout: true // Add this flag to identify logout
  },
];