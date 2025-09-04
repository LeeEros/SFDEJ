import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import {
  AcademicCapIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  FolderIcon,
  GlobeAltIcon,
  GridIcon,
  UserCircleIcon,
  UsersIcon,
} from "../icons";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; icon?: React.ReactNode }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <UserCircleIcon />,
    name: "Usuários",
    path: "/usuarios",
  },
  {
    icon: <UsersIcon />,
    name: "Diretorias",
    path: "/diretorias",
  },
  {
    icon: <BuildingOffice2Icon />,
    name: "EJs",
    path: "/ejs",
  },
  {
    icon: <GlobeAltIcon />,
    name: "Federações",
    path: "/federacao",
  },
  {
    icon: <AcademicCapIcon />,
    name: "Instituições",
    path: "/instituicoes",
  },
  {
    icon: <BriefcaseIcon />,
    name: "Clientes",
    path: "/clientes",
  },
  {
    icon: <ClipboardDocumentListIcon />,
    name: "Projetos",
    path: "/projetos",
  },
  {
    icon: <FolderIcon />,
    name: "Categorias",
    path: "/categorias",
  },

  {
    icon: <ChartBarIcon />,
    name: "Feedback",
    subItems: [
      {
        name: "Feedbacks",
        path: "/feedbacks",
        icon: <ChartBarIcon />,
      },
      {
        name: "Categorias de Feedback",
        path: "/feedback-categorias",
        icon: <FolderIcon />,
      },
      {
        name: "Questões de Feedback",
        path: "/feedback-questoes",
        icon: <ClipboardDocumentListIcon />,
      },
      //{
      //name: "Histórico de Feedback",
      //path: "/feedback-historico",
      //icon: <ChartBarIcon />
      //},
    ],
  },
  {
    icon: <GlobeAltIcon />,
    name: "Endereços",
    path: "/endereco",
  }
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleMenuClick = (name: string) => {
    setOpenMenu((prev) => (prev === name ? null : name));
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
      >

      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <ul className="flex flex-col gap-4">
            {navItems.map((nav) =>
              nav.subItems ? (
                <li key={nav.name}>
                  <button
                    type="button"
                    className={`menu-item group w-full flex items-center ${openMenu === nav.name ? "menu-item-active" : "menu-item-inactive"}`}
                    onClick={() => handleMenuClick(nav.name)}
                  >
                    <span className="menu-item-icon-size">{nav.icon}</span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <>
                        <span className="menu-item-text flex-1 text-left">{nav.name}</span>
                        <span className="ml-auto">{openMenu === nav.name ? "▲" : "▼"}</span>
                      </>
                    )}
                  </button>
                  {openMenu === nav.name && (
                    <ul className="ml-8 mt-2 flex flex-col gap-2">
                      {nav.subItems.map((sub) => (
                        <li key={sub.name}>
                          <Link
                            to={sub.path}
                            className={`menu-dropdown-item ${isActive(sub.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                              }`}
                          >
                            <span className="menu-item-icon-size">{sub.icon}</span>
                            <span>{sub.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={nav.name}>
                  <Link
                    to={nav.path!}
                    className={`menu-item group ${isActive(nav.path!)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                      }`}
                  >
                    <span
                      className={`menu-item-icon-size ${isActive(nav.path!)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                        }`}
                    >
                      {nav.icon}
                    </span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                      <span className="menu-item-text">{nav.name}</span>
                    )}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
