import type { Request, Response, NextFunction } from "express";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.session.userId) {
    res.status(401).json({
      success: false,
      message: "Authentication required",
    });

    return;
  }

  next();
};

export const requireRole = (...roles: Array<"user" | "admin">) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.session.userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    if (!req.session.userRole) {
      res.status(403).json({
        success: false,
        message: "User role not found",
      });

      return;
    }

    if (!roles.includes(req.session.userRole)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
      });

      return;
    }

    next();
  };
};
