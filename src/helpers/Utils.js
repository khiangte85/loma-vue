import auth from "../store/auth";

export default class Utils {
  static getErrorMessage(err) {
    if (err.response) {
      if (err.response.data.messages) {
        return err.response.data.messages[0];
      }
      return err.response.data.message;
    }

    return err.toString();
  }
  
}
