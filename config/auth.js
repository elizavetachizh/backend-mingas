export function isUser(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("danger", "Please log in.");
    res.redirect("/admin/users/login");
  }
}

export function isAdmin(req, res, next) {
  if (req.isAuthenticated() && res.locals.user.admin === 1) {
    next();
  } else {
    req.flash("danger", "Пожалуйста, войдите как администратор.");
    res.redirect("/admin/users/login");
  }
}
