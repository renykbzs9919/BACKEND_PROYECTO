import {Router} from 'express'

const router = Router()

router.get("/", (req, res) => {
  res.json({
    message: "Bienvenido a mi API",
  });
});

export default router