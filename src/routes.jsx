import {
  HomeIcon,
  StarIcon,
  TableCellsIcon,
} from "@heroicons/react/24/solid";
import { Home, ListBusiness } from "@/pages/dashboard";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "home",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "list business",
        path: "/list",
        element: <ListBusiness />,
      },
    ],
  },
];

export default routes;
