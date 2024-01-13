import { uploadBytes, ref } from "firebase/storage";
import { storage } from "./firebase.config";
import moment from "moment";

const bucketUrl = "gs://fir-384a7.appspot.com"
export const uploadFile = async (file, uid) => {
    if (!file)
        return ""
    const formattedDate = moment(new Date()).format();
    const bucket = `${bucketUrl}/${uid}/${formattedDate}`;
    await uploadBytes(ref(storage, bucket), file);
    return bucket;
}