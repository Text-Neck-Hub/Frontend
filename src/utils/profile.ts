    import * as jwt from 'jsonwebtoken';

    export function isOwner(uid:String): any {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) Error("Access token not found in localStorage");
        const decoded = jwt.decode(token);
        if (uid !== decoded.uid) {
          return false;
        }
        return decoded;
      } catch (error) {
        console.error("Failed to decode JWT:", error);
        return null;
      }
      finally {
        console.log("isOwner function executed");
      }
    }