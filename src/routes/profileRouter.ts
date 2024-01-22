import UserService from "../service/userService";
import ProfileService from "../service/profileService";
import express, { Request, Response, Router } from "express";
import CryptoService from "../service/cryptoService";

const router: Router = express.Router();
const profileService: ProfileService = new ProfileService();
const userService: UserService = new UserService();
const cryptoService = new CryptoService("sn0ISmjyz1CWT6Yb7dxu");

router.get("/edit/:username", (req: Request, res: Response) => {
  let username = req.params.username;

  profileService
    .getProfile(username)
    .then((user) => {
      const decPasswd = cryptoService.getDecryptUltra(user[0].passwd);
      const newUser = {
        username : user[0].username,
        passwd : decPasswd,
        grade : user[0].grade,
        mng_ip_ranges: user[0].mng_ip_ranges
      }
      res.send([newUser]);
    })
    .catch((error) => {
      console.error("profile failed:", error);
      res.status(500).send("Internal Server Error");
    });
});

router.post("/update/:username", (req: Request, res: Response) => {
  let oldname = req.params.username;
  let user = req.body;
  const encPasswd = cryptoService.getEncryptUltra(user.passwd);
  const newUser = {
    username:user.username,
    passwd : encPasswd
  }
  userService.checkUsername(user.username, oldname).then((result) => {
    if (result.exists) {
      res.status(401).send({ error: result.message });
    } else {
      profileService
        .modUser(newUser, oldname)
        .then((result2) => {
          res.send(result2.message);
        })
        .catch((error) => {
          res.status(500).send("업데이트 잘못된거 같습니다.");
        });
    }
  });
});

export = router;