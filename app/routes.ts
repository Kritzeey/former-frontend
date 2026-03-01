import {
  type RouteConfig,
  route,
  layout,
  index,
} from "@react-router/dev/routes";

export default [
  route("log-in", "routes/auth/log-in.tsx"),
  route("sign-up", "routes/auth/sign-up.tsx"),

  layout("routes/public/layout.tsx", [
    index("routes/public/home.tsx"),

    route("forms", "routes/public/forms/list.tsx"),
    route("forms/create", "routes/public/forms/create.tsx"),
    route("forms/:id", "routes/public/forms/details.tsx"),
    route("forms/:id/edit", "routes/public/forms/edit.tsx"),
  ]),
] satisfies RouteConfig;
