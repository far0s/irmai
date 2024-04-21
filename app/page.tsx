import Header from "@/components/Header/Header";
import s from "./page.module.css";
import Stage from "@/components/Stage/Stage";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <main className={s.page}>
      <Header />
      <Stage>this is where the magic happens</Stage>
      <Footer />
    </main>
  );
}
