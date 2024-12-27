import Image from "next/image";
import styles from "./page.module.css";
import Dropzone from "./components/Dropzone";

export default function Home() {
  return (
    <>
      <Dropzone />
    </>
  );
}
