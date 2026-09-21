import { SignUp } from "@clerk/nextjs";
import ThemeToggle from "../../components/ThemeToggle";

export default function Page() {
  return (
    <main className="authPage">
      <div className="authBackdrop" />
      <div className="authShell">
        <a className="authBrand" href="/">
          Global<span>Pedia</span>
        </a>
        <SignUp />
      </div>
    </main>
  );
}