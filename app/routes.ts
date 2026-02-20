import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/main-layout.tsx", [index("routes/home.tsx")]),

  route("login", "routes/authentication/login.tsx"),
  route("register", "routes/authentication/register.tsx"),
  route("forms", "routes/forms/forms-list.tsx"),
] satisfies RouteConfig;
