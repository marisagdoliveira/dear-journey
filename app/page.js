import Image from "next/image";
import Regpage from "./Regpage";

export default function Home() {
  return (
    <main className=" wrapper flex flex-col items-center  justify-between h-fit bg-[#a89ff8]">
      <Regpage/>
    </main>
  );
}
