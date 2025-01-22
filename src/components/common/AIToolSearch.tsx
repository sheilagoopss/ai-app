import { db } from "@/firebase/config";
import { collection, addDoc } from "@firebase/firestore";
import { Input } from "antd";

const AIToolSearch = () => {
  const onSearch = async (value: string) => {
    try {
      const ref = await addDoc(collection(db, "generate"), {
        prompt: value,
      });
      // ref.onSnapshot((snap) => {
      //   if (snap.get("response")) console.log("RESPONSE:" + snap.get("response"));
      // });

      console.log(ref);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Input.Search placeholder="Search for a tool..." onSearch={onSearch} />
  );
};

export default AIToolSearch;
